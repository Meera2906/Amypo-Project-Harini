import api from './api';

export const getMyStores = async () => {
  const response = await api.get('/merchants/my-stores');
  return response?.data !== undefined ? response.data : response;
};

export const getMyTasks = async () => {
  const response = await api.get('/merchants/my-tasks');
  return response?.data !== undefined ? response.data : response;
};

export const getStoreTasks = async (storeId) => {
  const response = await api.get(`/merchants/stores/${storeId}/tasks`);
  return response?.data !== undefined ? response.data : response;
};

const merchantService = {
  getMyStores,
  getMyTasks,
  getStoreTasks
};

export default merchantService;
