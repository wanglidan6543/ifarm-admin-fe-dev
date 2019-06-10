import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import Result from '../components/Result';
import styles from './RegisterResult.less';
import {tr} from '../../base/i18n';

const actions = (
  <div className={styles.actions}>
    <a href="">
      <Button size="large" type="primary">
        <span id="app.register-result.view-mailbox" />
      </Button>
    </a>
    <Link to="/">
      <Button size="large">
        <span id="app.register-result.back-home" />
      </Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        <span
          id="app.register-result.msg"
          values={{ email: location.state ? location.state.account : 'AntDesign@example.com' }}
        />
      </div>
    }
    description={tr('System', 'app.register-result.activation-email')}
    actions={actions}
    style={{ marginTop: 56 }}
  />
);

export default RegisterResult;
