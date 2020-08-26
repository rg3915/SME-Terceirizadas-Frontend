import {
  TIPO_PERFIL,
  ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS
} from "../../../constants/shared";
import { escolheStatusPendenteHomologacao } from "../helpers";

describe("Test escolheStatusPendenteHomologacao", () => {
  test("retorna lista se perfil é gpcodae", () => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.GESTAO_PRODUTO);
    expect(escolheStatusPendenteHomologacao()).toEqual([
      ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS.CODAE_PENDENTE_HOMOLOGACAO
    ]);
  });
  test("retorna um único status nos outros perfis", () => {
    for (let tipoPerfil of Object.values(TIPO_PERFIL)) {
      if (tipoPerfil === TIPO_PERFIL.GESTAO_PRODUTO) {
        continue;
      }
      localStorage.setItem("tipo_perfil", tipoPerfil);
      expect(escolheStatusPendenteHomologacao()).toEqual(
        ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS.CODAE_PENDENTE_HOMOLOGACAO
      );
    }
  });
});
