import { combineReducers } from 'redux';
import onlineReducer from './onlineReducer';

const rootReducer = combineReducers({
  onlineReg  : onlineReducer,
})

export default rootReducer;
