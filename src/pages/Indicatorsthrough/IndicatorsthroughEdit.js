import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Table,
  Button,
  Input,
  message,
  Divider,
  Row,
  Col,
  Select,
  Card,
  Icon,
  AutoComplete,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import axios from 'axios';
import styles from './List.less';
import { ROOT_PATH } from '../pathrouter';
import { stat } from 'fs';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  location.hash = '/user/login';
}
const Option = Select.Option;
const OptGroup = AutoComplete.OptGroup;
const FormItem = Form.Item;
const pattern = new RegExp(/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im);

@Form.create()
class TableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      farmList: [],
      userList: [],
      addFarm: [],
      formval: '',
      hierarchy: '',
      searchVal: '',
      AccordingState: '',
      categoryBreed: '',
      data: {
        uid: '', // ID
        username: '', // 用户账号
        lvl: '', // 层级，1=大区，2=省，3=公司，4=分公司，5=农场
        category: '', // 类别。1=养殖生产 2=销售
        status: '', // 状态 0启用 1禁用
        farms: [
          {
            farm_name: '', // 关联农场/省/公司/分公司代码名称
            organization_id: '', // 关联农场/省/公司/分公司代码
          },
        ], // 关联农场列表
      },
    };
  }
  componentDidMount() {
    axios({
      url: ROOT_PATH + '/api/backend/v1/user_priv',
      method: 'GET',
      params: {
        uid: this.props.match.params.id,
      },
    }).then(result => {
      this.setState({
        data: result.data.data,
      });
      let { data, hierarchy, AccordingState } = this.state;
      if (data.lvl === 1) {
        this.setState({
          hierarchy: '指定SCV大区',
        });
      } else if (data.lvl === 2) {
        this.setState({
          hierarchy: '指定省',
        });
      } else if (data.lvl === 3) {
        this.setState({
          hierarchy: '指定公司',
        });
      } else if (data.lvl === 4) {
        this.setState({
          hierarchy: '指定分公司/客户',
        });
      } else if (data.lvl === 5) {
        this.setState({
          hierarchy: '指定农场',
        });
      } else {
        this.setState({
          hierarchy: '',
        });
      }
      if (data.category === 1) {
        this.setState({
          categoryBreed: '养殖生产',
        });
      } else if (data.category === 2) {
        this.setState({
          categoryBreed: '销售',
        });
      } else {
        this.setState({
          categoryBreed: '',
        });
      }
      if (data.status === 0) {
        this.setState({
          AccordingState: '启用',
        });
      } else if (data.status === 1) {
        this.setState({
          AccordingState: '禁用',
        });
      } else {
        this.setState({
          AccordingState: '',
        });
      }
    });
  }
  onSave = () => {
    let { data, farmList, addFarm } = this.state;
    const { form } = this.props;

    let user = new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-]{1,30}$/);
    if (!user.test(data.username) || data.username === '') {
      message.error('用户名最多为30为、字母、数字、汉字');
    } else {
      let arr = [];
      data.farms.forEach(item => {
        arr.push(item.organization_id);
      });
      axios({
        url: ROOT_PATH + '/api/backend/v1/user_priv',
        method: 'POST',
        data: {
          uid: data.uid,
          lvl: data.lvl,
          category: data.category,
          status: data.status, // 状态 0启用 1禁用
          production_organizations: arr,
        },
      }).then(result => {
        if (result.data.error !== 0) {
          message.error(result.data.msg);
        } else {
          message.success(result.data.msg);
          location.hash = '/indicatorsthrough';
        }
      });
    }
  };
  // 搜索
  searchFarm = value => {
    let { farmList } = this.state;
    if (!value) {
      farmList = [];
    } else {
      farmList.map(item => item);
    }
    let { data } = this.state;
    axios({
      url: ROOT_PATH + '/api/backend/v1/production_organizations',
      method: 'GET',
      params: {
        search: value,
        lvl: data.lvl,
        category: data.category,
      },
    }).then(result => {
      this.setState({
        farmList: result.data.data.production_organizations,
      });
    });
  };
  deled = (item, index) => {
    let { data } = this.state;
    data.farms.splice(index, 1);
    this.setState({ data: { ...data } });
  };
  focusFarm = (e) => {
    console.log(e)
  }

  render() {
    let {
      data,
      farmList,
      userList,
      formval,
      hierarchy,
      AccordingState,
      addFarm,
      categoryBreed,
    } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue, isFieldTouched, getFieldError, isShow },
    } = this.props;
    const children = farmList.map((item, index) => (
      <Option key={index} label={item.organization_id}>
        {item.name}
      </Option>
    ));
    return (
      <PageHeaderWrapper>
        <Form hideRequiredMark style={{ marginTop: 8, background: '#fff', padding: '30px 0' }}>
          <FormItem
            name="number"
            label="用户ID"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('用户ID', {})(<span>{data.uid}</span>)}
          </FormItem>
          <FormItem
            label="用户名称"
            className={styles.form_input}
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
            label="
            看数据类型"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('category', {
              initialValue: categoryBreed,
            })(
              <Select
                style={{ width: '100%' }}
                onChange={value => {
                  data.category = value;
                }}
              >
                <Option value="1">养殖生产</Option>
                <Option value="2">销售</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="看数据范围"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('lvl', {
              initialValue: hierarchy,
            })(
              <Select
                style={{ width: '100%' }}
                onChange={value => {
                  if (value === '1') {
                    data.lvl = value;
                    data.farms.forEach((item, index) => {
                      let Intercept = item.farm_name.substring(item.farm_name.length - 1);
                      if (Intercept !== '区') {
                        data.farms.splice(index, 1);
                        this.setState({ data: { ...data } });
                      }
                    });
                  } else if (value === '2') {
                    data.lvl = value;
                    data.farms.forEach((item, index) => {
                      let Intercept = item.farm_name.substring(item.farm_name.length - 1);
                      if (Intercept !== '省') {
                        data.farms.splice(index, 1);
                        this.setState({ data: { ...data } });
                      }
                    });
                  } else if (value === '3') {
                    data.lvl = value;
                    data.farms.forEach((item, index) => {
                      let Intercept = item.farm_name.substring(item.farm_name.length - 2);
                      if (Intercept !== '公司') {
                        data.farms.splice(index, 1);
                        this.setState({ data: { ...data } });
                      }
                    });
                  } else if (value === '4') {
                    data.lvl = value;
                    data.farms.forEach((item, index) => {
                      let Intercept = item.farm_name.substring(item.farm_name.length - 3);
                      let Customer = item.farm_name.substring(item.farm_name.length - 2); // 客户
                      if (Intercept !== '分公司' && Customer !== '客户') {
                        data.farms.splice(index, 1);
                        this.setState({ data: { ...data } });
                      }
                    });
                  } else if (value === '5') {
                    data.lvl = value;
                    data.farms.forEach((item, index) => {
                      let Intercept = item.farm_name.substring(item.farm_name.length - 2);
                      if (Intercept !== '农场') {
                        data.farms.splice(index, 1);
                        this.setState({ data: { ...data } });
                      }
                    });
                  }
                }}
              >
                <Option value="1">指定SCV大区</Option>
                <Option value="2">指定省</Option>
                <Option value="3">指定公司</Option>
                <Option value="4">指定分公司/客户</Option>
                <Option value="5">指定农场</Option>
              </Select>
            )}
          </FormItem>
          <Row>
            <Col span={2} />
            <Col span={8} style={{ marginLeft: '20px', marginBottom: '10px' }}>
              <AutoComplete
                type="text"
                ref="editInput"
                style={{ width: '100%' }}
                className={styles.searchinp}
                onSelect={(value, option) => {
                  let abject = {
                    farm_name: option.props.children,
                    organization_id: option.props.label,
                  };
                  var allArr = []; //新数组
                  if (data.farms.length > 0) {
                    for (var i = 0; i < data.farms.length; i++) {
                      var flag = true;
                      if (data.farms[i].farm_name === abject.farm_name) {
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
                      message.info('您已添加');
                    }
                  } else {
                    data.farms.push(abject);
                  }
                }}
                onSearch={value => this.searchFarm(value)}
                onChange={value => this.searchFarm(value)}
                placeholder="搜索SVC大区/省/公司/分公司或客户/农场 名称或ID"
                // onFocus={value => this.searchFarm(value)}
                onBlur={value => this.searchFarm(value)}
              >
                {children}
              </AutoComplete>
            </Col>
          </Row>
          <div
            style={{
              display: 'flex',
              alignContent: 'center',
              padding: '10px 0',
              marginBottom: '20px',
            }}
          >
            <span style={{ width: '10%', textAlign: 'center' }}>已添加</span>
            <div style={{ width: '50%', border: 'solid 1px #eee', padding: '10px' }}>
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
                    {item.farm_name}
                    <b
                      style={{
                        color: 'red',
                        cursor: 'pointer',
                        marginLeft: '20px',
                      }}
                      onClick={() => {
                        this.deled(item, index);
                      }}
                    >
                      删除
                    </b>
                  </div>
                );
              })}
            </div>
          </div>
          <FormItem
            label="状态"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('Gender', {
              initialValue: AccordingState,
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
      </PageHeaderWrapper>
    );
  }
}

export default TableForm;
