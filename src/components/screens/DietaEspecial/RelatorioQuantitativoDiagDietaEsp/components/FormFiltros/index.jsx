import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Field, Form } from "react-final-form";

import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import Select from "components/Shareable/Select";
import MultiSelect from "components/Shareable/FinalForm/MultiSelect";

import { TIPO_PERFIL } from "constants/shared";

import {
  formFiltrosObtemDreEEscolasNovo,
  getDadosIniciais
} from "helpers/dietaEspecial";

import { InputComData } from "components/Shareable/DatePicker";

import "./styles.scss";
import { required, requiredMultiselectKhan } from "helpers/fieldValidators";

import { getAlergiasIntoleranciasAxios } from "services/dietaEspecial.service";
import { toastError } from "components/Shareable/Toast/dialogs";

export default ({ onSubmit, loading, setLoading }) => {
  const [diretoriasRegionais, setDiretoriasRegionais] = useState([
    { value: "", label: "Carregando..." }
  ]);
  const [escolas, setEscolas] = useState([
    { value: "", label: "Carregando...", dre: { uuid: "" } }
  ]);
  const [diagnosticos, setDiagnosticos] = useState([
    { value: "", label: "Carregando..." }
  ]);
  const [dadosIniciais, setDadosIniciais] = useState({});

  const tipoUsuario = localStorage.getItem("tipo_perfil");

  useEffect(() => {
    async function effect() {
      const promiseDreEscolas = formFiltrosObtemDreEEscolasNovo(
        setEscolas,
        setDiretoriasRegionais
      );
      const promiseDadosIniciais = getDadosIniciais();
      const promiseDiagnosticos = getAlergiasIntoleranciasAxios();
      const [, responseDadosIniciais, responseDiagnosticos] = await Promise.all(
        [promiseDreEscolas, promiseDadosIniciais, promiseDiagnosticos]
      );
      setDadosIniciais(responseDadosIniciais);
      if (responseDiagnosticos.status === HTTP_STATUS.OK) {
        setDiagnosticos(
          responseDiagnosticos.data.map(d => {
            return {
              value: d.id,
              label: d.descricao
            };
          })
        );
      } else {
        toastError("Erro ao obter os diagnósticos");
      }
      setLoading(false);
    }
    effect();
  }, []);

  const getEscolasFiltrado = dre => {
    if (
      tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL ||
      tipoUsuario === TIPO_PERFIL.ESCOLA
    ) {
      return escolas;
    } else if (dre) {
      if (dre.length === 0) {
        return escolas;
      } else {
        return escolas.filter(e => dre.includes(e.dre.uuid));
      }
    }
    return escolas;
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={dadosIniciais}
      render={({ handleSubmit, form, submitting, values }) => {
        return (
          <form
            onSubmit={handleSubmit}
            className="form-filtros-rel-quant-diag-dieta-esp"
          >
            <div className="row">
              <div className="col-5">
                <Field
                  label="Diretoria Regional de Educação"
                  component={MultiSelect}
                  showSearch
                  name="dre"
                  multiple
                  disabled={
                    loading ||
                    tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL ||
                    tipoUsuario === TIPO_PERFIL.ESCOLA
                  }
                  isLoading={loading}
                  options={diretoriasRegionais}
                  nomeDoItemNoPlural="diretorias regionais"
                  pluralFeminino
                  required
                  validate={requiredMultiselectKhan}
                />
              </div>
              <div className="col-7">
                <Field
                  label="Unidade Escolar"
                  component={MultiSelect}
                  showSearch
                  name="escola"
                  multiple
                  disabled={
                    loading ||
                    tipoUsuario === TIPO_PERFIL.ESCOLA ||
                    (values.dre && values.dre.length > 1)
                  }
                  isLoading={loading}
                  options={getEscolasFiltrado(values.dre)}
                  nomeDoItemNoPlural="escolas"
                  pluralFeminino
                />
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Field
                  label="Diagnóstico"
                  component={MultiSelect}
                  showSearch
                  name="diagnostico"
                  multiple
                  disabled={loading}
                  isLoading={loading}
                  options={diagnosticos}
                  nomeDoItemNoPlural="diagnósticos"
                />
              </div>
              <div className="col-2">
                <Field
                  label="Status"
                  component={Select}
                  name="status"
                  options={[
                    { uuid: "", nome: "Todos" },
                    { uuid: "ativas", nome: "Ativa" },
                    { uuid: "inativas", nome: "Inativa" },
                    { uuid: "pendentes", nome: "Pendente de aprovação" }
                  ]}
                  naoDesabilitarPrimeiraOpcao
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="Data da solicitação"
                  name="data_inicial"
                  className="data-inicial"
                  placeholder="De"
                  minDate={null}
                  maxDate={
                    values.data_final
                      ? moment(values.data_final, "DD/MM/YYYY")._d
                      : moment()._d
                  }
                  required
                  validate={required}
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="&nbsp;"
                  name="data_final"
                  popperPlacement="bottom-end"
                  placeholder="Até"
                  minDate={
                    values.data_inicial
                      ? moment(values.data_inicial, "DD/MM/YYYY")._d
                      : null
                  }
                  maxDate={moment()._d}
                  validate={required}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 botoes-envio">
                <Botao
                  texto="Limpar Filtros"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  disabled={submitting}
                  onClick={form.reset}
                />
                <Botao
                  style={BUTTON_STYLE.GREEN}
                  texto="Consultar"
                  className="ml-3"
                  type={BUTTON_TYPE.SUBMIT}
                  disabled={loading || submitting}
                />
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};