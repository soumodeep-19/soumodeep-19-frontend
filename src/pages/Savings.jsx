import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { savingsService } from '../services/savingsService';
import SavingsProgress from '../components/SavingsProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { PlusCircle, Target, Sparkles, TrendingUp } from 'lucide-react';

const Savings = () => {
  const { formatAmount } = useAuth();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Update Amount Modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [activeGoal, setActiveGoal] = useState(null);
  const [newSavedAmount, setNewSavedAmount] = useState('');

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [goalToDeleteId, setGoalToDeleteId] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await savingsService.getSavingsGoals();
      setGoals(res.data.goals || []);
    } catch (err) {
      setError(err.message || 'Failed to load savings goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter a goal name.');
    if (!targetAmount || Number(targetAmount) <= 0) return setError('Please enter a valid target amount.');

    try {
      setSubmitting(true);
      setError('');
      await savingsService.createSavingsGoal({
        name,
        target_amount: Number(targetAmount),
        saved_amount: Number(savedAmount) || 0,
        deadline: deadline || null
      });
      setCreateModalOpen(false);
      setName('');
      setTargetAmount('');
      setSavedAmount('0');
      setDeadline('');
      fetchGoals();
    } catch (err) {
      setError(err.message || 'Failed to create goal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenUpdateModal = (goal) => {
    setActiveGoal(goal);
    setNewSavedAmount(goal.saved_amount);
    setUpdateModalOpen(true);
  };

  const handleSaveProgress = async (e) => {
    e.preventDefault();
    if (!activeGoal) return;
    if (newSavedAmount === '' || Number(newSavedAmount) < 0) {
      return setError('Saved amount cannot be negative.');
    }

    try {
      setSubmitting(true);
      setError('');
      await savingsService.updateSavingsGoal(activeGoal.id, {
        saved_amount: Number(newSavedAmount)
      });
      setUpdateModalOpen(false);
      setActiveGoal(null);
      fetchGoals();
    } catch (err) {
      setError(err.message || 'Failed to update savings progress.');
    } finally {
      setSubmitting(false);
    }
  };

  const promptDelete = (id) => {
    setGoalToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!goalToDeleteId) return;
    try {
      await savingsService.deleteSavingsGoal(goalToDeleteId);
      setDeleteModalOpen(false);
      setGoalToDeleteId(null);
      fetchGoals();
    } catch (err) {
      setError(err.message || 'Failed to delete goal.');
    }
  };

  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.saved_amount), 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Savings Goals</h1>
          <p className="page-subtitle">Track what you're saving for and celebrate every milestone!</p>
        </div>
        <div>
          <button onClick={() => setCreateModalOpen(true)} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Create New Goal</span>
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} retry={fetchGoals} />

      {/* Aggregate Savings Progress Bar */}
      {goals.length > 0 && (
        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--primary-light)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Total Savings Milestone</h3>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--success)' }}>
              {formatAmount(totalSaved)} / {formatAmount(totalTarget)} ({overallPercentage}%)
            </div>
          </div>
          <div className="progress-bar-container" style={{ height: '12px' }}>
            <div
              className="progress-bar-fill normal"
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            />
          </div>
        </div>
      )}

      {/* Goals List */}
      {loading ? (
        <LoadingSpinner message="Loading your goals..." />
      ) : goals.length === 0 ? (
        <EmptyState
          title="No savings goals yet!"
          description="Setting a goal helps you stay motivated to save money instead of spending it on impulse snacks or microtransactions."
          actionText="Create Your First Goal"
          actionLink={null}
          icon={Target}
        />
      ) : (
        <div>
          {goals.map((goal) => (
            <SavingsProgress
              key={goal.id}
              goal={goal}
              onEdit={handleOpenUpdateModal}
              onDelete={promptDelete}
            />
          ))}
        </div>
      )}

      {/* Create Goal Modal */}
      {createModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Add a New Savings Goal
            </h3>

            <form onSubmit={handleCreateGoal}>
              <div className="form-group">
                <label className="form-label">Goal Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Wireless Headphones, Birthday Gift"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Target Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="e.g. 5000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Already Saved</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="e.g. 1000"
                    value={savedAmount}
                    onChange={(e) => setSavedAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Date (Optional)</label>
                <input
                  type="date"
                  className="form-input"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Saved Amount Modal */}
      {updateModalOpen && activeGoal && (
        <div className="modal-overlay" onClick={() => setUpdateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Update Progress for "{activeGoal.name}"
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
              Target: {formatAmount(activeGoal.target_amount)}
            </p>

            <form onSubmit={handleSaveProgress}>
              <div className="form-group">
                <label className="form-label">Current Total Saved Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={newSavedAmount}
                  onChange={(e) => setNewSavedAmount(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setUpdateModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Update Amount'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete Savings Goal?"
        message="Are you sure you want to delete this goal? This cannot be undone."
        confirmText="Delete Goal"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setGoalToDeleteId(null);
        }}
      />
    </div>
  );
};

export default Savings;
