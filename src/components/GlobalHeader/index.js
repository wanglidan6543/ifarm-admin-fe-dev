import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import './index.less';
import RightContent from './RightContent';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    // this.triggerResizeEvent.cancel();
  }

  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo } = this.props;
    return (
      <div className="global_header">
        {isMobile && (
          <Link to="/" className="global_logo" key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <span className="global_trigger" onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span>
        <RightContent {...this.props} />
      </div>
    );
  }
}
