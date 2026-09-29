import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import SummaryCard from '../components/SummaryCard';
import BudgetProgress from '../components/BudgetProgress';
import SavingsProgress from '../components/SavingsProgress';
import InsightCard from '../components/InsightCard';
import ExpenseCard from '../components/ExpenseCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  Wallet,
  Calendar,
  PiggyBank,
  CheckCircle,
  PlusCircle,
  TrendingDown,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user, formatAmount } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardService.getDashboard();
      setDashboardData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating your financial overview..." />;
  }

  const { metrics, recentExpenses, savingsGoals, insights } = dashboardData || {};

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Hey, {user?.name?.split(' ')[0] || 'Friend'}! 👋
          </h1>
          <p className="page-subtitle">
            Here's where your money is going this month. Keep building great habits!
          </p>
        </div>
        <div>
          <Link to="/expenses/add" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} retry={fetchDashboard} />

      {/* 1. Summary Cards Grid */}
      <div className="stats-grid">
        <SummaryCard
          title="Spent This Month"
          value={formatAmount(metrics?.totalMonthSpent || 0)}
          subtitle={`${metrics?.expenseCountThisMonth || 0} expenses recorded`}
          icon={Wallet}
          variant="coral"
        />

        <SummaryCard
          title="Spent This Week"
          value={formatAmount(metrics?.totalWeekSpent || 0)}
          subtitle="Mon - Sun velocity"
          icon={Calendar}
          variant="amber"
        />

        <SummaryCard
          title="Remaining Budget"
          value={
            metrics?.isOverBudget ? (
              <span style={{ color: 'var(--danger)' }}>
                Exceeded ({formatAmount(metrics?.overspentAmount || 0)})
              </span>
            ) : (
              formatAmount(metrics?.remainingBudget || 0)
            )
          }
          subtitle={
            metrics?.monthlyBudget > 0
              ? `${metrics.budgetUsedPercentage}% of ${formatAmount(metrics.monthlyBudget)} budget`
              : 'Set a budget in Budgets page'
          }
          icon={TrendingDown}
          variant={metrics?.isOverBudget ? 'coral' : 'cyan'}
        />

        <SummaryCard
          title="Total Saved"
          value={formatAmount(metrics?.totalSaved || 0)}
          subtitle="Across active goals"
          icon={PiggyBank}
          variant="mint"
        />
      </div>

      {/* 2. Smart Spending Insights Section */}
      {insights && insights.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary-light)" />
              Smart Spending Insights
            </h3>
            <Link to="/analytics" style={{ fontSize: '0.85rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
              Full Analytics <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.85rem' }}>
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* 3. Two Columns: Monthly Budget & Savings Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Monthly Budget Overview */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Monthly Budget</h3>
            <Link to="/budgets" style={{ fontSize: '0.82rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
              Manage Budgets
            </Link>
          </div>

          {metrics?.monthlyBudget > 0 ? (
            <BudgetProgress
              category="Overall Monthly Limit"
              spent={metrics.totalMonthSpent}
              budget={metrics.monthlyBudget}
              showBadge={false}
            />
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                You haven't set a monthly budget target yet. Setting limits helps you avoid overspending!
              </p>
              <Link to="/profile" className="btn btn-secondary btn-sm">
                Set Budget in Profile
              </Link>
            </div>
          )}

          {metrics?.categoryBreakdown && metrics.categoryBreakdown.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                Top Spending Category
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-input)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontWeight: 600 }}>{metrics.categoryBreakdown[0].category}</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>
                  {formatAmount(metrics.categoryBreakdown[0].amount)} ({metrics.categoryBreakdown[0].percentage}%)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Savings Goals Overview */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Active Savings Goals</h3>
            <Link to="/savings" style={{ fontSize: '0.82rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
              View All Goals
            </Link>
          </div>

          {savingsGoals && savingsGoals.length > 0 ? (
            savingsGoals.map((goal) => (
              <SavingsProgress key={goal.id} goal={goal} />
            ))
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                Saving for sneakers, a new game, or headphones? Create a goal to track your progress!
              </p>
              <Link to="/savings" className="btn btn-secondary btn-sm">
                Create Savings Goal
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 4. Recent Expenses Section */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Recent Activity</h3>
          <Link to="/expenses" style={{ fontSize: '0.85rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
            View All Expenses <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
          </Link>
        </div>

        {recentExpenses && recentExpenses.length > 0 ? (
          <div>
            {recentExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No expenses logged yet!"
            description="Whenever you buy snacks, gaming items, or bus rides, log it here to see your financial stats come alive."
            actionText="Record First Expense"
            actionLink="/expenses/add"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
