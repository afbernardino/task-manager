import React from "react";
import { connect } from "react-redux";
import { attemptToRegister } from "../../actions/users";
import UserForm from "./UserForm";
import styles from "../../styles";
import "./UserRegister.css";

class UserRegister extends React.Component {
  onSubmit = formValues => {
    this.props.attemptToRegister(formValues);
  };

  getSubmitBtnClassName = () => {
    const className = "ui teal";
    if (this.props.user.isRegistering) {
      return `${className} loading button disabled`;
    } else {
      return `${className} button`;
    }
  };

  renderErrorMessage = () => {
    const error = this.props.user.error;
    if (error) {
      return <div style={styles.ErrorMessage}>{error}</div>;
    }
  };

  render() {
    return (
      <div className="UserRegister">
        <div className="ui segments">
          <div className="ui teal inverted segment">
            <h3 style={{ textAlign: "center" }}>Register a new user</h3>
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

const mapStateToProps = state => {
  return { user: state.user };
};

export default connect(
  mapStateToProps,
  { attemptToRegister }
)(UserRegister);
