import React, { Component } from 'react';
import E from 'wangeditor';

export default class Editor extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const elem = this.refs.editorElem;
    console.log(elem);
    const editor = new E(elem);
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = html => {
      this.setState({
        editorContent: html,
      });
    };
    editor.customConfig.uploadImgServer = '/upload';
    editor.create();
  }
  render() {
    return <div ref="editorElem" />;
  }
}
