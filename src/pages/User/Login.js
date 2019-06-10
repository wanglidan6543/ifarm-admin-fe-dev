import React, { Component } from 'react';
import { connect } from 'dva'; 
import { Checkbox, Alert, Icon, message } from 'antd';
import Login from '../components/Login';
import styles from './Login.less';
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
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
        location.hash = '/home';
      } else {
        message.error(result.data.msg);
      }
    });
    return;
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={tr('System','app.login.tab-login-credentials' )}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(tr('System','app.login.message-invalid-credentials' ))}
            <UserName
              name="username"
              placeholder={`${tr('System','app.login.userName' )}`}
              rules={[
                {
                  required: true,
                  message: tr('System','validation.userName.required' ),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${tr('System','app.login.password' )}`}
              rules={[
                {
                  required: true,
                  message: tr('System','validation.password.required' ),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          {/* <Tab key="mobile" tab={tr('System','app.login.tab-login-mobile' })}>
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage(
                tr('System','app.login.message-invalid-verification-code' })
              )}
            <Mobile
              name="mobile"
              placeholder={tr('System','form.phone-number.placeholder' })}
              rules={[
                {
                  required: true,
                  message: tr('System','validation.phone-number.required' }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: tr('System','validation.phone-number.wrong-format' }),
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder={tr('System','form.verification-code.placeholder' })}
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={tr('System','form.get-captcha' })}
              getCaptchaSecondText={tr('System','form.captcha.second' })}
              rules={[
                {
                  required: true,
                  message: tr('System','validation.verification-code.required' }),
                },
              ]}
            />
          </Tab> */}
          <div>
            {/* <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox> */}
            {/* <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a> */}
          </div>
          <Submit loading={submitting}>
            <span id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
