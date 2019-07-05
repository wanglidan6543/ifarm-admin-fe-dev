import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Icon} from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import './UserLayout.css';
import logo from '../assets/logo.png';
// import getPageTitle from '../utils/getPageTitle';
import Login from '../pages/User/Login';
import SelectLang from '../components/SelectLang';

const links = [];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 正大集团
  </Fragment>
);

class UserLayout extends Component {
  render() {
    return (
      // <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
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
            {/* {children} */}
            {/* 正大集团用户登录页面 */}
            <Login />
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
