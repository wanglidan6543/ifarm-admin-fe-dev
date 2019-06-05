import React, { Component, Fragment } from 'react';
// import { List } from 'antd';
import { Result, Icon, WhiteSpace,Flex } from 'antd-mobile';
import axios from 'axios'
import styles from './List.less';

const myImg = src => <img src={src} className="user" alt="" />;

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  location.hash = '/user/login';
}

class TableForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Fragment>
        <Flex direction='column' style={{background:'#fff',height:'600px',alignContent:'center'}}>
          {/* <img src='http://img3.imgtn.bdimg.com/it/u=2356170312,4136497387&fm=26&gp=0.jpg' /> */}
          <b style={{fontSize:'24px',color:'#ccc',paddingTop:'25%'}}>首页建设中，敬请期待......</b>
        </Flex>
      </Fragment>
    );
  }
}

export default TableForm;
