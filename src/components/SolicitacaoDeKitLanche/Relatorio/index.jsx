import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { formValueSelector, reduxForm } from "redux-form";
import {
  SOLICITACAO_KIT_LANCHE,
  ESCOLA,
  DRE,
  CODAE,
  TERCEIRIZADA
} from "../../../configs/constants";
import { statusEnum, escolaPodeCancelar } from "../../../constants/statusEnum";
import { dataParaUTC } from "../../../helpers/utilities";
import { getDiasUteis } from "../../../services/diasUteis.service";
import { meusDados } from "../../../services/perfil.service";
import {
  getDetalheKitLancheAvulsa,
  CODAEquestionaKitLancheAvulso,
  terceirizadaRespondeQuestionamentoKitLancheAvulso,
  CODAENegaKitLancheAvulsoEscola,
  DREnaoValidarKitLancheAvulsoEscola
} from "../../../services/solicitacaoDeKitLanche.service";
import Botao from "../../Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE
} from "../../Shareable/Botao/constants";
import { FluxoDeStatus } from "../../Shareable/FluxoDeStatus";
import {
  ORIGEM_SOLICITACAO,
  ModalCancelarSolicitacao
} from "../../Shareable/ModalCancelarSolicitacao";
import { toastError, toastSuccess } from "../../Shareable/Toast/dialogs";
import { prazoDoPedidoMensagem, corDaMensagem } from "./helper";
import { ModalCODAEQuestiona } from "../../Shareable/ModalCODAEQuestiona";
import RelatorioHistoricoQuestionamento from "../../Shareable/RelatorioHistoricoQuestionamento";
import { ModalTerceirizadaRespondeQuestionamento } from "../../Shareable/ModalTerceirizadaRespondeQuestionamento";
import { ModalNegarSolicitacao } from "../../Shareable/ModalNegarSolicitacao";
import { ModalNaoValidarSolicitacao } from "../../Shareable/ModalNaoValidarSolicitacao";

class Relatorio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unifiedSolicitationList: [],
      uuid: null,
      meusDados: { diretorias_regionais: [{ nome: "" }] },
      showModal: false,
      showNaoValidarModal: false,
      showNegarModal: false,
      showQuestionarModal: false,
      showTerceirizadaRespondeQuestionamentoModal: false,
      solicitacaoKitLanche: null,
      prazoDoPedidoMensagem: null,
      CODAE_DEVE_QUESTIONAR: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.closeNaoValidarModal = this.closeNaoValidarModal.bind(this);
    this.closeNegarModal = this.closeNegarModal.bind(this);
    this.closeQuestionarModal = this.closeQuestionarModal.bind(this);
    this.closeTerceirizadaRespondeQuestionamentoModal = this.closeTerceirizadaRespondeQuestionamentoModal.bind(
      this
    );
    this.loadSolicitacao = this.loadSolicitacao.bind(this);
    this.showResponderQuestionamentoModal = this.showResponderQuestionamentoModal.bind(
      this
    );
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    meusDados().then(meusDados => {
      this.setState({ meusDados });
    });
    getDiasUteis().then(response => {
      const proximos_cinco_dias_uteis = dataParaUTC(
        new Date(response.proximos_cinco_dias_uteis)
      );
      const proximos_dois_dias_uteis = dataParaUTC(
        new Date(response.proximos_dois_dias_uteis)
      );
      if (uuid) {
        getDetalheKitLancheAvulsa(uuid).then(solicitacaoKitLanche => {
          const data = solicitacaoKitLanche.solicitacao_kit_lanche.data;
          this.setState({
            solicitacaoKitLanche,
            CODAE_DEVE_QUESTIONAR: solicitacaoKitLanche.logs.length === 2,
            uuid,
            prazoDoPedidoMensagem: prazoDoPedidoMensagem(
              data,
              proximos_dois_dias_uteis,
              proximos_cinco_dias_uteis
            )
          });
        });
      }
    });
  }

  showModal() {
    this.setState({ showModal: true });
  }

  showNaoValidarModal() {
    this.setState({ showNaoValidarModal: true });
  }

  showNegarModal() {
    this.setState({ showNegarModal: true });
  }

  showQuestionarModal() {
    this.setState({ showQuestionarModal: true });
  }

  showTerceirizadaQuestionaModal() {
    this.setState({ showTerceirizadaRespondeQuestionamentoModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  closeNaoValidarModal() {
    this.setState({ showNaoValidarModal: false });
  }

  closeNegarModal() {
    this.setState({ showNegarModal: false });
  }

  closeQuestionarModal() {
    this.setState({ showQuestionarModal: false });
  }

  closeTerceirizadaRespondeQuestionamentoModal() {
    this.setState({ showTerceirizadaRespondeQuestionamentoModal: false });
  }

  loadSolicitacao(uuid) {
    getDetalheKitLancheAvulsa(uuid).then(solicitacaoKitLanche => {
      this.setState({
        solicitacaoKitLanche
      });
    });
  }

  handleSubmit() {
    const { toastSucessoMensagem } = this.props;
    const uuid = this.state.uuid;
    this.props.HandleAprovaPedido(uuid).then(
      response => {
        if (response.status === HTTP_STATUS.OK) {
          toastSuccess(toastSucessoMensagem);
          this.loadSolicitacao(uuid);
        } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(
            "Houve um erro ao autorizar a Solicitação de Kit Lanche Passeio"
          );
        }
      },
      function() {
        toastError(
          "Houve um erro ao autorizar a Solicitação de Kit Lanche Passeio"
        );
      }
    );
  }

  showResponderQuestionamentoModal(resposta_sim_nao) {
    this.setState({ resposta_sim_nao });
    this.showTerceirizadaQuestionaModal();
  }

  render() {
    const {
      solicitacaoKitLanche,
      showModal,
      showNaoValidarModal,
      showNegarModal,
      showQuestionarModal,
      showTerceirizadaRespondeQuestionamentoModal,
      prazoDoPedidoMensagem,
      resposta_sim_nao,
      uuid,
      CODAE_DEVE_QUESTIONAR
    } = this.state;
    const { justificativa } = this.props;
    return (
      <div className="report">
        <ModalCancelarSolicitacao
          closeModal={this.closeModal}
          showModal={showModal}
          uuid={uuid}
          justificativa={justificativa}
          meusDados={meusDados}
          origemSolicitacao={ORIGEM_SOLICITACAO.ESCOLA}
          solicitacaoKitLanche={solicitacaoKitLanche}
        />
        <ModalNegarSolicitacao
          closeModal={this.closeNegarModal}
          showModal={showNegarModal}
          uuid={uuid}
          loadSolicitacao={this.loadSolicitacao}
          endpoint={CODAENegaKitLancheAvulsoEscola}
        />
        <ModalCODAEQuestiona
          closeModal={this.closeQuestionarModal}
          showModal={showQuestionarModal}
          justificativa={justificativa}
          uuid={uuid}
          loadSolicitacao={this.loadSolicitacao}
          endpoint={CODAEquestionaKitLancheAvulso}
        />
        <ModalTerceirizadaRespondeQuestionamento
          closeModal={this.closeTerceirizadaRespondeQuestionamentoModal}
          showModal={showTerceirizadaRespondeQuestionamentoModal}
          justificativa={justificativa}
          uuid={uuid}
          resposta_sim_nao={resposta_sim_nao}
          loadSolicitacao={this.loadSolicitacao}
          endpoint={terceirizadaRespondeQuestionamentoKitLancheAvulso}
        />
        <ModalNaoValidarSolicitacao
          closeModal={this.closeNaoValidarModal}
          showModal={showNaoValidarModal}
          justificativa={justificativa}
          uuid={uuid}
          loadSolicitacao={this.loadSolicitacao}
          naoValidaEndpoint={DREnaoValidarKitLancheAvulsoEscola}
        />
        {solicitacaoKitLanche && (
          <form onSubmit={this.props.handleSubmit}>
            <span className="page-title">
              Solicitação de Kit Lanche Passeio #{" "}
              {solicitacaoKitLanche.id_externo}
              <Link to={`/${this.props.VISAO}/${SOLICITACAO_KIT_LANCHE}`}>
                <Botao
                  texto="voltar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.BLUE}
                  icon={BUTTON_ICON.ARROW_LEFT}
                  className="float-right"
                />
              </Link>
            </span>
            <div className="card mt-3">
              <div className="card-body">
                <div className="row">
                  <p
                    className={`col-12 title-message ${corDaMensagem(
                      prazoDoPedidoMensagem
                    )}`}
                  >
                    {prazoDoPedidoMensagem}
                    <Botao
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.BLUE}
                      icon={BUTTON_ICON.PRINT}
                      className="float-right"
                    />
                  </p>
                  <div className="col-2">
                    <span className="badge-sme badge-secondary-sme">
                      <span className="id-of-solicitation-dre">
                        # {solicitacaoKitLanche.id_externo}
                      </span>
                      <br />{" "}
                      <span className="number-of-order-label">
                        ID DO PEDIDO
                      </span>
                    </span>
                  </div>
                  <div className="report-div-beside-order my-auto col-8">
                    <span className="requester">Escola Solicitante</span>
                    <br />
                    <span className="dre-name">
                      {solicitacaoKitLanche.escola &&
                        solicitacaoKitLanche.escola.nome}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2 report-label-value">
                    <p>DRE</p>
                    <p className="value-important">
                      {solicitacaoKitLanche.escola &&
                        solicitacaoKitLanche.escola.diretoria_regional &&
                        solicitacaoKitLanche.escola.diretoria_regional.nome}
                    </p>
                  </div>
                  <div className="col-2 report-label-value">
                    <p>Lote</p>
                    <p className="value-important">
                      {solicitacaoKitLanche.escola &&
                        solicitacaoKitLanche.escola.lote &&
                        solicitacaoKitLanche.escola.lote.nome}
                    </p>
                  </div>
                  <div className="col-2 report-label-value">
                    <p>Tipo de Gestão</p>
                    <p className="value-important">
                      {solicitacaoKitLanche.escola &&
                        solicitacaoKitLanche.escola.tipo_gestao &&
                        solicitacaoKitLanche.escola.tipo_gestao.nome}
                    </p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <FluxoDeStatus listaDeStatus={solicitacaoKitLanche.logs} />
                </div>
                <hr />
                <div className="row">
                  <div className="report-students-div col-3">
                    <span>Nº de alunos matriculados total</span>
                    <span>
                      {solicitacaoKitLanche.escola &&
                        solicitacaoKitLanche.escola.alunos_total}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 report-label-value">
                    <p className="value">Descrição da Solicitação</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4 report-label-value">
                    <p>Data do evento</p>
                    <p className="value">
                      {solicitacaoKitLanche.solicitacao_kit_lanche &&
                        solicitacaoKitLanche.solicitacao_kit_lanche.data}
                    </p>
                  </div>
                  <div className="col-8 report-label-value">
                    <p>Local do passeio</p>
                    <p className="value">{solicitacaoKitLanche.local}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4 report-label-value">
                    <p>Nº de alunos participantes</p>
                    <p className="value">
                      {solicitacaoKitLanche.quantidade_alunos} alunos
                    </p>
                  </div>
                  <div className="col-8 report-label-value">
                    <p>Tempo previsto do passeio</p>
                    <p className="value">
                      {solicitacaoKitLanche.solicitacao_kit_lanche &&
                        solicitacaoKitLanche.solicitacao_kit_lanche
                          .tempo_passeio_explicacao}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 float-right report-label-value">
                    <p>Opção desejada</p>
                    {solicitacaoKitLanche.solicitacao_kit_lanche &&
                      solicitacaoKitLanche.solicitacao_kit_lanche.kits.map(
                        (kit, key) => {
                          return (
                            <p key={key} className="value">
                              Modelo {kit.nome}
                            </p>
                          );
                        }
                      )}
                  </div>
                </div>
                {solicitacaoKitLanche.solicitacao_kit_lanche &&
                  solicitacaoKitLanche.solicitacao_kit_lanche.kits && (
                    <div className="row">
                      <div className="col-12 float-right report-label-value">
                        <p>Nº total de kits</p>
                        <p className="value">
                          {solicitacaoKitLanche.solicitacao_kit_lanche.kits
                            .length *
                            solicitacaoKitLanche.quantidade_alunos}{" "}
                          kits
                        </p>
                      </div>
                    </div>
                  )}
                <div className="row">
                  <div className="col-12 report-label-value">
                    <p>Observações</p>
                    <p
                      className="value"
                      dangerouslySetInnerHTML={{
                        __html:
                          solicitacaoKitLanche.solicitacao_kit_lanche &&
                          solicitacaoKitLanche.solicitacao_kit_lanche.descricao
                      }}
                    />
                  </div>
                </div>
                <RelatorioHistoricoQuestionamento
                  solicitacao={solicitacaoKitLanche}
                />
                {(() => {
                  switch (this.props.VISAO) {
                    case ESCOLA:
                      return (
                        escolaPodeCancelar(solicitacaoKitLanche.status) && (
                          <div className="form-group row float-right mt-4">
                            <div className="col-12 text-right">
                              <Botao
                                texto={"Cancelar"}
                                onClick={() => this.showModal()}
                                type={BUTTON_TYPE.SUBMIT}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                              />
                            </div>
                          </div>
                        )
                      );
                    case DRE:
                      return (
                        solicitacaoKitLanche.status ===
                          statusEnum.DRE_A_VALIDAR && (
                          <div className="form-group row float-right mt-4">
                            <Botao
                              texto={"Não Validar"}
                              className="ml-3"
                              onClick={() => this.showNaoValidarModal()}
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                            />
                            <Botao
                              texto="Validar"
                              type={BUTTON_TYPE.SUBMIT}
                              onClick={() => this.handleSubmit()}
                              style={BUTTON_STYLE.GREEN}
                              className="ml-3"
                            />
                          </div>
                        )
                      );
                    case CODAE:
                      return (
                        [
                          statusEnum.DRE_VALIDADO,
                          statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO
                        ].includes(solicitacaoKitLanche.status) && (
                          <div className="form-group row float-right mt-4">
                            <Botao
                              texto={"Negar"}
                              className="ml-3"
                              onClick={() => this.showNegarModal()}
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                            />
                            <Botao
                              texto={
                                solicitacaoKitLanche.foi_solicitado_fora_do_prazo &&
                                CODAE_DEVE_QUESTIONAR
                                  ? "Questionar"
                                  : "Autorizar"
                              }
                              type={BUTTON_TYPE.SUBMIT}
                              onClick={() =>
                                solicitacaoKitLanche.foi_solicitado_fora_do_prazo &&
                                CODAE_DEVE_QUESTIONAR
                                  ? this.showQuestionarModal()
                                  : this.handleSubmit()
                              }
                              style={BUTTON_STYLE.GREEN}
                              className="ml-3"
                            />
                          </div>
                        )
                      );
                    case TERCEIRIZADA:
                      return [
                        solicitacaoKitLanche.status ===
                          statusEnum.CODAE_AUTORIZADO && (
                          <div className="form-group row float-right mt-4">
                            <Botao
                              texto="Ciente"
                              type={BUTTON_TYPE.SUBMIT}
                              onClick={() => this.handleSubmit()}
                              style={BUTTON_STYLE.GREEN}
                              className="ml-3"
                            />
                          </div>
                        ),
                        solicitacaoKitLanche.status ===
                          statusEnum.CODAE_QUESTIONADO && (
                          <div className="form-group row float-right mt-4">
                            <Botao
                              texto={"Não"}
                              className="ml-3"
                              onClick={() =>
                                this.showResponderQuestionamentoModal("Não")
                              }
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                            />
                            <Botao
                              texto={"Sim"}
                              className="ml-3"
                              onClick={() =>
                                this.showResponderQuestionamentoModal("Sim")
                              }
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN}
                            />
                          </div>
                        )
                      ];
                    default:
                      return "AQUI";
                  }
                })()}
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}
const formName = "kitLancheAvulsoRelatorioForm";

const selector = formValueSelector(formName);
const mapStateToProps = state => {
  return {
    justificativa: selector(state, "justificativa")
  };
};

const RelatorioForm = reduxForm({
  form: formName,
  enableReinitialize: true
})(Relatorio);

export default connect(mapStateToProps)(RelatorioForm);
