import api from './api';

const taskService = {
  getAllTasks: async () => {
    const response = await api.get('/tasks/all');
    return response?.data !== undefined ? response.data : response;
  },
  createTask: async (taskData) => {
    const response = await api.post('/tasks/create', taskData);
    return response?.data !== undefined ? response.data : response;
  },
  getPendingTasks: async () => {
    const response = await api.get('/tasks/pending');
    return response?.data !== undefined ? response.data : response;
  },
  getAvailableCouriers: async () => {
    const response = await api.get('/tasks/available-couriers');
    return response?.data !== undefined ? response.data : response;
  },
  assignTask: async (taskId, courierId) => {
    const response = await api.put(`/tasks/${taskId}/assign`, { courierId });
    return response?.data !== undefined ? response.data : response;
  },
  updateStatus: async (taskId, status) => {
    const response = await api.put(`/tasks/${taskId}/status?status=${status}`);
    return response?.data !== undefined ? response.data : response;
  }
};

export const getAllTasks = (...args) => taskService.getAllTasks(...args);
export const createTask = (...args) => taskService.createTask(...args);
export const getPendingTasks = (...args) => taskService.getPendingTasks(...args);
export const getAvailableCouriers = (...args) => taskService.getAvailableCouriers(...args);
export const assignTask = (...args) => taskService.assignTask(...args);
export const updateStatus = (...args) => taskService.updateStatus(...args);

export default taskService;
