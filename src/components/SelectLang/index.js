import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown/index';
import { tr } from '../../common/i18n';
import './index.less';

export default class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    // setLocale(key);
  };

  render() {
    const { className } = this.props;
    
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
      <Menu className="lang_menu" selectedKeys={[selectedLang]} onClick={this.changeLang}>
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
      <HeaderDropdown overlay={langMenu} placement="bottomRight">
        <span className={classNames("drop_down", className)}>
          <Icon type="global" title={tr('System','navBar.lang')} />
        </span>
      </HeaderDropdown>
    );
  }
}
