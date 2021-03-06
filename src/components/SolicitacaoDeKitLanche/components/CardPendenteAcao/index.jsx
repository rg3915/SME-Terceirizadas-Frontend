import React, { Component } from "react";
import { Collapse } from "react-collapse";
import { Link } from "react-router-dom";
import { calcularNumeroDeEscolasUnicas } from "./helper";
import {
  talvezPluralizar,
  ehEscolaTipoCEI
} from "../../../../helpers/utilities";
import { SOLICITACAO_KIT_LANCHE } from "../../../../configs/constants";
import { ToggleExpandir } from "../../../Shareable/ToggleExpandir";
import { TIPO_SOLICITACAO } from "constants/shared";
const { SOLICITACAO_CEI, SOLICITACAO_NORMAL } = TIPO_SOLICITACAO;

export class CardPendenteAcao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      pedidosFiltrados: this.props.pedidos
    };
    this.filtrarPedidos = this.filtrarPedidos.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.pedidos.length !== prevProps.pedidos.length) {
      this.setState({ pedidosFiltrados: this.props.pedidos });
    }
  }

  filtrarPedidos(event) {
    if (event === undefined) event = { target: { value: "" } };
    let pedidosFiltrados = this.props.pedidos;
    pedidosFiltrados = pedidosFiltrados.filter(function(item) {
      const palavraAFiltrar = event.target.value.toLowerCase();
      return (
        item.id_externo.toLowerCase().includes(palavraAFiltrar) ||
        item.escola.nome.toLowerCase().search(palavraAFiltrar) !== -1 ||
        item.escola.codigo_eol.includes(palavraAFiltrar)
      );
    });
    this.setState({ pedidosFiltrados });
  }

  render() {
    const { pedidos, titulo, tipoDeCard, ultimaColunaLabel } = this.props;
    const { collapsed, pedidosFiltrados } = this.state;
    return (
      <div className="card card-pendency-approval meal-kit-solicitation">
        <div className={"card-title " + tipoDeCard}>{titulo}</div>
        <div className="row">
          <div className="col-2">
            <div className={"order-box " + tipoDeCard}>
              <span className="number">{pedidos.length}</span>
              <span className="order">
                {pedidos.length === 1 ? "solicitação" : "solicitações"}
              </span>
            </div>
          </div>
          {pedidos.length > 0 && (
            <div className="col-9">
              <div className="order-lines">
                <div className="label" />
                <span className="text">
                  <span className="value">
                    {calcularNumeroDeEscolasUnicas(pedidos)}{" "}
                  </span>
                  {`
                  ${talvezPluralizar(
                    calcularNumeroDeEscolasUnicas(pedidos),
                    "escola"
                  )} ${talvezPluralizar(
                    calcularNumeroDeEscolasUnicas(pedidos),
                    "solicitante"
                  )}
                  `}
                </span>
              </div>
            </div>
          )}
          <div className="col-1">
            {pedidos.length > 0 && (
              <ToggleExpandir
                onClick={() => this.setState({ collapsed: !collapsed })}
                ativo={!collapsed}
              />
            )}
          </div>
        </div>
        <Collapse isOpened={!collapsed}>
          <div className="row">
            <div className="input-search-full-width col-12">
              <input
                type="text"
                className="form-control"
                placeholder="Pesquisar"
                onChange={this.filtrarPedidos}
              />
              <i className="fas fa-search inside-input" />
            </div>
            <table className="orders-table mt-4 ml-3 mr-3">
              <thead>
                <tr>
                  <th>Código do Pedido</th>
                  <th>Código EOL</th>
                  <th>Nome da Escola</th>
                  <th>{ultimaColunaLabel || "Data"}</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.length > 0 &&
                  pedidosFiltrados.map((pedido, key) => {
                    const tipoSolicitacao = ehEscolaTipoCEI(pedido.escola)
                      ? SOLICITACAO_CEI
                      : SOLICITACAO_NORMAL;
                    return (
                      <Link
                        key={key}
                        to={`/${SOLICITACAO_KIT_LANCHE}/relatorio?uuid=${
                          pedido.uuid
                        }&tipoSolicitacao=${tipoSolicitacao}`}
                      >
                        <tr>
                          <td>{pedido.id_externo}</td>
                          <td>{pedido.escola.codigo_eol}</td>
                          <td>{pedido.escola.nome}</td>
                          <td>{pedido.solicitacao_kit_lanche.data}</td>
                        </tr>
                      </Link>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Collapse>
      </div>
    );
  }
}
