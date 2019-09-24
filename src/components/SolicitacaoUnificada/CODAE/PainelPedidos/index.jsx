import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { FiltroEnum } from "../../../../constants/filtroEnum";
import { getCODAEPedidosSolicitacoesUnificadas } from "../../../../services/solicitacaoUnificada.service";
import {
  CardPendenciaAprovacao,
  TIPO_CARD_ENUM
} from "../../components/CardPendenciaAprovacao";
import CardHistorico from "../../components/CardHistorico";
import {
  filtraNoLimite,
  filtraPrioritarios,
  filtraRegular,
  formatarPedidos
} from "./helper";
import { CODAE } from "../../../../configs/constants";
import { dataAtualDDMMYYYY } from "../../../../helpers/utilities";
import Select from "../../../Shareable/Select";

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
    getCODAEPedidosSolicitacoesUnificadas(filtro).then(response => {
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
    const { visaoPorCombo, pedidosAprovados, pedidosReprovados } = this.props;
    return (
      <div>
        {!pedidosCarregados ? (
          <div>Carregando...</div>
        ) : (
          <form onSubmit={this.props.handleSubmit}>
            <div className="card mt-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-3 font-10 my-auto">
                    Data: {dataAtualDDMMYYYY()}
                  </div>
                  <div className="offset-6 col-3 text-right">
                    <Field
                      component={Select}
                      name="visao_por"
                      naoDesabilitarPrimeiraOpcao
                      onChange={event =>
                        this.onFiltroSelected(event.target.value)
                      }
                      placeholder={"Filtro por"}
                      options={visaoPorCombo}
                    />
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-12">
                    <CardPendenciaAprovacao
                      titulo={
                        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)"
                      }
                      tipoDeCard={TIPO_CARD_ENUM.PRIORIDADE}
                      pedidos={pedidosPrioritarios}
                      ultimaColunaLabel={"Data da Inclusão"}
                      parametroURL={CODAE}
                    />
                  </div>
                </div>

                <div className="row pt-3">
                  <div className="col-12">
                    <CardPendenciaAprovacao
                      titulo={"Solicitações no prazo limite"}
                      tipoDeCard={"on-limit"}
                      pedidos={pedidosNoPrazoLimite}
                      ultimaColunaLabel={"Data da Inclusão"}
                      parametroURL={CODAE}
                    />
                  </div>
                </div>

                <div className="row pt-3">
                  <div className="col-12">
                    <CardPendenciaAprovacao
                      titulo={"Solicitações no prazo regular"}
                      tipoDeCard={"regular"}
                      pedidos={pedidosNoPrazoRegular}
                      ultimaColunaLabel={"Data da Inclusão"}
                      parametroURL={CODAE}
                    />
                  </div>
                </div>
                {pedidosAprovados.length > 0 && (
                  <div className="row pt-3">
                    <div className="col-12">
                      <CardHistorico
                        pedidos={formatarPedidos(pedidosAprovados)}
                        ultimaColunaLabel={"Data(s)"}
                        titulo={
                          "Histórico de Inclusões de Alimentação Autorizadas"
                        }
                        parametroURL={CODAE}
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
