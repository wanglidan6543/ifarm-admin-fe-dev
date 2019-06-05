import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import SelectLang from '../components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.png';
import getPageTitle from '../utils/getPageTitle';

const links = [];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 正大集团
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>管理系统</span>
                </Link>
              </div>
              <div className={styles.desc}>管理系统</div>
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
