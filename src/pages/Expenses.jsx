import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { expenseService } from '../services/expenseService';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseCard from '../components/ExpenseCard';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { PlusCircle, Search, Filter, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  'All',
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

const Expenses = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOption, setSortOption] = useState('date_desc');

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const fetchExpenses = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      let sortBy = 'expense_date';
      let sortOrder = 'desc';

      if (sortOption === 'date_asc') {
        sortBy = 'expense_date';
        sortOrder = 'asc';
      } else if (sortOption === 'amount_desc') {
        sortBy = 'amount';
        sortOrder = 'desc';
      } else if (sortOption === 'amount_asc') {
        sortBy = 'amount';
        sortOrder = 'asc';
      }

      const params = {
        page,
        limit: pagination.limit,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: search.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy,
        sortOrder
      };

      const res = await expenseService.getExpenses(params);
      setExpenses(res.data.expenses || []);
      setPagination(res.data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(1);
  }, [selectedCategory, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExpenses(1);
  };

  const handleEdit = (expense) => {
    navigate(`/expenses/edit/${expense.id}`);
  };

  const promptDelete = (expense) => {
    setExpenseToDelete(expense);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await expenseService.deleteExpense(expenseToDelete.id);
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
      fetchExpenses(pagination.page);
    } catch (err) {
      setError(err.message || 'Failed to delete expense.');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Expense History</h1>
          <p className="page-subtitle">Track, filter, and review all your purchases in detail.</p>
        </div>
        <div>
          <Link to="/expenses/add" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Record Expense</span>
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} retry={() => fetchExpenses(pagination.page)} />

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search box */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search description or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Date range */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="date"
              className="form-input"
              style={{ width: 'auto', padding: '0.65rem 0.75rem' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="From Date"
            />
            <input
              type="date"
              className="form-input"
              style={{ width: 'auto', padding: '0.65rem 0.75rem' }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="To Date"
            />
          </div>

          {/* Sort dropdown */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="form-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ padding: '0.65rem 0.75rem' }}
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
          </div>

          <button type="submit" className="btn btn-secondary">
            Filter
          </button>
        </form>

        {/* Category Pills Bar */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingTop: '1rem', paddingBottom: '0.25rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className="btn btn-sm"
              style={{
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-input)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Expense Listing */}
      {loading ? (
        <LoadingSpinner message="Fetching expenses..." />
      ) : expenses.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description={search || selectedCategory !== 'All' ? "Try adjusting your filters or search keyword." : "You haven't logged any expenses yet."}
          actionText="Add New Expense"
          actionLink="/expenses/add"
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div style={{ display: 'none' }} className="md-show">
            <ExpenseTable expenses={expenses} onEdit={handleEdit} onDelete={promptDelete} />
          </div>

          {/* Mobile Card View */}
          <div className="md-hide">
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={handleEdit}
                onDelete={promptDelete}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchExpenses(pagination.page - 1)}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchExpenses(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="Delete this expense?"
        message={`Are you sure you want to delete "${expenseToDelete?.description}"? This will update your charts and budget metrics.`}
        confirmText="Yes, Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
      />
    </div>
  );
};

export default Expenses;
