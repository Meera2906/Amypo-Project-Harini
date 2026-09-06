import React from 'react';

const CapacityBar = ({ current = 0, total = 100 }) => {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  let fillColor = '#22c55e'; // Green below 70%
  if (percentage >= 90) {
    fillColor = '#ef4444'; // Red at or above 90%
  } else if (percentage >= 70) {
    fillColor = '#f59e0b'; // Amber between 70% and 90%
  }

  return (
    <div className="capacity-bar-container" style={{ width: '100%' }}>
      <div
        className="capacity-bar-track"
        style={{
          backgroundColor: '#e2e8f0',
          borderRadius: '9999px',
          height: '10px',
          overflow: 'hidden',
          width: '100%'
        }}
      >
        <div
          className="capacity-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: fillColor,
            height: '100%',
            transition: 'width 0.3s ease, background-color 0.3s ease'
          }}
        />
      </div>
      <div
        className="capacity-bar-label"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#64748b',
          marginTop: '4px'
        }}
      >
        <span>{current} / {total}</span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
};

export default CapacityBar;
