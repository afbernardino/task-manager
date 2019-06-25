import React from "react";
import { connect } from "react-redux";
import { attemptToRegister } from "../../actions/users";
import UserFormWrapper from "./UserFormWrapper";
import "./UserRegister.css";

class UserRegister extends React.Component {
  onSubmit = formValues => {
    this.props.attemptToRegister(formValues);
  };

  render() {
    return (
      <div className="UserRegister">
        <UserFormWrapper
          title="Register a new User"
          onSubmit={this.onSubmit}
          isLoading={!!this.props.user.isRegistering}
          error={this.props.user.error}
        />
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
