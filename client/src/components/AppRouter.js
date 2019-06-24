import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import UserRegister from "./users/UserRegister";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const AppRouter = () => {
  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route path="/users/new" exact component={UserRegister} />
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
