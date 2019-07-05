import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Input, message, Select, AutoComplete } from 'antd';
// import PageHeaderWrapper from '../components/PageHeaderWrapper';
import axios from 'axios';
import './List.css';
import { ROOT_PATH } from '../pathrouter';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  window.location.hash = '/user/login';
}

const Option = Select.Option;
const FormItem = Form.Item;

class RelatedFarmsEdit extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      farmList: [],
      userList: [],
      formval: '',
      identity: '',
      data: {
        uid: '', // ID
        realname: '', // 用户昵称
        username: '', // 用户账号
        farms: [
          {
            name: '', // 农场名称
            production_organization_id: '', // 农场代码
          },
        ], // 关联农场列表
        role_id: 1, // 用户身份id
        avatar_url: '', // 头像地址
        status: '', // 状态 0启用 1禁用
      },
      savedata: {
        uid: '',
        farm_org: [], // 农场代码串
        status: '', // 状态 0启用 1禁用
        role_id: 0, // 用户身份
      },
    };
  }

  componentDidMount() {
    // 用户身份列表
    axios({
      url: ROOT_PATH + '/api/backend/v1/user/roles',
      method: 'GET',
    }).then(result => {
      this.setState({
        userList: result.data.data,
      });
    });
    // 详情
    axios({
      url: ROOT_PATH + '/api/backend/v1/user_farm',
      method: 'GET',
      params: {
        uid: this.props.match.params.id,
      },
    }).then(result => {
      console.log('详情');
      console.log(result.data);

      if (result.data.data.role_id === null) {
        result.data.data.role_id = 1;
      }
      this.setState({
        data: result.data.data,
      });
    });
  }

  onSave = () => {
    let { data } = this.state;
    let arr = [];
    data.farms.forEach(item => {
      arr.push(item.production_organization_id);
    });

    axios({
      url: ROOT_PATH + '/api/backend/v1/user_farm',
      method: 'PUT',
      data: {
        uid: data.uid,
        farm_ids: arr, // 农场代码串
        status: data.status, // 状态 0启用 1禁用
        role_id: data.role_id,
      },
    }).then(result => {
      if (result.data.error !== 0) {
        message.error(result.data.msg);
      } else {
        message.success(result.data.msg);
        window.location.hash = '/relatedfarms';
      }
    });
  };

  // 关联农场获取焦点时
  autoVal = value => {
    if (typeof value === 'undefined') {
      value = this.state.autoVal;
    }
    this.formsearch(value);
  };

  // 关联农场
  formsearch = value => {
    this.setState({
      autoVal: value,
    });
    this.setState({
      farmList: [],
    });
    axios({
      url: ROOT_PATH + '/api/backend/v1/farms',
      method: 'GET',
      params: {
        search: value,
      },
    }).then(result => {
      this.setState({
        farmList: result.data.data,
      });
    });
  };

  handleSearch = value => {
    let { farmList } = this.state;
    if (!value) {
      farmList = [];
    } else {
      farmList.map(item => item);
    }
  };

  deled = (item, index) => {
    let { data } = this.state;
    data.farms.splice(index, 1);
    this.setState({ data: { ...data } });
  };

  render() {
    let { data, farmList, userList, identity } = this.state;
    const { form: { getFieldDecorator } } = this.props;

    const children = farmList.map((item, index) => (
      <Option key={index} label={item.production_organization_id}>
        {item.name}
      </Option>
    ));
    return (
      <Fragment>
        <Form hideRequiredMark style={{ marginTop: 8, background: '#fff', padding: '30px 0' }}>
          <FormItem
            name="number"
            label="用户ID"
            className='form_input'
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('用户ID', {})(<span>{data.uid}</span>)}
          </FormItem>
          <FormItem
            label="用户名称"
            className='form_input'
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('用户名称', {
              initialValue: data.username,
              rules: [
                {
                  required: true,
                  pattern: new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-]{1,30}$/),
                  message: '用户名最多为30为、字母、数字、汉字',
                },
              ],
            })(
              <Input
                disabled={true}
                onChange={event => {
                  data.username = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="关联农场"
            className='form_input'
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            <AutoComplete
              type="text"
              style={{ width: '100%' }}
              className='searchinp'
              onSelect={(value, option) => {
                let abject = {
                  name: option.props.children,
                  production_organization_id: option.props.label,
                };
                var allArr = []; //新数组
                if (data.farms.length > 0) {
                  for (var i = 0; i < data.farms.length; i++) {
                    var flag = true;
                    if (data.farms[i].name === abject.name) {
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
                    data.farms.push(abject);
                  } else {
                    message.info('您已关联此农场');
                  }
                } else {
                  data.farms.push(abject);
                }
              }}
              onSearch={this.handleSearch}
              onChange={this.formsearch}
              placeholder="搜索农场名称/ID号（可添加多个）"
              onFocus={this.formsearch}
            >
              {children}
            </AutoComplete>
          </FormItem>
          <FormItem
            label="用户身份"
            className='form_input'
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('用户身份', {
              initialValue: identity,
            })(
              <Select
                style={{ width: '100%' }}
                onChange={value => {
                  data.role_id = Number(value);
                }}
              >
                {userList.map((val, ind) => {
                  return (
                    <Option key={ind} value={val.role_id}>
                      {val.name}
                    </Option>
                  );
                })}
              </Select>
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
            <span style={{ width: '10%', textAlign: 'center' }}>已关联</span>
            <div style={{ width: '50%' }}>
              {data.farms.map((item, index) => {
                return (
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
                    {item.name}
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
                );
              })}
            </div>
          </div>
          <FormItem
            label="状态"
            className='form_input'
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('Gender', {
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

RelatedFarmsEdit = Form.create()(RelatedFarmsEdit);

export default RelatedFarmsEdit;
