import React, { Component } from "react";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadTipoAlimentacao } from "../../../../reducers/tipoAlimentacaoReducer";
import Wizard from "../../../Shareable/Wizard";
import { Select } from "../../../Shareable/Select";

import StepMatutino from "./components/WizardSteps/StepMatutino";
import "./style.scss";

class CadastroTipoAlimentacao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: null,
      uuidUnidadeEscolar: null,

      dadosAlimentacao: {
        tipoAlimentos: [
          { nome: "Lanche - 4 horas", combinacoes: [1] },
          { nome: "Lanche - 5 horas", combinacoes: [1] },
          { nome: "Refeição/Sobremesa", combinacoes: [1] },
          { nome: "Refeição/ Sobremesa/ Lanche", combinacoes: [1] }
        ],
        possibilidades: [
          "Refeição/Sobremesa",
          "Merenda Seca",
          "Lanche 4h",
          "Lanche 5h",
          "Merenda Seca/ Sobremesa da Refeição"
        ]
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { meusDados } = this.props;

    if (meusDados !== prevState.meusDados) {
      this.setState({ meusDados });
    }
  }

  render() {
    const { uuidUnidadeEscolar, dadosAlimentacao } = this.state;
    const { handleSubmit } = this.props;
    return (
      <div className="card mt-3">
        <div className="card-body formulario-tipo-alimentacao">
          <form onSubmit={handleSubmit}>
            <section className="header">Cruzamento das possibilidades</section>
            <section className="tipos-de-unidade">
              <header>Tipos de Unidades</header>
              <article>
                <Field
                  component={Select}
                  name="tipos_unidades"
                  options={[
                    { nome: "Selecione a unidade", uuid: "" },
                    { nome: "EMEF", uuid: "fdhjfd-fdkdj-4fddf" },
                    { nome: "EMEBS", uuid: "jsh5d-iuehd-fhdjjsawe" },
                    { nome: "EMEFM", uuid: "jsh5d-iuehd-fhdjjs698" },
                    { nome: "CIEJA", uuid: "jsh5d-iuehd-fhdjjs142" },
                    { nome: "EJA", uuid: "jsh5d-iuehd-fhdjjsa8745" },
                    { nome: "EMEI", uuid: "jsh5d-iuehd-fh1jjsa8745" },
                    { nome: "EMEI DO CEMEI", uuid: "jsh3d-iuehd-fhdjjsa8745" }
                  ]}
                  onChange={event =>
                    this.setState({ uuidUnidadeEscolar: event.target.value })
                  }
                />
              </article>
            </section>
            {uuidUnidadeEscolar === null && (
              <Wizard
                steps={6}
                componentSteps={[
                  <StepMatutino
                    key="matutino"
                    dadosAlimentacao={dadosAlimentacao}
                  />
                ]}
                stepsNames={[
                  "1° Período Matutino",
                  "2° Período Intermediario",
                  "3° Período Vespetino",
                  "4° Período Noturno",
                  "Integral Lanche",
                  "Integral Refeição"
                ]}
              />
            )}
          </form>
        </div>
      </div>
    );
  }
}

const TipoDeAlimentacaoForm = reduxForm({
  form: "TipoDeAlimentacaoForm",
  enableReinitialize: true
})(CadastroTipoAlimentacao);
const selector = formValueSelector("TipoDeAlimentacaoForm");
const mapStateToProps = state => {
  return {
    initialValues: state.TipoDeAlimentacaoForm.data,
    tipos_unidades: selector(state, "tipos_unidades")
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadTipoAlimentacao
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TipoDeAlimentacaoForm);
