import api from './api';

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response?.data !== undefined ? response.data : response;
};

export const toggleStatus = async (id) => {
  const response = await api.put(`/admin/users/${id}/toggle-status`);
  return response?.data !== undefined ? response.data : response;
};

export const updateRole = async (id, role) => {
  const response = await api.put(`/admin/users/${id}/role`, { role });
  return response?.data !== undefined ? response.data : response;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response?.data !== undefined ? response.data : response;
};

const adminService = {
  getUsers,
  toggleStatus,
  updateRole,
  deleteUser
};

export default adminService;
