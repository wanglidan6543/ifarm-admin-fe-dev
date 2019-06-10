 
import pathToRegexp from 'path-to-regexp';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { menu, title } from '../defaultSettings';
import { tr } from '../base/i18n';

export const matchParamsPath = (pathname, breadcrumbNameMap) => {
  const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
  return breadcrumbNameMap[pathKey];
};

const getPageTitle = (pathname, breadcrumbNameMap) => {
  const currRouterData = matchParamsPath(pathname, breadcrumbNameMap);
  if (!currRouterData) {
    return title;
  }
  const pageName = menu.disableLocal
    ? currRouterData.name
    : tr('System', currRouterData.locale || currRouterData.name);

  return `${pageName} - ${title}`;
};


export default memoizeOne(getPageTitle, isEqual);
