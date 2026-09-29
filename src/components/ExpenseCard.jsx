import React from 'react';
import { useAuth } from '../context/AuthContext';
import CategoryBadge from './CategoryBadge';
import { Calendar, CreditCard, Edit2, Trash2 } from 'lucide-react';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const { formatAmount } = useAuth();

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '1.1rem',
        marginBottom: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        transition: 'var(--transition)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {expense.description}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <CategoryBadge category={expense.category} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={12} /> {expense.expense_date}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CreditCard size={12} /> {expense.payment_method}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger)' }}>
            -{formatAmount(expense.amount)}
          </div>
        </div>
      </div>

      {expense.note && (
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'var(--bg-input)', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
          💬 {expense.note}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
        {onEdit && (
          <button
            onClick={() => onEdit(expense)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
          >
            <Edit2 size={13} /> Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(expense)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', color: 'var(--danger)' }}
          >
            <Trash2 size={13} /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpenseCard;
