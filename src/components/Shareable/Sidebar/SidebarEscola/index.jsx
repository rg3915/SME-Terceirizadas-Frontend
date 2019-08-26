import React, { Component } from "react";
import { Link, NavLink, Redirect } from "react-router-dom";

export class SidebarEscola extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectPainel: false,
      redirectRelatorio: false,
      menuOpened: "",
      subMenu: "",
      timeout: null
    };
  }

  setRedirectPainel() {
    this.setState({
      redirectPainel: true
    });
  }

  setRedirectRelatorio() {
    this.setState({
      redirectRelatorio: true
    });
  }

  openMenu(menu) {
    const timeout = setTimeout(
      function() {
        this.setState({ menuOpened: menu });
      }.bind(this),
      1000
    );
    this.setState({ timeout });
  }

  closeMenu(event) {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
      this.setState({ timeout: null });
    }
    this.setState({ menuOpened: "" });
  }

  onSubmenuClick(submenu) {
    let subMenu = this.state.subMenu;
    subMenu = subMenu === submenu ? "" : submenu;
    this.setState({ subMenu });
  }

  renderizarRedirecionamentoPainel = () => {
    if (this.state.redirectPainel) {
      this.setState({ redirectPainel: false });
      return <Redirect to={"/escola/painel-de-controle"} />;
    }
  };

  renderizarRedirecionamentoRelatorio = () => {
    if (this.state.redirectRelatorio) {
      this.setState({ redirectRelatorio: false });
      return <Redirect to={"#"} />;
    }
  };

  render() {
    const { menuOpened, subMenu } = this.state;
    return [
      this.renderizarRedirecionamentoPainel(),
      this.renderizarRedirecionamentoRelatorio(),
      <li onMouseLeave={event => this.closeMenu(event)} className="nav-item">
        <NavLink
          onClick={() => this.setRedirectPainel()}
          onMouseOver={() => this.openMenu("painel-inicial")}
          className={`nav-link collapsed ${menuOpened === "painel-inicial" &&
            "keep-hover-settings"} `}
          data-toggle="collapse"
          data-target="#collapsePainel"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <i className="fas fa-sliders-h" />
          <span>Painel Inicial</span>
        </NavLink>
        <div
          id="collapsePainel"
          className={`collapse ${menuOpened === "painel-inicial" && "show"}`}
          aria-labelledby="headingPainel"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white collapse-inner rounded">
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/escola/status-solicitacoes"
            >
              Solicitações Autorizadas
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/escola/status-solicitacoes"
            >
              Solicitações Pendentes <br />
              de Autorização
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/escola/status-solicitacoes"
            >
              Solicitações Recusadas
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/escola/status-solicitacoes"
            >
              Solicitações Canceladas
            </NavLink>
          </div>
        </div>
      </li>,
      <li onMouseLeave={event => this.closeMenu(event)} className="nav-item">
        <NavLink
          onMouseOver={() => this.openMenu("solicitacoes")}
          className={`nav-link collapsed ${menuOpened === "solicitacoes" &&
            "keep-hover-settings"} `}
          data-toggle="collapse"
          data-target="#collapseSolicitacoes"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <i className="fas fa-edit" />
          <span>Solicitações</span>
        </NavLink>
        <div
          id="collapseSolicitacoes"
          className={`collapse ${menuOpened === "solicitacoes" && "show"}`}
          aria-labelledby="headingPainel"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white collapse-inner rounded">
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/escola/inclusao-de-alimentacao"
            >
              Inclusão de Alimentação
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/escola/alteracao-de-cardapio"
            >
              Alteração de Cardápio
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/escola/solicitacao-de-kit-lanche"
            >
              Solicitação de Kit Lanche
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/escola/inversao-de-dia-de-cardapio"
            >
              Inversão de Dia de Cardápio
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/escola/suspensao-de-alimentacao"
            >
              Suspensão de Alimentação
            </NavLink>
          </div>
        </div>
      </li>,
      <li onMouseLeave={event => this.closeMenu(event)} className="nav-item">
        <NavLink
          onClick={() => this.setRedirectRelatorio()}
          onMouseOver={() => this.openMenu("relatorio")}
          className={`nav-link collapsed ${menuOpened === "relatorio" &&
            "keep-hover-settings"} `}
          data-toggle="collapse"
          data-target="#collapseRelatorio"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <i className="fas fa-file-alt" />
          <span>Relatório</span>
        </NavLink>
        <div
          id="collapseRelatorio"
          className={`collapse ${menuOpened === "relatorio" && "show"}`}
          aria-labelledby="headingSchool"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white collapse-inner rounded">
            <NavLink
              onClick={() => this.onSubmenuClick("solicitacoes")}
              activeClassName="active"
              className="collapse-item"
              to="#"
            >
              Por tipo de Solicitação
              <i className="fas fa-chevron-down" />
            </NavLink>
            {subMenu === "solicitacoes" && (
              <div className="submenu">
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Inclusão de Alimentação
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Alteração de Cardápio
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Solicitação de Kit Lanche
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Solicitação Unificada
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Inversão de Dia de Cardápio
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Suspensão de Alimentação
                </NavLink>
              </div>
            )}
            <NavLink
              onClick={() => this.onSubmenuClick("status")}
              activeClassName="active"
              className="collapse-item"
              to="#"
            >
              Por tipo de Status
              <i className="fas fa-chevron-down" />
            </NavLink>
            {subMenu === "status" && (
              <div className="submenu">
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Inclusão de Alimentação
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Alteração de Cardápio
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Solicitação de Kit Lanche
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Solicitação Unificada
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Inversão de Dia de Cardápio
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="#"
                >
                  Suspensão de Alimentação
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </li>,
      <li onMouseLeave={event => this.closeMenu(event)} className="nav-item">
        <Link
          onMouseOver={() => this.openMenu("cadastros")}
          className={`nav-link collapsed ${menuOpened === "cadastros" &&
            "keep-hover-settings"} `}
          href="#teste"
          data-toggle="collapse"
          data-target="#collapseConfig"
          aria-expanded="false"
          aria-controls="collapseTwo"
        >
          <i className="fas fa-cog" />
          <span>Configurações</span>
        </Link>
        <div
          id="collapseConfig"
          className={`collapse ${menuOpened === "cadastros" && "show"}`}
          aria-labelledby="headingConfig"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <NavLink
              onClick={() => this.onSubmenuClick("cadastros")}
              activeClassName="active"
              className="collapse-item"
              to="#"
            >
              Cadastros
              <i className="fas fa-chevron-down" />
            </NavLink>
            {subMenu === "cadastros" && (
              <div className="submenu">
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="/configuracoes/cadastros"
                >
                  Perfil
                </NavLink>
                <NavLink
                  activeClassName="active"
                  className="collapse-item"
                  to="/configuracoes/cadastros"
                >
                  Unidades Escolares
                </NavLink>
              </div>
            )}
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to="/configuracoes/permissoes"
            >
              Permissões
            </NavLink>
          </div>
        </div>
      </li>
    ];
  }
}
