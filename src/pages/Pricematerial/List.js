import React, { Component, Fragment } from 'react';
import {
  Button,
  Input,
  message,
  Row,
  Col,
  Form,
  DatePicker,
  Select,
} from 'antd';
import { Link } from 'react-router-dom';
import './List.css';
import StandardTable from '../../components/StandardTable'; // 分页显示
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';
const { RangePicker} = DatePicker;

const FormItem = Form.Item;
const Option = Select.Option;

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  window.location.hash = '/user/login';
}

class PriceMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminList: [],
      selectedRows: [],
      list:[],
      searchVal: '',
      station: [],
      desabled: [],
      formValues: {},
      stepFormValues: {},
      loading: true,
      searchval: '',
      current:1,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      data: {
        current_page: 1,
        page_size: 10,
        order_time_start: '', // 订单开始时间
        order_time_stop: '', // 订单结束时间
        take_delivery_time_start: '', // 提货开始时间
        take_delivery_time_stop: '', // 提货结束时间
        order_way: 0, // 下单方式(0:默认返回所有，1:客户下单，2:行销员代下单)
        payment_mode: 0, // 付款方式 (0:默认返回所有，1:在线支付， 2:到厂支付)
        order_status: 0, // 订单状态(1表示待付款，2表示待备货，3表示待提货， 4表示提货中， 5表示待收货，6表示已完成， 7表示已取消，0表示默认返回所有）
        company: '', // 公司名称或公司代码
        user: '', // 用户名称或用户代码
        order_id: '', // 订单号
        sort_method: '', // 排序方法，0 ：按订单时间来排序
      },
    };
  }

  columns = [
    {
      title: '创建时间',
      dataIndex: 'create_time',
      align: 'center',
      size: 'small',
      render: text => <span href="javascript:;">{text}</span>,
    },
    {
      title: '订单编码',
      dataIndex: 'order_id',
      align: 'center',
      size: 'small',
    },
    {
      title: '公司名称',
      align: 'center',
      size: 'small',
      render: text => <span>{text.company_name}</span>,
    },
    {
      title: '客户名称',
      dataIndex: 'user_name',
      align: 'center',
      size: 'small',
    },
    {
      title: '客户代码',
      dataIndex: 'user_code',
      align: 'center',
      size: 'small',
    },
    {
      title: '客户手机号',
      dataIndex: 'user_mobile',
      align: 'center',
      size: 'small',
    },
    {
      title: '下单方式',
      dataIndex: 'order_way',
      align: 'center',
      size: 'small',
    },
    {
      title: '付款方式',
      dataIndex: 'pay_way',
      align: 'center',
      size: 'small',
    },
    {
      title: '提货日期',
      dataIndex: 'delivery_date',
      align: 'center',
      size: 'small',
    },
    {
      title: '订单实收金额/元',
      dataIndex: 'total_price',
      align: 'center',
      size: 'small',
    },
    {
      title: '订单状态',
      dataIndex: 'order_status',
      align: 'center',
      size: 'small',
    },
    {
      title: '状态更新时间',
      dataIndex: 'update_status',
      align: 'center',
      size: 'small',
    },
    {
      title: '操作',
      align: 'center',
      size: 'small',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Link
          to={{
            orderId: record.order_id,
            Id: record.uid,
            pathname: '/pricematerial/edit/' + record.uid + '/' + record.order_id,
          }}
        >
          订单详情
        </Link>
      ),
    },
  ];
  // 需改动
  getOrderList = () => {
    axios({
      url: ROOT_PATH + '/api/backend/v1/order_list',
      method: 'GET',
      params: this.state.data
    }).then(result => {
      if (result.data.error === 0) {
        result.data.data.list.map(item => {
          if (item.order_way === '1') {
            item.order_way = '客户下单';
          }
          if (item.order_way === '2') {
            item.order_way = '行销员代下单';
          }
          if (item.pay_way === '1') {
            item.pay_way = '在线支付';
          }
          if (item.pay_way === '2') {
            item.pay_way = '到厂支付';
          }
          switch (item.order_status) {
            case '1':
              item.order_status = '待付款';
              break;
            case '2':
              item.order_status = '待备货';
              break;
            case '3':
              item.order_status = '待提货';
              break;
            case '4':
              item.order_status = '提货中';
              break;
            case '5':
              item.order_status = '待收货';
              break;
            case '6':
              item.order_status = '已完成';
              break;
            case '7':
              item.order_status = '已取消';
              break;
            case '0':
              item.order_status = '待付款、待备货、待提货、提货中、待收货、已完成、已取消';
              break;
          }
        });
        this.setState({
          adminList: result.data.data,
          list:result.data.data.list,
          loading:false
        });
      } else {
        this.setState({
          adminList: [],
          pagination:this.state.pagination,
          loading:true
        });
      }
    });
  };

  componentDidMount() {
    this.getOrderList();
  }

  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { data } = this.state;
    const { form } = this.props;

    let params = {};
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    data.current_page = pagination.current;
    data.page_size = pagination.pageSize;
    form.validateFields((err, fieldsValue) => {
      let { data } = this.state;
      let values = {
        ...fieldsValue,
      };
      if (
        fieldsValue['order_time'] &&
        fieldsValue['order_time'].length > 0 &&
        fieldsValue['take_delivery_time'] &&
        fieldsValue['take_delivery_time'].length > 0
      ) {
        fieldsValue['order_time_start'] = fieldsValue['order_time'][0].format('YYYY-MM-DD H:MM:SS');
        fieldsValue['order_time_stop'] = fieldsValue['order_time'][1].format('YYYY-MM-DD H:MM:SS');
        fieldsValue['take_delivery_time_start'] = fieldsValue['take_delivery_time'][0].format(
          'YYYY-MM-DD ' + '00:00:00'
        );
        fieldsValue['take_delivery_time_stop'] = fieldsValue['take_delivery_time'][1].format(
          'YYYY-MM-DD ' + '23:59:59'
        );
      } else {
        if (fieldsValue['order_time'] && fieldsValue['order_time'].length > 0) {
          fieldsValue['order_time_start'] = fieldsValue['order_time'][0].format(
            'YYYY-MM-DD ' + '00:00:00'
          );
          fieldsValue['order_time_stop'] = fieldsValue['order_time'][1].format(
            'YYYY-MM-DD ' + '23:59:59'
          );
        } else {
          fieldsValue['order_time_start'] = '';
          fieldsValue['order_time_stop'] = '';
          fieldsValue['order_time'] = '';
        }
        if (fieldsValue['take_delivery_time'] && fieldsValue['take_delivery_time'].length > 0) {
          fieldsValue['take_delivery_time_start'] = fieldsValue['take_delivery_time'][0].format(
            'YYYY-MM-DD ' + '00:00:00'
          );
          fieldsValue['take_delivery_time_stop'] = fieldsValue['take_delivery_time'][1].format(
            'YYYY-MM-DD ' + '23:59:59'
          );
        } else {
          fieldsValue['take_delivery_time_start'] = '';
          fieldsValue['take_delivery_time_stop'] = '';
          fieldsValue['take_delivery_time'] = '';
        }
      }
      axios({
        url: ROOT_PATH + '/api/backend/v1/order_list',
        method: 'GET',
        params: {
          current_page: data.current_page,
          page_size: data.page_size,
          order_time_start: fieldsValue['order_time_start'], // 订单开始时间  values['order_time_start']
          order_time_stop: fieldsValue['order_time_stop'], // 订单结束时间  values['order_time_stop']  takdelivValue
          take_delivery_time_start: fieldsValue['take_delivery_time_start'], // 提货开始时间  values['take_delivery_time_start']
          take_delivery_time_stop: fieldsValue['take_delivery_time_stop'], // 提货结束时间  values['take_delivery_time_stop']
          order_way: fieldsValue.order_way, // 下单方式(0:默认返回所有，1:客户下单，2:行销员代下单)
          payment_mode: fieldsValue.payment_mode, // 付款方式 (0:默认返回所有，1:在线支付， 2:到厂支付)
          order_status: fieldsValue.order_status, // 订单状态(1表示待付款，2表示待备货，3表示待提货， 4表示提货中， 5表示待收货，6表示已完成， 7表示已取消，0表示默认返回所有）
          company: fieldsValue.company, // 公司名称或公司代码
          user: fieldsValue.user, // 用户名称或用户代码
          order_id: fieldsValue.order_id,
        },
      }).then(result => {
        if (result.data.error === 0) {
          result.data.data.list.map(item => {
            if (item.order_way === '1') {
              item.order_way = '客户下单';
            }
            if (item.order_way === '2') {
              item.order_way = '行销员代下单';
            }
            if (item.pay_way === '1') {
              item.pay_way = '在线支付';
            }
            if (item.pay_way === '2') {
              item.pay_way = '到厂支付';
            }
            switch (item.order_status) {
              case '1':
                item.order_status = '待付款';
                break;
              case '2':
                item.order_status = '待备货';
                break;
              case '3':
                item.order_status = '待提货';
                break;
              case '4':
                item.order_status = '提货中';
                break;
              case '5':
                item.order_status = '待收货';
                break;
              case '6':
                item.order_status = '已完成';
                break;
              case '7':
                item.order_status = '已取消';
                break;
              case '0':
                item.order_status = '待付款、待备货、待提货、提货中、待收货、已完成、已取消';
                break;
            }
          });
          this.setState({
            adminList: result.data.data,
            loading: false,
          });
        } else {
          this.setState({
            adminList: [],
            pagination: this.state.pagination,
            loading: false,
          });
        }
      });
    });
    this.setState({
      data:{...data}
    })
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  forMat = time => {
    var date = new Date(time);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  };

  resqust = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      let { data } = this.state;
      let values = {
        ...fieldsValue,
      };
      if (
        fieldsValue['order_time'] &&
        fieldsValue['order_time'].length > 0 &&
        fieldsValue['take_delivery_time'] &&
        fieldsValue['take_delivery_time'].length > 0
      ) {
        fieldsValue['order_time_start'] = fieldsValue['order_time'][0].format(
          'YYYY-MM-DD ' + '00:00:00'
        );
        fieldsValue['order_time_stop'] = fieldsValue['order_time'][1].format(
          'YYYY-MM-DD ' + '23:59:59'
        );
        fieldsValue['take_delivery_time_start'] = fieldsValue['take_delivery_time'][0].format(
          'YYYY-MM-DD ' + '00:00:00'
        );
        fieldsValue['take_delivery_time_stop'] = fieldsValue['take_delivery_time'][1].format(
          'YYYY-MM-DD ' + '23:59:59'
        );
      } else {
        if (fieldsValue['order_time'] && fieldsValue['order_time'].length > 0) {
          fieldsValue['order_time_start'] = fieldsValue['order_time'][0].format(
            'YYYY-MM-DD ' + '00:00:00'
          );
          fieldsValue['order_time_stop'] = fieldsValue['order_time'][1].format(
            'YYYY-MM-DD ' + '23:59:59'
          );
        } else {
          fieldsValue['order_time_start'] = '';
          fieldsValue['order_time_stop'] = '';
          fieldsValue['order_time'] = '';
        }
        if (fieldsValue['take_delivery_time'] && fieldsValue['take_delivery_time'].length > 0) {
          fieldsValue['take_delivery_time_start'] = fieldsValue['take_delivery_time'][0].format(
            'YYYY-MM-DD ' + '00:00:00'
          );
          fieldsValue['take_delivery_time_stop'] = fieldsValue['take_delivery_time'][1].format(
            'YYYY-MM-DD ' + '23:59:59'
          );
        } else {
          fieldsValue['take_delivery_time_start'] = '';
          fieldsValue['take_delivery_time_stop'] = '';
          fieldsValue['take_delivery_time'] = '';
        }
      }
      if (values.order_id) {
        axios({
          url: ROOT_PATH + '/api/backend/v1/order_list',
          method: 'GET',
          params: {
            current_page: 1,
            page_size: data.page_size,
            order_time_start: fieldsValue['order_time_start'], // 订单开始时间  values['order_time_start']
            order_time_stop: fieldsValue['order_time_stop'], // 订单结束时间  values['order_time_stop']  takdelivValue
            take_delivery_time_start: fieldsValue['take_delivery_time_start'], // 提货开始时间  values['take_delivery_time_start']
            take_delivery_time_stop: fieldsValue['take_delivery_time_stop'], // 提货结束时间  values['take_delivery_time_stop']
            order_way: fieldsValue.order_way, // 下单方式(0:默认返回所有，1:客户下单，2:行销员代下单)
            payment_mode: fieldsValue.payment_mode, // 付款方式 (0:默认返回所有，1:在线支付， 2:到厂支付)
            order_status: fieldsValue.order_status, // 订单状态(1表示待付款，2表示待备货，3表示待提货， 4表示提货中， 5表示待收货，6表示已完成， 7表示已取消，0表示默认返回所有）
            company: fieldsValue.company, // 公司名称或公司代码
            user: fieldsValue.user, // 用户名称或用户代码
            order_id: fieldsValue.order_id,
          },
        }).then(result => {
          if (result.data.error === 0) {
            result.data.data.list.map(item => {
              if (item.order_way === '1') {
                item.order_way = '客户下单';
              }
              if (item.order_way === '2') {
                item.order_way = '行销员代下单';
              }
              if (item.pay_way === '1') {
                item.pay_way = '在线支付';
              }
              if (item.pay_way === '2') {
                item.pay_way = '到厂支付';
              }
              switch (item.order_status) {
                case '1':
                  item.order_status = '待付款';
                  break;
                case '2':
                  item.order_status = '待备货';
                  break;
                case '3':
                  item.order_status = '待提货';
                  break;
                case '4':
                  item.order_status = '提货中';
                  break;
                case '5':
                  item.order_status = '待收货';
                  break;
                case '6':
                  item.order_status = '已完成';
                  break;
                case '7':
                  item.order_status = '已取消';
                  break;
              }
            });
            this.setState({
              adminList: result.data.data,
              pagination: result.data.data.pagination,
              loading: false,
            });
          } else {
            this.setState({
              adminList: [],
              pagination: this.state.pagination,
              loading: false,
            });
          }
        });
        return;
      }
      if (!fieldsValue['order_time'] && !fieldsValue['take_delivery_time']) {
        this.setState({
          loading: false,
        });
      }
      if (!fieldsValue['order_time'] && !fieldsValue['take_delivery_time']) {
        message.info('请选择订单时间或提货时间');
        return;
      }
      if (values.order_way === '' || typeof values.order_way == 'undefined') {
        message.info('请输入下单方式');
        return;
      }
      if (values.payment_mode === '' || typeof values.payment_mode == 'undefined') {
        message.info('请输入支付方式');
        return;
      }
      if (values.order_status === '' || typeof values.order_status == 'undefined') {
        message.info('请输入订单方式');
        return;
      }
      axios({
        url: ROOT_PATH + '/api/backend/v1/order_list',
        method: 'GET',
        params: {
          current_page: 1,
          page_size: data.page_size,
          order_time_start: fieldsValue['order_time_start'], // 订单开始时间  values['order_time_start']
          order_time_stop: fieldsValue['order_time_stop'], // 订单结束时间  values['order_time_stop']  takdelivValue
          take_delivery_time_start: fieldsValue['take_delivery_time_start'], // 提货开始时间  values['take_delivery_time_start']
          take_delivery_time_stop: fieldsValue['take_delivery_time_stop'], // 提货结束时间  values['take_delivery_time_stop']
          order_way: fieldsValue.order_way, // 下单方式(0:默认返回所有，1:客户下单，2:行销员代下单)
          payment_mode: fieldsValue.payment_mode, // 付款方式 (0:默认返回所有，1:在线支付， 2:到厂支付)
          order_status: fieldsValue.order_status, // 订单状态(1表示待付款，2表示待备货，3表示待提货， 4表示提货中， 5表示待收货，6表示已完成， 7表示已取消，0表示默认返回所有）
          company: fieldsValue.company, // 公司名称或公司代码
          user: fieldsValue.user, // 用户名称或用户代码
          order_id: fieldsValue.order_id,
        },
      }).then(result => {
        if (result.data.error === 0) {
          result.data.data.list.map(item => {
            if (item.order_way === '1') {
              item.order_way = '客户下单';
            }
            if (item.order_way === '2') {
              item.order_way = '行销员代下单';
            }
            if (item.pay_way === '1') {
              item.pay_way = '在线支付';
            }
            if (item.pay_way === '2') {
              item.pay_way = '到厂支付';
            }
            switch (item.order_status) {
              case '1':
                item.order_status = '待付款';
                break;
              case '2':
                item.order_status = '待备货';
                break;
              case '3':
                item.order_status = '待提货';
                break;
              case '4':
                item.order_status = '提货中';
                break;
              case '5':
                item.order_status = '待收货';
                break;
              case '6':
                item.order_status = '已完成';
                break;
              case '7':
                item.order_status = '已取消';
                break;
              case '0':
                item.order_status = '待付款、待备货、待提货、提货中、待收货、已完成、已取消';
                break;
            }
          });
          this.setState({
            adminList: result.data.data,
            loading: false,
          });
        } else {
          this.setState({
            adminList: [],
            pagination: this.state.pagination,
            loading: false,
          });
        }
      });
    });
  };

  // 点击查询
  handleSearch = e => {
    e.preventDefault();
    let { data } = this.state; 
    data.current_page = 1;
    this.setState({
      loading: true
    })
    this.resqust();
  };

  render() {
    const { data, adminList, selectedRows, loading } = this.state;
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Fragment>
        <Form
          style={{ background: '#fff', padding: '20px' }}
          onSubmit={this.handleSearch}
          layout="inline"
        >
          <Row>
            <Col md={8} sm={24}>
              <Form.Item label="订单时间" className='formselet'>
                {getFieldDecorator('order_time')(<RangePicker format="YYYY-MM-DD HH:mm:ss" />)}
              </Form.Item>
            </Col>
            <Col md={8} sm={24}>
              <Form.Item label="提货时间" className='formselet'>
                {getFieldDecorator('take_delivery_time')(<RangePicker format="YYYY-MM-DD HH:mm:ss" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={8} sm={24}>
              <FormItem label="下单方式" className='formselet'>
                {getFieldDecorator('order_way', {
                  initialValue: '0',
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="1">客户下单</Option>
                    <Option value="2">行销员代下单</Option>
                    <Option value="0">全部下单方式</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="支付方式" className='formselet'>
                {getFieldDecorator('payment_mode', {
                  initialValue: '0',
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="1">在线支付</Option>
                    <Option value="2">到场支付</Option>
                    <Option value="0">全部支付方式</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="订单状态" className='formselet'>
                {getFieldDecorator('order_status', {
                  initialValue: '0',
                })(
                  <Select
                    showSearch
                    placeholder="全部订单状态"
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="1">待付款</Option>
                    <Option value="2">待备货</Option>
                    <Option value="3">待提货</Option>
                    <Option value="4">提货中</Option>
                    <Option value="5">待收货</Option>
                    <Option value="6">已完成</Option>
                    <Option value="7">已取消</Option>
                    <Option value="0">全部订单状态</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={8} sm={24}>
              <FormItem className='inpform'>
                {getFieldDecorator('company')(
                  <Input
                    placeholder="公司名称或ID"
                    onSearch={value => {
                      let str = value.replace(/\s+/g, '');
                      data.company = str;
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem className='inpform'>
                {getFieldDecorator('user')(
                  <Input
                    placeholder="客户名称或ID"
                    onSearch={value => {
                      let str = value.replace(/\s+/g, '');
                      data.user = str;
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem className='inpform'>
                {getFieldDecorator('order_id')(
                  <Input
                    placeholder="订单号"
                    onSearch={value => {
                      let str = value.replace(/\s+/g, '');
                      data.order_id = str;
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ marginBottom: 24 }}>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                查询
              </Button>
            </div>
          </div>
        </Form>
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={adminList}
          scroll={{ x: 1600 }}
          columns={this.columns}
          style={{ background: '#fff' }}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
      </Fragment>
    );
  }
}

PriceMaterial = Form.create()(PriceMaterial);

export default PriceMaterial;
