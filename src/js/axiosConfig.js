import axios from 'axios';
import AuthService from './services/authService';

axios.interceptors.request.use(
  config => {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
      config.headers['Authorization'] = 'Bearer ' + user.accessToken;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      AuthService.logout();
      location.reload(true);
    }
    return Promise.reject(error);
  }
);

export default axios;
