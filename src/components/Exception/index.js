import React, { createElement } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import config from './typeConfig';
import './index.less';

class Exception extends React.PureComponent {
  static defaultProps = {
    backText: 'back to home',
    redirect: '/home',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      className,
      backText,
      linkElement = 'a',
      type,
      title,
      desc,
      img,
      actions,
      redirect,
      ...rest
    } = this.props;
    const pageType = type in config ? type : '404';
    const clsString = classNames("exception", className);
    return (
      <div className={clsString} {...rest}>
        <div className={"imgBlock"}>
          <div
            className={"imgEle"}
            style={{ backgroundImage: `url(${img || config[pageType].img})` }}
          />
        </div>
        <div className={"content"}>
          <h1>{title || config[pageType].title}</h1>
          <div className={"desc"}>{desc || config[pageType].desc}</div>
          <div className={"action"}>
            {actions ||
              createElement(
                linkElement,
                {
                  to: redirect,
                  href: redirect,
                },
                <Button type="primary">{backText}</Button>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Exception;
