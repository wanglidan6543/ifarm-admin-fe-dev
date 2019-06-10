import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'react-router';
import axios from 'axios';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  Badge,
  Divider,
  Steps,
  Radio,
  Upload,
  Icon,
  message,
} from 'antd';
import StandardTable from '../components/StandardTable'; // 分页显示
import PageHeaderWrapper from '../components/PageHeaderWrapper';
import E from 'wangeditor';
import Editor from './components/editor';
import 'antd/dist/antd.css';

import './style.less';

import styles from './List.less';
import { ROOT_PATH } from '../pathrouter';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  location.hash = '/user/login';
}

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const confirm = Modal.confirm;
// 组件建
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新建文章"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入至少五个字符的标题！', min: 5, max: 30 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        <Editor />
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="封面">
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          onRemove={true}
          action="//jsonplaceholder.typicode.com/posts/"
          // beforeUpload={beforeUpload}
          // onChange={this.handleChange}
        >
          {/* {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton} */}
        </Upload>
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} key="target" label="分类">
        {form.getFieldDecorator('cate', {
          rules: [{ required: true }],
        })(
          <Select style={{ width: '100%' }} placeholder="请选择">
            <Option value="0">价格走势</Option>
            <Option value="1">地方政策</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="初始阅读量">
        {form.getFieldDecorator('readPv', {
          rules: [{ required: true }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});
var forbidden = 'forbidden';

/* eslint react/no-multi-comp:0 */
@connect(({ article, loading }) => ({
  article,
  loading: loading.models.article,
}))
@Form.create()
class ArticleList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: true,
    LookVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    isShow: false,
    titleConent: '',
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'article_id',
      align: 'center',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '标题',
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
            // onClick={() => this.ModuleLook(record)}
          >
            {text.title}
          </span>
        </Fragment>
      ),
    },
    // {
    //   title: '展区',
    //   dataIndex: 'category_name',
    //   align: 'center',
    // },
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
    // {
    //   title: '展示顺序',
    //   dataIndex: 'category_name',
    //   align: 'center',
    // },
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
          {/* <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a> */}
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
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetch',
    });
  }

  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
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

    dispatch({
      type: 'article/fetch',
      payload: params,
    });
  };
  // 通过id进行跳转
  previewItem = id => {
    router.push(`/article/edit/${id}`);
  };
  // 标题
  ModuleLook = id => {
    this.setState({
      LookVisible: true,
    });
    axios(
      {
        url: `https://gateway-iorder.cpgroupcloud.com/api/iorder/v3/artical/detail?artical_id=${
          id.article_id
        }`,
        method: 'GET',
        params: {},
      },
      {}
    ).then(result => {
      this.setState({
        titleConent: result.data,
      });
    });
  };
  handleOk = e => {
    this.setState({
      LookVisible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      LookVisible: false,
    });
  };
  // 重置 ()
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'article/fetch',
      payload: {},
    });
  };
  // 展开()
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  // 操作时间
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'article/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };
  // 选
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'article/fetch',
        payload: values,
      });
    });
  };
  //
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  // 新建
  handleEdit = e => {
    location.hash = '/article/add';
  };
  // 编辑
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'article/update',
      payload: {
        query: formValues,
        body: {
          name: fields.name,
          desc: fields.desc,
          key: fields.key,
        },
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  postEdit = e => {
    location.hash = '/article/edit/' + e.article_id;
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
          console.log(result);

          if (result.data.error == 0) {
            message.success('操作成功');
            location.hash = '/';
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
          console.log(result);

          if (result.data.error == 0) {
            message.success('操作成功');
            location.hash = '/';
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
          console.log(result);

          if (result.data.error == 0) {
            message.success('操作成功');
            location.hash = '/';
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

  // ReactDOM.render(
  //   <div>
  //     <Button onClick={showConfirm}>
  //       Confirm
  //     </Button>
  //     <Button onClick={showDeleteConfirm} type="dashed">
  //       Delete
  //     </Button>
  //     <Button onClick={showPropsConfirm} type="dashed">
  //       With extra props
  //     </Button>
  //   </div>,
  //   mountNode
  // );

  // renderSimpleForm() {
  //   const {
  //     form: { getFieldDecorator },
  //   } = this.props;
  //   return (
  //     <Form onSubmit={this.handleSearch} layout="inline">
  //       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //         <Col md={8} sm={24}>
  //           <FormItem label="规则名称">
  //             {getFieldDecorator('name')(<Input placeholder="请输入" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="使用状态">
  //             {getFieldDecorator('status')(
  //               <Select placeholder="请选择" style={{ width: '100%' }}>
  //                 <Option value="0">关闭</Option>
  //                 <Option value="1">运行中</Option>
  //               </Select>
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <span className={styles.submitButtons}>
  //             <Button type="primary" htmlType="submit">
  //               查询
  //             </Button>
  //             <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
  //               重置
  //             </Button>
  //             <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
  //               展开 <Icon type="down" />
  //             </a>
  //           </span>
  //         </Col>
  //       </Row>
  //     </Form>
  //   );
  // }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return <Form />;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="分类">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">价格走势</Option>
                  <Option value="1">地方政策</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未发布</Option>
                  <Option value="1">已发布</Option>
                  <Option value="1">已撤回</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a> */}
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      article: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}> */}
              <Button icon="plus" type="primary" onClick={() => this.handleEdit()}>
                文章发布
              </Button>
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )} */}
            </div>
            {/* 阅读量，分页 */}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {/* 新建页面 */}
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        <Modal
          style={{ height: '800px', 'overflow-y': 'auto', width: '40%' }}
          title="Basic Modal"
          visible={this.state.LookVisible}
          onOk={() => {
            this.handleOk();
          }}
          onCancel={() => {
            this.handleCancel();
          }}
        >
          <div
            className={styles.derong}
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
            dangerouslySetInnerHTML={{ __html: `${this.state.titleConent}` }}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ArticleList;
