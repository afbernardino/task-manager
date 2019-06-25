import React from "react";
import UserForm from "./UserForm";
import styles from "../../styles";

class UserFormWrapper extends React.Component {
  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  getSubmitBtnClassName = () => {
    const className = "ui teal";
    if (this.props.isLoading) {
      return `${className} loading button disabled`;
    } else {
      return `${className} button`;
    }
  };

  renderErrorMessage = () => {
    const error = this.props.error;
    if (error) {
      return <div style={styles.ErrorMessage}>{error}</div>;
    }
  };

  render() {
    return (
      <div>
        <div className="ui segments">
          <div className="ui teal inverted segment">
            <h3 style={{ textAlign: "center" }}>{this.props.title}</h3>
          </div>
          <div className="ui segment">
            <div>
              <UserForm
                onSubmit={this.onSubmit}
                submitBtnClassName={this.getSubmitBtnClassName()}
              />
            </div>
          </div>
        </div>
        {this.renderErrorMessage()}
      </div>
    );
  }
}

export default UserFormWrapper;
