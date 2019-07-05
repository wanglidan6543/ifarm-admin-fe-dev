import React, { Component } from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';

import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';

import { Provider } from 'react-redux';
import store from './store/index';

export default class RootRouter extends Component {
  
  render() {
    return (
      <HashRouter>
        <Provider store={store}>
          <Switch>
            <Route path="/user/login" component={UserLayout} />
            <Route path="/" component={BasicLayout} />
          </Switch>
        </Provider>
      </HashRouter>
    )
  }
}