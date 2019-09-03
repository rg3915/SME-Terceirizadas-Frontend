import React from "react";
import { NavLink } from "react-router-dom";
import "./style.scss";

export const InputSearch = props =>
(
  <div className="div-input-search row">
    <div className="col-12">
      <NavLink to={props.voltarLink || "/"} className="btn btn-outline-primary">
        <i class="fas fa-arrow-left" /> Voltar
      </NavLink>
      <span className="float-right">
        <input
          className="input-search"
          placeholder="Pesquisar"
          onChange={props.filterList}
        />
        <i class="fas fa-search" />
      </span>
    </div>
  </div>
);