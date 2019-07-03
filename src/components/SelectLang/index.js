import React, { PureComponent } from 'react';
// import { formatMessage, setLocale, getLocale } from 'umi/locale';
import { Menu, Icon, Dropdown } from 'antd';
// import classNames from 'classnames';
// import HeaderDropdown from '../HeaderDropdown';
import './index.css';
import { tr } from '../../common/i18n';

export default class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    // setLocale(key);
  };

  render() {
    const selectedLang = 'zh-CN';
    const locales = ['zh-CN'];
    // const locales = ['zh-CN', 'zh-TW', 'en-US', 'pt-BR'];
    const languageLabels = {
      'zh-CN': '简体中文',
      // 'zh-TW': '繁体中文',
      // 'en-US': 'English',
      // 'pt-BR': 'Português',
    };
    const languageIcons = {
      'zh-CN': '🇨🇳',
      // 'zh-TW': '🇭🇰',
      // 'en-US': '🇬🇧',
      // 'pt-BR': '🇧🇷',
    };
    const langMenu = (
      <Menu className='menu' selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown overlay={langMenu} placement="bottomRight" className="dropDown">
        <span>
          <Icon className="icon" type="global" title={tr('System','navBar.lang')} />
        </span>
      </Dropdown>
    );
  }
}
