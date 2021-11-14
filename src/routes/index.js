import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PublicRoute from "./PublicRoute";
import Layout from "../components/Layout";
import Home from "../containers/Home";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" render={() => (<Redirect to="/home" />)} />
      <PublicRoute
        path="/home"
        component={Home}
        layout={Layout}
      />
    </Switch>
  )};

export default Routes;
