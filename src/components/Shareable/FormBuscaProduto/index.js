import React, { useEffect, useReducer } from "react";
import { Form, Field } from "react-final-form";
import { Row, Col } from "antd";
import moment from "moment";
import AutoCompleteField from "components/Shareable/AutoCompleteField";
import { InputComData } from "components/Shareable/DatePicker";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "components/Shareable/Botao/constants";
import "./style.scss";

import {
  getNomesProdutos,
  getNomesMarcas,
  getNomesFabricantes,
  getNomesTerceirizadas
} from "services/produto.service";

const initialState = {
  dados: {},
  terceirizadas: [],
  produtos: [],
  marcas: [],
  fabricantes: [],
  inicio: ""
};

function reducer(state, { type: actionType, payload }) {
  switch (actionType) {
    case "atualizarInicio":
      return { ...state, inicio: payload };
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
      throw new Error("Invalid action type: ", actionType);
  }
}

const FormBuscaProduto = ({ onSubmit, exibirBotaoVoltar, history }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  return (
    <Form
      onSubmit={onSubmit}
      render={({ form, handleSubmit, submitting, values }) => (
        <form
          onSubmit={handleSubmit}
          className="busca-produtos-formulario-shared"
        >
          <Row gutter={[16, 16]}>
            <Col md={24} lg={12} xl={16}>
              <Field
                component={AutoCompleteField}
                dataSource={state.terceirizadas}
                label="Nome da terceirizada"
                onSearch={v => onSearch("terceirizadas", v)}
                name="nome_terceirizada"
              />
            </Col>
            <Col md={24} lg={6} xl={4}>
              <Field
                component={InputComData}
                label="Início do Período"
                name="data_inicial"
                labelClassName="datepicker-fixed-padding"
                minDate={null}
              />
            </Col>
            <Col md={24} lg={6} xl={4}>
              <Field
                component={InputComData}
                label={"Até"}
                name="data_final"
                labelClassName="datepicker-fixed-padding"
                popperPlacement="bottom-end"
                minDate={
                  values.data_inicial
                    ? moment(values.data_inicial, "DD/MM/YYYY")._d
                    : null
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Field
                component={AutoCompleteField}
                dataSource={state.produtos}
                label="Nome do Produto"
                className="input-busca-produto"
                onSearch={v => onSearch("produtos", v)}
                name="nome_produto"
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={24} lg={12}>
              <Field
                component={AutoCompleteField}
                dataSource={state.marcas}
                className="input-busca-produto"
                label="Marca do Produto"
                onSearch={v => onSearch("marcas", v)}
                name="nome_marca"
              />
            </Col>
            <Col md={24} lg={12}>
              <Field
                component={AutoCompleteField}
                dataSource={state.fabricantes}
                label="Fabricante do Produto"
                onSearch={v => onSearch("fabricantes", v)}
                name="nome_fabricante"
              />
            </Col>
          </Row>
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
              onClick={() => form.reset()}
              className="float-right ml-3"
              disabled={submitting}
            />
            {!!exibirBotaoVoltar && (
              <Botao
                type={BUTTON_TYPE.BUTTON}
                texto={"Voltar"}
                style={BUTTON_STYLE.BLUE_OUTLINE}
                onClick={() => history.goBack()}
              />
            )}
          </div>
        </form>
      )}
    />
  );
};

export default FormBuscaProduto;