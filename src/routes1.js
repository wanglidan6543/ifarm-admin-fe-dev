import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import Login from './pages/User/Login';
import BasicLayout from './layouts/BasicLayout';
import Home from './pages/Home/List';
import ArticleList from './pages/Article/List';
import * as ArticleEdit from './pages/Article/ArticleEdit';
import * as Price from './pages/Price/List';
import * as Pricematerial from './pages/Pricematerial/List';
import * as PricematerialDetail from './pages/Pricematerial/Pricematerialdetail';
import * as RelatedFarms from './pages/Relatedfarms/List';
import * as RelatedFarmsEdit from './pages/Relatedfarms/RelatedfarmsEdit';
import * as Threshold from './pages/Threshold/List';
import * as ThresholdEdit from './pages/Threshold/ThresholdEdit';
import * as Admin from './pages/Administration/List';
import * as AdminEdit from './pages/Administration/AdminEdit';
import * as AdminAuthority from './pages/Administration/Authority';
import * as User from './pages/Usered/List';
import * as UserEdit from './pages/Usered/UseredAdd';
import * as ChangePwd from './pages/User/Changepassword';


module.exports = (
  <Fragment>
    <Route path='/user' component={UserLayout}>
      <Redirect to='/user/login' />
      <Route path='/user/login' component={Login}/>
    </Route>
    <Route path='/' exact component={BasicLayout}>
        <Route path='/home' component={Home} />
        <Route path='/article' component={ArticleList} >
        <Route path='/article/add' component={ArticleEdit} />
        <Route path='/article/edit/:id' component={ArticleEdit} />
        <Route path='/price' component={Price} />
        <Route path='/pricematerial' component={Pricematerial} />
          <Route path='/pricematerial/edit/:id/:orderId' component={PricematerialDetail} />
        <Route path='/relatedfarms' component={RelatedFarms} />
          <Route path='/relatedfarms/edit/:id' component={RelatedFarmsEdit} />
        <Route path='/threshold' component={Threshold} />
          <Route path='/threshold/edit/:id' component={ThresholdEdit} />
        <Route path='/administration' component={Admin} />
          <Route path='/administration/edit/:id' component={AdminEdit} />
          <Route path='/administration/add' component={AdminEdit} />
          <Route path='/administration/authority/:id' component={AdminAuthority} />
        <Route path='/usered' component={User} />
          <Route path='/usered/add' component={UserEdit} />
          <Route path='/usered/edit/:id' component={UserEdit} />
        </Route>
        <Route path='/login/password' component={ChangePwd} />
      </Route>
  </Fragment>
);