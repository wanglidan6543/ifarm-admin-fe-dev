import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Icon} from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import logo from '../assets/logo.png';
import Login from '../pages/User/Login';
import SelectLang from '../components/SelectLang';

import './UserLayout.less';

const links = [];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 正大集团
  </Fragment>
);

class UserLayout extends Component {
  render() {
    return (
      <DocumentTitle title="管理系统">
        <div className="container">
          <div className="lang">
            <SelectLang />
          </div>
          <div className="content">
            <div className="top">
              <div className="top-header">
                <Link to="/">
                  <img alt="logo" className="top-logo" src={logo} />
                  <span className="system-title">管理系统</span>
                </Link>
              </div>
              <div className='desc'>管理系统</div>
            </div>
            <Login />
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
