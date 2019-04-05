import React, { Component } from "react";
import Button, { ButtonStyle } from "./Shareable/button";
import {
  LabelAndInput,
  LabelAndCombo,
  LabelAndTextArea
} from "./Shareable/labelAndInput";
import "./Shareable/custom.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addCycle, addDay, rfInputEdited } from "../actions/menuActions";

class MenuChange extends Component {
  render() {
    const { addCycle, description, addDay, rfInputEdited } = this.props;
    console.log("PROPS", this.props);
    return (
      <div className="container">
        <form>
          <div>
            <label className="header-form-label mb-5">Nº de matriculados</label>
          </div>
          <div>
            <button className="btn btn-primary mr-3">150</button>
            <label>
              Informação automática disponibilizada no cadastro da UE
            </label>
          </div>
          <div className="form-group row">
            <LabelAndInput
              placeholder="Registro funcional"
              onChange={payload => rfInputEdited(payload)}
              value={this.props.rf}
              cols="6 6 6 6"
              type="text"
              name="rf"
              label="RF Responsável"
            />
            <LabelAndInput
              value={this.props.cargo}
              cols="6 6 6 6"
              type="text"
              name="cargo"
              label="Cargo / Função"
            />
          </div>
          <div className="form-group row">
            <LabelAndInput
              value={this.props.nome}
              cols="12 12 12 12"
              name="nome"
              label="Nome"
            />
          </div>
          <div className="form-group row">
            <LabelAndCombo
              cols="5 5 5 5"
              name="periodo"
              label="Período de alteração"
            />
            <LabelAndCombo
              cols="4 4 4 4"
              name="tipo"
              label="Tipo de Alimentação"
            />
            <LabelAndInput
              cols="3 3 3 3"
              name="nro_alunos"
              label="Nº de alunos"
            />
          </div>
          <div className="form-group row">
            <LabelAndCombo cols="5 5 5 5" label="Período de alteração" />
            <LabelAndCombo cols="4 4 4 4" label="Tipo de Alimentação" />
            <LabelAndInput cols="3 3 3 3" type="number" label="Nº de alunos" />
          </div>
          <Button styleBt={ButtonStyle.OutlineDark} text="Adicionar Período" />
          <div className="form-group row-1">
            <label className="session-header mt-3">Data de alteração</label>
          </div>
          <div className="form-group row">
            <LabelAndInput
              cols="4 4 4 4"
              type="date"
              name="de"
              label="Alterar dia"
            />
            <LabelAndCombo cols="4 4 4 4" label="Para" name="para" />
          </div>
          <div className="form-group row">
            <LabelAndInput
              cols="4 4 4 4"
              type="date"
              name="de"
              label="Alterar dia"
            />
            <LabelAndInput cols="4 4 4 4" type="date" name="ate" label="Até" />
            <LabelAndCombo cols="4 4 4 4" label="Para" name="para" />
          </div>
          <div className="form-group row">
            <Button
              styleBt={ButtonStyle.OutlineInfo}
              onClick={() => addDay(description)}
              className="ml-3"
              text="Adicionar dia"
            />
            {/* Aqui é chamado a action de addCycle com parametro description */}
            <Button
              styleBt={ButtonStyle.OutlineInfo}
              onClick={() => addCycle(description)}
              className="ml-3"
              text="Adicionar Ciclo"
            />
          </div>
          <div className="form-group">
            <LabelAndTextArea label="Observações" name="obs" />
          </div>
        </form>
      </div>
    );
  }
}

// olhe o arquivo que agrega os reducers src/reducers.js
// state é o global, menu é o reducer que me interessa
// description é quem vai ser mapeado para dentro do componente
const mapStateToProps = state => ({
  rf: state.menu.rf,
  cargo: state.menu.cargo,
  nome: state.menu.nome,
  description: state.menu.description
});

// mapea addCycle no dispatch, separar metodos por ,
// const mapDispatchToProps = dispatch => {
//   bindActionCreators({ addCycle }, dispatch)
// }
const mapDispatchToProps = dispatch =>
  bindActionCreators({ addDay, addCycle, rfInputEdited }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuChange);