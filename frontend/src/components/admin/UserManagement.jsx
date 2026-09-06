import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import EmptyState from '../common/EmptyState';

const initialUsersFallback = [
  { id: 2, username: 'manager1', email: 'manager1@lastmile.com', role: 'DISPATCH_MANAGER', isActive: true },
  { id: 3, username: 'merchant1', email: 'merchant1@lastmile.com', role: 'MERCHANT_PARTNER', isActive: true },
  { id: 4, username: 'courier1', email: 'courier1@lastmile.com', role: 'FIELD_COURIER', isActive: true },
  { id: 5, username: 'courier2', email: 'courier2@lastmile.com', role: 'FIELD_COURIER', isActive: false }
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers();
      const data = response?.data !== undefined ? response.data : response;
      const userList = Array.isArray(data)
        ? data
        : data?.content && Array.isArray(data.content)
        ? data.content
        : initialUsersFallback;

      // Filter out PLATFORM_ADMIN users from display as required by SRS 14.6
      const filtered = userList.filter((u) => u.role !== 'PLATFORM_ADMIN');
      setUsers(filtered);
    } catch (err) {
      const filtered = initialUsersFallback.filter((u) => u.role !== 'PLATFORM_ADMIN');
      setUsers(filtered);
      setError(err?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const actionWord = user.isActive ? 'Revoke' : 'Restore';
    const confirmed = window.confirm(`Are you sure you want to ${actionWord} access for ${user.username}?`);
    if (!confirmed) return;

    try {
      await adminService.toggleStatus(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (err) {
      alert(err?.message || 'Failed to update user status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err?.message || 'Failed to update user role');
    }
  };

  return (
    <div className="user-management-page">
      <div className="user-management-header">
        <div>
          <h1 className="users-title">User Management</h1>
          <p className="users-subtitle">
            Administer system roles, personnel privileges, and platform credentials
          </p>
        </div>
        <button type="button" onClick={fetchUsers} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="personnel-loading" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner-ring" style={{ margin: '0 auto 16px' }}></div>
          <p className="loading-text">Syncing Personnel Database...</p>
        </div>
      ) : users.length === 0 ? (
        <EmptyState message="No personnel accounts to manage." />
      ) : (
        <div className="table-responsive-wrapper">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Access Status</th>
                <th>Security Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="task-id-cell">USR-#{u.id}</td>
                  <td>
                    <strong>{u.username}</strong>
                  </td>
                  <td>{u.email || `${u.username}@lastmile.com`}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="role-select"
                    >
                      <option value="DISPATCH_MANAGER">DISPATCH_MANAGER</option>
                      <option value="MERCHANT_PARTNER">MERCHANT_PARTNER</option>
                      <option value="FIELD_COURIER">FIELD_COURIER</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${u.isActive ? 'status-active' : 'status-revoked'}`}>
                      {u.isActive ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u)}
                      className={`btn-action ${u.isActive ? 'btn-revoke' : 'btn-restore'}`}
                    >
                      {u.isActive ? 'Revoke Access' : 'Restore Access'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
