import React, { Component, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Row, Col } from 'antd';

import isEqual from 'lodash/isEqual';
import styles from './List.less';
import StandardTable from '@/components/StandardTable'; // 分页显示
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';
import { isNull } from 'util';

const Search = Input.Search;
// ???
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
const HEADPICURL =
  'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1555412492&di=d5d5a04572ede36ae3448f86a163e19e&src=http://img.zcool.cn/community/01786557e4a6fa0000018c1bf080ca.png@1280w_1l_2o_100sh.png';
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
      datalisted: [],
      station: [],
      desabled: [],
      formValues: {},
      searchval: '',
      pagination: {
        total: 0, // 总数量
        enable_total: 0, // 启用数量
        prohibit_total: 0, // 禁用数量
      },
    };
  }
  columns = [
    {
      title: '权限名称',
      dataIndex: 'update_timed',
      align: 'center',
      render: text => <span href="javascript:;">{text}</span>,
    },
    {
      title: 'ID',
      dataIndex: 'uid',
      align: 'center',
    },
    {
      title: '状态',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <span>{text.status === 0 ? '启用' : '禁用'}</span>
        </Fragment>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center',
      render: text => <span href="javascript:;">{text}</span>,
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.editID(record)}> 编辑 </a>
        </Fragment>
      ),
    },
  ];
  editID = id => {
    location.hash = '/jurisdiction/edit/' + id.uid;
  };
  // 需改动
  ListShow = value => {
    axios({
      url: ROOT_PATH + '/api/backend/v1/users',
      method: 'GET',
      params: {
        search: value,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
      },
    }).then(result => {
      if (result.data.error === 0) {
        this.setState({
          adminList: result.data,
          datalisted: result.data.list,
          pagination: result.data.pagination,
        });
      } else {
        this.setState({
          adminList: [],
          datalisted: [],
          pagination: this.state.pagination,
        });
      }
    });
  };
  componentDidMount() {
    this.ListShow();
  }
  onsearchVal = value => {
    this.ListShow(value);
    this.setState({
      searchval: value,
    });
  };
  adminAdd = () => {
    location.hash = '/jurisdiction/add';
  };
  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { loading, data, adminList, selectedRows, datalisted, station, desabled } = this.state;
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
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    axios({
      url: ROOT_PATH + '/api/backend/v1/users',
      method: 'GET',
      params: params,
    }).then(result => {
      if (result.data.error === 0) {
        result.data.list.map(item => {
          item.avatar_url === ''
            ? (item.avatar_url = HEADPICURL)
            : (item.avatar_url = item.avatar_url);
          item.update_time === ''
            ? (item.update_time = '--')
            : (item.update_time = item.update_time);
          if (item.realname === '') {
            item.realname = '--';
          } else {
            item.realname = item.realname;
          }
          if (isNull(item.realname)) {
            item.realname = '--';
          } else {
            item.realname = item.realname;
          }
          if (isNull(item.tel_mobile)) {
            item.tel_mobile = '--';
          } else {
            item.tel_mobile = item.tel_mobile;
          }
          if (item.tel_mobile === '') {
            item.tel_mobile = '--';
          } else {
            item.tel_mobile = item.tel_mobile;
          }
          if (isNull(item.email)) {
            item.email = '--';
          } else {
            item.email = item.email;
          }
          if (item.email === '') {
            item.email = '--';
          } else {
            item.email = item.email;
          }
        });
      }
      this.setState({
        adminList: result.data,
        datalisted: result.data.list,
        pagination: result.data.pagination,
      });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const {
      loading,
      data,
      adminList,
      selectedRows,
      datalisted,
      station,
      desabled,
      pagination,
      key,
    } = this.state;
    return (
      <Fragment>
        <Row style={{ paddingBottom: '10px' }}>
          <Col span={8}>
            <Search
              placeholder="请输入将搜索的权限名称"
              onSearch={value => {
                let str = value.replace(/\s+/g, '');
                this.onsearchVal(str);
              }}
              enterButton
            />
          </Col>
          <Col span={8} offset={8}>
            <Button icon="plus" type="primary" onClick={() => this.adminAdd(true)}>
              新增权限
            </Button>
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
        <p>
          共有{pagination.total}个用户管理, 启用{pagination.enable_total}个, 冻结
          {pagination.prohibit_total}个
        </p>
      </Fragment>
    );
  }
}

export default TableForm;
