import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '正大集团',
          title: '正大集团',
          href: 'http://www.cpgroup.cn/',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 正大集团
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
