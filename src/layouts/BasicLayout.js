import React, { Suspense, Fragment } from 'react';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
// import { connect } from 'dva';
import { connect } from 'react-redux';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import logo from '../assets/logo.png';
// import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import PageLoading from '../components/PageLoading';
import SiderMenu from '../components/SiderMenu';
import getPageTitle from '../utils/getPageTitle';
// import styles from './BasicLayout.less';
import './BasicLayout.css';
import Home from '../pages/Home/List';
import ArticleList from '../pages/Article/List';
import ArticleEdit from '../pages/Article/ArticleEdit';
import Price from '../pages/Price/List';
import Pricematerial from '../pages/Pricematerial/List';
import PricematerialDetail from '../pages/Pricematerial/Pricematerialdetail';
import RelatedFarms from '../pages/Relatedfarms/List';
import RelatedFarmsEdit from '../pages/Relatedfarms/RelatedfarmsEdit';
import Threshold from '../pages/Threshold/List';
import ThresholdEdit from '../pages/Threshold/ThresholdEdit';
// import Admin from './pages/Administration/List';
// import AdminEdit from './pages/Administration/AdminEdit';
// import AdminAuthority from './pages/Administration/Authority';
// import User from './pages/Usered/List';
// import UserEdit from './pages/Usered/UseredAdd';
// import ChangePwd from './pages/User/Changepassword';

import GlobalFooter from '../components/GlobalFooter';
import { Route, Switch } from 'react-router-dom';

const { Footer } = Layout;

// lazy load SettingDrawer
// const SettingDrawer = React.lazy(() => import('../components/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.Component {
  // componentDidMount() {
  //   const {
  //     dispatch,
  //     route: { routes, authority },
  //   } = this.props;
  //   dispatch({
  //     type: 'user/fetchCurrent',
  //   });
  //   dispatch({
  //     type: 'setting/getSetting',
  //   });
  //   dispatch({
  //     type: 'menu/getMenuData',
  //     payload: { routes, authority },
  //   });
  // }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'global/changeLayoutCollapsed',
    //   payload: collapsed,
    // });
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location,
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader,
    } = this.props;

    const isTop = PropsLayout === 'topmenu';
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className='content' style={contentStyle}>
              <Switch>
                <Route path="/home" component={Home} />
                <Route exact path='/article' component={ArticleList} />
                <Route path='/article/add' component={ArticleEdit} />
                <Route path='/article/edit/:id' component={ArticleEdit} />
                <Route path='/price' component={Price} />
                <Route exact path='/pricematerial' component={Pricematerial} />
                <Route path='/pricematerial/edit/:id/:orderId' component={PricematerialDetail} />
                <Route exact path='/relatedfarms' component={RelatedFarms} />
                <Route path='/relatedfarms/edit/:id' component={RelatedFarmsEdit} />
                <Route exact path='/threshold' component={Threshold} />
                <Route path='/threshold/edit/:id' component={ThresholdEdit} />
                {/*<Route exact path='/administration' component={Admin} />
                <Route path='/administration/edit/:id' component={AdminEdit} />
                <Route path='/administration/add' component={AdminEdit} />
                <Route path='/administration/authority/:id' component={AdminAuthority} />
                <Route exact path='/usered' component={User} />
                <Route path='/usered/add' component={UserEdit} />
                <Route path='/usered/edit/:id' component={UserEdit} />
                <Route path='/login/password' component={ChangePwd} /> */}
              </Switch>
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              links={[
                {
                  key: '正大集团',
                  title: '正大集团',
                  href: 'http://www.cpgroup.cn/',
                  blankTarget: true,
                },
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> 2019 正大集团
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        {/* <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}> */}
        <DocumentTitle title="系统首页">
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}
export default BasicLayout;

// export default connect(({ global, setting, menu: menuModel }) => ({
//   collapsed: global.collapsed,
//   layout: setting.layout,
//   menuData: menuModel.menuData,
//   breadcrumbNameMap: menuModel.breadcrumbNameMap,
//   ...setting,
// }))(props => (
//   <Media query="(max-width: 599px)">
//     {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
//   </Media>
// ));