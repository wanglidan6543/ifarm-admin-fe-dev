import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import './index.less';

// TODO:
/**
 * 错误页面
 * 登录页面样式
 * 提示更新: global.js 如何引入
 */

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>  
    <App />
  </LocaleProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// 判断是否是什么开发
if (process.env.NODE_ENV === 'development') {
  let serviceWorker = require('./serviceWorker')
  serviceWorker.unregister()
}
