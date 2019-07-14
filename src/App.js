import React, { Component } from 'react'
import { Route, Switch, HashRouter } from 'react-router-dom';

import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';

class App extends Component {
  render() {
    return (
      <div className="app">
        <HashRouter>
          <Switch>
            <Route path="/user/login" component={UserLayout} />
            <Route path="/" component={BasicLayout} />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}
export default App;
