import React, { Component, Fragment } from 'react';
// import { connect } from 'dva';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon, Dropdown, Menu } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import './UserLayout.css';
import logo from '../assets/logo.png';
// import getPageTitle from '../utils/getPageTitle';
import { tr } from '../common/i18n';
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

    const selectedLang = 'zh-CN';
    const locales = ['zh-CN'];
    // const locales = ['zh-CN', 'zh-TW', 'en-US', 'pt-BR'];
    const languageLabels = {
      'zh-CN': '简体中文',
      // 'zh-TW': '繁体中文',
      // 'en-US': 'English',
      // 'pt-BR': 'Português',
    };
    const languageIcons = {
      'zh-CN': '🇨🇳',
      // 'zh-TW': '🇭🇰',
      // 'en-US': '🇬🇧',
      // 'pt-BR': '🇧🇷',
    };
    const langMenu = (
      <Menu className="menu" selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      // <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
      <DocumentTitle title="用户登录">
        <div className="container">
          <div className="lang">
            {/* <SelectLang /> */}
            <Dropdown overlay={langMenu} placement="bottomRight" className="dropDown">
              <span>
                <Icon className="icon" type="global" title={tr('System','navBar.lang')} />
              </span>
            </Dropdown>
          </div>
          <div className="content">
            <div className="top">
              <div className="header">
                <Link to="/">
                  <img alt="logo" className="logo" src={logo} />
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
// export default connect(({ menu: menuModel }) => ({
//   menuData: menuModel.menuData,
//   breadcrumbNameMap: menuModel.breadcrumbNameMap,
// }))(UserLayout);
