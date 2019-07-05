import { combineReducers } from 'redux';

import * as global from '../models/global';
import * as list from '../models/list';
import * as menu from '../models/menu';
import * as project from '../models/project';
import * as setting from '../models/setting';
import * as user from '../models/user';
 
const rootReducer = combineReducers({
  global,
  list,
  menu,
  project,
  setting,
  user,
  collapsed: false
});

export default rootReducer;