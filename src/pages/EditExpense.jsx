import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { expenseService } from '../services/expenseService';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await expenseService.getExpenseById(id);
        setExpense(res.data.expense);
      } catch (err) {
        setError(err.message || 'Failed to load expense details.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleUpdate = async (formData) => {
    await expenseService.updateExpense(id, formData);
    navigate('/expenses');
  };

  if (loading) {
    return <LoadingSpinner message="Loading expense details..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
        <div>
          <h1 className="page-title">Edit Expense</h1>
          <p className="page-subtitle">Update your transaction record and notes.</p>
        </div>
      </div>

      <ErrorMessage message={error} retry={() => navigate('/expenses')} />

      {expense && (
        <ExpenseForm
          initialData={expense}
          onSubmit={handleUpdate}
          onCancel={() => navigate('/expenses')}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditExpense;
