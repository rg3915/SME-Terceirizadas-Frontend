import React, { Component } from "react";
import { Collapse } from "react-collapse";
import { Field, reduxForm } from "redux-form";
import { CODAE, SOLICITACOES } from "../../../configs/constants";
import { dataAtual } from "../../../helpers/utilities";
import CardMatriculados from "../../Shareable/CardMatriculados";
import {
  CardStatusDeSolicitacao,
  CARD_TYPE_ENUM
} from "../../Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { LabelAndCombo } from "../../Shareable/labelAndInput/labelAndInput";
import "../../Shareable/style.scss";
import TabelaHistoricoLotesDREs from "../../Shareable/TabelaHistoricoLotesDREs";
import { FILTRO } from "./const";
import VisaoGeral from "./VisaoGeral";
import VisaoPorDRE from "./VisaoPorDRE";

class DashboardCODAE extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      dre: false,
      filtro: FILTRO.SEM_FILTRO,

      solicitacoesAprovadasFiltradas: [],
      solicitacoesPendentesAprovacaoFiltradas: [],
      solicitacoesCanceladasFiltradas: [],
      solicitacoesRevisaoFiltradas: []
    };
    this.alterarCollapse = this.alterarCollapse.bind(this);
  }

  onVencimentoPara(filtro) {
    this.setState({ filtro });
  }

  alterarCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const {
      totalAlunos,
      handleSubmit,
      solicitacoesAprovadas,
      solicitacoesPendentesAprovacao,
      solicitacoesCanceladas,
      vencimentoPara,
      lotes
    } = this.props;
    const { collapsed, loading } = this.state;
    return (
      <div>
        <form onSubmit={handleSubmit(this.props.handleSubmit)}>
          <Field component={"input"} type="hidden" name="uuid" />
          <CardMatriculados
            collapsed={collapsed}
            alterarCollapse={this.alterarCollapse}
            numeroAlunos={totalAlunos}
          >
            <Collapse isOpened={!collapsed}>
              <TabelaHistoricoLotesDREs lotes={lotes} />
            </Collapse>
          </CardMatriculados>
          <div className="card mt-3">
            <div className="card-body">
              <div className="card-title font-weight-bold dashboard-card-title">
                <span>
                  <i className="fas fa-thumbtack" />
                  Painel de Status de Solicitações
                  <i className="fas fa-pen" />
                </span>
                <span className="float-right">
                  <input
                    className="input-search"
                    placeholder="Pesquisar"
                    onChange={this.filterList}
                  />
                  <i className="fas fa-search" />
                </span>
              </div>
              <div>
                <p className="current-date">
                  Data: <span>{dataAtual()}</span>
                </p>
              </div>
              <div className="row">
                <div className="col-6">
                  <CardStatusDeSolicitacao
                    cardTitle={"Autorizadas"}
                    loading={loading}
                    cardType={CARD_TYPE_ENUM.APROVADO}
                    solicitations={solicitacoesAprovadas}
                    icon={"fa-check"}
                    href={`/${CODAE}/${SOLICITACOES}`}
                  />
                </div>
                <div className="col-6">
                  <CardStatusDeSolicitacao
                    cardTitle={"Pendente Aprovação"}
                    loading={loading}
                    cardType={CARD_TYPE_ENUM.PENDENTE}
                    solicitations={solicitacoesPendentesAprovacao}
                    icon={"fa-exclamation-triangle"}
                    href={`/${CODAE}/${SOLICITACOES}`}
                  />
                </div>
              </div>
              <div className="row pt-3">
                <div className="col-6">
                  <CardStatusDeSolicitacao
                    cardTitle={"Canceladas"}
                    loading={loading}
                    cardType={CARD_TYPE_ENUM.CANCELADO}
                    solicitations={solicitacoesCanceladas}
                    icon={"fa-times-circle"}
                    href={`/${CODAE}/${SOLICITACOES}`}
                  />
                </div>
                <div className="col-6">
                  <CardStatusDeSolicitacao
                    cardTitle={"Solicitação recusada"}
                    loading={loading}
                    cardType={CARD_TYPE_ENUM.NEGADO}
                    solicitations={solicitacoesCanceladas}
                    icon={"fa-times-circle"}
                    href={`/${CODAE}/${SOLICITACOES}`}
                  />
                </div>
              </div>
              <p className="caption">Legenda</p>
              <div className="caption-choices">
                <span>
                  <i className="fas fa-check" />
                  Solicitação Autorizada
                </span>
                <span>
                  <i className="fas fa-exclamation-triangle" />
                  Solicitação Pendente Aprovação
                </span>
                <span>
                  <i className="fas fa-ban" />
                  Solicitação Recusada
                </span>
                <span>
                  <i className="fas fa-times-circle" />
                  Solicitação Cancelada
                </span>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <div className="card-title font-weight-bold dashboard-card-title">
                <i className="fas fa-lock" />
                Pendências
                <span className="float-right">
                  <Field
                    component={LabelAndCombo}
                    onChange={filtro => this.onVencimentoPara(filtro)}
                    placeholder={"Vencimento para"}
                    options={vencimentoPara}
                  />
                </span>
              </div>
              <div className="pt-3" />

              {this.state.dre ? (
                <VisaoPorDRE {...this.props} />
              ) : (
                <VisaoGeral filtro={this.state.filtro} />
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }
}
const DashboardCODAEForm = reduxForm({
  form: "dashboardCODAE",
  enableReinitialize: true
})(DashboardCODAE);

export default DashboardCODAEForm;
