import React, { Component, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Row, Col } from 'antd';
import StandardTable from '../../components/StandardTable'; // 分页显示
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';

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

class Admin extends Component {
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
      render: text => <span href="javascript:;">{text}</span>,
    },
    {
      title: 'ID',
      dataIndex: 'uid',
      align: 'center',
    },
    {
      title: '用户名',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              width: '400px',
            }}
          >
            {text.realname}
          </span>
          <Divider type="vertical" />
        </Fragment>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'tel_mobile',
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <span>{text.status === 0 ? '启用' : '禁用'}</span>
        </Fragment>
      ),
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.authOrity(record)}> 权限 </a>
          <Divider type="vertical" />
          <a onClick={() => this.editID(record)}> 编辑 </a>
        </Fragment>
      ),
    },
  ];

  authOrity = id => {
    // location.hash = '/administration/authority/' + id.uid;
  }

  editID = id => {
    window.location.hash = '/administration/edit/' + id.uid;
  };

  // 需改动
  getAdminList = value => {
    const params = {
      search: value,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    }
    this.updateData(params);
  };

  updateData(params) {
    this.setState({
      loading: true,
    })
    axios({
      url: ROOT_PATH + '/api/backend/v1/admin_users',
      method: 'GET',
      params: params
    }).then(result => {
      if (result.data.error === 0) {
        this.setState({
          loading: false,
        });
        this.setState({
          adminList: result.data,
          datalisted: result.data.list,
          pagination: result.data.pagination,
        });
      }
    });
  }

  componentDidMount() {
    this.getAdminList();
  }

  onsearchVal = value => {
    this.getAdminList(value);
    this.setState({
      searchval: value,
    });
  };

  // 新建管理员
  adminAdd = () => {
    window.location.hash = '/administration/add';
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
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.updateData(params);
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const { loading, adminList, selectedRows, pagination } = this.state;
    return (
      <Fragment>
        <Row style={{ paddingBottom: '10px' }}>
          <Col span={8}>
            <Search
              placeholder="请输入搜索的用户名、手机号、邮箱"
              onSearch={value => {
                let str = value.replace(/\s+/g, '');
                this.onsearchVal(str);
              }}
              enterButton
            />
          </Col>
          <Col span={8} offset={8}>
            <Button icon="plus" type="primary" onClick={() => this.adminAdd(true)}>
              新建管理员
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
          共有{pagination.total}个管理员, 启用{pagination.enable_total}个, 冻结
          {pagination.prohibit_total}个
        </p>
      </Fragment>
    );
  }
}

export default Admin;
