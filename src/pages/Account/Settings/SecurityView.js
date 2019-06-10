import React, { Component, Fragment } from 'react';
import { List } from 'antd';
// import { getTimeDistance } from '@/utils/utils';
import { tr } from '../../../base/i18n';

const passwordStrength = {
  strong: (
    <font className="strong">
      <span id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <span id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <span id="app.settings.security.weak" defaultMessage="Weak" />
      Weak
    </font>
  ),
};

class SecurityView extends Component {
  getData = () => [
    {
      title: tr('System', 'app.settings.security.password', {}),
      description: (
        <Fragment>
          {tr('System', 'app.settings.security.password-description')}：
          {passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a>
          <span id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: tr('System', 'app.settings.security.phone', {}),
      description: `${tr(
        'System', 'app.settings.security.phone-description',
        {}
      )}：138****8293`,
      actions: [
        <a>
          <span id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: tr('System', 'app.settings.security.question', {}),
      description: tr('System', 'app.settings.security.question-description', {}),
      actions: [
        <a>
          <span id="app.settings.security.set" defaultMessage="Set" />
        </a>,
      ],
    },
    {
      title: tr('System', 'app.settings.security.email', {}),
      description: `${tr(
        'System', 'app.settings.security.email-description',
        {}
      )}：ant***sign.com`,
      actions: [
        <a>
          <span id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: tr('System', 'app.settings.security.mfa', {}),
      description: tr('System', 'app.settings.security.mfa-description', {}),
      actions: [
        <a>
          <span id="app.settings.security.bind" defaultMessage="Bind" />
        </a>,
      ],
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
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default SecurityView;
