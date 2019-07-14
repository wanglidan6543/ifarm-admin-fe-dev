import {tr} from '../common/i18n';
import defaultSetting from '../defaultSettings';
import Authorized from '../utils/Authorized';
const { check } = Authorized;

export function formatter(data, parentAuthority, parentName) {
  if (!data) {
    return null;
  }
  return data.map(item => {
    if (!item.name || !item.path) {
      return null;
    }

    let locale = 'menu';
    if (parentName) {
      locale = `${parentName}.${item.name}`;
    } else {
      locale = `menu.${item.name}`;
    }
    // if enableMenuLocale use item.name,
    // close menu international
    const name = defaultSetting.disableLocal ? item.name
      : tr('Menu', locale);
    const result = {
      ...item,
      name,
      locale,
      authority: item.authority || parentAuthority,
    };
    if (item.routes) {
      const children = this.formatter(item.routes, item.authority, locale);
      // Reduce memory usage
      result.children = children;
    }
    delete result.routes;
    return result;
  })
    .filter(item => item);
}

function getSubMenu(item) {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

export function filterMenuData(menuData) {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};

export function getBreadcrumbNameMap(menuData) {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};