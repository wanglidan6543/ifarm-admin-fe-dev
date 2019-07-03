import React, { PureComponent, Fragment } from 'react';
import { Table, Input, Button, Popconfirm, Form, Row, Col, message, Radio } from 'antd';
import axios from 'axios';
import { ROOT_PATH } from '../pathrouter';
// import PageHeaderWrapper from '../components/PageHeaderWrapper';
// import styles from './List.less';
import './List.css';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
// if (!jwt_token || jwt_token.length < 32) {
//   window.location.hash = '/user/login';
// }

const FormItem = Form.Item;
const EditableContext = React.createContext();
const RadioGroup = Radio.Group;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends PureComponent {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = event => {
    const { record, Handinpval, dataIndex } = this.props;
    this.form.validateFields((error, values) => {
      if (record[dataIndex] === record.benchmark_standard) {
        record.benchmark_standard = Number(event.target.value);
      } else {
        record.benchmark_warning = Number(event.target.value);
      }
      this.toggleEdit();
      Handinpval({ ...record, ...values });
    });
  };
  render() {
    const { editing } = this.state;
    const {
      savedata,
      editable,
      dataIndex,
      title,
      record,
      index,
      Handinpval,
      ...restProps
    } = this.props;
    return (
      <td {...restProps} style={{ width: '20%', textAlign: 'center' }}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return editing ? (
                <Form style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FormItem
                    className='inpcen'
                    style={{ margin: 0, width: '40%', display: 'flex', alignItems: 'center' }}
                  >
                    {form.getFieldDecorator(dataIndex, {
                      rules: [
                        {
                          required: true,
                          message: `${title} is required.`,
                        },
                      ],
                      initialValue: record[dataIndex],
                    })(
                      <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Input
                          ref={node => (this.input = node)}
                          onPressEnter={this.save}
                          onBlur={this.save}
                          // onChange={event => {this.onChanginp(event)}}
                        />
                        <span>%</span>
                      </div>
                    )}
                  </FormItem>
                </Form>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24 }}
                  onClick={this.toggleEdit}
                >
                  {restProps.children}%
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

class EditableTable extends PureComponent {
  state = {
    dataSource: [],
    count: 2,
    farmList: [],
    userList: [],
    selectedRows: [],
    formval: '',
    value: 1,
    data: {
      farm_name: '', // 农场名称
      farm_code: '', // 农场代码
      auto_transfer: '', // 是否自动转6-1
      farm_indexs: [
        {
          index_id: '', // 指标id
          index_name: '', // 指标名称
          benchmark_type: '', // 预警类型
          benchmark_standard: 0, // 标准值
          benchmark_warning: 0, // 预警阈值
          update_time: '', // 更新时间
        },
      ],
    },
    savedata: {
      farm_code: '', // 农场代码
      parent_farm_code: '',
      auto_transfer: '',
      benchmarks: [],
    },
  };
  // 恢复默认
  handleDefault = key => {
    axios({
      url: ROOT_PATH + '/api/backend/v1/ifarm_benchmark/recovery',
      method: 'PUT',
      data: {
        index_id: key.index_id, // 指标id
        farm_code: this.props.match.params.id, // 农场代码
        parent_farm_code: this.props.history.location.state,
      },
    }).then(result => {
      if (result.data.error !== 0) {
        message.error(result.data.msg);
      } else {
        message.success(result.data.msg);
      }
    });
    this.HandList();
  };

  Handinpval = row => {
    let { savedata } = this.state;
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.index_id === item.index_id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    savedata.benchmarks = newData;
    this.setState({
      savedata: { ...savedata },
    });
  };
  columns = [
    {
      title: '指标项目',
      dataIndex: 'index_name',
    },
    {
      title: '预警类型',
      dataIndex: 'benchmark_type',
    },
    {
      title: '标准值',
      dataIndex: 'benchmark_standard',
      editable: true,
    },
    {
      title: '预警阈值',
      dataIndex: 'benchmark_warning',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) =>
        this.state.dataSource.length >= 1 ? (
          <a onClick={() => this.handleDefault(record)} href="javascript:;">
            恢复默认
          </a>
        ) : null,
    },
  ];

  HandList = () => {
    axios({
      url: ROOT_PATH + '/api/backend/v1/ifarm_benchmark',
      method: 'GET',
      params: {
        farm_code: this.props.match.params.id,
        parent_farm_code: this.props.history.location.state,
      },
    }).then(result => {
      let { value } = this.state;
      result.data.data.auto_transfer === 1 ? (value = 1) : (value = 0);
      if(result.data.data.auto_transfer === 1){
        this.setState({
          value:1
        })
      }
      if(result.data.data.auto_transfer === 0){
        this.setState({
          value:0
        })
      }
      this.setState({
        data: result.data.data,
        dataSource: result.data.data.farm_indexs,
      });
    });
  };
  componentDidMount() {
    // TODO:
    // this.HandList();
  }
  onSave = () => {
    let { data, farmList, savedata, value } = this.state;
    const { form } = this.props;
    savedata.farm_code = data.farm_code;
    savedata.auto_transfer = value;
    savedata.parent_farm_code = this.props.history.location.state;
    axios({
      url: ROOT_PATH + '/api/backend/v1/ifarm_benchmark',
      method: 'POST',
      data: savedata,
    }).then(result => {
      if (result.data.error !== 0) {
        message.error(result.data.msg);
      } else {
        message.success(result.data.msg);
        window.location.hash = '/threshold';
      }
    });
  };
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };
  render() {
    const { dataSource, data, savedata } = this.state;
    console.log(this.state.value)
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          Handinpval: this.Handinpval,
          savedata: this.state.savedata,
        }),
      };
    });
    return (
      <Fragment>
        <div style={{ background: '#fff', padding: '15px 0' }}>
          <Row
            gutter={8}
            style={{ display: 'flex', alignItems: 'center', background: '#fff', margin: '20px 0' }}
          >
            <Col span={2} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '18px' }}>农场名称</span>
            </Col>
            <Col span={8}>
              <Input
                style={{ padding: '25px 10px' }}
                size="large"
                value={data.farm_name}
                disabled={true}
              />
            </Col>
          </Row>
          <Row
            gutter={8}
            style={{ display: 'flex', alignItems: 'center', background: '#fff', margin: '20px 0' }}
          >
            <Col span={2} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '18px' }}>农场代码</span>
            </Col>
            <Col span={8}>
              <Input
                style={{ padding: '25px 10px' }}
                size="large"
                value={data.farm_code}
                disabled={true}
              />
            </Col>
          </Row>
          <Row
            gutter={8}
            style={{ display: 'flex', alignItems: 'center', background: '#fff', margin: '20px 0' }}
          >
            <Col span={4} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '18px' }}>是否自动转6-1</span>
            </Col>
            <Col span={8}>
              <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <div>
            <Table
              style={{ width: '80%', marginLeft: '10%' }}
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={dataSource}
              columns={columns}
              savedata={savedata}
            />
          </div>
          <div style={{ marginLeft: '15%' }}>
            <Button
              style={{ width: '20%', height: '50px' }}
              type="primary"
              onClick={() => {
                this.onSave();
              }}
            >
              保存
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default EditableTable;
