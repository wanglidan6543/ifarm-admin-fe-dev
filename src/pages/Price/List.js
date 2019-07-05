import React, { PureComponent, Fragment } from 'react';
import axios from 'axios';
import {
  Row,
  Col,
  Card,
  Form,
  Select,
  Button,
  DatePicker,
  Modal,
  Upload,
  Icon,
  message,
} from 'antd';
import StandardTable from '../../components/StandardTable';
// import PageHeaderWrapper from '../components/PageHeaderWrapper';
import './List.css';

import { ROOT_PATH } from '../pathrouter';

const FormItem = Form.Item;

window.filed = '';
window.msg = '';
window.msged = '';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  window.location.hash = '/user/login';
}

const handleFileChanged = {
  name: 'file',
  action: ROOT_PATH + '/api/backend/v1/price/import_data',
  headers: {
    authorization: jwt_token,
  },
  onChange: e => {
    let fileName = e.file.name.lastIndexOf('.');
    let fileNameLength = e.file.name.length; //取到文件名长度
    let fileFormat = e.file.name.substring(fileName + 1, fileNameLength);
    if (e.file.status == 'done') {
      window.filed = fileFormat;
      window.msg = e.file.response.error;
      window.msged = e.file.response.msg;
      if (e.file.response.error != 0) {
        message.error(e.file.response.msg);
      } else {
        message.success(e.file.response.msg);
      }
    }
  },
};

const CreateForm = Form.create()(props => {
  const { modalVisible, handleModalVisible } = props;
  const okHandle = e => {
    if (window.filed !== 'xls' && window.filed !== 'xlsx') {
      message.error('请导入xls格式');
    }
    if (window.msg != 0) {
      message.error(window.msged);
    } else {
      if (window.msged === window.msged) {
        handleModalVisible(false);
        message.success('导入成功');
      }
    }
  };

  return (
    <Modal
      destroyOnClose
      title="导入生猪每日价格"
      visible={modalVisible}
      onOk={okHandle}
      okText="导入"
      className='daoru'
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="">
        <Upload {...handleFileChanged}>
          <Button>
            <Icon type="upload" /> 选择文件上传
          </Button>
        </Upload>
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
// @connect(({ rule, loading }) => ({
//   rule,
//   loading: loading.models.rule,
// }))

class PriceList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: true,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    districtOptionList: [],
    priceCategoryOptionList: [],
    data: [],
    filed: '',
    currentPage: 1,
    pageSize: 10
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'price_id',
    },
    {
      title: '日期',
      dataIndex: 'day',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '地区',
      dataIndex: 'district_name',
    },
  ];

  componentDidMount() {
    axios(
      {
        url: ROOT_PATH + '/api/backend/v1/price/breeds',
        method: 'get',
        params: {},
      },
      {}
    ).then(result => {
      if (result.data.error == 0) {
        this.setState({
          priceCategoryOptionList: result.data.data.breeds,
        });
      }
    });

    axios(
      {
        url: ROOT_PATH + '/api/backend/v1/districts',
        method: 'get',
        params: {},
      },
      {}
    ).then(result => {
      if (result.data.error == 0) {
        this.setState({
          districtOptionList: result.data.data,
        });
      }
    });

    this.getPriceData();
  }

  getPriceData(params) {
    axios(
      {
        url: ROOT_PATH + '/api/backend/v1/prices',
        method: 'get',
        params: params,
      },
      {}
    ).then(result => {
      if (result.data.error == 0) {
        this.setState({
          data: result.data
        });
      }
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { form } = this.props;

    let params = {};

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };

      values['start_time'] = values['start_time'] ? values['start_time'].format('YYYY-MM-DD') : '';
      values['end_time'] = values['end_time'] ? values['end_time'].format('YYYY-MM-DD') : '';

      axios({
        url: ROOT_PATH + '/api/backend/v1/prices',
        method: 'GET',
        params: {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          district_id: fieldsValue.district_id,
          breed_id: fieldsValue.breed_id,
          start_time: values['start_time'],
          end_time: values['end_time'],
        },
      }).then(result => {
        this.setState({
          data: result.data
        });

        if (result.data.error != 0) {
          message.error(result.data.msg);
        }
      });
    });
  };

  previewItem = id => {
    window.location.push(`/article/edit/${id}`);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });

    this.getPriceData();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  priceList = () => {
    const {
      form,
    } = this.props;

    let { currentPage, pageSize } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      
      const values = {
        ...fieldsValue,
      };

      values['start_time'] = values['start_time'] ? values['start_time'].format('YYYY-MM-DD') : '';
      values['end_time'] = values['end_time'] ? values['end_time'].format('YYYY-MM-DD') : '';

      axios({
        url: ROOT_PATH + '/api/backend/v1/prices',
        method: 'GET',
        params: {
          currentPage: currentPage,
          pageSize: pageSize,
          district_id: fieldsValue.district_id,
          breed_id: fieldsValue.breed_id,
          start_time: values['start_time'],
          end_time: values['end_time'],
        },
      }).then(result => {
       this.setState({
          data: result.data
        });
        if (result.data.error != 0) {
          message.error(result.data.msg);
        }
      });

      this.setState({
        formValues: values,
      });
    });
  };

  handleSearch = e => {
    e.preventDefault();
    this.priceList();
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    axios(
      {
        url: ROOT_PATH + '/api/rule',
        method: 'post',
        body: {
          desc: fields.desc
        }
      },
      {}
    ).then(result => {
      message.success('添加成功');
      this.handleModalVisible();
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="开始日期">
              {getFieldDecorator('start_time')(
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="结束日期">
              {getFieldDecorator('end_time')(
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="分类">
              {getFieldDecorator('breed_id')(
                <Select
                  placeholder="外三元生猪"
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
                  {this.state.priceCategoryOptionList.map((item, i) => {
                    return (
                      <option key={i} value={item.breed_id}>
                        {item.name}
                      </option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="地区">
              {getFieldDecorator('district_id')(
                <Select
                  placeholder="请选择"
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
                  {this.state.districtOptionList.map((item, i) => {
                    return (
                      <option key={i} value={item.district_id}>
                        {item.name}
                      </option>
                    );
                  })}
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
    const { loading } = this.props;
    let { data } = this.state;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Fragment>
        <Card bordered={false}>
          <div className='tableList'>
            <div className='tableListForm'>{this.renderForm()}</div>
            <div className='tableListOperator'>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                生猪价格导入
              </Button>
              <Button
                icon="file"
                target="_blank"
                href="http://cp-pig-rich.oss-cn-beijing.aliyuncs.com/template/%E5%85%A8%E5%9B%BD%E7%8C%AA%E4%BB%B7.xls"
              >
                模板
              </Button>
            </div>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}

PriceList = Form.create()(PriceList);

export default PriceList;
