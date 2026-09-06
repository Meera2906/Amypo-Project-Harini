import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import TaskList from './components/tasks/TaskList';
import CreateTask from './components/merchant/CreateTask';
import MyOrders from './components/merchant/MyOrders';
import UserManagement from './components/admin/UserManagement';
import StatCards from './components/dashboard/StatCards';
import CapacityBar from './components/common/CapacityBar';

function App() {
  const user = useSelector((state) => state.auth?.user);
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const renderContent = () => {
    // If not logged in, always render Login view unless viewing public paths
    if (!user) {
      return <Login />;
    }

    // Role-based route handling
    const role = user.role;

    if (currentPath === '/users' && role === 'PLATFORM_ADMIN') {
      return <UserManagement />;
    }

    if (currentPath === '/tasks') {
      return <TaskList />;
    }

    if (currentPath === '/create-task' && role === 'MERCHANT_PARTNER') {
      return <CreateTask />;
    }

    if (currentPath === '/my-orders' && role === 'MERCHANT_PARTNER') {
      return <MyOrders />;
    }

    // Default Role Dashboards for '/'
    if (role === 'PLATFORM_ADMIN') {
      return (
        <div className="admin-dashboard-container">
          <div className="dashboard-hero">
            <h1>Platform Administration Control</h1>
            <p>System-wide logistics observability, user credentials, and security controls</p>
          </div>
          <StatCards
            stats={[
              { label: 'Active Users', value: '24' },
              { label: 'Pending Dispatches', value: '8' },
              { label: 'Completed Deliveries', value: '142' },
              { label: 'Route Efficiency', value: '94.2%' }
            ]}
          />
          <UserManagement />
        </div>
      );
    }

    if (role === 'DISPATCH_MANAGER') {
      return (
        <div className="manager-dashboard-container">
          <div className="dashboard-hero">
            <h1>Dispatch Operations Terminal</h1>
            <p>Monitor local zone capacity, assign couriers, and balance queue throughput</p>
          </div>
          <StatCards
            stats={[
              { label: 'Open Deliveries', value: '5' },
              { label: 'In-Transit Deliveries', value: '7' },
              { label: 'Available Couriers', value: '4' },
              { label: 'Fleet Capacity', value: '68%' }
            ]}
          />
          <div style={{ marginBottom: '24px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Real-time Fleet Delivery Capacity
            </h4>
            <CapacityBar current={68} total={100} />
          </div>
          <TaskList />
        </div>
      );
    }

    if (role === 'MERCHANT_PARTNER') {
      return (
        <div className="merchant-dashboard-container">
          <div className="dashboard-hero">
            <h1>Merchant Dispatch Hub</h1>
            <p>Create new orders and supervise live hyper-local fulfillment</p>
          </div>
          <CreateTask />
          <div style={{ marginTop: '40px' }}>
            <MyOrders />
          </div>
        </div>
      );
    }

    if (role === 'FIELD_COURIER') {
      return (
        <div className="courier-dashboard-container">
          <div className="dashboard-hero">
            <h1>Courier Route Board</h1>
            <p>Review assigned pickups, update delivery milestones, and optimize route time</p>
          </div>
          <div style={{ marginBottom: '24px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Today's Payload Capacity
            </h4>
            <CapacityBar current={15} total={25} />
          </div>
          <TaskList />
        </div>
      );
    }

    return <TaskList />;
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
