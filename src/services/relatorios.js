import { API_URL } from "../constants/config.constants";

export const getRelatorioKitLancheUnificado = uuid => {
  const url = `${API_URL}/solicitacoes-kit-lanche-unificada/${uuid}/relatorio/`;
  return url;
};

export const getRelatorioAlteracaoCardapio = uuid => {
  const url = `${API_URL}/alteracoes-cardapio/${uuid}/relatorio/`;
  return url;
};

export const getRelatorioDietaEspecial = uuid => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/relatorio/`;
  return url;
};

export const getRelatorioInclusaoAlimentacao = (uuid, ehInclusaoContinua) => {
  let url = `${API_URL}/grupos-inclusao-alimentacao-normal/${uuid}/relatorio/`;
  if (ehInclusaoContinua) {
    url = `${API_URL}/inclusoes-alimentacao-continua/${uuid}/relatorio/`;
  }
  return url;
};

export const getDetalheKitLancheAvulso = uuid => {
  const url = `${API_URL}/solicitacoes-kit-lanche-avulsa/${uuid}/relatorio/`;
  return url;
};

export const getDetalheInversaoCardapio = uuid => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/relatorio/`;
  return url;
};

export const getDetalheSuspensaoAlimentacao = uuid => {
  const url = `${API_URL}/grupos-suspensoes-alimentacao/${uuid}/relatorio/`;
  return url;
};