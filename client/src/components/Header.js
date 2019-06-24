import React from "react";
import { Link, withRouter } from "react-router-dom";
import { HOME_ROUTE, USER_REGISTER_ROUTE } from "../routers/routes";

class Header extends React.Component {
  getItemClassName = route => {
    if (route === this.props.location.pathname) {
      return "item active";
    }
    return "item";
  };

  render() {
    return (
      <div className="ui secondary pointing menu">
        <Link to={HOME_ROUTE} className={this.getItemClassName(HOME_ROUTE)}>
          Home
        </Link>
        <div className="right menu">
          <Link
            to={USER_REGISTER_ROUTE}
            className={this.getItemClassName(USER_REGISTER_ROUTE)}
          >
            Login/Register
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
