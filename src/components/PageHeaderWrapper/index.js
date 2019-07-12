import React, { Component } from 'react';
import { Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import defaultSetting from '../../defaultSettings';
import { tr } from '../../common/i18n';
import BreadcrumbView from './breadcrumb';
import './index.less';

export default class PageHeaderWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentWidth: defaultSetting.contentWidth
    }
  }

  render() {
    const { children } = this.props;

    let contentClassName = `${'main'}`;
    if (this.state.contentWidth === 'Fixed') {
      contentClassName = `${'main'} ${'wide'}`;
    }
    return (
      <div style={{ margin: '-24px -24px 0' }} >
        <div className="breadHeader">
          <Skeleton
            loading={false}
            title={false}
            paragraph={{ rows: 3 }}
          >
          {
            <BreadcrumbView 
              wide={this.state.contentWidth === 'Fixed'}
              home={<span id="menu.home" defaultMessage="Home">{tr('Menu', 'menu.home')}</span>}
              key="pageheader"
              linkElement={Link}
              itemRender={item => {
                if (item.locale) {
                  return <span id={item.locale} defaultMessage={item.title}>{tr('Menu', item.locale)}</span>;
                }
                return item.title;
              }}
              {...this.props} 
            />
          }
          </Skeleton>
        </div>
        {children ? (
          <div className='subcontent'>
            <div className={contentClassName}>{children}</div>
          </div>
        ) : null}
      </div>
    )
  }
}
