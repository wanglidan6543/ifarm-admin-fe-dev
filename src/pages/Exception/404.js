import React from 'react';
import { Link } from 'react-router-dom';
import Exception from '../components/Exception';
import { tr } from '../../common/i18n';

const Exception404 = () => (
  <Exception
    type="404"
    desc={tr('System', 'app.exception.description.404' )}
    linkElement={Link}
    backText={tr('System', 'app.exception.back')}
  />
);

export default Exception404;
