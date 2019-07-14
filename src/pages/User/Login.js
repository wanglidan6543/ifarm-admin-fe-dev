import React, { Component } from 'react';
import { Icon, message, Tabs, Form, Input, Button } from 'antd';
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';
import { tr } from '../../common/i18n';
import './Login.less';

const { TabPane } = Tabs;

class Login extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return; }

      window.localStorage.setItem('username', values.username);
      axios(
        {
          url: ROOT_PATH + '/api/backend/v1/user/login',
          method: 'post',
          params: {},
          data: { ...values },
        },
        {}
      ).then(result => {
        if (result.data.error == 0 && result.data.data.jwt_token) {
          window.localStorage.setItem('jwt_token', result.data.data.jwt_token);
          window.localStorage.setItem('loginInfo', JSON.stringify(result.data.data));
          window.location.hash = '/home';
        } else {
          message.error(result.data.msg);
        }
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
    <div className="login_root">
      <div className="login_content">
        <Form onSubmit={this.handleSubmit} >
          <Tabs
            animated={false}
            defaultActiveKey="1"
          >
            <TabPane tab="账号密码登录" key="1">
                <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: tr('System', 'validation.userName.required') }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder={tr('System', 'app.login.userName')}
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: tr('System', 'validation.password.required') }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder={tr('System', 'app.login.password')}
                    onPressEnter={e => {
                      e.preventDefault();
                      // this.loginForm.validateFields(this.handleSubmit);
                      }                  
                    }
                  />,
                )}
              </Form.Item>
              <Button size="large" type="primary" htmlType="submit" className="submit">
                {tr('System', 'app.login.login')}
              </Button>
            </TabPane>
          </Tabs>
        </Form>
      </div>
    </div>
    )  
  };
}


Login = Form.create()(Login);

export default Login;
