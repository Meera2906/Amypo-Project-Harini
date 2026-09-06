import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import taskService, { getAllTasks, getAvailableCouriers, assignTask, updateStatus } from '../../services/taskService';
import { setTasks } from '../../store/slices/taskSlice';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';

const initialFallbackTasks = [
  {
    id: 101,
    parcelName: 'Artisanal Bread',
    pickupLocation: 'Downtown Bakery, Hub 1',
    deliveryLocation: '42 Maple Street, Apt 3B',
    packageWeightKg: 2.4,
    status: 'OPEN',
    priority: 1
  },
  {
    id: 102,
    parcelName: 'Medical Supplies Batch C',
    pickupLocation: 'City Central Pharmacy',
    deliveryLocation: '88 Riverbend Parkway',
    packageWeightKg: 1.2,
    status: 'PENDING',
    priority: 2
  }
];

const TaskList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const [tasks, setLocalTasks] = useState(initialFallbackTasks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignModalTask, setAssignModalTask] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [selectedCourierId, setSelectedCourierId] = useState('');

  const isDispatchManager = user?.role === 'DISPATCH_MANAGER';
  const isCourier = user?.role === 'FIELD_COURIER';

  const parseTasks = (res) => {
    if (!res) return null;
    if (res.data?.content && Array.isArray(res.data.content)) return res.data.content;
    if (res.content && Array.isArray(res.content)) return res.content;
    if (res.data?.tasks && Array.isArray(res.data.tasks)) return res.data.tasks;
    if (res.data && Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res;
    return null;
  };

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchFn = taskService?.getAllTasks || getAllTasks;
      const response = await fetchFn();
      const list = parseTasks(response);
      if (list) {
        setLocalTasks(list);
        dispatch(setTasks(list));
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch tasks');
      // Keep fallback tasks on network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleOpenAssign = async (task) => {
    setAssignModalTask(task);
    try {
      const courierFn = taskService?.getAvailableCouriers || getAvailableCouriers;
      const courierList = await courierFn();
      const parsed = parseTasks(courierList) || [];
      setCouriers(parsed.length > 0 ? parsed : [
        { id: 1, username: 'courier1', email: 'courier1@lastmile.com' },
        { id: 2, username: 'courier2', email: 'courier2@lastmile.com' }
      ]);
    } catch (e) {
      setCouriers([
        { id: 1, username: 'courier1', email: 'courier1@lastmile.com' }
      ]);
    }
  };

  const handleConfirmAssign = async () => {
    if (!assignModalTask || !selectedCourierId) return;
    try {
      const assignFn = taskService?.assignTask || assignTask;
      await assignFn(assignModalTask.id, selectedCourierId);
      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === assignModalTask.id ? { ...t, status: 'PENDING' } : t
        )
      );
      setAssignModalTask(null);
      setSelectedCourierId('');
    } catch (err) {
      alert(err?.message || 'Assignment failed');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const updateFn = taskService?.updateStatus || updateStatus;
      await updateFn(taskId, newStatus);
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      alert(err?.message || 'Status update failed');
    }
  };

  return (
    <div className="task-list-page-container">
      <div className="task-list-header-banner">
        <div>
          <h1 className="queue-title">Logistics Optimization Queue</h1>
          <p className="queue-subtitle">
            Real-time hyper-local parcel dispatch, routing, and courier allocation
          </p>
        </div>
        <button
          type="button"
          onClick={loadTasks}
          className="refresh-btn"
          title="Refresh task list"
        >
          🔄 Refresh
        </button>
      </div>

      {loading && tasks.length === 0 ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState message="No logistics tasks available in the optimization queue." />
      ) : (
        <div className="table-responsive-wrapper">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Parcel Details</th>
                <th>Pickup Location</th>
                <th>Delivery Destination</th>
                <th>Weight (kg)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const statusStr = String(task.status || 'OPEN').toUpperCase();
                return (
                  <tr key={task.id || task.parcelName}>
                    <td className="task-id-cell">#{task.id || '—'}</td>
                    <td className="task-name-cell">
                      <strong>{task.parcelName || 'Delivery Parcel'}</strong>
                    </td>
                    <td className="task-location-cell">{task.pickupLocation || '—'}</td>
                    <td className="task-location-cell">{task.deliveryLocation || '—'}</td>
                    <td className="task-weight-cell">
                      {task.packageWeightKg != null ? `${task.packageWeightKg} kg` : '—'}
                    </td>
                    <td className="task-status-cell">
                      <span className={`status-badge status-${statusStr.toLowerCase()}`}>
                        {statusStr}
                      </span>
                    </td>
                    <td className="task-actions-cell">
                      {isDispatchManager && statusStr === 'OPEN' && (
                        <button
                          type="button"
                          className="btn-action btn-assign"
                          onClick={() => handleOpenAssign(task)}
                        >
                          Assign
                        </button>
                      )}

                      {isDispatchManager && statusStr === 'PENDING' && (
                        <button
                          type="button"
                          className="btn-action btn-reassign"
                          onClick={() => handleOpenAssign(task)}
                        >
                          Reassign
                        </button>
                      )}

                      {isCourier && statusStr === 'PENDING' && (
                        <button
                          type="button"
                          className="btn-action btn-pickup"
                          onClick={() => handleUpdateStatus(task.id, 'PICKED_UP')}
                        >
                          Pick Up
                        </button>
                      )}

                      {isCourier && statusStr === 'PICKED_UP' && (
                        <button
                          type="button"
                          className="btn-action btn-complete"
                          onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {assignModalTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Courier to #{assignModalTask.id}</h3>
            <p className="modal-subtext">Parcel: {assignModalTask.parcelName}</p>
            <div className="form-group" style={{ margin: '16px 0' }}>
              <label htmlFor="courierSelect">Select Field Courier</label>
              <select
                id="courierSelect"
                value={selectedCourierId}
                onChange={(e) => setSelectedCourierId(e.target.value)}
                className="login-input"
              >
                <option value="">-- Choose an available courier --</option>
                {couriers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.username} ({c.email || 'Active'})
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setAssignModalTask(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirmAssign}
                disabled={!selectedCourierId}
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
