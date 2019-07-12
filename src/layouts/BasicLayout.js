import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
// import { connect } from 'dva';
import { connect } from 'react-redux';
import { ContainerQuery } from 'react-container-query';
import Media from 'react-media';
import logo from '../assets/logo.png';
import Header from './Header';
import SiderMenu from '../components/SiderMenu';
// import getPageTitle from '../utils/getPageTitle';
import GlobalFooter from '../components/GlobalFooter';
import { Route, Switch } from 'react-router-dom';
// import './BasicLayout.css';
import './BasicLayout.less';
import {tr} from '../common/i18n';
import Context from './menuContext';

import axios from 'axios';
import { ROOT_PATH } from '../pages/pathrouter';

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
import Admin from '../pages/Administration/List';
import AdminEdit from '../pages/Administration/AdminEdit';
import AdminAuthority from '../pages/Administration/Authority';
import User from '../pages/Usered/List';
import UserEdit from '../pages/Usered/UseredAdd';
import ChangePwd from '../pages/User/Changepassword';

import Authorized from '../utils/Authorized';
import defaultSetting from '../defaultSettings';
import { thisTypeAnnotation } from '@babel/types';

const { Footer, Content} = Layout;
const { check } = Authorized;

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

  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      menuData: [],
      breadcrumbNameMap: {},
      currentUser: {},
      setting: defaultSetting,
      layout: defaultSetting.layout,
      isMobile: false,
    }
  }

  componentDidMount() {
    // user/fetchCurrent
    this.getCurrentUser();

    // meun/getMenuData
    this.getMenuData();
  }

  getContext() {
    const { location } = this.props;
    return {
      location
    }
  }

  getCurrentUser(params) {
    axios.get(
      ROOT_PATH + `/api/backend/v1/user/info?${JSON.stringify(params)}`,
      {
      headers: { Authorization: window.localStorage.getItem('jwt_token')  }
      }
      )
      .then(res => {
        console.log('getCurrentUser');
        console.log(res);
        this.setState({
          currentUser: res.data.data
        })
      })
  }

  getMenuData() {
    axios.get(
       `${ROOT_PATH}/api/backend/v1/menu`,
       {
        headers: { Authorization: window.localStorage.getItem('jwt_token')  }
        }
       )
       .then(res => {
  
         let originalMenuData = this.formatter(res.data.data);
         const menuData = this.filterMenuData(originalMenuData);
  
         const breadcrumbNameMap = this.getBreadcrumbNameMap(originalMenuData);

         this.setState({
           menuData,
           breadcrumbNameMap
         });
       }) 
    }

  formatter = (data, parentAuthority, parentName) => {
    if (!data) {
      return null;
    }
    return data.map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = defaultSetting.disableLocal ? item.name
        : tr('Menu', locale);
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = this.formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);      
  }

  getSubMenu = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      return {
        ...item,
        children: filterMenuData(item.children), // eslint-disable-line
      };
    }
    return item;
  };

  filterMenuData = menuData => {
    if (!menuData) { 
      return [];
    }
    return menuData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => check(item.authority, this.getSubMenu(item)))
      .filter(item => item);
  };

  getBreadcrumbNameMap = menuData => {
    if (!menuData) {
      return {};
    }
    const routerMap = {};
  
    const flattenMenuData = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          flattenMenuData(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    flattenMenuData(menuData);
    return routerMap;
  };

  getLayoutStyle = () => {
    const { isMobile, collapsed, layout } = this.state;
    const { fixSiderbar } = this.state.setting;

    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    this.setState({collapsed});
  };

  render() {
    const { layout, isMobile, menuData, collapsed } = this.state;
    const { navTheme, fixedHeader } = this.state.setting;

    const isTop = layout === 'topmenu';
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layoutDom = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            collapsed={collapsed}
            location={this.state.location}
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
                <Route path='/threshold/edit/:id/:code' component={ThresholdEdit} />
                <Route exact path='/administration' component={Admin} />
                <Route path='/administration/edit/:id' component={AdminEdit} />
                <Route path='/administration/add' component={AdminEdit} />
                <Route path='/administration/authority/:id' component={AdminAuthority} />
                <Route exact path='/usered' component={User} />
                <Route path='/usered/add' component={UserEdit} />
                <Route path='/usered/edit/:id' component={UserEdit} />
                <Route path='/login/password' component={ChangePwd} />
                {/* <Route component={Error} /> */}
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
              <div className={params}>{layoutDom}</div>
            </Context.Provider>
          )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}
// export default BasicLayout;

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

// function mapStateToProps(state) {
//   return {
//     collapsed: state.global.collapsed,
//     layout: state.setting.layout,
//     menuData: state.menu.menuData,
//     breadcrumbNameMap: state.menu.breadcrumbNameMap,
//     ...state.setting,
//   }
// }

export default connect()(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));