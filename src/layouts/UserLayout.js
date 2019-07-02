import React, { Component, Fragment } from 'react';
// import { connect } from 'dva';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import SelectLang from '../components/SelectLang';
// import styles from './UserLayout.less';
// import './UserLayout.css';
import './UserLayout.less';
import logo from '../assets/logo.png';
// import getPageTitle from '../utils/getPageTitle';
import Login from '../pages/User/Login';

const links = [];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 正大集团
  </Fragment>
);

class UserLayout extends Component {
  // componentDidMount() {
  //   const {
  //     dispatch,
  //     route: { routes, authority },
  //   } = this.props;
  //   dispatch({
  //     type: 'menu/getMenuData',
  //     payload: { routes, authority },
  //   });
  // }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      // <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
      <DocumentTitle title="用户登录">
        <div className="container">
          <div className="lang">
            <SelectLang />
          </div>
          <div className="content">
            <div className="top">
              <div className="header">
                <Link to="/">
                  <img alt="logo" className="logo" src={logo} />
                  <span className="title">管理系统</span>
                </Link>
              </div>
              <div className='desc'>管理系统</div>
            </div>
            {/* {children} */}
            {/* 正大集团用户登录页面 */}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
// export default connect(({ menu: menuModel }) => ({
//   menuData: menuModel.menuData,
//   breadcrumbNameMap: menuModel.breadcrumbNameMap,
// }))(UserLayout);
