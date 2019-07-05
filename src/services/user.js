import request from '../utils/request';
import { ROOT_PATH } from '../pages/pathrouter';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent(params) {
  return request(ROOT_PATH + `/api/backend/v1/user/info?${JSON.stringify(params)}`, {
    method: 'GET',
    headers: { Authorization: window.localStorage.getItem('jwt_token') },
  });
}
