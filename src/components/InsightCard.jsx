import React from 'react';
import { AlertTriangle, Info, CheckCircle, Lightbulb, Bell } from 'lucide-react';

const iconMap = {
  warning: AlertTriangle,
  alert: Bell,
  positive: CheckCircle,
  info: Info,
  tip: Lightbulb
};

const InsightCard = ({ insight }) => {
  const Icon = iconMap[insight.type] || Info;

  return (
    <div className={`insight-card ${insight.type}`}>
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: `var(--${insight.type === 'positive' ? 'success' : (insight.type === 'warning' ? 'danger' : (insight.type === 'alert' ? 'warning' : 'primary'))}-bg)`,
          color: `var(--${insight.type === 'positive' ? 'success' : (insight.type === 'warning' ? 'danger' : (insight.type === 'alert' ? 'warning' : 'primary-light'))})`
        }}
      >
        <Icon size={20} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 className="insight-title">{insight.title}</h4>
        <p className="insight-desc">{insight.message}</p>
        {insight.action && (
          <span className="insight-action">
            💡 {insight.action}
          </span>
        )}
      </div>
    </div>
  );
};

export default InsightCard;
