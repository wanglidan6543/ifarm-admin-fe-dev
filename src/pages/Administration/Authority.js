import React, { PureComponent, Fragment } from 'react';
import { Form, Table, Button, Input, message, Divider, Row, Col, Select, Card, Icon,Transfer } from 'antd';
import PageHeaderWrapper from '../components/PageHeaderWrapper';
import axios from 'axios';
import styles from './List.less';
import { ROOT_PATH } from '../pathrouter';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  location.hash = '/user/login';
}
const Option = Select.Option;
const FormItem = Form.Item;

@Form.create()
class TableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      mockData: [],
      targetKeys: [],
    };
  }
  componentDidMount() {
    this.getMock();
  }

  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 10; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  };

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };
  
  render() {
    const {
      form: { getFieldDecorator, getFieldValue, isFieldTouched, getFieldError, isShow, password },
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Form onSubmit={this.handleSearch} style={{ marginTop: 8, background: '#fff', padding: '30px 0' }}>
          <input type="password" style={{ position: 'fixed', left: '-9999px' }} />
          {this.props.match.url === '/administration/authority/' + this.props.match.params.id ? (
            <FormItem
              name="number"
              label="ID"
              className={styles.form_input}
              style={{ width: '60%', display: 'flex', alignItems: 'center' }}
            >
              {getFieldDecorator('ID', {
              })(<span>GLY0002</span>)}
            </FormItem>
          ) : (
            ''
          )}
          <FormItem
              name="number"
              label="管理员用户ID"
              className={styles.form_input}
              style={{ width: '60%', display: 'flex', alignItems: 'center' }}
            >
              {getFieldDecorator('UserID', {
              })(<span>GLY0002</span>)}
            </FormItem>
          <FormItem
            name="number"
            label="管理员名称"
            className={styles.form_input}
            style={{ width: '60%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('User', {
            })(<span>王小二</span>)}
          </FormItem>
          
          <Transfer
            dataSource={this.state.mockData}
            listStyle={{
              width: 300,
              height: 300,
              border:'solid 1px #eee',
              marginLeft:'40px'
            }}
            titles={['功能未添加', '功能已添加']}
            operations={['to right', 'to left']}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={item => `${item.title}-${item.description}`}
            footer={this.renderFooter}
          />
          <FormItem
            label="可见业务"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center',margin:'20px 0' ,display:'flex'}}
          >
            {getFieldDecorator('look', {
              // initialValue: identity,
            })(
              <div style={{display:'flex'}}>
                <Select
                style={{ width: '100%' }}
              >
                <Option value='0'>
                  全部市
                </Option>
              </Select>
              <Button type="primary" style={{marginLeft:'10px'}}>添加</Button>
              </div>
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
            <span style={{ width: '10%', textAlign: 'center' }}>已添加</span>
            <div style={{ width: '50%' }}>
              {/* {data.farms.map((item, index) => {
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
                      }}
                      onClick={() => {
                        this.deled(item, index);
                      }}
                    >
                      x
                    </b>
                  </div>
                );
              })} */}
            </div>
          </div>
          <FormItem
            label="可见区域"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center',margin:'20px 0' ,display:'flex'}}
          >
            {getFieldDecorator('look', {
              // initialValue: identity,
            })(
              <div style={{display:'flex'}}>
                <Select
                style={{ width: '100%' }}
              >
                <Option value='0'>
                  全部省
                </Option>
              </Select>
              <Select
                style={{ width: '100%',margin:'0 10px' }}
              >
                <Option value='0'>
                  全部市
                </Option>
              </Select>
              <Select
                style={{ width: '100%' }}
              >
                <Option value='0'>
                  全部区
                </Option>
              </Select>
              <Button type="primary" style={{marginLeft:'10px'}}>添加</Button>
              </div>
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
            <span style={{ width: '10%', textAlign: 'center' }}>已添加</span>
            <div style={{ width: '50%' }}>
              {/* {data.farms.map((item, index) => {
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
                      }}
                      onClick={() => {
                        this.deled(item, index);
                      }}
                    >
                      x
                    </b>
                  </div>
                );
              })} */}
            </div>
          </div>
          <FormItem
            label="状态"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('Gender', {
              // initialValue: data.status === 0 ? '启用' : '禁用',
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
              style={{ width: '20%', height: '50px',marginTop:'20px' }}
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
