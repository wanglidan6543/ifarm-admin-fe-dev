import React, { Component, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Row, Col, Select } from 'antd';

import StandardTable from '../../components/StandardTable'; // 分页显示
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';
import { Link } from 'react-router-dom';
const Search = Input.Search;

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  window.location.hash = '/user/login';
}

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const Option = Select.Option;

class Threshold extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminList: [],
      selectedRows: [],
      searchVal: '',
      current: 1,
      currentPage: 1,
      pageSize: 10,
      datalisted: [],
      station: [],
      desabled: [],
      indexList:[],
      formValues: {},
      searchval: '',
      index_id: '', // 用户身份
      loading: true,
      pagination: {
        total: 0, // 总数量
        enable_total: 0, // 启用数量
        prohibit_total: 0, // 禁用数量
      },
    };
  }
  columns = [
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center',
      render: text => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            whiteSpace: 'pre-wrap',
            width: '80px',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '农场名称',
      dataIndex: 'farm_name',
      align: 'center',
      render: text => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            whiteSpace: 'pre-wrap',
            width: '100px',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '农场代码',
      dataIndex: 'farm_code',
      align: 'center',
      render: text => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            width: '100px',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '指标项目',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              width: '100px',
            }}
          >
            {text.index_name}
          </span>
        </Fragment>
      ),
    },
    {
      title: '预警类型',
      dataIndex: 'benchmark_type',
      align: 'center',
    },
    {
      title: '标准值',
      align: 'center',
      render: (text, record) => <span>{text.benchmark_standard}%</span>,
    },
    {
      title: '预警阈值',
      align: 'center',
      render: (text, record) => <span>{text.benchmark_warning}%</span>,
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Link
          to={{
            state: record.parent_farm_code,
            pathname: '/threshold/edit/' + record.farm_code + '/' + record.parent_farm_code,
          }}
        >
          {' '}
          编辑{' '}
        </Link>
      ),
    },
  ];

  // 列表
  getDataList = (value, id) => {
    const params = {
      search: value,
      index_id: id,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    };

    this.updateData(params);
  
    axios({
      url: ROOT_PATH + '/api/backend/v1/farm_indexs',
      method: 'GET',
    }).then(result => {
      this.setState({
        indexList:result.data.data
      })
    })
  };

  updateData(params) {
    this.setState({
      loading: true
    });
    axios({
      url: ROOT_PATH + '/api/backend/v1/ifarm_benchmarks',
      method: 'GET',
      params: params,
    }).then(result => {
      if (result.data.error === 0) {
        this.setState({
          loading: false,
        });
        result.data.list.map((item, index) => {
          if (item.username === '') {
            item.username = '--';
          } else {
            item.username = item.username;
          }
          if (item.update_time === '') {
            item.update_time = '--';
          } else {
            item.update_time = item.update_time;
          }
          if (item.tel_mobile === '') {
            item.tel_mobile = '--';
          } else {
            item.tel_mobile = item.tel_mobile;
          }
          if (item.farm_name === '') {
            item.farm_name = '--';
          } else {
            item.farm_name = item.farm_name;
          }
          if (item.farm_code === '') {
            item.farm_code = '--';
          } else {
            item.farm_code = item.farm_code;
          }
        });
      }
      this.setState({
        adminList: result.data,
        datalisted: result.data.list,
        pagination: result.data.pagination,
      });
    });
  }

  componentDidMount() {
    this.getDataList();
  }

  // input搜索
  onsearchVal = value => {
    this.setState({
      searchval: value,
    });

    this.getDataList(value, this.state.index_id);
  };

  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      search: this.state.searchval,
      index_id: this.state.index_id,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    // 
    this.updateData(params);
  };

  // 指标项目
  seletval = value => {
    this.setState({
      index_id: value,
    });
    this.getDataList(this.state.searchval, value);
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const {
      loading,
      adminList,
      selectedRows,
      pagination,
      indexList
    } = this.state;

    return (
      <Fragment>
        <Row style={{ paddingBottom: '10px' }}>
          <Col span={3} style={{ marginRight: '25px' }}>
            <Select
              defaultValue="请选择指标项目"
              style={{ width: '160px' }}
              onChange={value => {
                this.seletval(value);
              }}
            >
              <Option value="">全部</Option>
              {indexList.map((value, index) => {
                return (
                  <Option key={index} value={value.index_id}>
                    {value.index_name}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={8}>
            <Search
              placeholder="请输入搜索的农场名称、农场代码"
              style={{ marginLeft: '30px' }}
              onSearch={value => {
                let str = value.replace(/\s+/g, '');
                this.onsearchVal(str);
              }}
              enterButton
            />
          </Col>
        </Row>
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={adminList}
          columns={this.columns}
          style={{ background: '#fff' }}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
        <p>共有{pagination.total}个记录</p>
      </Fragment>
    );
  }
}

export default Threshold;
