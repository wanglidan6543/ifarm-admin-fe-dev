import React from 'react';
import { Link } from 'react-router-dom';
import Exception from '../components/Exception';
import { tr } from '../../base/i18n';

const Exception403 = () => (
  <Exception
    type="403"
    desc={tr('System', 'app.exception.description.403' )}
    linkElement={Link}
    backText={tr('System', 'app.exception.back')}
  />
);

export default Exception403;
