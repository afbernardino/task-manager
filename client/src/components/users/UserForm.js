import React from "react";
import { Field, reduxForm } from "redux-form";
import validator from "validator";
import styles from "../../styles";

const normalizeToLowerCase = value => value && value.toLowerCase();

class UserForm extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return <div style={styles.ErrorMessage}>{error}</div>;
    }
  }

  renderInput = ({ input, icon, placeHolder, type, meta }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;

    return (
      <div className={className}>
        <div className="ui left icon input">
          <i className={icon} />
          <input
            {...input}
            type={type}
            autoComplete="off"
            placeholder={placeHolder}
          />
        </div>
        {this.renderError(meta)}
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    return (
      <div>
        <form
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          className="ui form error"
        >
          <Field
            name="name"
            component={this.renderInput}
            icon="user icon"
            placeHolder="Name"
            type="text"
          />
          <Field
            name="email"
            component={this.renderInput}
            icon="at icon"
            placeHolder="E-mail"
            type="text"
            normalize={normalizeToLowerCase}
          />
          <Field
            name="password"
            component={this.renderInput}
            icon="lock icon"
            placeHolder="Password"
            type="password"
          />
          <button className={this.props.submitBtnClassName}>Submit</button>
        </form>
      </div>
    );
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.name) {
    errors.name = "Please enter a name.";
  }

  if (!formValues.email || !validator.isEmail(formValues.email)) {
    errors.email = "Please enter a valid e-mail.";
  }

  if (!formValues.password) {
    errors.password = "Please enter a password.";
  }

  return errors;
};

export default reduxForm({
  form: "userForm",
  validate
})(UserForm);
