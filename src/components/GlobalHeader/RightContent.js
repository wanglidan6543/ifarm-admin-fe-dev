import React, { PureComponent } from 'react';
import { Spin, Tag, Menu, Icon, Avatar } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import './index.less';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  render() {
    const {
      onMenuClick,
      theme,
    } = this.props;

    var currentUser = window.localStorage.getItem('loginInfo');
    if (currentUser){
      currentUser = JSON.parse(currentUser);

    }else{
      currentUser={};
      currentUser.realname = '';
    }

    const menu = (
      <Menu className="menu" selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <span id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
        <Menu.Item key="pasd">
          <Icon type="key" />
          <span id="menu.account.password" defaultMessage="logout" onClick={()=>this.pasd()} />
        </Menu.Item>
      </Menu>
    );

    let className = 'right';
    if (theme === 'dark') {
      className = `${'right'}  ${'dark'}`;
    }
    return (
      <div className={className}>
        {currentUser.realname ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${'action'} ${'account'}`}>
              <Avatar
                size="small"
                className='avatar'
                src={currentUser.avatar}
                alt="avatar"
              />
              <span className='name'>{currentUser.realname}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang className='action' />
      </div>
    );
  }
}
