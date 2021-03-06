import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON
} from "components/Shareable/Botao/constants";
import FormBuscaProduto from "components/Shareable/FormBuscaProduto";
import { gerarParametrosConsulta } from "helpers/utilities";

import { gerarLabelPorFiltro } from "helpers/produto";

import {
  getProdutosPorTerceirizada,
  getRelatorioProdutosHomologados
} from "services/produto.service";

import "./style.scss";

const gerarLabelTotal = filtros => {
  if (filtros.data_inicial || filtros.data_final) return " no período";
  return "";
};

const TabelaProdutosHomologados = ({ grupos, filtros }) => {
  if (!grupos) return false;
  return (
    <section className="tabela-produtos-homologados">
      <div className="header-homologados">
        <div>Terceirizada</div>
        <div>Nome do Produto</div>
        <div>Marca</div>
        <div>Dieta Especial</div>
        <div>Aditivos Alergênicos</div>
        <div>Data de Cadastro</div>
        <div>Data de Homologação</div>
      </div>
      {grupos.map((grupo, index) => {
        return (
          <>
            {grupo.produtos.map((produto, index2) => {
              return (
                <div key={index2} className="body-homologados">
                  <div>
                    {
                      produto.ultima_homologacao.rastro_terceirizada
                        .nome_fantasia
                    }
                  </div>
                  <div>{produto.nome}</div>
                  <div>{produto.marca.nome}</div>
                  <div>{produto.eh_para_alunos_com_dieta ? "Sim" : "Não"}</div>
                  <div>{produto.tem_aditivos_alergenicos ? "Sim" : "Não"}</div>
                  <div>{produto.criado_em}</div>
                  <div>{produto.ultima_homologacao.criado_em}</div>
                </div>
              );
            })}
            <div className="linha-totalizacao" key={index}>
              <span>
                {`Total de itens por ${grupo.terceirizada.nome_fantasia}: `}
                <span>{grupo.produtos.length.toString().padStart(2, "0")}</span>
              </span>
            </div>
          </>
        );
      })}
      <div className="linha-totalizacao linha-totalizacao-geral">
        <span>
          {`Total de produtos cadastrados ${gerarLabelTotal(filtros)}:`}
          <span>
            {grupos
              .reduce((acc, v) => {
                return acc + v.produtos.length;
              }, 0)
              .toString()
              .padStart(2, "0")}
          </span>
        </span>
      </div>
    </section>
  );
};

const RelatorioProdutosHomologados = () => {
  const [grupos, setGrupos] = useState(null);
  const [filtros, setFiltros] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!filtros) return;
    async function fetchData() {
      setCarregando(true);
      const response = await getProdutosPorTerceirizada(filtros);
      setCarregando(false);
      setGrupos(response.data);
    }
    fetchData();
  }, [filtros, setGrupos]);

  const onSubmitForm = formValues => {
    setFiltros(formValues);
  };

  const handleClose = () => {
    setGrupos(null);
    setFiltros(null);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 page-relatorio-produtos-homologados">
        <div className="card-body">
          <FormBuscaProduto
            onSubmit={onSubmitForm}
            onAtualizaProdutos={() => {}}
          />

          {grupos && !grupos.length && (
            <div className="text-center mt-5">
              Não existem dados para filtragem informada.
            </div>
          )}
        </div>
      </div>

      <Modal
        dialogClassName="modal-90w"
        show={Boolean(grupos && grupos.length)}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Relatório de Produtos Homologados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="m-3">
            <p className="text-black font-weight-bold mb-1">
              {filtros && gerarLabelPorFiltro(filtros)}
            </p>
            <TabelaProdutosHomologados grupos={grupos} filtros={filtros} />
          </section>
        </Modal.Body>
        <Modal.Footer>
          <section>
            <Botao
              type={BUTTON_TYPE.BUTTON}
              titulo="imprimir"
              texto="imprimir"
              style={BUTTON_STYLE.BLUE}
              icon={BUTTON_ICON.PRINT}
              className="float-right ml-3"
              onClick={() => {
                const params = gerarParametrosConsulta(filtros);
                getRelatorioProdutosHomologados(params);
              }}
            />

            <Botao
              texto="voltar"
              titulo="voltar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.BLUE_OUTLINE}
              icon={BUTTON_ICON.ARROW_LEFT}
              onClick={handleClose}
              className="float-right"
            />
          </section>
        </Modal.Footer>
      </Modal>
    </Spin>
  );
};

export default RelatorioProdutosHomologados;
