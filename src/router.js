import React, { Component } from 'react';
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom';

import Home from './pages/Home/List';
import UserLayout from './layouts/UserLayout';
import Login from './pages/User/Login';
import BasicLayout from './layouts/BasicLayout';

export default class router extends Component {
  
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/"
            render={()=> {
              return <Redirect to="/user" />
            }}
          />
          <Route path='/user' component={UserLayout} />
          <Route path='/basichome' component={BasicLayout} />
          <Route path='/home' component={Home} />
        </Switch>
      </HashRouter>
    )
  }
}