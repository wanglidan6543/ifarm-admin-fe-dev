import React, { PureComponent, Fragment } from 'react';
import axios from 'axios';
import { 
  Form,
  Input,
  Button,
  Card,
  Icon,
  message,
} from 'antd';

import { ROOT_PATH } from '../pathrouter';
import './Changepassword.less';

const FormItem = Form.Item;

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  window.location.hash = '/user/login';
}

class Changepassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changepassword: {
        password: '', // 旧密码
        new_password: '', // 新密码
        confirm_password: '', // 确认密码
      },
      isShow: false,
      types: 'password',
      typed: 'password',
      typing: 'password',
      icontype: 'eye-invisible',
      icontyped: 'eye-invisible',
      icontyping: 'eye-invisible',
    };
  }
  onSave = () => {
    let { changepassword } = this.state;
    let password = new RegExp(/[0-9a-zA-Z]{8,16}/);
    let passworded = new RegExp(/[0-9a-zA-Z]{1,16}/);
    if (!passworded.test(changepassword.password || changepassword.password != '')) {
      message.error('请输入数字字母大小写');
    } else if (!password.test(changepassword.new_password || changepassword.new_password != '')) {
      message.error('请输入数字字母大小写');
    } else if (
      !password.test(changepassword.confirm_password || changepassword.confirm_password != '')
    ) {
      message.error('请输入数字字母大小写');
    } else {
      axios({
        url: ROOT_PATH + '/api/backend/v1/update_password',
        method: 'POST',
        data: this.state.changepassword,
      }).then(result => {
        if (result.data.error !== 0) {
          message.error(result.data.msg);
        } else {
          message.success(result.data.msg);
          window.location.hash = '/user/login';
        }
      });
    }
  };

  eyeone = () => {
    if (this.state.types === 'password' || this.state.icontype === 'eye-invisible') {
      this.setState({
        types: 'text',
        icontype: 'eye',
      });
    } else {
      this.setState({
        types: 'password',
        icontype: 'eye-invisible',
      });
    }
  };

  eyetwo = () => {
    if (this.state.typed === 'password' || this.state.icontyped === 'eye-invisible') {
      this.setState({
        typed: 'text',
        icontyped: 'eye',
      });
    } else {
      this.setState({
        typed: 'password',
        icontyped: 'eye-invisible',
      });
    }
  };

  eyethree = () => {
    if (this.state.typing === 'password' || this.state.icontyping === 'eye-invisible') {
      this.setState({
        typing: 'text',
        icontyping: 'eye',
      });
    } else {
      this.setState({
        typing: 'password',
        icontyping: 'eye-invisible',
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    let {
      changepassword,
      isShow,
      types,
      icontype,
      typed,
      typing,
      icontyped,
      icontyping,
    } = this.state;

    return (
      <Fragment>
        <Card bordered={false}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem
              label="原密码"
              className="form_input"
              style={{ width: '40%', display: 'flex' }}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/[0-9a-zA-Z]{1,16}/),
                    message: '密码格式有误',
                  },
                ],
              })(
                <Input
                  prefix={<Icon onClick={this.eyeone} type={icontype} />}
                  type={types}
                  placeholder="请输入原密码"
                  onChange={event => {
                    changepassword.password = event.target.value;
                  }}
                />
              )}
            </FormItem>
            <FormItem
              label="新密码"
              className="form_input"
              style={{ width: '40%', display: 'flex' }}
            >
              {getFieldDecorator('new_password', {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/[0-9a-zA-Z]{8,16}/),
                    message:
                      '密码不可少于八位, (规则大写字母，小写字母与数字中的任意两种以上的组合)',
                  },
                ],
              })(
                <Input
                  type={typed}
                  placeholder="请输入新密码"
                  prefix={<Icon onClick={this.eyetwo} type={icontyped} />}
                  onChange={event => {
                    changepassword.new_password = event.target.value;
                  }}
                />
              )}
            </FormItem>
            <FormItem
              label="确认密码"
              className="form_input"
              style={{ width: '40%', display: 'flex' }}
            >
              {getFieldDecorator('confirm_password', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Input
                  type={typing}
                  placeholder="再次确认密码"
                  prefix={
                    <Icon
                      onClick={this.eyethree}
                      type={icontyping}
                      style={{ color: 'rgba(0,0,0,.25)', marginLeft: '90%' }}
                    />
                  }
                  onChange={event => {
                    changepassword.confirm_password = event.target.value;
                    if (changepassword.confirm_password !== changepassword.new_password) {
                      this.setState({
                        isShow: true,
                      });
                    } else {
                      this.setState({
                        isShow: false,
                      });
                    }
                  }}
                />
              )}
              {isShow ? <span style={{ color: 'red' }}>两次密码输入不一致</span> : ''}
            </FormItem>
          </Form>
          <div style={{ marginLeft: '10%' }}>
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
        </Card>
      </Fragment>
    );
  }
}

Changepassword = Form.create()(Changepassword);

export default Changepassword;
