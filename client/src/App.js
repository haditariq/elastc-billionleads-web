import React from "react";

import { Search } from "./components/ElasticSearchScreen";
import "./styles/index.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Search} />
        <Redirect from="/" to="/" />
      </Switch>
    </Router>
  );
}
