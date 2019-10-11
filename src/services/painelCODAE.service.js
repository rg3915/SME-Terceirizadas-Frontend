import {
  filtraCiencia,
  filtraInformados,
  filtraNoLimite,
  filtraPrioritarios,
  filtraRegular
} from "../helpers/painelPedidos";
import { API_URL } from "../constants/config.constants";
import { getCODAEPedidosAlteracaoCardapio } from "./alteracaoDecardapio.service";
import authService from "./auth";
import { getCODAEPedidosInclusaoAvulsoPendentes } from "./inclusaoDeAlimentacaoAvulsa.service";
import { getCODAEPedidosInclusaoContinuosPendentes } from "./inclusaoDeAlimentacaoContinua.service";
import { getCODAEPedidosDeInversoes } from "./inversaoDeDiaDeCardapio.service";
import { getCODAEPedidosKitLanchePendentes } from "./solicitacaoDeKitLanche.service";
import { getCODAEPedidosSolicitacoesUnificadas } from "./solicitacaoUnificada.service";
import { getSuspensaoDeAlimentacaoCODAE } from "./suspensaoDeAlimentacao.service";
import { SOLICITACOES } from "./contants";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json"
};

const TODAS_SOLICITACOES_CODAE_URL = `${API_URL}/codae-solicitacoes`;

export const getSolicitacoesAutorizadasCodae = async () => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${SOLICITACOES.AUTORIZADOS}/`;

  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  try {
    const result = await fetch(url, OBJ_REQUEST);
    const json = await result.json();
    return json.results;
  } catch (error) {
    console.log(error);
  }
};

export const getSolicitacoesCanceladasCodae = async () => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${SOLICITACOES.CANCELADOS}/`;

  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  try {
    const result = await fetch(url, OBJ_REQUEST);
    const json = await result.json();
    return json.results;
  } catch (error) {
    console.log(error);
  }
};

export const getSolicitacoesPendentesAutorizacaoCodae = async filtro => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${
    SOLICITACOES.PENDENTES
  }/${filtro}/`;

  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  try {
    const result = await fetch(url, OBJ_REQUEST);
    const json = await result.json();
    return json.results;
  } catch (error) {
    console.log(error);
  }
};

export const getSolicitacoesNegadasCodae = async () => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${SOLICITACOES.NEGADOS}/`;

  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  try {
    const result = await fetch(url, OBJ_REQUEST);
    const json = await result.json();
    return json.results;
  } catch (error) {
    console.log(error);
  }
};

export const getResumoPendenciasInversoesCardapio = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  const solicitacoes = await getCODAEPedidosDeInversoes(filtro);

  if (solicitacoes) {
    pedidosPrioritarios = filtraPrioritarios(solicitacoes.results);
    pedidosLimite = filtraNoLimite(solicitacoes.results);
    pedidosRegular = filtraRegular(solicitacoes.results);
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasInclusaoAlimentacao = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  const solicitacoesContinuas = await getCODAEPedidosInclusaoContinuosPendentes(
    filtro
  );
  const soliticacoesAvulsas = await getCODAEPedidosInclusaoAvulsoPendentes(
    filtro
  );

  if (solicitacoesContinuas && soliticacoesAvulsas) {
    const todasTmp = solicitacoesContinuas.results.concat(
      soliticacoesAvulsas.results
    );

    pedidosPrioritarios = filtraPrioritarios(todasTmp);
    pedidosLimite = filtraNoLimite(todasTmp);
    pedidosRegular = filtraRegular(todasTmp);
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasKitLancheAvulso = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  const solicitacoesContinuas = await getCODAEPedidosKitLanchePendentes(filtro);

  if (solicitacoesContinuas) {
    pedidosPrioritarios = filtraPrioritarios(solicitacoesContinuas.results);
    pedidosLimite = filtraNoLimite(solicitacoesContinuas.results);
    pedidosRegular = filtraRegular(solicitacoesContinuas.results);
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasKitLancheUnificado = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  const solicitacoesUnificadas = await getCODAEPedidosSolicitacoesUnificadas(
    filtro
  );

  if (solicitacoesUnificadas) {
    pedidosPrioritarios = filtraPrioritarios(solicitacoesUnificadas.results);
    pedidosLimite = filtraNoLimite(solicitacoesUnificadas.results);
    pedidosRegular = filtraRegular(solicitacoesUnificadas.results);
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasAlteracaoCardapio = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  const solicitacoesUnificadas = await getCODAEPedidosAlteracaoCardapio(filtro);

  if (solicitacoesUnificadas) {
    pedidosPrioritarios = filtraPrioritarios(solicitacoesUnificadas.results);
    pedidosLimite = filtraNoLimite(solicitacoesUnificadas.results);
    pedidosRegular = filtraRegular(solicitacoesUnificadas.results);
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasSuspensaoCardapio = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    informados: 0,
    ciencia: 0
  };

  let informados = [];
  let ciencia = [];

  const suspensoesRefeicao = await getSuspensaoDeAlimentacaoCODAE(filtro);

  if (suspensoesRefeicao) {
    informados = filtraInformados(suspensoesRefeicao.results);
    ciencia = filtraCiencia(suspensoesRefeicao.results);
  }

  resposta.ciencia = ciencia.length;
  resposta.informados = informados.length;
  resposta.total = resposta.informados + resposta.ciencia;

  return resposta;
};

export const getResumoPendenciasCODAEporDRE = async filtro => {
  // TODO Algoritimo de prioridade desse endpoint não bate com usado para os cards por tipo de doc
  const solicitacoes = await getSolicitacoesPendentesAutorizacaoCodae(filtro);

  const reducer = (resumoPorDRE, corrente) => {
    if (!resumoPorDRE[corrente.dre_nome]) {
      resumoPorDRE[corrente.dre_nome] = {};
    }
    if (corrente.prioridade !== "VENCIDO") {
      resumoPorDRE[corrente.dre_nome][corrente.prioridade] = resumoPorDRE[
        corrente.dre_nome
      ][corrente.prioridade]
        ? (resumoPorDRE[corrente.dre_nome][corrente.prioridade] += 1)
        : 1;
      resumoPorDRE[corrente.dre_nome]["TOTAL"] = resumoPorDRE[
        corrente.dre_nome
      ]["TOTAL"]
        ? (resumoPorDRE[corrente.dre_nome]["TOTAL"] += 1)
        : 1;
    }
    return resumoPorDRE;
  };

  let resumoPorDRE = solicitacoes.reduce(reducer, {});

  return resumoPorDRE;
};

export const getResumoPendenciasCODAEporLote = async filtro => {
  // TODO Algoritimo de prioridade desse endpoint não bate com usado para os cards por tipo de doc
  const solicitacoes = await getSolicitacoesPendentesAutorizacaoCodae(filtro);

  const reducer = (resumoPorLote, corrente) => {
    if (!resumoPorLote[corrente.lote]) {
      resumoPorLote[corrente.lote] = {};
    }
    if (corrente.prioridade !== "VENCIDO") {
      resumoPorLote[corrente.lote][corrente.prioridade] = resumoPorLote[
        corrente.lote
      ][corrente.prioridade]
        ? (resumoPorLote[corrente.lote][corrente.prioridade] += 1)
        : 1;
      resumoPorLote[corrente.lote]["TOTAL"] = resumoPorLote[corrente.lote][
        "TOTAL"
      ]
        ? (resumoPorLote[corrente.lote]["TOTAL"] += 1)
        : 1;
    }
    return resumoPorLote;
  };

  let resumoPorLote = solicitacoes.reduce(reducer, {});

  return resumoPorLote;
};
