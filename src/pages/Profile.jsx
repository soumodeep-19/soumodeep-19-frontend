import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import ErrorMessage from '../components/ErrorMessage';
import { User, Save, CheckCircle, Shield } from 'lucide-react';

const Profile = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    monthly_allowance: user?.monthly_allowance || 0,
    monthly_budget: user?.monthly_budget || 0,
    savings_goal: user?.savings_goal || 0,
    currency: user?.currency || 'INR'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return setError('Name cannot be empty.');
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await profileService.updateProfile({
        name: formData.name,
        monthly_allowance: Number(formData.monthly_allowance) || 0,
        monthly_budget: Number(formData.monthly_budget) || 0,
        savings_goal: Number(formData.savings_goal) || 0,
        currency: formData.currency
      });
      await refreshUser();
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ maxWidth: '640px', margin: '0 auto 1.5rem' }}>
        <div>
          <h1 className="page-title">My Profile & Preferences</h1>
          <p className="page-subtitle">Configure your monthly limits and currency settings.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {success && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--success-bg)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#6ee7b7',
              marginBottom: '1.25rem',
              fontSize: '0.9rem'
            }}
          >
            <CheckCircle size={18} color="var(--success)" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name / Nickname</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read-Only)</label>
            <input
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <Shield size={12} /> Contact support to change your account email.
            </span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Preferred Currency</label>
              <select
                name="currency"
                className="form-select"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="INR">Indian Rupee (₹ INR)</option>
                <option value="USD">US Dollar ($ USD)</option>
                <option value="EUR">Euro (€ EUR)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Allowance / Pocket Money</label>
              <input
                type="number"
                step="0.01"
                name="monthly_allowance"
                className="form-input"
                value={formData.monthly_allowance}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Monthly Spending Cap</label>
              <input
                type="number"
                step="0.01"
                name="monthly_budget"
                className="form-input"
                value={formData.monthly_budget}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Savings Target</label>
              <input
                type="number"
                step="0.01"
                name="savings_goal"
                className="form-input"
                value={formData.savings_goal}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
              ) : (
                <Save size={16} />
              )}
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
