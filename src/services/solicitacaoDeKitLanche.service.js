import { API_URL } from "../constants/config.constants";
import authService from "./auth";
import axios from "./_base";
import { FLUXO, PEDIDOS } from "./constants";

export const URL_SOLICITAR = `${API_URL}/kit-lanches`;
export const URL_SOLICITACOES_AVULSAS = `${API_URL}/solicitacoes-kit-lanche-avulsa`;
export const URL_SOLICITACOES_AVULSAS_CEI = `${API_URL}/solicitacoes-kit-lanche-cei-avulsa`;

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json"
};

export const getKitsByApi = async () => {
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };

  const url = `${API_URL}/solicitar-kit-lanche/`;
  OBJ_REQUEST["method"] = "GET";
  return await fetch(url, OBJ_REQUEST)
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.log("Error Kit Lanche: ", error);
      return {};
    });
};

export const solicitarKitLanche = async values => {
  let status = 0;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "POST",
    body: JSON.stringify(values)
  };
  return await fetch(`${URL_SOLICITACOES_AVULSAS}/`, OBJ_REQUEST)
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const registroAtualizaKitLanche = (payload, uuid) => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${uuid}/`;
  let status = 0;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: authToken
  })
    .then(response => {
      status = response.status;
      return response.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const atualizarKitLanche = async values => {
  const OBJ_REQUEST = {
    headers: authToken,
    method: "PUT",
    body: JSON.stringify(values)
  };

  return await fetch(`${URL_SOLICITAR}/${values.id}/`, OBJ_REQUEST)
    .then(response => {
      return response.json();
    })
    .catch(erro => {
      console.log("Atualizar Kit Lanche: ", erro);
    });
};

export const removeKitLanche = async uuid => {
  const OBJ_REQUEST = {
    headers: authToken,
    method: "DELETE"
  };
  let status = 0;
  return await fetch(`${URL_SOLICITACOES_AVULSAS}/${uuid}/`, OBJ_REQUEST)
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return { data: error, status: status };
    });
};

export const inicioPedido = uuid => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${uuid}/${FLUXO.INICIO_PEDIDO}/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: authToken
  })
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const getSolicitacoesKitLancheApi = async () => {
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };

  return await fetch(
    `${URL_SOLICITACOES_AVULSAS}/${PEDIDOS.MEUS}/`,
    OBJ_REQUEST
  )
    .then(response => {
      const resp = response.json();
      return resp;
    })
    .catch(erro => {
      console.log("Pega Kit Lanches: ", erro);
    });
};

export const getRefeicoesApi = async () => {
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };

  return await fetch(`${API_URL}/kit-lanches/`, OBJ_REQUEST)
    .then(response => {
      return response.json();
    })
    .catch(erro => {
      return erro;
    });
};

export const getKitLanches = async () => {
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };

  return await fetch(`${API_URL}/kit-lanches/`, OBJ_REQUEST)
    .then(response => {
      return response.json();
    })
    .catch(erro => {
      return erro;
    });
};

export const getCODAEPedidosKitLanchePendentes = filtroAplicado => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${PEDIDOS.CODAE}/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const getDREPedidosDeKitLancheCei = filtroAplicado => {
  const url = `${URL_SOLICITACOES_AVULSAS_CEI}/${
    PEDIDOS.DRE
  }/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(async result => {
      const data = await result.json();
      return {
        results: data.results.map(el => ({
          ...el,
          isCei: true
        })),
        status: data.status
      };
    })
    .catch(error => {
      console.log(error);
    });
};

export const getCodaePedidosDeKitLancheCei = filtroAplicado => {
  const url = `${URL_SOLICITACOES_AVULSAS_CEI}/${
    PEDIDOS.CODAE
  }/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const getDiretoriaRegionalPedidosDeKitLanche = filtroAplicado => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${PEDIDOS.DRE}/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const getDiretoriaRegionalPedidosDeKitLancheReprovados = () => {
  //TODO: TIRAR
  const url = `${URL_SOLICITACOES_AVULSAS}/pedidos-reprovados-diretoria-regional/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const getCodaePedidosDeKitLanche = filtroAplicado => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${PEDIDOS.CODAE}/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const getTerceirizadasPedidosDeKitLanche = filtroAplicado => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${
    PEDIDOS.TERCEIRIZADA
  }/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const getDetalheKitLancheAvulsa = (uuid, isCei) => {
  const path = isCei ? URL_SOLICITACOES_AVULSAS_CEI : URL_SOLICITACOES_AVULSAS;
  const url = `${path}/${uuid}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      console.log(error);
    });
};

export const DREValidaKitLancheAvulso = (uuid, isCei) => {
  const path = isCei ? URL_SOLICITACOES_AVULSAS_CEI : URL_SOLICITACOES_AVULSAS;
  const url = `${path}/${uuid}/${FLUXO.DRE_VALIDA}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "PATCH"
  };
  let status = 0;
  return fetch(url, OBJ_REQUEST)
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const DRENaoValidaKitLancheAvulso = async (
  uuid,
  justificativa,
  isCei
) => {
  const path = isCei ? URL_SOLICITACOES_AVULSAS_CEI : URL_SOLICITACOES_AVULSAS;
  const url = `${path}/${uuid}/${FLUXO.DRE_NAO_VALIDA}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "PATCH",
    body: JSON.stringify({ justificativa })
  };
  let status = 0;
  try {
    const res = await fetch(url, OBJ_REQUEST);
    const data = await res.json();
    status = res.status;
    return { ...data, status: status };
  } catch (error) {
    return error.json();
  }
};

export const CODAEquestionaKitLancheAvulso = async (
  uuid,
  observacao_questionamento_codae,
  isCei
) => {
  const path = isCei ? URL_SOLICITACOES_AVULSAS_CEI : URL_SOLICITACOES_AVULSAS;
  const url = `${path}/${uuid}/${FLUXO.CODAE_QUESTIONA}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "PATCH",
    body: JSON.stringify({ observacao_questionamento_codae })
  };
  let status = 0;
  try {
    const res = await fetch(url, OBJ_REQUEST);
    const data = await res.json();
    status = res.status;
    return { ...data, status: status };
  } catch (error) {
    return error.json();
  }
};

export const terceirizadaRespondeQuestionamentoKitLancheAvulso = async (
  uuid,
  payload
) => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${uuid}/${
    FLUXO.TERCEIRIZADA_RESPONDE_QUESTIONAMENTO
  }/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "PATCH",
    body: JSON.stringify(payload)
  };
  let status = 0;
  try {
    const res = await fetch(url, OBJ_REQUEST);
    const data = await res.json();
    status = res.status;
    return { ...data, status: status };
  } catch (error) {
    return error.json();
  }
};

export const cancelaKitLancheAvulsoEscola = async (uuid, justificativa) => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${uuid}/${FLUXO.ESCOLA_CANCELA}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "PATCH",
    body: JSON.stringify({ justificativa })
  };
  let status = 0;
  try {
    const res = await fetch(url, OBJ_REQUEST);
    const data = await res.json();
    status = res.status;
    return { ...data, status: status };
  } catch (error) {
    return error.json();
  }
};

export const CODAENegaKitLancheAvulso = async (uuid, justificativa) => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${uuid}/${FLUXO.CODAE_NEGA}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "PATCH",
    body: JSON.stringify({ justificativa })
  };
  let status = 0;
  try {
    const res = await fetch(url, OBJ_REQUEST);
    const data = await res.json();
    status = res.status;
    return { ...data, status: status };
  } catch (error) {
    return error.json();
  }
};

export const CODAEAutorizaKitLancheAvulso = (uuid, justificativa = {}) => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${uuid}/${FLUXO.CODAE_AUTORIZA}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    body: JSON.stringify(justificativa),
    method: "PATCH"
  };
  let status = 0;
  return fetch(url, OBJ_REQUEST)
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const terceirizadaTomaCienciaKitLancheAvulso = uuid => {
  const url = `${URL_SOLICITACOES_AVULSAS}/${uuid}/${
    FLUXO.TERCEIRIZADA_TOMA_CIENCIA
  }/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "PATCH"
  };
  let status = 0;
  return fetch(url, OBJ_REQUEST)
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const solicitarKitLancheCei = values => {
  const url = `solicitacoes-kit-lanche-cei-avulsa/`;
  return axios.post(url, values);
};

export const getSolicitacoesKitLancheCeiRascunho = () => {
  const url = `solicitacoes-kit-lanche-cei-avulsa/minhas-solicitacoes/`;
  return axios.get(url);
};

export const registroAtualizaKitLancheCei = (payload, uuid) => {
  const url = `solicitacoes-kit-lanche-cei-avulsa/${uuid}/`;
  return axios.patch(url, payload);
};

export const inicioPedidoCei = uuid => {
  const url = `solicitacoes-kit-lanche-cei-avulsa/${uuid}/${
    FLUXO.INICIO_PEDIDO
  }/`;
  return axios.patch(url);
};
