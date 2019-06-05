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
  Upload,
  Modal,
  TreeSelect 
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import axios from 'axios';
import styles from './List.less';
import { ROOT_PATH } from '../pathrouter';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  location.hash = '/user/login';
}

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const treeData = [
  {
    title: '内容管理',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: '文章管理',
        value: '0-0-0',
        key: '0-0-0',
      },
      {
        title: '价格管理',
        value: '0-0-1',
        key: '0-0-0',
      },
    ],
  },
  {
    title: '用户与权限管理',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: '用户管理',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: '管理员管理',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: '管理员权限管理',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];

@Form.create()
class TableForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: ['0-0-0']
    }
  }
  componentDidMount() {
    let { data } = this.state;
    if (this.props.match.url === '/usered/edit/' + this.props.match.params.id) {
      axios({
        url: ROOT_PATH + '/api/backend/v1/user',
        method: 'GET',
        params: {
          uid: this.props.match.params.id,
        },
      }).then(result => {
        
      });
    }
  }
  onChange = value => {
    console.log('onChange ', value);
    this.setState({ value });// 此时改变的是当前选中的value形成的一个数组
  };
  onSave = () => {
   
  };
  render() {
    let {value} = this.state
    const Option = Select.Option;
    const FormItem = Form.Item;
    
    const {
      form: { getFieldDecorator, getFieldValue, isFieldTouched, getFieldError, isShow },
    } = this.props;
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: '100%',
      },
    };
    return (
      <PageHeaderWrapper>
        <Form hideRequiredMark style={{ marginTop: 8, background: '#fff', padding: '30px 0' }}>
          <FormItem
            name="number"
            label="ID"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('ID', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<span>QX00001</span>)}
          </FormItem>
          <FormItem
            label="权限名称"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('username', {
              initialValue: '农场信息管理',
              rules: [
                {
                  required: true,
                  pattern: new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-_]{1,30}$/),
                  message: '用户名最多为30为、字母、数字、汉字',
                },
              ],
            })(
              <Input 
                onChange={event => { }}
              />
            )}
          </FormItem>
          <FormItem
            label="选择状态"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('data.login_limit', {
              initialValue: value,
            })(
              <TreeSelect {...tProps} />
            )}
          </FormItem>
          <FormItem
            label="状态"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('data.status', {
              initialValue: '启用',
              rules: [
                {
                  rules: [{ required: true, message: 'Please select your gender!' }],
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                onChange={value => {
                  
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
