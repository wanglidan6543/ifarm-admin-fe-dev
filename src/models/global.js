// import { queryNotices } from '../services/api';

const ChANGE_LAYOUT_COLLAPSED = 'changeLayoutCollapsed';
const SAVE_NOTICES = 'saveNotices';
const SAVE_CLEARED_NOTICES = 'saveClearedNotices';

const actionHandles = {
  ChANGE_LAYOUT_COLLAPSED: (state, { payload }) =>{
    return {
      ...state,
      collapsed: payload,
    };
  },
  SAVE_NOTICES: (state, { payload }) =>{
    return {
      ...state,
      notices: payload,
    };
  },
  SAVE_CLEARED_NOTICES: (state, { payload }) =>{
    return {
      ...state,
      notices: state.notices.filter(item => item.type !== payload),
    };
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  collapsed: false,
  notices: [],
};

export default global = (state = initialState, action) => {
  const handler = actionHandles[action.type]

  return handler ? handler(state, action) : state
}

/*
export default {
  namespace: 'global',

  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        })
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
  },

  reducers: {
    
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
*/