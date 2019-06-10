import React from 'react';
import { Link } from 'react-router-dom';
import Exception from '../components/Exception';
import { tr } from '../../base/i18n';

const Exception500 = () => (
  <Exception
    type="500"
    desc={tr('System','app.exception.description.500' )}
    linkElement={Link}
    backText={tr('System','app.exception.back')}
  />
);

export default Exception500;
