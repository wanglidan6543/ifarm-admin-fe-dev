import React, { Component, Fragment } from 'react';
// import { connect } from 'dva';
import axios from 'axios';
import E from 'wangeditor';
// import CateSelect from './components/select.js';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Upload,
  message,
  Modal,
} from 'antd';
// import PageHeaderWrapper from '../components/PageHeaderWrapper';
// import styles from './ArticleEdit.less';
import { ROOT_PATH } from '../pathrouter';
// import Editor from './components/editor';
const FormItem = Form.Item;
// const { Option } = Select;
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

var editorObj;
// var jwt_token = window.localStorage.getItem('jwt_token');
// axios.defaults.headers.common['Authorization'] = jwt_token;
// if (!jwt_token || jwt_token.length < 32) {
//   location.hash = '/user/login';
// }

// var loginInfo = window.localStorage.getItem('loginInfo');
// if (!loginInfo){
//   var loginInfo = JSON.parse(loginInfo);
// }else{
//   loginInfo = {};
//   loginInfo.realname = '';
// }

// @connect(({ loading }) => ({
//   submitting: loading.effects['form/submitRegularForm'],
// }))
// @Form.create()
class ArtcicleEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      cover: '',
      status: '',
      read_count: '100',
      category_id: 0,
      categoryOptionList: [],
      previewVisible: false,
      previewImage: '',
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
    const { dispatch, match } = this.props;
    const { params } = match;
    const elem = this.refs.editorElem;
    const editor = new E(elem);
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = html => {
      this.setState({
        content: html,
      });
    };
    editor.customConfig.uploadImgServer = ROOT_PATH + '/api/backend/v1/file_uploads';

    editor.customConfig.uploadImgHooks = {
      before: function(xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function(xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      fail: function(xhr, editor, result) {
        message.error('图片上传出错');

        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function(xhr, editor) {
        message.error('图片上传出错');
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function(xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function(insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        var url = result.data;
        insertImg(url);

        // result 必须是一个 JSON 格式字符串！！！否则报错
      },
    };
    editor.create();

    editor.txt.html(this.state.content);
    editorObj = editor;

    axios({
      url: ROOT_PATH + '/api/backend/v1/article/categories',
      method: 'GET',
    }).then(result => {
      if (result.data.error == 0) {
        var categoryOptionLists = result.data.data.categories;
        categoryOptionLists.push({ category_id: 0, name: '请选择' });
        this.setState({
          categoryOptionList: categoryOptionLists,
        });
      }
    });

    var article_id = 0;
    if (params) {
      article_id = params.id;
      axios({
        url: ROOT_PATH + '/api/backend/v1/article',
        method: 'GET',
        params: { article_id: article_id },
      }).then(result => {
        if (result.data.error == 0) {
          this.setState({
            category_id: result.data.data.category_id,
            content: result.data.data.content,
            previewImage: result.data.data.cover,
            cover: result.data.data.cover,
            article_id: result.data.data.article_id,
            read_count: result.data.data.read_count,
            status: result.data.data.status,
            title: result.data.data.title,
          });
          this.state.fileList.forEach(item => {
            // item.url = result.data.data.cover;
          });
          editor.txt.html(this.state.content);
        }
      });
    }
  }

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleBack = e => {
    window.location.history.go(-1);
  };

  handlePublish = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var d = values;
        d.content = editorObj.txt.html();
        d.status = 1;
        d.article_id = this.state.article_id;
        d.cover = this.state.cover;
        if (d.article_id) {
          var md = 'put';
        } else {
          var md = 'post';
        }
        if (d.title === '') {
        } else if (document.getElementsByTagName('p')[0].innerHTML === '<br>' && d.content === "<p><br></p>") {
          alert('正文不能为空');
        } else if (d.cover === '') {
          alert('封面不能为空');
        } else if (d.category_id === 0) {
          alert('分类不能为空');
        } else if (d.read_count === '') {
          alert('初始阅读量不能为空');
        } else {
          axios({
            url: ROOT_PATH + '/api/backend/v1/article', // /api/backend/v1/article/release
            method: md,
            data: d,
          }).then(result => {
            if (result.data.error == 0) {
              window.location.hash = '/';
            } else {
              alert(result.data.msg);
            }
          });
        }
      }
    });
  };

  handleSave = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var d = values;
        d.status = 0;
        d.content = editorObj.txt.html();
        d.article_id = this.state.article_id;
        d.cover = this.state.cover;
        if (d.article_id) {
          var md = 'put';
        } else {
          var md = 'post';
        }

        axios({
          url: ROOT_PATH + '/api/backend/v1/article',
          method: md,
          params: {},
          data: d,
        }).then(result => {
          if (result.data.error == 0) {
            window.location.hash = '/';
          } else {
            message.error(result.data.msg);
          }
        });
      }
    });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
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

  handleFileChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, previewImage =>
        this.setState({
          previewImage,
          loading: false,
          cover: info.file.response.data.file_url,
        })
      );
    }
  };

  handleCancel = () => this.setState({ previewVisible: false });

  render() {
    const { submitting } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <Fragment>
        <Card bordered={false}>
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem layout="vertical" name="title" label="标题">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入标题' }],
                initialValue: this.state.title,
              })(<Input placeholder="请输入标题" />)}
            </FormItem>
            {/* name="content"   */}
            <FormItem name="content" layout="vertical" label="正文" placeholder="请输入正文">
              <div ref="editorElem" style={{ textAlign: 'left' }} />
            </FormItem>
            <FormItem layout="vertical" label="封面">
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={ROOT_PATH + '/api/backend/v1/file_upload'}
                beforeUpload={this.beforeUpload}
                onChange={this.handleFileChange}
              >
                {previewImage ? (
                  <img style={{ width: '80px', height: '80px' }} src={previewImage} alt="avatar" />
                ) : (
                  uploadButton
                )}
              </Upload>
            </FormItem>
            <FormItem layout="vertical" name="category_id" key="category_id" label="分类">
              {getFieldDecorator('category_id', {
                rules: [{ required: true }],
                initialValue: this.state.category_id,
              })(
                <Select
                  placeholder="请选择"
                  showSearch
                  // style={{ width: 200 }}
                  optionFilterProp="children"
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.categoryOptionList.map((item, i) => {
                    return (
                      <option key={item.category_id} value={item.category_id}>
                        {item.name}
                      </option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem layout="vertical" label="初始阅读量">
              {getFieldDecorator('read_count', {
                rules: [{ required: true }],
                initialValue: this.state.read_count,
              })(<Input placeholder="请输入" onChange={this.handleChange} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="danger"
                htmlType="submit"
                loading={submitting}
                onClick={this.handlePublish}
              >
                发布
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 20 }}
                loading={submitting}
                onClick={this.handleSave}
              >
                存草稿
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleBack}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </Fragment>
    );
  }
}

ArtcicleEdit = Form.create()(ArtcicleEdit);

export default ArtcicleEdit;
