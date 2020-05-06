import React, { Component } from "react";
import CheckboxField from "components/Shareable/Checkbox/Field";
import { InputText } from "components/Shareable/Input/InputText";
import Botao from "components/Shareable/Botao";
import { AAutoComplete } from "components/Shareable/MakeField";
import { BUTTON_STYLE } from "components/Shareable/Botao/constants";
import { Field } from "redux-form";
import { InputComData } from "../../../../Shareable/DatePicker";
import { SelectWithHideOptions } from "../../../../Shareable/SelectWithHideOptions";

class FormBuscaProduto extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = selectedItems => {
    this.props.handleChange(selectedItems);
  };

  onSelectStatus = value => {
    this.props.onSelectStatus(value);
  };

  onDeselectStatus = value => {
    this.props.onDeselectStatus(value);
  };

  checkTipoProduto = (indice, check, nome) => {
    this.props.checkTipoProduto(indice, check, nome);
  };

  checkProdutoAlergenico = () => {
    this.props.checkProdutoAlergenico();
  };

  onClear = () => {
    this.props.onClear();
  };

  onSearch = values => {
    this.props.onSearch(values);
  };

  render() {
    const {
      statusOptions,
      tipos_produto,
      produto_alergenico,
      selectedItems,
      handleSubmit,
      nomesMarcas,
      nomesFabricantes,
      nomesProdutos,
      minDate
    } = this.props;
    return (
      <form>
        <div className="descricao-topo-busca-produto">
          Consulte por produtos no sistema
        </div>
        <div className="tipo-status-barra-busca">
          <label>Data cadastro</label>
          <label>Status</label>
          <label>Tipo de produto</label>

          <div className="input-datas-inicio-termino">
            <Field
              className="input-data"
              component={InputComData}
              name="data-de"
              minDate={minDate}
            />
            <Field
              className="input-data"
              component={InputComData}
              name="data-ate"
            />
          </div>
          <div>
            <Field
              component={SelectWithHideOptions}
              options={statusOptions}
              name="status"
              handleChange={this.handleChange}
              selectedItems={selectedItems}
              onSelect={value => this.onSelectStatus(value)}
              onDeselect={value => this.onDeselectStatus(value)}
            />
          </div>
          <div className="check-tipos-prod">
            {tipos_produto.map((tipo, indice) => {
              return (
                <Field
                  key={indice}
                  className="check-tipo-produto"
                  component={CheckboxField}
                  name={`check_${tipo.nome}`}
                  check={tipo.check}
                  nomeInput={`${tipo.label}`}
                  onChange={() => {
                    this.checkTipoProduto(indice, tipo.check, tipo.nome);
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="grid-produtos-alergenicos">
          <label>Ingredientes/aditivos alegênicos?</label>
          <label>Quais?</label>
          <div className="check-produto_alergenico">
            <Field
              component={CheckboxField}
              name={`produtos_alergenicos`}
              check={produto_alergenico}
              nomeInput={"Sim"}
              onChange={() => {
                this.checkProdutoAlergenico();
              }}
            />
          </div>
          <div>
            <Field component={InputText} name="aditivos" />
          </div>
        </div>
        <div className="produto-input">
          <label>Nome do Produto</label>
        </div>
        <div>
          <Field
            name="nome"
            component={AAutoComplete}
            dataSource={nomesProdutos}
            filterOption
          />
        </div>

        <div className="marca-fabricante-produto">
          <label>Marca do produto</label>
          <label>Fabricante do produto</label>
          <Field
            name="marca"
            component={AAutoComplete}
            dataSource={nomesMarcas}
            filterOption
          />
          <Field
            name="fabricante"
            component={AAutoComplete}
            dataSource={nomesFabricantes}
            filterOption
          />
        </div>

        <div className="botoes-de-pesquisa-produto">
          <Botao
            style={BUTTON_STYLE.GREEN_OUTLINE}
            texto="Cancelar"
            onClick={() => {
              this.onClear();
            }}
          />
          <Botao
            style={BUTTON_STYLE.GREEN}
            texto="Consultar"
            onClick={handleSubmit(values =>
              this.onSearch({
                ...values
              })
            )}
          />
        </div>
      </form>
    );
  }
}

export default FormBuscaProduto;
