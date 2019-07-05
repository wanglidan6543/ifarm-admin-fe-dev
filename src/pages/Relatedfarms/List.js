import React, { Component, Fragment } from 'react';
import { Input, Row, Col, Select } from 'antd';

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

const Option = Select.Option;

class RelatedFarms extends Component {
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
      userList: [],
      formValues: {},
      loading: true,
      searchval: '',
      role_id: '', // 用户身份
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
      render: (text, record) => (
        <Fragment>
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              width: '200px',
            }}
          >
            {text.username}
          </span>
        </Fragment>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'tel_mobile',
      align: 'center',
    },
    {
      title: '关联农场名称',
      dataIndex: 'farm_name',
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
      render: (text, record) => <span>{text.status === 0 ? '启用' : '禁用'}</span>,
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => <a onClick={() => this.editID(record)}> 编辑 </a>,
    },
  ];
  
  editID = id => {
    window.location.hash = '/relatedfarms/edit/' + id.uid;
  };

  // 列表
  getDataList = (value, id) => {
    const params =  {
      search: value,
      role_id: id,
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
      url: ROOT_PATH + '/api/backend/v1/user_farms',
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
        this.setState({
          adminList: result.data,
          datalisted: result.data.list,
          pagination: result.data.pagination,
          loading: false,
        });
      }
    });
  }

  componentDidMount() {
    this.getDataList();
    axios({
      url: ROOT_PATH + '/api/backend/v1/user/roles',
      method: 'GET',
    }).then(result => {
      this.setState({
        userList: result.data.data,
      });
    });
  }

  // input搜索
  onsearchVal = value => {
    this.setState({
      searchval: value,
    });
    this.getDataList(value, this.state.role_id);
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
      role_id: this.state.role_id,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.updateData(params);
  };

  // 用户
  seletval = value => {
    this.setState({
      role_id: value,
    });
    this.getDataList(this.state.searchval, value);
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const { loading, adminList, selectedRows, pagination, userList } = this.state;
    return (
      <Fragment>
        <Row style={{ paddingBottom: '10px' }}>
          <Col span={3} style={{ marginRight: '25px' }}>
            <Select
              style={{ width: '100%' }}
              defaultValue="请选择用户身份"
              onChange={value => {
                this.setState({
                  role_id: value,
                });
                this.seletval(value);
              }}
            >
              {userList.map((val, ind) => {
                return (
                  <Option key={ind} value={val.role_id}>
                    {val.name}
                  </Option>
                );
              })}
              <Option value='""'>全部</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Search
              placeholder="请输入搜索的用户名、手机号、关联农场名称、农场代码"
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
        <p>共有{pagination.total}个项目</p>
      </Fragment>
    );
  }
}

export default RelatedFarms;
