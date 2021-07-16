import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

ReactDOM.render(
  <Router>
    <Switch>
      <Route
        path="/:balance?/:currency?/:ticker?/:time_frame?/:start_date?/:end_date?/:user_id?/:session_strategy_id?"
        component={App}
      />
    </Switch>
  </Router>,
  document.getElementById("root")
);