import React from 'react';

const StatCards = ({ stats = [] }) => {
  return (
    <div className="stat-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '20px 0' }}>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="stat-card"
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div
            className="stat-card-label"
            style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            {stat.label}
          </div>
          <div
            className="stat-card-value"
            style={{ fontSize: '1.875rem', fontWeight: '700', color: '#0f172a', marginTop: '8px' }}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
