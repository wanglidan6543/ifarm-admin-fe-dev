import React, { Component, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Row, Col, Select } from 'antd';

import isEqual from 'lodash/isEqual';
import styles from './List.less';
import StandardTable from '../components/StandardTable'; // 分页显示
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';
import { timingSafeEqual } from 'crypto';

const Search = Input.Search;

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  location.hash = '/user/login';
}

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {},
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const Option = Select.Option;

class TableForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminList: [],
      selectedRows: [],
      searchVal: '',
      current: 1,
      currentPage: 1,
      pageSize: 10,
      station: [],
      desabled: [],
      userList: [],
      formValues: {},
      searchval: '',
      category: '',
      lvl: '',
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
      render: text => <span href="javascript:;">{text}</span>,
    },
    {
      title: '用户ID',
      dataIndex: 'uid',
      align: 'center',
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'username',
      render: text => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            width: '200px',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'tel_mobile',
      align: 'center',
    },
    {
      title: '看数据类型',
      align: 'center',
      dataIndex: 'category',
      render: text => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            width: '200px',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '看数据范围',
      dataIndex: 'lvl',
      align: 'center',
      render: text => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            width: '200px',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '状态',
      align: 'center',
      render: text => <span>{text.status}</span>,
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => <a onClick={() => this.editID(record)}> 编辑 </a>,
    },
  ];
  editID = id => {
    location.hash = '/indicatorsthrough/edit/' + id.uid;
  };
  // 列表
  ListShow = (value, category, lvl) => {
    axios({
      url: ROOT_PATH + '/api/backend/v1/user_privs',
      method: 'GET',
      params: {
        search: value,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        lvl: lvl, // 层级，1=大区，2=省，3=公司，4=分公司，5=农场
        category: category, // 类别。1=养殖生产 2=销售
      },
    }).then(result => {
      if (result.data.error === 0) {
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
          if (item.status === 0) {
            item.status = '启用';
          } else if (item.status === 1) {
            item.status = '禁用';
          } else {
            item.status = '--';
          }
          if (item.category === '') {
            item.category = '--';
          } else {
            item.category = item.category;
          }
          if (item.lvl === '') {
            item.lvl = '--';
          } else {
            item.lvl = item.lvl;
          }
        });
      }
      this.setState({
        adminList: result.data,
        pagination: result.data.pagination,
      });
    });
  };
  componentDidMount() {
    this.ListShow();
  }
  // input搜索
  onsearchVal = value => {
    this.setState({
      searchval: value,
    });
    this.ListShow(value, this.state.category, this.state.lvl);
  };
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { loading, data, adminList, selectedRows, station, desabled } = this.state;
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
      lvl: this.state.lvl, // 层级，1=大区，2=省，3=公司，4=分公司，5=农场
      category: this.state.category, // 类别。1=养殖生产 2=销售
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    axios({
      url: ROOT_PATH + '/api/backend/v1/user_privs',
      method: 'GET',
      params: params,
    }).then(result => {
      if (result.data.error === 0) {
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
          if (item.status === 0) {
            item.status = '启用';
          } else if (item.status === 1) {
            item.status = '禁用';
          } else {
            item.status = '--';
          }
          if (item.category === '') {
            item.category = '--';
          } else {
            item.category = item.category;
          }
          if (item.lvl === '') {
            item.lvl = '--';
          } else {
            item.lvl = item.lvl;
          }
        });
      }
      this.setState({
        adminList: result.data,
        pagination: result.data.pagination,
      });
    });
  };
  // 类型
  seletval = value => {
    this.ListShow(this.state.searchval, value, this.state.lvl);
  };
  Ierarchy = value => {
    this.ListShow(this.state.searchval, this.state.lvl, value);
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const { loading, data, adminList, selectedRows, station, desabled, pagination } = this.state;
    return (
      <Fragment>
        <Row style={{ paddingBottom: '10px' }} gutter={12}>
          <Col span={3} style={{ marginRight: '25px' }}>
            <Select
              defaultValue="请选择类型"
              style={{ width: '100%' }}
              onChange={value => {
                this.setState({
                  category: value,
                });
                this.seletval(value);
              }}
            >
              <Option value="1">养殖生产</Option>
              <Option value="2">销售</Option>
              <Option value="">全部</Option>
            </Select>
          </Col>
          <Col span={3} style={{ marginRight: '25px' }}>
            <Select
              defaultValue="请选择范围"
              style={{ width: '100%' }}
              onChange={value => {
                this.setState({
                  lvl: value,
                });
                this.Ierarchy(value);
              }}
            >
              <Option value="1">指定SCV大区</Option>
              <Option value="2">指定省</Option>
              <Option value="3">指定公司</Option>
              <Option value="4">指定分公司/客户</Option>
              <Option value="5">指定农场</Option>
              <Option value="">全部</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Search
              placeholder="请输入搜索的用户名、手机号"
              onSearch={value => {
                let str = value.replace(/\s+/g, '');
                this.setState({
                  searchval: str,
                });
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
        <p>共有{pagination.total}个项目</p>
      </Fragment>
    );
  }
}

export default TableForm;
