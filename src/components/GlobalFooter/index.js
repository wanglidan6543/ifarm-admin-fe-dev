import React from 'react';
import './index.css';

const GlobalFooter = ({links, copyright }) => {
  return (
    <footer className="globalFooter">
      {links && (
        <div className="links">
          {links.map(link => (
            <a
              key={link.key}
              title={link.key}
              target={link.blankTarget ? '_blank' : '_self'}
              href={link.href}
            >
              {link.title}
            </a>
          ))}
        </div>
      )}
      {copyright && <div className="copyright">{copyright}</div>}
    </footer>
  );
};

export default GlobalFooter;
