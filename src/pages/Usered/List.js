import React, { Component, Fragment } from 'react';
import { Button, Input, Row, Col } from 'antd';
import StandardTable from '../../components/StandardTable'; // 分页显示
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';
import { isNull } from 'util';

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

const HEADPICURL =
  'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1555412492&di=d5d5a04572ede36ae3448f86a163e19e&src=http://img.zcool.cn/community/01786557e4a6fa0000018c1bf080ca.png@1280w_1l_2o_100sh.png';

class User extends Component {
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
      render: text => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            whiteSpace:'pre-wrap',
            width: '80px',
          }}
          href="javascript:;"
        >
          {text}
        </span>
      ),
    },
    {
      title: '用户ID',
      dataIndex: 'uid',
      align: 'center',
    },
    {
      title: '用户名',
      align: 'center',
      render: text => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            width: '80px',
          }}
        >
          {text.username}
        </span>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'realname',
      align: 'center',
      render: text => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            width: '80px',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '头像',
      align: 'center',
      render: (text, record) => (
        <img style={{ width: '80px', height: '80px', borderRadius: '50%' }} src={text.avatar_url} />
      ),
    },
    {
      title: '手机号',
      dataIndex: 'tel_mobile',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'login_limit',
      align: 'center',
    },
    {
      title: '默认邮箱',
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
          {text.email}
        </span>
      ),
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
    window.location.hash = '/usered/edit/' + id.uid;
  };

  getUserList = value => {
    const params = {
      search: value,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    };
    this.updateData(params);
  };

  updateData(params) {
    this.setState({
      loading: true
    });
    axios({
      url: ROOT_PATH + '/api/backend/v1/users',
      method: 'GET',
      params: params,
    }).then(result => {
      if (result.data.error === 0) {
        this.setState({
          loading: false
        });
        result.data.list.map((item, index) => {
          if (item.avatar_url === '') {
            item.avatar_url = HEADPICURL;
          } else {
            item.avatar_url = item.avatar_url;
          }
          if (item.login_limit === '') {
            item.login_limit = '--';
          }
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
          if (item.update_time === '') {
            item.update_time = '--';
          } else {
            item.update_time = item.update_time;
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
  }

  componentDidMount() {
    this.getUserList();
  }

  onsearchVal = value => {
    this.getUserList(value);
    this.setState({
      searchval: value,
    });
  };

  adminAdd = () => {
    window.location.hash = '/usered/add';
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
    const {
      loading,
      adminList,
      selectedRows,
      pagination,
    } = this.state;
    return (
      <Fragment>
        <Row style={{ paddingBottom: '10px' }}>
          <Col span={8}>
            <Search
              placeholder="请输入搜索的用户名、昵称、手机号、邮箱、客户号、身份证号、税号"
              onSearch={value => {
                let str = value.replace(/\s+/g, '');
                this.onsearchVal(str);
              }}
              enterButton
            />
          </Col>
          <Col span={8} offset={8}>
            <Button icon="plus" type="primary" onClick={() => this.adminAdd(true)}>
              新增用户
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

export default User;
