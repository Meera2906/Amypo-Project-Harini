import React, { useState, useEffect } from 'react';
import merchantService from '../../services/merchantService';
import EmptyState from '../common/EmptyState';

const initialOrdersFallback = [
  {
    id: 201,
    parcelName: 'Fresh Organic Produce Pack',
    pickupLocation: 'Green Valley Grocers',
    deliveryLocation: '14 Elm Court, Suite 4',
    packageWeightKg: 4.8,
    status: 'COMPLETED'
  },
  {
    id: 202,
    parcelName: 'Artisanal Pastries Box',
    pickupLocation: 'Downtown Bakery, Hub 1',
    deliveryLocation: '77 Ocean Boulevard',
    packageWeightKg: 1.5,
    status: 'PENDING'
  }
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await merchantService.getMyTasks();
        const data = response?.data !== undefined ? response.data : response;
        if (isMounted) {
          if (Array.isArray(data)) {
            setOrders(data);
          } else if (data?.content && Array.isArray(data.content)) {
            setOrders(data.content);
          } else {
            setOrders(initialOrdersFallback);
          }
        }
      } catch (err) {
        if (isMounted) {
          setOrders(initialOrdersFallback);
          setError(err?.message || 'Failed to sync order history');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="orders-page-container">
      <div className="orders-header-bar">
        <div>
          <h1 className="orders-title">Merchant Order Management</h1>
          <p className="orders-subtitle">
            Track historical and active order dispatches for your merchant storefronts
          </p>
        </div>
      </div>

      {loading ? (
        <div className="orders-loading" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner-ring" style={{ margin: '0 auto 16px' }}></div>
          <p className="loading-text">Syncing Order Books...</p>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState message="No orders registered for your storefront yet." />
      ) : (
        <div className="table-responsive-wrapper">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Parcel Details</th>
                <th>Pickup Hub</th>
                <th>Delivery Destination</th>
                <th>Weight</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = String(order.status || 'OPEN').toUpperCase();
                return (
                  <tr key={order.id}>
                    <td className="task-id-cell">ORD-#{order.id}</td>
                    <td className="task-name-cell">
                      <strong>{order.parcelName}</strong>
                    </td>
                    <td className="task-location-cell">{order.pickupLocation}</td>
                    <td className="task-location-cell">{order.deliveryLocation}</td>
                    <td className="task-weight-cell">{order.packageWeightKg} kg</td>
                    <td className="task-status-cell">
                      <span className={`status-badge status-${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
