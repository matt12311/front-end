import axios from 'axios';
import store from '../redux/store';
import { LOGOUT } from '../redux/types';

const api = axios.create({
  baseURL: 'https://ship.fulfilling.co/api',
});
/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
**/

// api.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response.status === 401) {
//       store.dispatch({ type: LOGOUT });
//     }
//     return Promise.reject(err);
//   }
// );


export default api;
