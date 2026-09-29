import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { expenseService } from '../services/expenseService';

const AddExpense = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    await expenseService.createExpense(formData);
    navigate('/expenses');
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
        <div>
          <h1 className="page-title">Record an Expense</h1>
          <p className="page-subtitle">Track your daily purchases, snacks, and hangouts.</p>
        </div>
      </div>

      <ExpenseForm
        onSubmit={handleCreate}
        onCancel={() => navigate('/expenses')}
        isEditing={false}
      />
    </div>
  );
};

export default AddExpense;
