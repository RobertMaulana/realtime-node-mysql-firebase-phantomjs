import * as ActionTypes from '../actions/constants';

const onlineReducer = (state = 0, action) => {
  switch(action.type) {
    case ActionTypes.ONLINE_REGISTRATION: return action.payload
    default: return state;
  }
}

export default onlineReducer;
