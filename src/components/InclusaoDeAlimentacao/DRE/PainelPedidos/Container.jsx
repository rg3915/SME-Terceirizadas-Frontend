import React, { Component } from "react";
import { visaoPorComboSomenteDatas } from "../../../../constants/painelPedidos.constants";
import {
  getDiretoriaRegionalPedidosAprovados as pedidosAprovadosContinuos,
  getDiretoriaRegionalPedidosReprovados as pedidosReprovadosContinuos
} from "../../../../services/inclusaoDeAlimentacaoContinua.service";
import {
  getDiretoriaRegionalPedidosAprovados as pedidosAprovadosNormais,
  getDiretoriaRegionalPedidosReprovados as pedidosReprovadosNormais
} from "../../../../services/inclusaoDeAlimentacaoAvulsa.service";
import PainelPedidos from ".";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visaoPorCombo: visaoPorComboSomenteDatas,
      pedidosAprovados: [],
      pedidosReprovados: []
    };
  }

  componentDidMount() {
    let pedidosAprovadosRetornados = 0;
    let pedidosReprovadosRetornados = 0;
    let pedidosAprovados = [];
    let pedidosReprovados = [];

    pedidosAprovadosContinuos().then(response => {
      pedidosAprovadosRetornados += 1;
      pedidosAprovados = pedidosAprovados.concat(response.results);
      if (pedidosAprovadosRetornados === 2) {
        this.setState({ pedidosAprovados });
      }
    });

    pedidosAprovadosNormais().then(response => {
      pedidosAprovadosRetornados += 1;
      pedidosAprovados = pedidosAprovados.concat(response.results);
      if (pedidosAprovadosRetornados === 2) {
        this.setState({ pedidosAprovados });
      }
    });

    pedidosReprovadosContinuos().then(response => {
      pedidosReprovadosRetornados += 1;
      pedidosReprovados = pedidosReprovados.concat(response.results);
      if (pedidosReprovadosRetornados === 2) {
        this.setState({ pedidosReprovados });
      }
    });

    pedidosReprovadosNormais().then(response => {
      pedidosReprovadosRetornados += 1;
      pedidosReprovados = pedidosReprovados.concat(response.results);
      if (pedidosReprovadosRetornados === 2) {
        this.setState({ pedidosReprovados });
      }
    });
  }

  render() {
    return <PainelPedidos {...this.state} />;
  }
}

export default Container;
