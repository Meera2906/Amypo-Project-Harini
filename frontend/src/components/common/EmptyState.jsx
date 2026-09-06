import React from 'react';

const EmptyState = ({ message = 'No data available' }) => {
  return (
    <div className="empty-state-wrapper">
      <div className="empty-state-icon">📦</div>
      <p className="empty-state-message">{message}</p>
    </div>
  );
};

export default EmptyState;
