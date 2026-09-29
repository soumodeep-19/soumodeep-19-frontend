import React from 'react';

const ChartCard = ({ title, subtitle, children, rightAction }) => {
  return (
    <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{title}</h3>
          {subtitle && (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {subtitle}
            </p>
          )}
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
      <div style={{ width: '100%', minHeight: '280px', flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
