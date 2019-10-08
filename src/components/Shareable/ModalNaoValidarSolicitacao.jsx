import React, { Component } from "react";
import { Field } from "redux-form";
import { LabelAndTextArea, LabelAndCombo } from "./labelAndInput/labelAndInput";
import { required } from "../../helpers/fieldValidators";
import { Modal } from "react-bootstrap";
import BaseButton, { ButtonStyle, ButtonType } from "./button";
import { DREnaoValidarKitLancheAvulsoEscola } from "../../services/solicitacaoDeKitLanche.service";
import HTTP_STATUS from "http-status-codes";
import { toastSuccess, toastError } from "./Toast/dialogs";

export class ModalNaoValidarSolicitacao extends Component {
  constructor(props) {
    super(props);
    this.state = { justificativa: "", motivoCancelamento: "" };
  }
  async cancelarSolicitacaoDaEscola(uuid) {
    const { justificativa, motivoCancelamento } = this.state;
    const resp = await DREnaoValidarKitLancheAvulsoEscola(
      uuid,
      `${motivoCancelamento} - ${justificativa}`
    );
    if (resp.status === HTTP_STATUS.OK) {
      this.props.closeModal();
      toastSuccess("Solicitação não validada com sucesso!");
    } else {
      toastError(resp.detail);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.justificativa !== this.props.justificativa) {
      this.setState({ justificativa: this.props.justificativa });
    }
    if (prevProps.motivoCancelamento !== this.props.motivoCancelamento) {
      this.setState({ motivoCancelamento: this.props.motivoCancelamento });
    }
  }

  render() {
    const { showModal, closeModal, uuid } = this.props;
    return (
      <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Deseja não validar solicitação?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-row">
            <div className="form-group col-12">
              <Field
                component={LabelAndCombo}
                name="motivo_cancelamento"
                label="Motivo"
                //TODO: criar campos a mais no backend?
                options={[
                  {
                    nome: "Sem motivo",
                    uuid: "Sem motivo"
                  },
                  {
                    nome: "Em desacordo com o contrato",
                    uuid: "Em desacordo com o contrato"
                  }
                ]}
                validate={required}
              />
            </div>
            <div className="form-group col-12">
              <Field
                component={LabelAndTextArea}
                placeholder="Obrigatório"
                label="Justificativa"
                name="justificativa"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <BaseButton
            label="Não"
            type={ButtonType.BUTTON}
            onClick={closeModal}
            style={ButtonStyle.OutlinePrimary}
            className="ml-3"
          />
          <BaseButton
            label="Sim"
            type={ButtonType.BUTTON}
            onClick={() => {
              this.cancelarSolicitacaoDaEscola(uuid);
            }}
            style={ButtonStyle.Primary}
            className="ml-3"
          />
        </Modal.Footer>
      </Modal>
    );
  }
}