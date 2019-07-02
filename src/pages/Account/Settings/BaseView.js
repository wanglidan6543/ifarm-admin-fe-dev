import React, { Component, Fragment } from 'react';
import { Form, Input, Upload, Select, Button } from 'antd';
import { connect } from 'dva';
import E from 'wangeditor';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import { tr } from '../../../common/i18n';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <span id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <span id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editorContent: '',
    };
  }

  componentDidMount() {
    this.setBaseInfo();
    const elem = this.refs.editorElem;
    const editor = new E(elem);
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = html => {
      this.setState({
        editorContent: html,
      });
    };
    editor.customConfig.uploadImgServer = '/upload';
    editor.create();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  clickHandle() {
    document.write(this.state.editorContent);
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={tr('System', 'app.settings.basic.email' )}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: tr('System', 'app.settings.basic.email-message', {}),
                  },
                ],
              })(<Input />)}
            </FormItem>

            <div ref="editorElem" style={{ textAlign: 'left' }} />

            <FormItem label={tr('System', 'app.settings.basic.nickname' )}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: tr('System', 'app.settings.basic.nickname-message', {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={tr('System', 'app.settings.basic.profile' )}>
              {getFieldDecorator('profile', {
                rules: [
                  {
                    required: true,
                    message: tr('System', 'app.settings.basic.profile-message', {}),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={tr('System', 'app.settings.basic.profile-placeholder' )}
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem label={tr('System', 'app.settings.basic.country' )}>
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: tr('System', 'app.settings.basic.country-message' , {}),
                  },
                ],
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={tr('System', 'app.settings.basic.geographic' )}>
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: tr('System', 'app.settings.basic.geographic-message' , {}),
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem>
            <FormItem label={tr('System', 'app.settings.basic.address' )}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: tr('System', 'app.settings.basic.address-message' , {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={tr('System', 'app.settings.basic.phone' )}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: tr('System', 'app.settings.basic.phone-message' , {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem>
            <Button type="primary" onClick={this.clickHandle.bind(this)}>
              <span
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default BaseView;
