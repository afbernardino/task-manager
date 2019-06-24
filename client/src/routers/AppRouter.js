import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import UserRegister from "../components/users/UserRegister";
import Header from "../components/Header";
import { USER_REGISTER_ROUTE } from "./routes";

export const history = createBrowserHistory();

const AppRouter = () => {
  return (
    <Router history={history}>
      <Header />
      <div>
        <Switch>
          <Route path={USER_REGISTER_ROUTE} exact component={UserRegister} />
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
