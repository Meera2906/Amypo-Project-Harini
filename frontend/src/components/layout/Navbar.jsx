import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  let navigate;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch (e) {
    navigate = (path) => {
      if (typeof window !== 'undefined') window.location.pathname = path;
    };
  }

  const handleLogout = () => {
    dispatch(logout());
    if (navigate) navigate('/login');
  };

  const role = user?.role;

  return (
    <nav className="navbar-container" role="navigation">
      <div className="navbar-brand">
        <span className="brand-icon">📦</span>
        <span className="brand-name">LastMile</span>
        <span className="brand-badge">Optimizer</span>
      </div>

      <div className="navbar-links">
        {user && (
          <>
            {role === 'PLATFORM_ADMIN' && (
              <a href="/users" className="nav-link" onClick={(e) => { e.preventDefault(); if (navigate) navigate('/users'); }}>
                User Management
              </a>
            )}

            {role === 'DISPATCH_MANAGER' && (
              <a href="/tasks" className="nav-link" onClick={(e) => { e.preventDefault(); if (navigate) navigate('/tasks'); }}>
                Delivery Task
              </a>
            )}

            {role === 'MERCHANT_PARTNER' && (
              <>
                <a href="/create-task" className="nav-link" onClick={(e) => { e.preventDefault(); if (navigate) navigate('/create-task'); }}>
                  Create Delivery
                </a>
                <a href="/my-orders" className="nav-link" onClick={(e) => { e.preventDefault(); if (navigate) navigate('/my-orders'); }}>
                  My Orders
                </a>
              </>
            )}

            {role === 'FIELD_COURIER' && (
              <a href="/tasks" className="nav-link" onClick={(e) => { e.preventDefault(); if (navigate) navigate('/tasks'); }}>
                My Deliveries
              </a>
            )}
          </>
        )}
      </div>

      <div className="navbar-auth-section">
        {user ? (
          <div className="user-profile-bar">
            <span className="welcome-text">
              Welcome, {user.username || 'User'}!
            </span>
            <span className="role-tag">{role}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="logout-button"
              role="button"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="guest-actions">
            <button
              type="button"
              onClick={() => { if (navigate) navigate('/login'); }}
              className="login-nav-btn"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;