import React, { Component } from "react";

import Botao from "../../../Shareable/Botao";
import { BUTTON_STYLE, BUTTON_ICON } from "../../../Shareable/Botao/constants";

import "./Painel.scss";

const CabecalhoPainel = ({ totalDietasAtivas, totalDietasInativas }) => (
  <div className="row cabecalho-painel">
    <div className="col-4">
      <i className="fas fa-check-circle" />
      <span>Total de Dietas Ativas: {totalDietasAtivas}</span>
    </div>
    <div className="col-4">
      <i className="fas fa-times-circle" />
      <span>Total de Dietas Inativas: {totalDietasInativas}</span>
    </div>
    <div className="col-4">
      <Botao
        texto="Imprimir"
        icon={BUTTON_ICON.PRINT}
        style={BUTTON_STYLE.BLUE_OUTLINE}
      />
    </div>
  </div>
);

const TabelaDietas = ({ solicitacoes }) => {
  if (solicitacoes === undefined || solicitacoes.length === 0) {
    return <div>Carregando...</div>;
  }
  return (
    <div className="row">
      <div className="col-12">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Código EOL</th>
              <th scope="col">Nome do Aluno</th>
              <th scope="col">Qtde. Ativas</th>
              <th scope="col">Qtde. Inativas</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {solicitacoes.map((dados, key) => {
              return (
                <tr key={key}>
                  <td>{dados.codigo_eol}</td>
                  <td>{dados.nome}</td>
                  <td>{dados.ativas}</td>
                  <td>{dados.inativas}</td>
                  <td>
                    <Botao
                      texto="Visualizar"
                      icon={undefined}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default class Painel extends Component {
  render() {
    const { dadosDietaPorAluno } = this.props;
    const { total_ativas, total_inativas, solicitacoes } = dadosDietaPorAluno;
    if (solicitacoes.length === 0) {
      return <div>Não há dados para os filtros utilizados</div>;
    }
    return (
      <div className="card mt-3">
        <div className="card-body">
          <form>
            <CabecalhoPainel
              totalDietasAtivas={total_ativas}
              totalDietasInativas={total_inativas}
            />
            <hr />
            <div className="row">
              <div className="col-12">
                <p>Unidade Escolar</p>
                <p>000108 EMEF JOSÉ ERMIRIO DE MORAIS, SEN</p>
              </div>
            </div>
            <TabelaDietas solicitacoes={solicitacoes} />
          </form>
        </div>
      </div>
    );
  }
}