import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Button,
  Input,
  message,
  Select,
  Checkbox,
  List,
  Collapse,
} from 'antd';

// import PageHeaderWrapper from '../components/PageHeaderWrapper';
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';
import { isNull } from 'util';
import './List.css';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  window.location.hash = '/user/login';
}

const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const HEADPICURL =
  'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1555412492&di=d5d5a04572ede36ae3448f86a163e19e&src=http://img.zcool.cn/community/01786557e4a6fa0000018c1bf080ca.png@1280w_1l_2o_100sh.png';

class UserAdd extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      limit: '',
      toendble: '', // 启用
      data: {
        username: '', // 用户名
        avatar_url: '', // 头像地址
        email: '', // 邮箱
        realname: '', // 昵称
        uid: '', // ID
        tel_mobile: '', // 手机号
        status: 0, // 状态。0启用  1禁用
        login_limit: '', // 登陆类型。1员工   2非员工
        role_ids: [],
      },
      isShow: false,
      isPnone: false,
      previewVisible: false,
      imageUrl: '',
      loading: false,
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: '',
        },
      ],
      UserIdentity: [],
      userSize: '编辑',
    };
  }

  componentDidMount() {
    let { data } = this.state;
    this.restUser();
    if (this.props.match.url === '/usered/edit/' + this.props.match.params.id) {
      axios({
        url: ROOT_PATH + '/api/backend/v1/user',
        method: 'GET',
        params: {
          uid: this.props.match.params.id,
        },
      }).then(result => {
        this.setState({
          data: result.data.data,
        });

        let userData = result.data.data;
        if (!userData) { return; }

        if(isNull(userData.login_limit)){
          userData.login_limit = 1
        }
        if(isNull(userData.realname)){
          userData.realname = ''
        }
        if (userData.avatar_url === '') {
          this.setState({
            imageUrl: HEADPICURL,
          });
        } else {
          this.setState({
            imageUrl: userData.avatar_url,
          });
        }
        data.uid = userData.uid;
      });
    }
  }

  onSave = () => {
    let { data } = this.state;
    // let user = new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-_]{1,30}$/); // 用户名
    // let realname = new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-]{1,30}$/); // 昵称
    let phone = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/); // 手机号

    // if (!user.test(data.username) || data.username === '') {
    //   message.error('用户名输入有误');
    // } else if (!realname.test(data.realname) || data.realname === '') {
    //   message.error('昵称输入有误');
    // } else 
    if (!phone.test(data.tel_mobile || data.tel_mobile === '')) {
      message.error('手机号输入有误');
    } else {
      if (this.props.match.url === '/usered/edit/' + this.props.match.params.id) {
        axios({
          url: ROOT_PATH + '/api/backend/v1/user',
          method: 'PUT',
          data: {
            username: data.username, // 用户名
            avatar_url: data.avatar_url, // 头像地址
            email: data.email, // 邮箱
            realname: data.realname, // 昵称
            uid: data.uid, // ID
            tel_mobile: data.tel_mobile, // 手机号
            status: data.status, // 状态。0启用  1禁用
            login_limit: data.login_limit, // 登陆类型。1员工   2非员工
          },
        }).then(result => {
          if (result.data.error !== 0) {
            message.error(result.data.msg);
          } else {
            message.success(result.data.msg);
            window.location.hash = '/usered';
          }
        });
      } else if (this.props.match.url === '/usered/add') {
        let arr = [];
        data.role_ids.forEach(item => {
          arr.push(item.role_id);
        });
        axios({
          url: ROOT_PATH + '/api/backend/v1/user',
          method: 'POST',
          data: {
            username: data.username, // 用户名
            avatar_url: data.avatar_url, // 头像地址
            email: data.email, // 邮箱
            realname: data.realname, // 昵称
            tel_mobile: data.tel_mobile, // 手机号
            status: data.status, // 状态。0启用  1禁用
            login_limit: data.login_limit, // 登陆类型。1员工   2非员工
            role_ids: arr,
          },
        }).then(result => {
          if (result.data.error !== 0) {
            message.error(result.data.msg);
          } else {
            message.success(result.data.msg);
            window.hash = '/usered';
          }
        });
      }
    }
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      let { data } = this.state;
      data.avatar_url = info.file.response.data.file_url;
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };

  beforeUpload(file) {
    const isPng = file.type;
    if (isPng != 'image/png' && isPng != 'image/jpeg') {
      message.error('头像只支持png、jpg');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2KB!');
      return false;
    }
  }
  // 多选框选中和没选中的情况下，选中添加，取消删除
  onCheckout = (value, index, e, arr) => {
    let check = e.target.checked;
    let { data } = this.state;
    arr[index].indeterminate = !arr[index].indeterminate;
    this.setState({
      UserIdentity: [...arr],
    });
  };

  restUser = () => {
    let { data, UserIdentity, userSize, listed } = this.state;
    axios({
      url: ROOT_PATH + '/api/backend/v1/user/roles',
      method: 'GET',
    }).then(result => {
      result.data.data.forEach(item => {
        item.indeterminate = false;
      });
      UserIdentity = result.data.data.map((item, value) => {
        data.role_ids.map((value, index) => {
          if (item.name === value.role_name) {
            item.indeterminate = true;
          }
        });
        return item;
      });
      this.setState({
        UserIdentity,
      });
    });
  };

  // 删除操作
  deled = (value, index) => {
    let { data, UserIdentity } = this.state;
    data.role_ids.splice(index, 1);
    UserIdentity.forEach((item, index) => {
      if (value.role_name === item.name) {
        UserIdentity.splice(index, 1);
      }
    });
    this.restUser();
    this.setState({
      data: { ...data },
    });
  };

  //确定事件
  userChange = key => {
    let { data, UserIdentity } = this.state;
    this.restUser();
    if (key.length == 0) {
      this.state.UserIdentity.forEach((item, index) => {
        if (item.indeterminate) {
          let object = {
            role_name: item.name,
            role_id: item.role_id,
          };
          var allArr = []; //新数组
          if (data.role_id.length > 0) {
            for (var i = 0; i < data.role_ids.length; i++) {
              var flag = true;
              if (data.role_ids[i].role_name === object.role_name) {
                flag = false;
                allArr.push(flag);
              } else {
                flag = true;
                allArr.push(flag);
              }
            }
            flag = allArr.every(item => {
              return item === true;
            });
            if (flag) {
              data.role_ids.push(object);
            }
          } else {
            data.role_ids.push(object);
          }
        } else {
          data.role_ids.splice(index);
        }
      });
      this.setState({
        data: { ...data },
        userSize: '编辑',
      });
    } else {
      this.setState({
        userSize: '确定',
      });
    }
  };

  render() {
    let {
      data,
      UserIdentity,
      userSize,
    } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    if (this.props.match.url === '/usered/edit/' + this.props.match.params.id) {
      if(isNull(data.login_limit)){
        data.login_limit = ''
      }
      // data.login_limit === 2 ? (limit = '非员工') : (limit = '员工');
      data.password = this.state.password;
    } else {
      // data.status === 0 ? '启用' : '禁用';
      data.password = data.password;
    }

    return (
      <Fragment>
        <Form hideRequiredMark style={{ marginTop: 8, background: '#fff', padding: '30px 0' }}>
          {this.props.match.url === '/usered/edit/' + this.props.match.params.id ? (
            <FormItem
              name="number"
              label="ID"
              className='form_input'
              style={{ width: '40%', display: 'flex', alignItems: 'center' }}
            >
              {getFieldDecorator('ID', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<span>{data.uid}</span>)}
            </FormItem>
          ) : (
            ''
          )}
          <FormItem
            label="用户名"
            className='form_input'
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('username', {
              initialValue: data.username,
              // rules: [
              //   {
              //     required: true,
              //     pattern: new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-_]{1,30}$/),
              //     message: '用户名最多为30为、字母、数字、汉字',
              //   },
              // ],
            })(
              <Input
                onChange={event => {
                  data.username = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="昵称"
            className='form_input'
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('昵称', {
              initialValue: data.realname,
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
                  data.realname = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="手机号"
            className='form_input'
            autoComplete="off"
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('input-number', {
              initialValue: data.tel_mobile,
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
                  data.tel_mobile = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="默认邮箱"
            className='form_input'
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('邮箱号', {
              initialValue: data.email,
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
                  data.email = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="用户身份"
            className='form_col'
            style={{ width: '40%', display: 'flex' }}
          >
            {getFieldDecorator('用户身份', {})(
              <Collapse onChange={this.userChange}>
                <Panel header={userSize} showArrow={false}>
                  {UserIdentity.map((value, index, arr) => {
                    return (
                      <List key={index}>
                        <Checkbox
                          checked={value.indeterminate}
                          value={value.role_id}
                          onChange={e => this.onCheckout(value, index, e, arr)}
                        >
                          {value.name}
                        </Checkbox>
                      </List>
                    );
                  })}
                </Panel>
              </Collapse>
            )}
          </FormItem>
          <div
            style={{
              display: 'flex',
              alignContent: 'center',
              padding: '10px 0',
              marginBottom: '20px',
            }}
          >
            <span style={{ width: '10%', textAlign: 'center' }}>已添加用户身份</span>
            <div style={{ width: '50%' }}>
              {data.role_ids.length > 0 &&
                data.role_ids.map((item, index) => {
                  return item.role_name != '' ? (
                    <div
                      key={index}
                      style={{
                        marginRight: '20px',
                        background: '#eee',
                        padding: '8px 10px',
                        textAlign: 'center',
                        display: 'inline-block',
                        marginBottom: '10px',
                      }}
                    >
                      {item.role_name}
                      <b
                        style={{
                          color: 'red',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          this.deled(item, index);
                        }}
                      >
                        x
                      </b>
                    </div>
                  ) : (
                    ''
                  );
                })}
            </div>
          </div>
          <FormItem
            label="状态"
            className='form_input'
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('data.status', {
              initialValue: data.status === 0 ? '启用' : '禁用',
              rules: [
                {
                  rules: [{ required: true, message: 'Please select your gender!' }],
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                onChange={value => {
                  data.status = Number(value);
                }}
              >
                <Option value="0">启用</Option>
                <Option value="1">禁用</Option>
              </Select>
            )}
          </FormItem>
          <div style={{ marginLeft: '15%' }}>
            <Button
              style={{ width: '20%', height: '50px' }}
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

UserAdd = Form.create()(UserAdd);

export default UserAdd;
