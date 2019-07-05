import { stringify } from 'qs';
import request from '../utils/request';
import { ROOT_PATH } from '../pages/pathrouter';

// 获取菜单数据
export async function requestMenuData() {
  return request(ROOT_PATH + '/api/backend/v1/menu', {
    method: 'GET',
    headers: { Authorization: window.localStorage.getItem('jwt_token') },
  });
}

export async function accountLogin(params) {
  return request(ROOT_PATH + '/api/backend/v1/user/login', {
    method: 'POST',
    body: params,
  });
}

export async function queryPosts(params) {
  // params = {page:1};
  return request(ROOT_PATH + `/api/backend/v1/articles?${stringify(params)}`, {
    method: 'GET',
    headers: { Authorization: window.localStorage.getItem('jwt_token') },
  });
}

export async function queryPrice(params) {
  // params = {page:1};
  return request(ROOT_PATH + `/api/backend/v1/prices?${stringify(params)}`, {
    method: 'GET',
    headers: { Authorization: window.localStorage.getItem('jwt_token') },
  });
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// 侧边栏接口获取

// export async function siderMenu(params) {
//   // params = {page:1};
//   return request(ROOT_PATH + `/api/backend/v1/prices?${stringify(params)}`, {
//     method: 'GET',
//     headers: { Authorization: window.localStorage.getItem('jwt_token') },
//   });
// }
