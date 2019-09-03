import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { FiltroEnum } from "../../../../constants/filtroEnum";
import { getTerceirizadaPedidosSolicitacoesUnificadas } from "../../../../services/solicitacaoUnificada.service";
import { LabelAndCombo } from "../../../Shareable/labelAndInput/labelAndInput";
import {
  CardPendenciaAprovacao,
  TIPO_CARD_ENUM
} from "../../components/CardPendenciaAprovacao";
import CardHistorico from "./CardHistorico";
import {
  filtraNoLimite,
  filtraPrioritarios,
  filtraRegular,
  formatarPedidos
} from "./helper";

class PainelPedidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pedidosPrioritarios: [],
      pedidosNoPrazoLimite: [],
      pedidosNoPrazoRegular: [],
      pedidosCarregados: false
    };
  }

  filtrar(filtro) {
    getTerceirizadaPedidosSolicitacoesUnificadas(filtro).then(response => {
      let pedidosPrioritarios = filtraPrioritarios(response.results);
      let pedidosNoPrazoLimite = filtraNoLimite(response.results);
      let pedidosNoPrazoRegular = filtraRegular(response.results);
      this.setState({
        pedidosPrioritarios,
        pedidosNoPrazoLimite,
        pedidosNoPrazoRegular,
        pedidosCarregados: true
      });
    });
  }

  componentDidMount() {
    this.filtrar(FiltroEnum.SEM_FILTRO);
  }

  onFiltroSelected(value) {
    switch (value) {
      case FiltroEnum.HOJE:
        this.filtrarHoje();
        break;
      default:
        this.filtrar(value);
        break;
    }
  }

  render() {
    const {
      pedidosPrioritarios,
      pedidosNoPrazoLimite,
      pedidosNoPrazoRegular,
      pedidosCarregados
    } = this.state;
    const {
      visaoPorCombo,
      pedidosAprovados,
      pedidosReprovados
    } = this.props;
    return (
      <div>
        {!pedidosCarregados ? (
          <div>Carregando...</div>
        ) : (
          <form onSubmit={this.props.handleSubmit}>
            <div>
              <div className="row">
                <div className="col-7">
                  <div className="page-title">
                    Solicitação Unificada - Pendente Ciência
                  </div>
                </div>
                <div className="col-5">
                  <div className="row">
                    <div classame="col-6">
                      <span>Vencimento para:</span>
                    </div>
                    <div className="col-6">
                      <Field
                        component={LabelAndCombo}
                        name="visao_por"
                        onChange={value => this.onFiltroSelected(value)}
                        placeholder={"Visão por dia"}
                        options={visaoPorCombo}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row pt-3">
                <div className="col-12">
                  <CardPendenciaAprovacao
                    titulo={
                      "Pedidos próximos ao prazo de vencimento (2 dias ou menos)"
                    }
                    tipoDeCard={TIPO_CARD_ENUM.PRIORIDADE}
                    pedidos={pedidosPrioritarios}
                    ultimaColunaLabel={"Data da Inclusão"}
                    parametroURL={"terceirizada"}
                  />
                </div>
              </div>

              <div className="row pt-3">
                <div className="col-12">
                  <CardPendenciaAprovacao
                    titulo={"Pedidos no prazo limite"}
                    tipoDeCard={"on-limit"}
                    pedidos={pedidosNoPrazoLimite}
                    ultimaColunaLabel={"Data da Inclusão"}
                    parametroURL={"terceirizada"}
                  />
                </div>
              </div>

              <div className="row pt-3">
                <div className="col-12">
                  <CardPendenciaAprovacao
                    titulo={"Pedidos no prazo regular"}
                    tipoDeCard={"regular"}
                    pedidos={pedidosNoPrazoRegular}
                    ultimaColunaLabel={"Data da Inclusão"}
                    parametroURL={"terceirizada"}
                  />
                </div>
              </div>
              {pedidosAprovados.length > 0 && (
                <div className="row pt-3">
                  <div className="col-12">
                    <CardHistorico
                      pedidos={formatarPedidos(pedidosAprovados)}
                      ultimaColunaLabel={"Data(s)"}
                      titulo={"Histórico de Inclusões de Alimentação Aprovadas"}
                    />
                  </div>
                </div>
              )}
              {pedidosReprovados.length > 0 && (
                <div className="row pt-3">
                  <div className="col-12">
                    <CardHistorico
                      pedidos={formatarPedidos(pedidosReprovados)}
                      ultimaColunaLabel={"Data(s)"}
                      titulo={
                        "Histórico de Inclusões de Alimentação Reprovadas"
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    );
  }
}

const PainelPedidosForm = reduxForm({
  form: "painelPedidos",
  enableReinitialize: true
})(PainelPedidos);
const selector = formValueSelector("painelPedidos");
const mapStateToProps = state => {
  return {
    valorDoFiltro: selector(state, "visao_por")
  };
};

export default connect(mapStateToProps)(PainelPedidosForm);