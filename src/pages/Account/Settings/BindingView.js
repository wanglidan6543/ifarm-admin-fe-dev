import React, { Component, Fragment } from 'react';
import { Icon, List } from 'antd';
import { tr } from '../../../base/i18n';

class BindingView extends Component {
  getData = () => [
    {
      title: tr('System', 'app.settings.binding.taobao'),
      description: tr('System', 'app.settings.binding.taobao-description'),
      actions: [
        <a>
          <span>{tr('System', 'app.settings.binding.bind')}</span>
        </a>,
      ],
      avatar: <Icon type="taobao" className="taobao" />,
    },
    {
      title: tr('System', 'app.settings.binding.alipay', {}),
      description: tr('System', 'app.settings.binding.alipay-description', {}),
      actions: [
        <a>
          <span id="app.settings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <Icon type="alipay" className="alipay" />,
    },
    {
      title: tr('System', 'app.settings.binding.dingding', {}),
      description: tr('System', 'app.settings.binding.dingding-description', {}),
      actions: [
        <a>
          <span id="app.settings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <Icon type="dingding" className="dingding" />,
    },
  ];

  render() {
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default BindingView;
