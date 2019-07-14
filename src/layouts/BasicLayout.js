import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
// import { connect } from 'react-redux';
import { ContainerQuery } from 'react-container-query';
// import Media from 'react-media';
import logo from '../assets/logo.png';
import HeaderView from './Header';
import SiderMenu from '../components/SiderMenu';
import getPageTitle from '../utils/getPageTitle';
import GlobalFooter from '../components/GlobalFooter';
import { Route, Switch } from 'react-router-dom';
import './BasicLayout.less';
import Context from './menuContext';

import { formatter, getBreadcrumbNameMap, filterMenuData } from '../models/menu';

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
import Error from '../pages/404';

import defaultSetting from '../defaultSettings';
import PageHeaderWrapper from '../components/PageHeaderWrapper';

const { Footer, Content} = Layout;

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
      location,
      breadcrumbNameMap: this.state.breadcrumbNameMap
    }
  }

  getCurrentUser(params) {
    axios(
      {
        url: ROOT_PATH + '/api/backend/v1/user/info',
        method: 'GET',
        params: params
      },
      {
        headers: { Authorization: window.localStorage.getItem('jwt_token')  }
      }).then(res => {
        this.setState({
          currentUser: res.data.data
        })
      })
  }

  getMenuData() {
    axios(
      {
        url: ROOT_PATH + '/api/backend/v1/menu',
        method: 'GET'
      },
      {
       headers: { Authorization: window.localStorage.getItem('jwt_token')  }
      }).then(res => {
        let originalMenuData = formatter(res.data.data);
        const menuData = filterMenuData(originalMenuData);
        const breadcrumbNameMap = getBreadcrumbNameMap(originalMenuData);
        console.log(originalMenuData);
        console.log(menuData);
        console.log(breadcrumbNameMap);
        this.setState({
          menuData,
          breadcrumbNameMap
        });
      })
    }

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
    this.setState({
      collapsed
    });
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
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <HeaderView
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            setting={this.state.setting}
            collapsed={collapsed}
            {...this.props}
          />
          <Content className='content' style={contentStyle}>
          <Switch>
            <Route path="/home" component={Home} />
            <PageHeaderWrapper 
              breadcrumbNameMap={this.state.breadcrumbNameMap}
              {...this.props}>
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
            </PageHeaderWrapper>
            <Route component={Error} /> 
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
        <DocumentTitle title={getPageTitle(this.props.location.pathname, this.state.breadcrumbNameMap)}>
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

export default BasicLayout;

// export default connect()(props => (
//   <Media query="(max-width: 599px)">
//     {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
//   </Media>
// ));