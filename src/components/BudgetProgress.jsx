import React from 'react';
import { useAuth } from '../context/AuthContext';
import CategoryBadge from './CategoryBadge';

const BudgetProgress = ({
  category,
  spent = 0,
  budget = 0,
  showBadge = true
}) => {
  const { formatAmount } = useAuth();

  const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const isOver = spent > budget && budget > 0;
  const remaining = Math.max(0, budget - spent);

  let statusClass = 'normal';
  if (isOver) {
    statusClass = 'danger';
  } else if (percentage >= 80) {
    statusClass = 'warning';
  }

  return (
    <div style={{ padding: '0.85rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {showBadge && category ? (
            <CategoryBadge category={category} />
          ) : (
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{category || 'Overall Budget'}</span>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isOver ? 'var(--danger)' : 'var(--text-primary)' }}>
            {formatAmount(spent)}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {' / '}{formatAmount(budget)}
          </span>
        </div>
      </div>

      <div className="progress-bar-container" style={{ margin: '0.5rem 0' }}>
        <div
          className={`progress-bar-fill ${statusClass}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        <span>
          {isOver ? (
            <strong style={{ color: 'var(--danger)' }}>
              Over budget by {formatAmount(spent - budget)}!
            </strong>
          ) : (
            `${formatAmount(remaining)} remaining`
          )}
        </span>
        <span style={{ fontWeight: 600, color: isOver ? 'var(--danger)' : (percentage >= 80 ? 'var(--warning)' : 'inherit') }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default BudgetProgress;
