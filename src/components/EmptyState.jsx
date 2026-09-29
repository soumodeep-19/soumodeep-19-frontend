import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PlusCircle } from 'lucide-react';

const EmptyState = ({
  title = 'No expenses yet!',
  description = 'Add your first expense to unlock smart spending charts and insights.',
  actionText = 'Add Expense',
  actionLink = '/expenses/add',
  icon: Icon = Sparkles
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-color)',
        margin: '1rem 0'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.12)',
          color: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          maxWidth: '380px',
          marginBottom: '1.5rem'
        }}
      >
        {description}
      </p>
      {actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
