import fetch from 'dva/fetch';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import dva from 'dva';

class App extends React.Component {

  render() {
    return (
      <HashRouter>
        <UserLayout />
      </HashRouter>
    );
  }
}

const app = dva();
app.router(()=><App />)
export default app;

window.username = window.localStorage.getItem('username')
// export const dva = {
//   config: {
//     onError(err) {
//       err.preventDefault();
//     },
//   },
// };

let authRoutes = {};

function ergodicRoutes(routes, authKey, authority) {
  routes.forEach(element => {
    if (element.path === authKey) {
      if (!element.authority) element.authority = []; // eslint-disable-line
      Object.assign(element.authority, authority || []);
    } else if (element.routes) {
      ergodicRoutes(element.routes, authKey, authority);
    }
    return element;
  });
}

export function patchRoutes(routes) {
  Object.keys(authRoutes).map(authKey =>
    ergodicRoutes(routes, authKey, authRoutes[authKey].authority)
  );
  window.g_routes = routes;
}

// export function render(oldRender) {
//   fetch('/api/auth_routes')
//     .then(res => res.json())
//     .then(
//       ret => {
//         authRoutes = ret;
//         oldRender();
//       },
//       () => {
//         oldRender();
//       }
//     );
// }


