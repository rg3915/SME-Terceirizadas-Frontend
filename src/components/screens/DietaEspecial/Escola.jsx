import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { length, minLength, required } from "../../../helpers/fieldValidators";
import { dateDelta } from "../../../helpers/utilities";
import { criaDietaEspecial } from "../../../services/dietaEspecial";
import { meusDados } from "../../../services/perfil.service";
import Botao from "../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../Shareable/Botao/constants";
import CardMatriculados from "../../Shareable/CardMatriculados";
import { InputComData } from "../../Shareable/DatePicker";
import InputText from "../../Shareable/Input/InputText";
import { TextAreaWYSIWYG } from "../../Shareable/TextArea/TextAreaWYSIWYG";
import { toastError, toastSuccess } from "../../Shareable/Toast/dialogs";
import "./style.scss";

const minLength6 = minLength(6);

class solicitacaoDietaEspecial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantidadeAlunos: "..."
    };
  }
  componentDidMount() {
    meusDados().then(meusDados => {
      this.setState({
        quantidadeAlunos: meusDados.vinculo_atual.instituicao.quantidade_alunos
      });
    });
  }

  async onSubmit(payload) {
    const response = await criaDietaEspecial(payload);
    if (response.status === HTTP_STATUS.CREATED) {
      toastSuccess("Solicitação realizada com sucesso.");
    } else {
      toastError("Erro ao solicitar dieta especial");
    }
  }

  render() {
    const { quantidadeAlunos } = this.state;
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <CardMatriculados numeroAlunos={quantidadeAlunos} />
        <div className="card mt-2 p-4">
          <div>
            <span className="card-title font-weight-bold cinza-escuro">
              Descrição da Solicitação
            </span>
          </div>
          <div className="grid-container">
            <div className="ajuste-fonte">Cód. EOL do Aluno</div>
            <div className="ajuste-fonte">Nome completo do Aluno</div>
            <div className="ajuste-fonte">Data de Nascimento</div>
            <Field
              component={InputText}
              name="codigo_eol_aluno"
              placeholder="Insira o Código"
              className="form-control"
              validate={[required, length(6)]}
            />
            <Field
              component={InputText}
              name="nome_completo_aluno"
              placeholder="Insira o Nome do Aluno"
              className="form-control"
              validate={[required, minLength6]}
            />
            <Field
              component={InputComData}
              name="data_nascimento_aluno"
              placeholder="Selecione"
              className="form-control"
              minDate={dateDelta(-360 * 99)}
              maxDate={dateDelta(-1)}
              validate={required}
            />
          </div>
          <section className="row">
            <div className="col-7">
              <Field
                component={InputText}
                label="Nome do Pescritor da receita (médico, nutricionista, fonoaudiólogo)"
                name="nome_completo_pescritor"
                placeholder="Insira o Nome do Pescritor"
                className="form-control"
                validate={[required, minLength6]}
              />
            </div>
            <div className="col-5">
              <Field
                component={InputText}
                label="Registro funcional (CRM/CRN/CRFa)"
                name="registro_funcional_pescritor"
                placeholder="Insira o Registro Funcional"
                className="form-control"
                validate={[required, minLength6]}
              />
            </div>
          </section>
          <section className="row mb-5">
            <div className="col-12">
              <Field
                component={TextAreaWYSIWYG}
                label="Observações"
                name="observacoes"
                className="form-control"
              />
            </div>
          </section>
          <article className="card-body footer-button">
            <Botao
              texto="Cancelar"
              onClick={() => this.props.reset()}
              disabled={pristine || submitting}
              style={BUTTON_STYLE.GREEN_OUTLINE}
            />
            <Botao
              texto="Enviar"
              disabled={pristine || submitting}
              type={BUTTON_TYPE.SUBMIT}
              onClick={handleSubmit(values =>
                this.onSubmit({
                  ...values
                })
              )}
              style={BUTTON_STYLE.GREEN}
            />
          </article>
        </div>
      </form>
    );
  }
}

const componentNameForm = reduxForm({
  form: "solicitacaoDietaEspecial"
})(solicitacaoDietaEspecial);

export default componentNameForm;
