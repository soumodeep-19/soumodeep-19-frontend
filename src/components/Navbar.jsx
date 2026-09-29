import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Wallet, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, currencySymbol } = useAuth();

  return (
    <header className="top-navbar">
      <Link to="/dashboard" className="nav-brand">
        <div className="brand-icon">⚡</div>
        <span>TeenSpend</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/expenses/add" className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          <span style={{ display: 'none' }} className="sm-show">Add Expense</span>
          <span>Add</span>
        </Link>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-card)'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                {user.name?.split(' ')[0] || 'Teen'}
              </span>
            </Link>

            <button
              onClick={logout}
              className="btn btn-icon btn-sm"
              title="Log out"
              style={{ color: 'var(--text-secondary)' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
