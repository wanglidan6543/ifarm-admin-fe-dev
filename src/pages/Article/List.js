import React, { Component, Fragment } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Card, Button, Modal, Divider, message } from 'antd';
import StandardTable from '../../components/StandardTable'; // 分页显示
import { ROOT_PATH } from '../pathrouter';

import './List.less';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  window.location.hash = '/user/login';
}

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const confirm = Modal.confirm;

class ArticleList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      expandForm: true,
      LookVisible: false,
      selectedRows: [],
      formValues: {},
      stepFormValues: {},
      isShow: false,
      titleConent: '',
      loading: true,
      data: {}
    };
  }
  
  columns = [
    {
      title: 'ID',
      dataIndex: 'article_id',
      align: 'center',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '标题',
      dataIndex: 'title',
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
            {text}
          </span>
        </Fragment>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category_name',
      align: 'center',
    },
    {
      title: '阅读量',
      dataIndex: 'read_count',
      sorter: true,
      needTotal: true,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status_name',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'update_time',
      sorter: true,
      align: 'center',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作人',
      dataIndex: 'operation_user',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          {record.status == 0 ? (
            <a data-id={record.article_id} onClick={() => this.postEdit(record)}>
              编辑
            </a>
          ) : (
            <span>编辑</span>
          )}
          <Divider type="vertical" />
          {record.status == 0 ? (
            <a data-id={record.article_id} onClick={() => this.postPublish(record)}>
              发布
            </a>
          ) : (
            <span>发布</span>
          )}
          <Divider type="vertical" />
          {record.status == 1 ? (
            <a data-id={record.article_id} onClick={() => this.postReback(record)}>
              撤回
            </a>
          ) : (
            <span>撤回</span>
          )}
          <Divider type="vertical" />

          {record.status == 0 ? (
            <a data-id={record.article_id} onClick={() => this.postDelete(record)}>
              删除
            </a>
          ) : (
            <span>删除</span>
          )}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.getArticlesData();
  }

  getArticlesData(params) {
    this.setState({
      loading: true
    });
    axios.get(
      ROOT_PATH + `/api/backend/v1/articles?${JSON.stringify(params)}`,
      {
        headers: { Authorization: window.localStorage.getItem('jwt_token')  }
      }
    )
    .then(res => {
      this.setState({
        data: res.data,
        loading: false
      })
    });
  }

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
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.getArticlesData(params);
  };

  // 通过id进行跳转
  previewItem = id => {
    window.location.hash = '/article/edit/' + id;
  };

  // 选择
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 新建
  handleEdit = e => {
    window.location.hash = '/article/add';
  };

  postEdit = e => {
    let id = e.article_id;
    window.location.hash = '/article/edit/' + id;
  };

  postReback = e => {
    // return;
    confirm({
      title: '确认撤回？',
      content: '',
      onOk() {
        axios(
          {
            url: ROOT_PATH + '/api/backend/v1/article/withdraw',
            method: 'post',
            params: {},
            data: { article_id: e.article_id },
          },
          {}
        ).then(result => {
          if (result.data.error == 0) {
            message.success('操作成功');
            window.location.hash = '/article';
            window.location.reload();
          } else {
            message.error(result.data.msg);
          }
        });

        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  postPublish = e => {
    // return;
    confirm({
      title: '确认发布',
      content: '',
      onOk() {
        axios(
          {
            url: ROOT_PATH + '/api/backend/v1/article/release',
            method: 'post',
            params: {},
            data: { article_id: e.article_id },
          },
          {}
        ).then(result => {
          if (result.data.error == 0) {
            message.success('操作成功');
            window.location.hash = '/article';
            window.location.reload();
          } else {
            message.error(result.data.msg);
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  postDelete = e => {
    // return;
    confirm({
      title: '确认删除？',
      content: '',
      onOk() {
        axios(
          {
            url: ROOT_PATH + '/api/backend/v1/article',
            method: 'delete',
            params: {},
            data: { article_id: e.article_id },
          },
          {}
        ).then(result => {
          if (result.data.error == 0) {
            message.success('操作成功');
            window.location.hash = '/article';
            window.location.reload();
          } else {
            message.error(result.data.msg);
          }
        });
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  render() {
    const { selectedRows, data } = this.state;
    return (
      <Fragment>
        <Card bordered={false}>
          <div className="table-list">
            <div className="table-list-operator">
              <Button icon="plus" type="primary" onClick={() => this.handleEdit()}>
                文章发布
              </Button>
            </div>
            {/* 阅读量，分页 */}
            <StandardTable
              selectedRows={selectedRows}
              loading={this.state.loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default ArticleList;
