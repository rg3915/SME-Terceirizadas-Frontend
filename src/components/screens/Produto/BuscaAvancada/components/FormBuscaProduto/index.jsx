import moment from "moment";
import React, { useEffect, useReducer, useState } from "react";
import { Form, Field } from "react-final-form";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import AutoCompleteField from "components/Shareable/AutoCompleteField";
import CheckboxField from "components/Shareable/Checkbox/Field";
import FinalFormToRedux from "components/Shareable/FinalFormToRedux";
import { InputText } from "components/Shareable/Input/InputText";
import { SelectWithHideOptions } from "components/Shareable/SelectWithHideOptions";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "components/Shareable/Botao/constants";
import { InputComData } from "components/Shareable/DatePicker";

import {
  getNomesProdutos,
  getNomesMarcas,
  getNomesFabricantes,
  getNomesTerceirizadas
} from "services/produto.service";

import {
  getOpecoesStatus,
  retornaStatusBackend,
  getTodasOpcoesStatusPorPerfil
} from "./helpers";
import "./style.scss";

const initialState = {
  dados: {},
  status: ["Ativo", "Suspenso"],
  produtos: [],
  marcas: [],
  fabricantes: [],
  dataMinima: null,
  dataMaxima: null
};

const FORM_NAME = "buscaAvancadaProduto";

function reducer(state, { type: actionType, payload }) {
  switch (actionType) {
    case "popularDados":
      return { ...state, dados: payload };
    case "atualizarFiltro": {
      if (!payload.searchText.length) {
        return { ...state, [payload.filtro]: [] };
      }
      const reg = new RegExp(payload.searchText, "i");
      const filtrado = state.dados[payload.filtro].filter(el => reg.test(el));
      return { ...state, [payload.filtro]: filtrado };
    }

    case "resetar":
      return { ...initialState, dados: state.dados };
    default:
      // eslint-disable-next-line no-console
      console.error("Invalid action type: ", actionType);
  }
}

const FormBuscaProduto = ({ setFiltros, setPage, initialValues, history }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [status, setStatus] = useState({
    opcoesStatus: getOpecoesStatus(),
    statusSelecionados: []
  });

  useEffect(() => {
    async function fetchData() {
      Promise.all([
        getNomesProdutos(),
        getNomesMarcas(),
        getNomesFabricantes(),
        getNomesTerceirizadas()
      ]).then(([produtos, marcas, fabricantes, terceirizadas]) => {
        dispatch({
          type: "popularDados",
          payload: {
            produtos: produtos.data.results.map(el => el.nome),
            marcas: marcas.data.results.map(el => el.nome),
            fabricantes: fabricantes.data.results.map(el => el.nome),
            terceirizadas: terceirizadas.data.results.map(
              el => el.nome_fantasia
            )
          }
        });
      });
    }
    fetchData();
  }, []);

  const onSearch = (filtro, searchText) => {
    dispatch({
      type: "atualizarFiltro",
      payload: {
        filtro,
        searchText
      }
    });
  };

  const onSelectStatus = value => {
    if (value === "Todos") {
      setStatus({ opcoesStatus: [], statusSelecionados: ["Todos"] });
    } else {
      setStatus({
        opcoesStatus: getOpecoesStatus(),
        statusSelecionados: [...status.statusSelecionados, value]
      });
    }
  };

  const onDeselectStatus = value => {
    if (value === "Todos") {
      setStatus({ opcoesStatus: getOpecoesStatus(), statusSelecionados: [] });
    } else {
      const filtered = status.statusSelecionados.filter(item => item !== value);
      setStatus({
        opcoesStatus: getOpecoesStatus(),
        statusSelecionados: filtered
      });
    }
  };

  const onSubmit = values => {
    let formValues = JSON.parse(JSON.stringify(values));

    if (formValues.tipo_produto_comum && !formValues.dieta_especial) {
      formValues.eh_para_alunos_com_dieta = false;
    } else if (!formValues.tipo_produto_comum && formValues.dieta_especial) {
      formValues.eh_para_alunos_com_dieta = true;
    }

    if (formValues.status && formValues.status.length !== 0) {
      if (formValues.status.includes("Todos")) {
        formValues.status = getTodasOpcoesStatusPorPerfil();
      } else if (formValues.status.length === 1 && formValues.status[0] === "")
        formValues.status = getTodasOpcoesStatusPorPerfil();
      else {
        formValues.status.map((status, index) => {
          if (status !== "") {
            const statusBackend = retornaStatusBackend(status);
            if (Array.isArray(statusBackend)) {
              statusBackend.map(status => formValues.status.push(status));
              formValues.status.splice(index, 1);
            } else formValues.status[index] = statusBackend;
          }
        });
      }
      if (formValues.status[0] === "") formValues.status.splice(0, 1);
    } else {
      formValues.status = getTodasOpcoesStatusPorPerfil();
    }

    setFiltros({ ...formValues });
    setPage(1);
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={history.action === "POP" && initialValues}
      render={({ form, handleSubmit, submitting, values }) => (
        <form onSubmit={handleSubmit} className="busca-produtos">
          <FinalFormToRedux form={FORM_NAME} />
          <div className="form-row">
            <div className="col-12 col-md-4 col-xl-4">
              <div className="row">
                <label className="ml-3">Data cadastro</label>
              </div>
              <div className="row">
                <div className="col mt-1">
                  <Field
                    component={InputComData}
                    name="data_inicial"
                    className="data-inicial"
                    labelClassName="datepicker-fixed-padding"
                    placeholder="De"
                    minDate={null}
                    maxDate={
                      values.data_final
                        ? moment(values.data_final, "DD/MM/YYYY")._d
                        : moment()._d
                    }
                  />
                </div>
                <div className="col mt-1">
                  <Field
                    component={InputComData}
                    name="data_final"
                    labelClassName="datepicker-fixed-padding"
                    popperPlacement="bottom-end"
                    placeholder="Até"
                    minDate={
                      values.data_inicial
                        ? moment(values.data_inicial, "DD/MM/YYYY")._d
                        : null
                    }
                    maxDate={moment()._d}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 col-xl-5">
              <label>Status</label>
              <Field
                component={SelectWithHideOptions}
                options={status.opcoesStatus}
                name="status"
                selectedItems={status.statusSelecionados}
                onSelect={value => onSelectStatus(value)}
                onDeselect={value => onDeselectStatus(value)}
              />
            </div>
            <div className="col-12 col-md-3 col-xl-3 check-tipos-prod">
              <div className="row">
                <label className="ml-3">Tipo de produto</label>
              </div>

              <div className="row">
                <div className="col mt-2 ml-1">
                  <Field
                    className="check-tipo-produto"
                    component={CheckboxField}
                    name="tipo_produto_comum"
                    type="checkbox"
                    nomeInput="Comum"
                  />
                </div>
                <div className="col mt-2">
                  <Field
                    className="check-tipo-produto"
                    component={CheckboxField}
                    name="dieta_especial"
                    type="checkbox"
                    nomeInput="Dieta especial"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-row mt-2">
            <div className="col-md-3 col-xl-3">
              <label>Ingredientes/aditivos alergênicos?</label>
              <div className="check-produto_alergenico">
                <Field
                  component={CheckboxField}
                  name="tem_aditivos_alergenicos"
                  nomeInput={"Sim"}
                  type="checkbox"
                />
              </div>
            </div>
            <div className="col-md-9 col-xl-9">
              <label>
                Quais? (Possível Informar um ou mais ingredientes separados por
                vírgula)
              </label>
              <Field
                component={InputText}
                name="aditivos"
                disabled={!values.tem_aditivos_alergenicos}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="col-md-12 col-xl-12">
              <Field
                component={AutoCompleteField}
                dataSource={state.produtos}
                label="Nome do Produto"
                placeholder="Digite nome do produto"
                className="input-busca-produto"
                onSearch={v => onSearch("produtos", v)}
                name="nome_produto"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-6 col-xl-6">
              <Field
                component={AutoCompleteField}
                dataSource={state.marcas}
                className="input-busca-produto"
                label="Marca do Produto"
                placeholder="Digite marca do produto"
                onSearch={v => onSearch("marcas", v)}
                name="nome_marca"
              />
            </div>
            <div className="col-md-6 col-xl-6">
              <Field
                component={AutoCompleteField}
                dataSource={state.fabricantes}
                label="Fabricante do Produto"
                placeholder="Digite fabricante do produto"
                onSearch={v => onSearch("fabricantes", v)}
                name="nome_fabricante"
              />
            </div>
          </div>
          <div className="mt-4 mb-4">
            <Botao
              texto="Consultar"
              type={BUTTON_TYPE.SUBMIT}
              style={BUTTON_STYLE.GREEN}
              className="float-right ml-3"
              disabled={submitting}
            />

            <Botao
              texto="Limpar Filtros"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="float-right ml-3"
              onClick={() => {
                form.reset({
                  tipo_produto_comum: undefined,
                  dieta_especial: undefined,
                  nome_fabricante: undefined,
                  nome_marca: undefined,
                  nome_produto: undefined,
                  aditivos: undefined,
                  tem_aditivos_alergenicos: undefined,
                  status: undefined,
                  data_final: undefined,
                  data_inicial: undefined
                });
                setStatus({
                  opcoesStatus: getOpecoesStatus(),
                  statusSelecionados: []
                });
              }}
            />
          </div>
        </form>
      )}
    />
  );
};

const mapStateToProps = state => {
  return {
    initialValues: state.finalForm[FORM_NAME]
  };
};

export default withRouter(connect(mapStateToProps)(FormBuscaProduto));
