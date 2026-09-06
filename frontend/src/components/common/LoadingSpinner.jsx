import React from 'react';

const LoadingSpinner = () => {
  return (
    <div data-testid="loader" className="loading-spinner-container">
      <div className="spinner-ring"></div>
      <span className="spinner-text">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
