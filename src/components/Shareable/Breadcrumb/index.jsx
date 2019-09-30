import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

export default class Breadcrumb extends Component {
  render() {
    const { home, anteriores, atual } = this.props;
    return (
      <div className="breadcrumb-row row">
        <div className="col-9">
          <ul className="br-breadcrumb">
            <li>
              <Link className={`home ${atual && "is-active"}`} exact to={home}>
                <i className="fas fa-home" />
              </Link>
            </li>
            {anteriores &&
              anteriores.length > 0 &&
              anteriores.map(anterior => {
                return (
                  <li>
                    <Link className="is-active" exact to={anterior.href}>
                      {anterior.titulo}
                    </Link>
                  </li>
                );
              })}
            {atual && (
              <li>
                <Link exact to={atual.href}>
                  {atual.titulo}
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="col-3 text-right contrast">
          <i className="fas fa-adjust" /> Contraste
        </div>
      </div>
    );
  }
}
