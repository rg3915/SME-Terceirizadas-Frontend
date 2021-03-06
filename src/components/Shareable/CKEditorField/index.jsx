import React from "react";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { HelpText } from "../HelpText";
import InputErroMensagem from "../Input/InputErroMensagem";

const CKEditorField = props => {
  const {
    helpText,
    label,
    input: { value, onChange },
    meta,
    name,
    required,
    ...rest
  } = props;
  return (
    <div className="select">
      {label && [
        required && (
          <span key={1} className="required-asterisk">
            *
          </span>
        ),
        <label key={2} htmlFor={name} className="col-form-label">
          {label}
        </label>
      ]}
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(_, editor) => {
          onChange(editor.getData());
        }}
        {...rest}
      />
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} />
    </div>
  );
};
CKEditorField.defaultProps = {
  config: {
    removePlugins: ["Heading", "Link", "BlockQuote"],
    toolbar: [
      "bold",
      "italic",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "insertTable",
      "|",
      "undo",
      "redo"
    ]
  }
};
export default CKEditorField;
