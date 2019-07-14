import React from 'react';
import Exception from '../components/Exception';
import { tr } from '../common/i18n';
import { Link } from 'react-router-dom';

export default () => (
  <Exception
    type="404"
    linkElement={Link}
    desc={tr('Error', 'exception.description.404')}
    backText={tr('Error', 'exception.back')}
  />
);
