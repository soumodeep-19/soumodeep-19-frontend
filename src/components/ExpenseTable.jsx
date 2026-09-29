import React from 'react';
import { useAuth } from '../context/AuthContext';
import CategoryBadge from './CategoryBadge';
import { Edit2, Trash2 } from 'lucide-react';

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  const { formatAmount } = useAuth();

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Method</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {expense.expense_date}
              </td>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {expense.description}
                </div>
                {expense.note && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {expense.note}
                  </div>
                )}
              </td>
              <td>
                <CategoryBadge category={expense.category} />
              </td>
              <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {expense.payment_method}
              </td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--danger)', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                -{formatAmount(expense.amount)}
              </td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={() => onEdit(expense)}
                    className="btn btn-icon btn-sm"
                    title="Edit Expense"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(expense)}
                    className="btn btn-icon btn-sm"
                    style={{ color: 'var(--danger)' }}
                    title="Delete Expense"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
