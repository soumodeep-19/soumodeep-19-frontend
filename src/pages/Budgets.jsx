import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/budgetService';
import { expenseService } from '../services/expenseService';
import BudgetProgress from '../components/BudgetProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import { PlusCircle, PiggyBank, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Gaming',
  'Transportation',
  'Shopping',
  'Education',
  'Subscriptions',
  'Entertainment',
  'Personal',
  'Other'
];

const Budgets = () => {
  const { user, formatAmount } = useAuth();

  const [budgets, setBudgets] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [savingBudget, setSavingBudget] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch budgets
      const budgetRes = await budgetService.getBudgets();
      setBudgets(budgetRes.data.budgets || []);

      // Fetch current month expenses to compute category spent
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const expenseRes = await expenseService.getExpenses({ startDate: firstDay, endDate: lastDay, limit: 100 });
      const expenses = expenseRes.data.expenses || [];

      const totals = {};
      expenses.forEach((e) => {
        totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
      });
      setCategoryExpenses(totals);
    } catch (err) {
      setError(err.message || 'Failed to load budgets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return setError('Please enter a valid positive budget amount.');
    }

    try {
      setSavingBudget(true);
      setError('');
      await budgetService.upsertBudget({
        category: selectedCategory,
        amount: Number(amount),
        period: 'monthly'
      });
      setModalOpen(false);
      setAmount('');
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to save budget.');
    } finally {
      setSavingBudget(false);
    }
  };

  const promptDelete = (b) => {
    setBudgetToDelete(b);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!budgetToDelete) return;
    try {
      await budgetService.deleteBudget(budgetToDelete.id);
      setDeleteModalOpen(false);
      setBudgetToDelete(null);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete budget limit.');
    }
  };

  // Warnings calculation
  const warnings = budgets.filter((b) => {
    const spent = categoryExpenses[b.category] || 0;
    const limit = Number(b.amount);
    return limit > 0 && spent / limit >= 0.8;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Budget Management</h1>
          <p className="page-subtitle">Set safe spending limits so you always have money left over.</p>
        </div>
        <div>
          <button onClick={() => setModalOpen(true)} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Set Category Limit</span>
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} retry={fetchData} />

      {/* Warnings Banner if any budget near/exceeded */}
      {warnings.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          {warnings.map((b) => {
            const spent = categoryExpenses[b.category] || 0;
            const limit = Number(b.amount);
            const isExceeded = spent > limit;
            const pct = Math.round((spent / limit) * 100);

            return (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isExceeded ? 'var(--danger-bg)' : 'var(--warning-bg)',
                  border: `1px solid ${isExceeded ? 'rgba(244, 63, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                  color: isExceeded ? '#fecdd3' : '#fef3c7',
                  marginBottom: '0.5rem',
                  fontSize: '0.88rem'
                }}
              >
                <AlertTriangle size={18} color={isExceeded ? 'var(--danger)' : 'var(--warning)'} />
                <div>
                  <strong>{b.category} Alert:</strong> You have used {pct}% of your limit ({formatAmount(spent)} of {formatAmount(limit)}).
                  {isExceeded ? " Try delaying further purchases in this category." : " Keep an eye on extra expenses!"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Monthly Target Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="card-title">Overall Monthly Budget Target</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
          Configured in your user profile:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly Allowance</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.2rem' }}>
              {formatAmount(user?.monthly_allowance || 0)}
            </div>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly Spending Cap</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--primary-light)' }}>
              {formatAmount(user?.monthly_budget || 0)}
            </div>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Planned Monthly Savings</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--success)' }}>
              {formatAmount(Math.max(0, (user?.monthly_allowance || 0) - (user?.monthly_budget || 0)))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Category Spending Limits</h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {budgets.length} categories budgeted
          </span>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading your budgets..." />
        ) : budgets.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <PiggyBank size={40} color="var(--primary-light)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
              No category limits configured yet
            </h4>
            <p style={{ fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
              Setting limits on categories like <em>Food</em> or <em>Gaming</em> ensures you don't burn through your allowance too quickly!
            </p>
            <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-sm">
              <PlusCircle size={16} />
              Set First Category Limit
            </button>
          </div>
        ) : (
          <div>
            {budgets.map((b) => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <BudgetProgress
                    category={b.category}
                    spent={categoryExpenses[b.category] || 0}
                    budget={Number(b.amount)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => promptDelete(b)}
                  className="btn btn-icon btn-sm"
                  style={{ color: 'var(--danger)', marginTop: '0.5rem' }}
                  title="Remove limit"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Budget Limit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
              Set Category Spending Limit
            </h3>

            <form onSubmit={handleSaveBudget}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Limit Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="e.g. 1500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingBudget}>
                  {savingBudget ? 'Saving...' : 'Save Limit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Remove category budget?"
        message={`Are you sure you want to remove the spending limit for ${budgetToDelete?.category}?`}
        confirmText="Remove"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setBudgetToDelete(null);
        }}
      />
    </div>
  );
};

export default Budgets;
