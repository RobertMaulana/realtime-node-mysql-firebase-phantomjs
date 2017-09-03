import * as ActionTypes from './constants';
import axios from 'axios';

export const onlineRequest = data => ({
  type: ActionTypes.ONLINE_REGISTRATION,
  payload: data,
});

export const onlineRegistration= data => {
  return dispatch =>
    axios.get('http://localhost:50012/v1/goproteksi/today')
    .then(response => dispatch(onlineRequest(response.data)))
    .catch(err => console.log(err.message))
};
