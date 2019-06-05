import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Table,
  Button,
  Input,
  message,
  Divider,
  Row,
  Col,
  Select,
  Card,
  Icon,
  Upload,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import axios from 'axios';
import styles from './List.less';
import { ROOT_PATH } from '../pathrouter';
import { isNull } from 'util';

var jwt_token = window.localStorage.getItem('jwt_token');
axios.defaults.headers.common['Authorization'] = jwt_token;
if (!jwt_token || jwt_token.length < 32) {
  location.hash = '/user/login';
}
const Option = Select.Option;
const FormItem = Form.Item;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const HEADPICURL =
  'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1555412492&di=d5d5a04572ede36ae3448f86a163e19e&src=http://img.zcool.cn/community/01786557e4a6fa0000018c1bf080ca.png@1280w_1l_2o_100sh.png';

@Form.create()
class TableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      limit: '',
      toendble: '', // 启用
      data: {
        username: '', // 用户名
        avatar_url: '', // 头像地址
        email: '', // 邮箱
        realname: '', // 昵称
        uid: '', // ID
        tel_mobile: '', // 手机号
        status: 0, // 状态。0启用  1禁用
        login_limit: '', // 登陆类型。1员工   2非员工
      },
      isShow: false,
      isPnone: false,
      previewVisible: false,
      imageUrl: '',
      loading: false,
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: '',
        },
      ],
    };
  }
  componentDidMount() {
    let { data } = this.state;
    if (this.props.match.url === '/usered/edit/' + this.props.match.params.id) {
      axios({
        url: ROOT_PATH + '/api/backend/v1/user',
        method: 'GET',
        params: {
          uid: this.props.match.params.id,
        },
      }).then(result => {
        this.setState({
          data: result.data.data,
        });
        if(isNull(result.data.data.login_limit)){
          result.data.data.login_limit = 1
        }
        if(isNull(result.data.data.realname)){
          result.data.data.realname = ''
        }
        if (result.data.data.avatar_url === '') {
          this.setState({
            imageUrl: HEADPICURL,
          });
        } else {
          this.setState({
            imageUrl: result.data.data.avatar_url,
          });
        }
        data.uid = result.data.data.uid;
      });
    }
  }
  onSave = () => {
    let { data } = this.state;
    let user = new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-_]{1,30}$/); // 用户名
    let realname = new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-]{1,30}$/); // 昵称
    let phone = new RegExp(/^[1][3,4,5,7,8][0-9]{9}$/); // 手机号
    if (!user.test(data.username) || data.username === '') {
      message.error('用户名输入有误');
    } else if (!realname.test(data.realname) || data.realname === '') {
      message.error('昵称输入有误');
    } else if (!phone.test(data.tel_mobile || data.tel_mobile === '')) {
      message.error('手机号输入有误');
    } else {
      if (this.props.match.url === '/usered/edit/' + this.props.match.params.id) {
        axios({
          url: ROOT_PATH + '/api/backend/v1/user',
          method: 'PUT',
          data: {
            username: data.username, // 用户名
            avatar_url: data.avatar_url, // 头像地址
            email: data.email, // 邮箱
            realname: data.realname, // 昵称
            uid: data.uid, // ID
            tel_mobile: data.tel_mobile, // 手机号
            status: data.status, // 状态。0启用  1禁用
            login_limit: data.login_limit, // 登陆类型。1员工   2非员工
          },
        }).then(result => {
          if (result.data.error !== 0) {
            message.error(result.data.msg);
          } else {
            message.success(result.data.msg);
            location.hash = '/usered';
          }
        });
      } else if (this.props.match.url === '/usered/add') {
        axios({
          url: ROOT_PATH + '/api/backend/v1/user',
          method: 'POST',
          data: {
            username: data.username, // 用户名
            avatar_url: data.avatar_url, // 头像地址
            email: data.email, // 邮箱
            realname: data.realname, // 昵称
            tel_mobile: data.tel_mobile, // 手机号
            status: data.status, // 状态。0启用  1禁用
            login_limit: data.login_limit, // 登陆类型。1员工   2非员工
          },
        }).then(result => {
          if (result.data.error !== 0) {
            message.error(result.data.msg);
          } else {
            message.success(result.data.msg);
            location.hash = '/usered';
          }
        });
      }
    }
  };
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      let { data } = this.state;
      data.avatar_url = info.file.response.data.file_url;
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };
  beforeUpload(file) {
    const isPng = file.type;
    if (isPng != 'image/png' && isPng != 'image/jpeg') {
      message.error('头像只支持png、jpg');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2KB!');
      return false;
    }
  }
  render() {
    let { data, isPnone, previewVisible, imageUrl, fileList, limit } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue, isFieldTouched, getFieldError, isShow },
    } = this.props;
    if (this.props.match.url === '/usered/edit/' + this.props.match.params.id) {
      if(isNull(data.login_limit)){
        data.login_limit = ''
      }
      data.login_limit === 2 ? (limit = '非员工') : (limit = '员工');
      data.password = this.state.password;
    } else {
      data.status === 0 ? '启用' : '禁用';
      data.password = data.password;
    }
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );
    return (
      <PageHeaderWrapper>
        <Form hideRequiredMark style={{ marginTop: 8, background: '#fff', padding: '30px 0' }}>
          {this.props.match.url === '/usered/edit/' + this.props.match.params.id ? (
            <FormItem
              name="number"
              label="ID"
              className={styles.form_input}
              style={{ width: '40%', display: 'flex', alignItems: 'center' }}
            >
              {getFieldDecorator('ID', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<span>{data.uid}</span>)}
            </FormItem>
          ) : (
            ''
          )}
          {/* <FormItem
            label="头像"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={ROOT_PATH + '/api/backend/v1/file_upload'}
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? (
                <img style={{ width: '80px', height: '80px' }} src={imageUrl} alt="avatar" />
              ) : (
                uploadButton
              )}
            </Upload>
          </FormItem> */}
          <FormItem
            label="用户名"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('username', {
              initialValue: data.username,
              rules: [
                {
                  required: true,
                  pattern: new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-_]{1,30}$/),
                  message: '用户名最多为30为、字母、数字、汉字',
                },
              ],
            })(
              <Input
                onChange={event => {
                  data.username = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="昵称"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('昵称', {
              initialValue: data.realname,
              rules: [
                {
                  required: true,
                  pattern: new RegExp(/^[\u4e00-\u9fa5A-Za-z0-9-]{1,30}$/),
                  message: '用户名最多为30为、字母、数字、汉字',
                },
              ],
            })(
              <Input
                onChange={event => {
                  data.realname = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="手机号"
            className={styles.form_input}
            autoComplete="off"
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('input-number', {
              initialValue: data.tel_mobile,
              rules: [
                {
                  required: true,
                  pattern: new RegExp(/^[1][3,4,5,7,8][0-9]{9}$/),
                  message: '请输入正确的手机号',
                },
              ],
            })(
              <Input
                onChange={event => {
                  data.tel_mobile = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="默认邮箱"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('邮箱号', {
              initialValue: data.email,
              rules: [
                {
                  required: true,
                  pattern: new RegExp(
                    /^([a-zA-Z0-9_-]{1,16})@([a-zA-Z0-9]{1,9})(\.(?:com|net|org|edu|gov|mil|cn|us))$/
                  ),
                  message: '请输入正确的邮箱号',
                  len: 50,
                },
              ],
            })(
              <Input
                onChange={event => {
                  data.email = event.target.value;
                }}
              />
            )}
          </FormItem>
          <FormItem
            label="类型"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('data.login_limit', {
              initialValue: limit,
              rules: [
                {
                  rules: [{ required: true, message: 'Please select your gender!' }],
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                onChange={value => {
                  data.login_limit = Number(value);
                }}
              >
                <Option value="2">非员工</Option>
                <Option value="1">员工</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="状态"
            className={styles.form_input}
            style={{ width: '40%', display: 'flex', alignItems: 'center' }}
          >
            {getFieldDecorator('data.status', {
              initialValue: data.status === 0 ? '启用' : '禁用',
              rules: [
                {
                  rules: [{ required: true, message: 'Please select your gender!' }],
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                onChange={value => {
                  data.status = Number(value);
                }}
              >
                <Option value="0">启用</Option>
                <Option value="1">禁用</Option>
              </Select>
            )}
          </FormItem>
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
        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default TableForm;
