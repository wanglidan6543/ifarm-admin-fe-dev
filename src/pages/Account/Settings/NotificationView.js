import React, { Component, Fragment } from 'react';
import { tr } from '../../../common/i18n';
import { Switch, List } from 'antd';

class NotificationView extends Component {
  getData = () => {
    const Action = (
      <Switch
        checkedChildren={tr('System', 'app.settings.open' )}
        unCheckedChildren={tr('System', 'app.settings.close' )}
        defaultChecked
      />
    );
    return [
      {
        title: tr('System', 'app.settings.notification.password', {}),
        description: tr('System', 'app.settings.notification.password-description' , {}),
        actions: [Action],
      },
      {
        title: tr('System', 'app.settings.notification.messages', {}),
        description: tr('System', 'app.settings.notification.messages-description', {}),
        actions: [Action],
      },
      {
        title: tr('System', 'app.settings.notification.todo', {}),
        description: tr('System', 'app.settings.notification.todo-description', {}),
        actions: [Action],
      },
    ];
  };

  render() {
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default NotificationView;
