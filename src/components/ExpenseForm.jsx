import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Save } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Education',
  'Gaming',
  'Subscriptions',
  'Personal',
  'Other'
];

const PAYMENT_METHODS = [
  'Cash',
  'Card',
  'UPI',
  'Bank',
  'Other'
];

const ExpenseForm = ({ initialData = {}, onSubmit, onCancel, isEditing = false }) => {
  const { currencySymbol } = useAuth();

  const [formData, setFormData] = useState({
    amount: initialData.amount || '',
    category: initialData.category || 'Food',
    description: initialData.description || '',
    expense_date: initialData.expense_date || new Date().toISOString().split('T')[0],
    payment_method: initialData.payment_method || 'Cash',
    note: initialData.note || ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      return setError('Please enter a valid positive amount.');
    }

    if (!formData.description.trim()) {
      return setError('Please provide a short description.');
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        amount: Number(formData.amount)
      });
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 className="card-title">
        {isEditing ? 'Edit Expense' : 'Add New Expense'}
      </h3>

      {error && (
        <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', color: '#fecdd3', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.88rem' }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Amount ({currencySymbol}) *</label>
        <input
          type="number"
          step="0.01"
          name="amount"
          className="form-input"
          placeholder="e.g. 250"
          value={formData.amount}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method *</label>
          <select
            name="payment_method"
            className="form-select"
            value={formData.payment_method}
            onChange={handleChange}
          >
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <input
          type="text"
          name="description"
          className="form-input"
          placeholder="e.g. Lunch with friends, Steam sale, Metro card"
          value={formData.description}
          onChange={handleChange}
          maxLength={200}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Date *</label>
        <input
          type="date"
          name="expense_date"
          className="form-input"
          value={formData.expense_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Personal Note (Optional)</label>
        <textarea
          name="note"
          className="form-textarea"
          rows={3}
          placeholder="Add tags or reminder notes (e.g. Split with Rohan, Science project)"
          value={formData.note}
          onChange={handleChange}
          maxLength={500}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
          ) : isEditing ? (
            <Save size={16} />
          ) : (
            <PlusCircle size={16} />
          )}
          {isEditing ? 'Save Changes' : 'Record Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
