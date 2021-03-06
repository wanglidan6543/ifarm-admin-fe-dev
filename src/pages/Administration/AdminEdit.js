import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, message, Select} from 'antd';
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';
import './List.less';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  window.location.hash = '/user/login';
}

const Option = Select.Option;
const FormItem = Form.Item;

class AdminEdit extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      userShow: {
        uid: '', // ID
        realname: '', // 用户名
        email: '', // 邮箱
        tel_mobile: '', // 手机号
        password: '', // 密码
        status: 0, // 状态。0启用  1禁用
      },
      password: '1234qwer',
      isShow: false,
      isPnone: false,
      desable: false,
    };
  }
  componentDidMount() {
    if (this.props.match.url === '/administration/edit/' + this.props.match.params.id) {
      axios({
        url: ROOT_PATH + '/api/backend/v1/admin_user',
        method: 'GET',
        params: {
          uid: this.props.match.params.id,
        },
      }).then(result => {
        this.setState({
          userShow: result.data.data, // 这个里面没有密码的字段，所以我要给他一个默认的
        });
      });
    }
  }
  onSave = () => {
    let { userShow } = this.state;
    // let user = new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-]{1,30}$/);
    let phone = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/);
    let pasd = new RegExp(/^[\w]{8,12}$/);
    // if (!user.test(userShow.realname) || userShow.realname === '') {
    //   message.error('用户名输入有误');
    // } else 
    if (!phone.test(userShow.tel_mobile || userShow.tel_mobile === '')) {
      message.error('手机号输入有误');
    } else {
      if (this.props.match.url === '/administration/edit/' + this.props.match.params.id) {
        let { userShow } = this.state;
        if (userShow.password === undefined) {
          userShow.password = '';
        } else {
          userShow.password = userShow.password;
        }
        axios({
          url: ROOT_PATH + '/api/backend/v1/admin_user',
          method: 'PUT',
          data: {
            uid: userShow.uid, // ID
            realname: userShow.realname, // 用户名
            email: userShow.email, // 邮箱
            tel_mobile: userShow.tel_mobile, // 手机号
            password: userShow.password, // 密码
            status: userShow.status, // 状态。0启用  1禁用
          },
        }).then(result => {
          if (result.data.error !== 0) {
            message.error(result.data.msg);
          } else {
            message.success(result.data.msg);
            window.location.hash = '/administration';
          }
        });
      } else if (this.props.match.url === '/administration/add') {
        let { userShow } = this.state;
        userShow.password = this.state.password;
        axios({
          url: ROOT_PATH + '/api/backend/v1/admin_user',
          method: 'POST',
          data: this.state.userShow,
        }).then(result => {
          if (result.data.error !== 0) {
            message.error(result.data.msg);
          } else {
            message.success(result.data.msg);
            window.location.hash = '/administration';
          }
        });
      }
    }
  };

  pswd = () => {
    let { userShow } = this.state;
    userShow.password = '1234qwer';
    this.props.form.resetFields();
    this.setState({
      userShow: { ...userShow },
    });
  };

  render() {
    let { userShow, desable } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    if (this.props.match.url === '/administration/edit/' + this.props.match.params.id) {
      this.setState({
        desable: false,
      });
    } else if (this.props.match.url === '/administration/add') {
      // userShow.status === 0 ? '启用' : '禁用',
        this.setState({
          desable: true,
        });
    }

    return (
      <Fragment>
        <Form hideRequiredMark style={{ marginTop: 8, background: '#fff', padding: '30px 0' }}>
          <input type="password" style={{ position: 'fixed', left: '-9999px' }} />
          {this.props.match.url === '/administration/edit/' + this.props.match.params.id ? (
            <FormItem
              name="number"
              label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
              className="formInput"
              style={{ width: '40%', display: 'flex', alignItems: 'center' }}
            >
              {getFieldDecorator('ID', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<span>{userShow.uid}</span>)}
            </FormItem>
          ) : (
            ''
          )}
          <FormItem
            label="&nbsp;&nbsp;用户名&nbsp;&nbsp;"
            className="formInput"
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('userShow.realname', {
              initialValue: userShow.realname,
              // rules: [
              //   {
              //     required: true,
              //     pattern: new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-]{1,30}$/),
              //     message: '用户名最多为30为、字母、数字、汉字',
              //   },
              // ],
            })(
              <Input
                onChange={event => {
                  userShow.realname = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="&nbsp;&nbsp;邮箱号&nbsp;&nbsp;"
            className="formInput"
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('邮箱号', {
              initialValue: userShow.email,
              rules: [
                {
                  required: true,
                  pattern: new RegExp(
                    /^([a-zA-Z0-9_-]{1,16})@([a-zA-Z0-9]{1,9})(\.(?:com|net|org|edu|gov|mil|cn|us))$/
                  ),
                  message: '请输入正确的邮箱号',
                  len: 50,
                },
              ],
            })(
              <Input
                onChange={event => {
                  userShow.email = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="&nbsp;&nbsp;手机号&nbsp;&nbsp;"
            className="formInput"
            autoComplete="off"
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('input-number', {
              initialValue: userShow.tel_mobile,
              rules: [
                {
                  required: true,
                  pattern: new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/),
                  message: '请输入正确的手机号',
                },
              ],
            })(
              <Input
                onChange={event => {
                  userShow.tel_mobile = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="默认密码 "
            className="formInput"
            style={{ width: '40%', display: 'flex' }}
          >
            {getFieldDecorator('passward', {
              initialValue: this.state.password,
              rules: [
                {
                  required: true,
                  pattern: new RegExp(/^[\w]{8,12}$/),
                  message: '密码最少为8位,字母、数字、下划线',
                },
              ],
            })(
              <Input.Password
                disabled={desable}
                onChange={event => {
                  userShow.password = event.target.value;
                }}
              />
            )}
            {this.props.match.url === '/administration/edit/' + this.props.match.params.id ? (
              <span
                onClick={() => {
                  this.pswd();
                }}
                style={{ marginLeft: '223px', color: '#40a9ff',cursor: 'pointer', }}
              >
                恢复默认密码
              </span>
            ) : (
              ''
            )}
          </FormItem>
          {/* {this.props.match.url === '/administration/edit/' + this.props.match.params.id ? (
            <div
              onClick={() => {
                this.pswd();
              }}
            >
              <Button
                style={{ width: '20%', height: '40px', marginBottom: '25px' }}
                type="primary"
                onClick={() => {
                  this.pswd();
                }}
              >
                恢复默认密码
              </Button>
            </div>
          ) : (
            ''
          )} */}
          <FormItem
            label="状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态 "
            className="formInput"
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('userShow.status', {
              initialValue: userShow.status === 0 ? '启用' : '禁用',
              rules: [
                {
                  rules: [{ required: true, message: 'Please select your gender!' }],
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                onChange={value => {
                  userShow.status = Number(value);
                }}
              >
                <Option value="0">启用</Option>
                <Option value="1">禁用</Option>
              </Select>
            )}
          </FormItem>
          <div style={{ marginLeft: '15%' }}>
            <Button
              style={{ width: '20%', height: '40px' }}
              type="primary"
              onClick={() => {
                this.onSave();
              }}
            >
              保存
            </Button>
          </div>
        </Form>
      </Fragment>
    );
  }
}

AdminEdit = Form.create()(AdminEdit);

export default AdminEdit;
