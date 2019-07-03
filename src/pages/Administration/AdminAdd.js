import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Row, Col, Select, form } from 'antd';
import axios from 'axios';
// import isEqual from 'lodash/isEqual';
// import styles from './List.less';
import {ROOT_PATH} from '../pathrouter'

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
// if (!jwt_token || jwt_token.length < 32) {
//   location.hash = '/user/login';
// }

const Option = Select.Option;

class AdminAdd extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      userShow: {
        realname: '', // 用户名
        email: '', // 邮箱
        tel_mobile: '', // 手机号
        password: '', // 密码
        status: '', // 状态。0启用  1禁用
      },
    };
  }
  black = () => {
    window.location.hash = '/administration';
  };
  onSave = () => {
    axios({
      url: ROOT_PATH + '/api/backend/v1/admin_user',
      method: 'POST',
      params: {},
      data: this.state.userShow,
    }).then(result => {
      if (result.data.error !== 0) {
        message.error(result.data.msg);
      } else {
        message.success(result.data.msg);
        window.location.hash = '/administration';
      }
      console.log(result);
    });
  };
  render() {
    let { userShow } = this.state;
    return (
      <Fragment>
        <div style={{ background: '#fff', padding: '15px 0' }}>
          <Row
            gutter={8}
            style={{ display: 'flex', alignItems: 'center', background: '#fff', margin: '20px 0' }}
          >
            <Col span={2} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>ID</span>
            </Col>
            <Col span={8}>
              <Input style={{ padding: '25px 10px' }} size="large" />
            </Col>
          </Row>
          <Row
            gutter={8}
            style={{ display: 'flex', alignItems: 'center', background: '#fff', margin: '20px 0' }}
          >
            <Col span={2} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>用户名</span>
            </Col>
            <Col span={8}>
              <Input
                style={{ padding: '25px 10px' }}
                onChange={event => {
                  userShow.realname = event.target.value;
                }}
                size="large"
              />
            </Col>
          </Row>
          <Row
            gutter={8}
            style={{ display: 'flex', alignItems: 'center', background: '#fff', margin: '20px 0' }}
          >
            <Col span={2} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>邮箱号</span>
            </Col>
            <Col span={8}>
              <Input
                style={{ padding: '25px 10px' }}
                size="large"
                onChange={event => {
                  userShow.email = event.target.value;
                }}
              />
            </Col>
          </Row>
          <Row
            gutter={8}
            style={{ display: 'flex', alignItems: 'center', background: '#fff', margin: '20px 0' }}
          >
            <Col span={2} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>手机号</span>
            </Col>
            <Col span={8}>
              <Input
                style={{ padding: '25px 10px' }}
                size="large"
                onChange={event => {
                  userShow.tel_mobile = event.target.value;
                }}
              />
            </Col>
          </Row>
          <Row
            gutter={8}
            style={{ display: 'flex', alignItems: 'center', background: '#fff', margin: '20px 0' }}
          >
            <Col span={2} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>默认密码</span>
            </Col>
            <Col span={8}>
              <Input
                style={{ padding: '25px 10px' }}
                size="large"
                onChange={event => {
                  userShow.password = event.target.value;
                }}
              />
            </Col>
          </Row>
          <Row
            gutter={8}
            style={{ display: 'flex', alignItems: 'center', background: '#fff', margin: '20px 0' }}
          >
            <Col span={2} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>状态</span>
            </Col>
            <Col span={8}>
              <Select
                style={{ width: '100%' }}
                onChange={value => {
                  userShow.status = value;
                  if (userShow.status === '启用') {
                    userShow.status = 0;
                  } else {
                    userShow.status = 1;
                  }
                }}
              >
                <Option value="启用">启用</Option>
                <Option value="禁用">禁用</Option>
              </Select>
            </Col>
          </Row>
          <div style={{ marginLeft: '15%' }}>
            <Button
              style={{ width: '20%', height: '50px' }}
              type="primary"
              size="large "
              onClick={() => {
                this.onSave();
              }}
            >
              保存
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AdminAdd;
