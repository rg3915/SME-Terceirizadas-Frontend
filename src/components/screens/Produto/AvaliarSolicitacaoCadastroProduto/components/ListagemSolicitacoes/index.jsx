import React, { Fragment } from "react";
import "antd/dist/antd.css";
import "./styles.scss";

const ListagemProdutos = ({ solicitacoes, ativos, setAtivos }) => (
  <section className="resultado-busca-produto-avancada">
    <header>Veja os resultados para busca</header>
    <article>
      <div className="grid-produto-table header-table-produtos">
        <div>Nome do Produto</div>
        <div>Marca</div>
        <div>Fabricante</div>
        <div>Data solicitação</div>
        <div>Status</div>
        <div />
      </div>
      {solicitacoes.map((solicitacao, index) => {
        const bordas =
          ativos && ativos.includes(solicitacao.uuid) ? "desativar-borda" : "";
        const icone =
          ativos && ativos.includes(solicitacao.uuid)
            ? "angle-up"
            : "angle-down";
        return (
          <Fragment key={index}>
            <div className="grid-produto-table body-table-produtos">
              <div className={`${bordas}`}>{solicitacao.nome_produto}</div>
              <div className={`${bordas}`}>{solicitacao.marca_produto}</div>
              <div className={`${bordas}`}>
                {solicitacao.fabricante_produto}
              </div>
              <div className={`${bordas}`}>
                {solicitacao.criado_em.split(" ")[0]}
              </div>
              <div className={`${bordas}`}>{solicitacao.status_title}</div>
              <div>
                <i
                  className={`fas fa-${icone}`}
                  onClick={() => {
                    ativos && ativos.includes(solicitacao.uuid)
                      ? setAtivos(ativos.filter(el => el !== solicitacao.uuid))
                      : setAtivos(
                          ativos
                            ? [...ativos, solicitacao.uuid]
                            : [solicitacao.uuid]
                        );
                  }}
                />
              </div>
            </div>
            {ativos && ativos.includes(solicitacao.uuid) && (
              <section className="resultado-busca-detalhe-produto">
                <div className="cabecalho-empresa">
                  <b>Informações do Produto</b>
                </div>
                <div className="grid-escola">
                  <div
                    className="value-empresa"
                    dangerouslySetInnerHTML={{
                      __html: solicitacao.info_produto
                    }}
                  />
                </div>
                <div className="cabecalho-empresa">Dados escolares</div>
                <div className="grid-escola">
                  <div className="label-empresa">Nome</div>
                  <div className="label-empresa">Lote</div>
                  <div className="label-empresa">Tipo de gestão</div>
                  <div className="value-empresa">{solicitacao.escola.nome}</div>
                  <div className="value-empresa">{solicitacao.escola.lote}</div>
                  <div className="value-empresa">
                    {solicitacao.escola.tipo_gestao.nome}
                  </div>
                  <div className="label-empresa">E-mail</div>
                  <div className="label-empresa">Telefone</div>
                  <div />
                  <div className="value-empresa">
                    {solicitacao.escola.contato.email}
                  </div>
                  <div className="value-empresa">
                    {solicitacao.escola.contato.telefone} -{" "}
                    {solicitacao.escola.contato.telefone2}
                  </div>
                  <div />
                  <div className="label-empresa">Nome DRE</div>
                  <div className="label-empresa">Cód. DRE</div>
                  <div />
                  <div className="value-empresa">
                    {solicitacao.escola.diretoria_regional.nome}
                  </div>
                  <div className="value-empresa">
                    {solicitacao.escola.diretoria_regional.codigo_eol}
                  </div>
                  <div />
                </div>
                <div className="cabecalho-empresa">
                  <b>Dados do aluno</b>
                </div>
                <div className="grid-escola">
                  <div className="label-empresa">Nome</div>
                  <div className="label-empresa">Cód. EOL</div>
                  <div className="label-empresa">Data Nascimento</div>
                  <div className="value-empresa">{solicitacao.aluno.nome}</div>
                  <div className="value-empresa">
                    {solicitacao.aluno.codigo_eol}
                  </div>
                  <div className="value-empresa">
                    {solicitacao.aluno.data_nascimento}
                  </div>
                </div>
              </section>
            )}
          </Fragment>
        );
      })}
    </article>
  </section>
);

export default ListagemProdutos;
