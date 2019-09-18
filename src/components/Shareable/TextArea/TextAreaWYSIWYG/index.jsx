import React, { Component } from "react";
import PropTypes from "prop-types";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-datepicker/dist/react-datepicker.css";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { HelpText } from "../../HelpText";
import InputErroMensagem from "../../Input/InputErroMensagem";
import { OpcoesCustomizadas } from "./OpcoesCustomizadas";
import "./style.scss";
import "../style.scss";

export class TextAreaWYSIWYG extends Component {
  constructor(props) {
    super(props);
    const editorState = EditorState.createEmpty();
    this.state = {
      editorState,
      talvezBordaVermelha: false
    };
    this.changeValue(editorState);
  }

  initEditorState() {
    const html = "";
    const contentBlock = htmlToDraft(html);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    return EditorState.createWithContent(contentState);
  }

  handleChange(editorState) {
    this.setState({ editorState });
    this.changeValue(editorState);
  }

  componentWillReceiveProps(nextProps) {
    const { input } = nextProps;
    if (input.value === "") {
      const editorState = EditorState.createEmpty();
      this.setState({ editorState });
      return;
    }
    if (
      input.value &&
      input.value !== this.props.value &&
      input.value !== "<p></p>\n"
    ) {
      const contentBlock = htmlToDraft(input.value);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.moveFocusToEnd(
        EditorState.createWithContent(contentState)
      );
      this.setState({ editorState });
    }
  }

  onBlur(event) {
    this.setState({ talvezBordaVermelha: true });
    const value = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    this.props.input.onBlur(value);
  }

  changeValue(editorState) {
    const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.input.onChange(value);
  }

  render() {
    const { editorState, talvezBordaVermelha } = this.state;
    const {
      disabled,
      helpText,
      input,
      label,
      meta,
      name,
      placeholder,
      required,
      temOpcoesCustomizadas
    } = this.props;
    return (
      <div className="textarea" id="react-wysiwyg">
        {label && [
          required && <span className="required-asterisk">*</span>,
          <label htmlFor={name} className="col-form-label">
            {label}
          </label>
        ]}
        <Editor
          editorState={editorState}
          name={name}
          wrapperClassName={`wrapper-class ${
            required && input.value === "<p></p>\n" && talvezBordaVermelha
              ? "border-red"
              : "border"
          } rounded`}
          editorClassName="ml-2"
          readOnly={disabled}
          className="form-control"
          placeholder={placeholder}
          required={required}
          onBlur={event => this.onBlur(event)}
          onEditorStateChange={editorState => this.handleChange(editorState)}
          // how to config: https://jpuri.github.io/react-draft-wysiwyg/#/docs

          toolbar={{
            options: ["inline", "list"],
            inline: {
              inDropdown: false,
              options: ["bold", "italic", "underline", "strikethrough"]
            },
            list: { inDropdown: false, options: ["unordered", "ordered"] }
          }}
          toolbarCustomButtons={
            temOpcoesCustomizadas && [
              <OpcoesCustomizadas
                editorState={editorState}
                onChange={this.handleChange}
              />
            ]
          }
        />
        <HelpText helpText={helpText} />
        <InputErroMensagem meta={meta} />
      </div>
    );
  }
}

TextAreaWYSIWYG.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  helpText: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool
};

TextAreaWYSIWYG.defaultProps = {
  className: "",
  disabled: false,
  helpText: "",
  input: {},
  label: "",
  meta: {},
  name: "",
  placeholder: "",
  required: false
};