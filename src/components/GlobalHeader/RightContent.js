import React, { PureComponent } from 'react';
import { Spin, Menu, Icon, Avatar } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import './index.less';
import { tr } from '../../common/i18n';

export default class GlobalHeaderRight extends PureComponent {

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
      <Menu className="rightMenu" selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <span defaultMessage="logout">
            {tr('Menu', "menu.account.logout")}
          </span>
        </Menu.Item>
        <Menu.Item key="pasd">
          <Icon type="key" />
          <span defaultMessage="logout">
           {tr('Menu', 'menu.account.password')}
          </span>
        </Menu.Item>
      </Menu>
    );

    let className = 'right';
    if (theme === 'dark') {
      className = 'right dark';
    }
    return (
      <div className={className}>
        {currentUser.realname ? (
          <HeaderDropdown overlay={menu}>
            <span className='action account'>
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
