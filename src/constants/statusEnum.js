export const statusEnum = {
  INFORMADO: "INFORMADO",
  RASCUNHO: "RASCUNHO",
  DRE_A_VALIDAR: "DRE_A_VALIDAR",
  DRE_VALIDADO: "DRE_VALIDADO",
  CODAE_A_AUTORIZAR: "CODAE_A_AUTORIZAR",
  CODAE_AUTORIZADO: "CODAE_AUTORIZADO",
  TERCEIRIZADA_TOMOU_CIENCIA: "TERCEIRIZADA_TOMOU_CIENCIA",
  ESCOLA_CANCELOU: "ESCOLA_CANCELOU",
  CANCELADO_AUTOMATICAMENTE: "CANCELADO_AUTOMATICAMENTE",
  DRE_CANCELOU: "DRE_CANCELOU"
};

export const escolaPodeCancelar = status => {
  return (
    status === statusEnum.TERCEIRIZADA_TOMOU_CIENCIA ||
    status === statusEnum.CODAE_AUTORIZADO ||
    status === statusEnum.CODAE_A_AUTORIZAR ||
    status === statusEnum.DRE_VALIDADO ||
    status === statusEnum.DRE_A_VALIDAR
  );
};
