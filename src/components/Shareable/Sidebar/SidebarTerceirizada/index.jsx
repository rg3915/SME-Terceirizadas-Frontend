import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { TERCEIRIZADA } from "../../../../configs/constants";
import { PERFIL } from "../../../../constants";

export class SidebarTerceirizada extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subMenu: ""
    };
  }

  onSubmenuClick(submenu) {
    let subMenu = this.state.subMenu;
    subMenu = subMenu === submenu ? "" : submenu;
    this.setState({ subMenu });
  }

  renderTerceirizada() {
    const { subMenu } = this.state;
    return [
      <li key={1} className="nav-item">
        <NavLink
          className={`nav-link collapsed`}
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
          className={`collapse`}
          aria-labelledby="headingPainel"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white collapse-inner rounded">
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to={`/`}
            >
              Home
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to={`/${TERCEIRIZADA}/solicitacoes`}
            >
              Autorizadas
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to={`/${TERCEIRIZADA}/solicitacoes`}
            >
              Aguardando autorização
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to={`/${TERCEIRIZADA}/solicitacoes`}
            >
              Negadas
            </NavLink>
            <NavLink
              activeClassName="active"
              className="collapse-item"
              to={`/${TERCEIRIZADA}/solicitacoes`}
            >
              Canceladas
            </NavLink>
          </div>
        </div>
      </li>,
      <li key={2} className="nav-item">
        <NavLink
          className={`nav-link collapsed`}
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
          className={`collapse`}
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
                  Solicitação de Kit <br /> Lanche Passeio
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
                  Solicitação de Kit Lanche Passeio
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
      <li key={3} className="nav-item">
        <Link
          className={`nav-link collapsed`}
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
          className={`collapse`}
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
              </div>
            )}
            {localStorage.getItem("perfil") ===
              PERFIL.NUTRI_ADMIN_RESPONSAVEL && (
              <NavLink
                activeClassName="active"
                className="collapse-item"
                to="/configuracoes/permissoes"
              >
                Permissões
              </NavLink>
            )}
          </div>
        </div>
      </li>
    ];
  }

  render() {
    return this.renderTerceirizada();
  }
}
