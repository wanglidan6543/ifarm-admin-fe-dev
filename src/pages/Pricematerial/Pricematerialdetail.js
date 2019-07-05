import React, { PureComponent, Fragment } from 'react';
import { Table, Row, Col, List } from 'antd';
// import PageHeaderWrapper from '../components/PageHeaderWrapper';
import { ROOT_PATH } from '../pathrouter';
import axios from 'axios';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  window.location.hash = '/user/login';
}

class PriceMaterialDetail extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      value: props.value,
      adminList: [],
      selectedRows: [],
      orserWay: '',
      payMethod: '',
      creatTime: '', // 创建时间
      dateofDelivery: '', // 状态日期
      updateStatustime: '', // 状态更新时间
      totalWeight: 0, // 总重
      data: {
        order_id: '', // 订单编号
        create_time: '', // 创建时间
        order_way: '', // 下单方式(1:客户下单，2:行销员代下单)
        pay_method: '', // 付款方式 (1:在线支付， 2:到厂支付)
        total_money: '', // 订单总金额/元
        local_discount: '', // 订单当场折扣金额/元
        advance_discount: '', // 使用预提折扣金额/元
        payment_advance: '', // 使用预付款金额/元
        company_name: '', // 公司名称
        company_code: '', // 公司代码
        user_name: '', // 客户名称
        user_code: '', // 客户代码
        user_tel: '', // 客户手机号
        date_of_delivery: '', // 取货日期
        status: '', // 订单状态(1表示待付款，2表示待备货，3表示待提货， 4表示提货中， 5表示待收货，6表示已完成， 7表示已取消）
        update_status_time: '', // 状态更新时间
      },
      statu: '',
      thpaymentMmethod:''
    };
  }

  columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '商品简称',
      align: 'center',
      dataIndex: 'short_name',
    },
    {
      title: '商品代码',
      dataIndex: 'goods_code',
      align: 'center',
    },
    {
      title: '包装类型',
      dataIndex: 'package_type',
      align: 'center',
    },
    {
      title: '规格',
      dataIndex: 'size',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'count',
      align: 'center',
    },
    {
      title: '合计重量/KG',
      dataIndex: 'total_weight',
      align: 'center',
    },
  ];

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

  componentDidMount() {
    axios({
      url: ROOT_PATH + '/api/backend/v1/order_details',
      method: 'GET',
      params: {
        order_id: this.props.match.params.orderId, // 订单编号  this.props.location.orderId
        user_id: this.props.match.params.id, // 用户id   this.props.location.Id
      },
    }).then(result => {
      if (result.data.error === 0) {
        let { statu } = this.state;
        if (result.data.data.status === '1') {
          this.setState({
            statu: '待付款',
          });
        } else if (result.data.data.status === '2') {
          this.setState({
            statu: '待备货',
          });
        } else if (result.data.data.status === '3') {
          this.setState({
            statu: '待提货',
          });
        } else if (result.data.data.status === '4') {
          this.setState({
            statu: '提货中',
          });
        } else if (result.data.data.status === '5') {
          this.setState({
            statu: '待收货',
          });
        } else if (result.data.data.status === '6') {
          this.setState({
            statu: '已完成',
          });
        } else if (result.data.data.status === '7') {
          this.setState({
            statu: '已取消',
          });
        }
        
        if(result.data.data.th_payment_method === '06'){
          this.setState({
            thpaymentMmethod:'信e付'
          })
        } else {
          this.setState({
            thpaymentMmethod:''
          })
        }
        if (result.data.data.order_way === '1') {
          this.setState({
            orserWay: '客户下单',
          });
        } else {
          this.setState({
            orserWay: '行销员代下单',
          });
        }
        if (result.data.data.pay_method === '1') {
          this.setState({
            payMethod: '在线支付',
          });
        } else {
          this.setState({
            payMethod: '到厂支付',
          });
        }
        result.data.data.product_info.forEach(item => {
          if (item.package_type === '0') {
            item.package_type = '包装';
          } else {
            item.package_type = '散装';
          }
        });
        this.setState({
          data: result.data.data,
          adminList: result.data.data.product_info,
          totalWeight:result.data.data.aggregate_weight
        });
      }
    });
  }

  render() {
    const {
      data,
      statu,
      orserWay,
      payMethod,
      totalWeight,
      thpaymentMmethod
    } = this.state;
    return (
      <Fragment>
        <List style={{ background: '#fff', padding: '10px' }}>
          <List.Item style={{ color: '#001529', fontWeight: 'bold' }}>订单基础信息</List.Item>
          <Row style={{ margin: '40px 0' }}>
            <Col span={12}>订单编号 : {data.order_id}</Col>
            <Col span={12}>公司名称 : {data.company_name}</Col>
          </Row>
          <Row style={{ margin: '40px 0' }}>
            <Col span={12}>公司代码 : {data.company_code}</Col>
            <Col span={12}>客户名称 : {data.user_name}</Col>
          </Row>
          <Row style={{ margin: '40px 0' }}>
            <Col span={12}>客户代码 : {data.user_code}</Col>
            <Col span={12}>客户手机号 : {data.user_tel}</Col>
          </Row>
          <List.Item style={{ color: '#001529', fontWeight: 'bold' }}>订单状态信息</List.Item>
          <Row style={{ margin: '40px 0' }}>
            <Col span={12}>创建时间 : {this.forMat(Number(data.create_time))}</Col>
            <Col span={12}>提货日期 : {this.forMat(Number(data.date_of_delivery))}</Col>
          </Row>
          <Row style={{ margin: '40px 0' }}>
            <Col span={12}>订单状态 : {statu}</Col>
            <Col span={12}>状态更新时间 : {this.forMat(Number(data.update_status_time))}</Col>
          </Row>
          <List.Item style={{ color: '#001529', fontWeight: 'bold' }}>支付及金融信息</List.Item>
          <Row style={{ margin: '40px 0' }}>
            <Col span={12}>订单实收金额/元 : {data.order_real_money}</Col>
            <Col span={12}>下单方式 : {orserWay}</Col>
          </Row>
          <Row style={{ margin: '40px 0' }}>
            <Col span={12}>订单总金额/元 : {data.total_money}</Col>
            <Col span={12}>付款方式 : {payMethod}</Col>
          </Row>
          <Row style={{ margin: '40px 0' }}>
            <Col span={12}>订单当场折扣金额/元 : {data.local_discount}</Col>
            <Col span={12}>使用预提折扣金额/元 : {data.advance_discount}</Col>
          </Row>
          <Row style={{ margin: '40px 0' }}>
            <Col span={12}>使用预付款余额金额/元 : {data.payment_advance}</Col>
            <Col span={12}>第三方支付方式 : {thpaymentMmethod}</Col>
          </Row>
          <Row style={{ margin: '40px 0' }}>
            <Col span={12}>使用第三方支付金额/元 : {data.th_pay_money}</Col>
          </Row>
        </List>
        <Table
          style={{ background: '#fff' }}
          dataSource={this.state.adminList}
          columns={this.columns}
          pagination={false}
        />
        <p
          style={{
            width: '100%',
            background: '#fff',
            padding: '20px 20px 20px 0',
            textAlign: 'right',
          }}
        >
          总重量 : <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{totalWeight}KG</span>
        </p>
      </Fragment>
    );
  }
}

export default PriceMaterialDetail;
