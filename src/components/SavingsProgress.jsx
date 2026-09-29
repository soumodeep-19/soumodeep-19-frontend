import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Target, Calendar, CheckCircle2 } from 'lucide-react';

const SavingsProgress = ({ goal, onEdit, onDelete }) => {
  const { formatAmount } = useAuth();

  const target = Number(goal.target_amount) || 0;
  const saved = Number(goal.saved_amount) || 0;
  const percentage = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
  const isCompleted = saved >= target && target > 0;
  const remaining = Math.max(0, target - saved);

  return (
    <div
      style={{
        background: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        marginBottom: '1rem',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isCompleted ? 'var(--success-bg)' : 'rgba(99, 102, 241, 0.15)',
              color: isCompleted ? 'var(--success)' : 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isCompleted ? <CheckCircle2 size={20} /> : <Target size={20} />}
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{goal.name}</h4>
            {goal.deadline && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                <Calendar size={12} /> Target Date: {goal.deadline}
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isCompleted ? 'var(--success)' : 'var(--text-primary)' }}>
            {formatAmount(saved)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Target: {formatAmount(target)}
          </div>
        </div>
      </div>

      <div className="progress-bar-container" style={{ height: '10px', margin: '0.75rem 0' }}>
        <div
          className={`progress-bar-fill ${isCompleted ? 'success' : 'normal'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
        <span style={{ color: isCompleted ? 'var(--success)' : 'var(--text-secondary)' }}>
          {isCompleted ? 'Target achieved! 🎉' : `${formatAmount(remaining)} left to save`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 700, color: isCompleted ? 'var(--success)' : 'var(--primary-light)' }}>
            {percentage}%
          </span>
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
            >
              Update
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="btn btn-icon btn-sm"
              style={{ color: 'var(--danger)', padding: '0.2rem' }}
              title="Delete goal"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsProgress;
