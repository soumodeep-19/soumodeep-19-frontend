import React from 'react';

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default'
}) => {
  return (
    <div className={`stat-card ${variant}`}>
      {Icon && (
        <div className="stat-icon-wrapper">
          <Icon size={24} />
        </div>
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default SummaryCard;
