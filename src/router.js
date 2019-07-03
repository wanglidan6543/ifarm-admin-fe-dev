import React, { Component } from 'react';
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom';

import Home from './pages/Home/List';
// import ArticleList from './pages/Article/List';
import UserLayout from './layouts/UserLayout';
import Login from './pages/User/Login';
import BasicLayout from './layouts/BasicLayout';

export default class router extends Component {
  
  render() {
    return (
      <HashRouter>
        <Switch>
          {/* <Route exact path="/" render={()=> {
              return <Redirect to="/user" />
            }}
          />
          <Route path="/user" component={UserLayout} /> */}

          {/* <Route exact path="/" render={()=> {
              return <Redirect to="/home" />
            }}
          />
          <Route path="/home" component={Home} /> */}

          <Route path="/" component={BasicLayout} />

          {/* <Route exact path="/" render={()=> (
            <BasicLayout>
              <Switch>
                <Route path="/home" component={Home} />
                <Redirect to="/home" />
              </Switch>
            </BasicLayout>
          )} /> */}
          
        </Switch>
      </HashRouter>
    )
  }
}