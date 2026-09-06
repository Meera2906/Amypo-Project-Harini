import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response?.data !== undefined ? response.data : response;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response?.data !== undefined ? response.data : response;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const login = (...args) => authService.login(...args);
export const register = (...args) => authService.register(...args);
export const logout = (...args) => authService.logout(...args);

export default authService;