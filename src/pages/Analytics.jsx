import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import ChartCard from '../components/ChartCard';
import SummaryCard from '../components/SummaryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Award, DollarSign, PieChart as PieIcon } from 'lucide-react';

const CATEGORY_COLORS = {
  Food: '#fbbf24',
  Gaming: '#c084fc',
  Transportation: '#38bdf8',
  Shopping: '#fb7185',
  Education: '#34d399',
  Subscriptions: '#a5b4fc',
  Entertainment: '#f472b6',
  Personal: '#2dd4bf',
  Other: '#94a3b8'
};

const Analytics = () => {
  const { formatAmount, currencySymbol } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardService.getAnalytics();
      setAnalyticsData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Generating your spending charts..." />;
  }

  const { metrics, charts } = analyticsData || {};
  const hasExpenses = metrics && metrics.totalMonthSpent > 0;

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-card)',
            fontSize: '0.85rem'
          }}
        >
          {label && <p style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{label}</p>}
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color || item.fill, margin: '0.2rem 0' }}>
              {item.name}: <strong>{formatAmount(item.value)}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Spending Analytics</h1>
          <p className="page-subtitle">Visual breakdowns to help you understand where your money goes.</p>
        </div>
      </div>

      <ErrorMessage message={error} retry={fetchAnalytics} />

      {/* Overview Stat Cards */}
      <div className="stats-grid">
        <SummaryCard
          title="Daily Average"
          value={formatAmount(metrics?.averageDailySpending || 0)}
          subtitle="Spent per day this month"
          icon={TrendingUp}
          variant="cyan"
        />

        <SummaryCard
          title="Monthly Spend"
          value={formatAmount(metrics?.totalMonthSpent || 0)}
          subtitle={`Compared to ${formatAmount(metrics?.totalPrevMonthSpent || 0)} last month`}
          icon={DollarSign}
          variant="coral"
        />

        <SummaryCard
          title="Top Category"
          value={metrics?.categoryBreakdown?.[0]?.category || 'None'}
          subtitle={
            metrics?.categoryBreakdown?.[0]
              ? `${metrics.categoryBreakdown[0].percentage}% of your expenses`
              : 'No expenses'
          }
          icon={PieIcon}
          variant="amber"
        />

        <SummaryCard
          title="Budget Health"
          value={
            metrics?.isOverBudget ? (
              <span style={{ color: 'var(--danger)' }}>Over Budget</span>
            ) : metrics?.budgetUsedPercentage ? (
              `${metrics.budgetUsedPercentage}% used`
            ) : (
              'Good'
            )
          }
          subtitle={metrics?.remainingBudget ? `${formatAmount(metrics.remainingBudget)} remaining` : 'On track'}
          icon={Award}
          variant={metrics?.isOverBudget ? 'coral' : 'mint'}
        />
      </div>

      {!hasExpenses ? (
        <EmptyState
          title="Not enough data for charts yet"
          description="Log a few daily expenses to unlock interactive donut charts, daily spending curves, and month-over-month comparisons."
          actionText="Add an Expense"
          actionLink="/expenses/add"
        />
      ) : (
        <>
          {/* Row 1: Category Donut Chart & Daily Spend Over Time Area Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* 1. Category Breakdown Donut Chart */}
            <ChartCard
              title="Spending by Category"
              subtitle="Where did your allowance go this month?"
            >
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={metrics?.categoryBreakdown || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {(metrics?.categoryBreakdown || []).map((entry) => (
                      <Cell
                        key={`cell-${entry.category}`}
                        fill={CATEGORY_COLORS[entry.category] || '#6366f1'}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 2. Spending Over Time Line/Area Chart */}
            <ChartCard
              title="Daily Spending Velocity"
              subtitle="Daily expenditure across the current month"
            >
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={charts?.spendingOverTime || []}>
                  <defs>
                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `${currencySymbol}${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    name="Daily Spend"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#spendGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Row 2: Category Comparison & Budget vs Actual */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* 3. Category Comparison Bar Chart (Current vs Previous Month) */}
            <ChartCard
              title="Category Comparison"
              subtitle="Current Month vs Previous Month"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={charts?.categoryComparison || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="category"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `${currencySymbol}${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>}
                  />
                  <Bar dataKey="currentMonth" name="This Month" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="previousMonth" name="Last Month" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 4. Budget vs Actual Spending */}
            <ChartCard
              title="Budget vs Actual Spending"
              subtitle="How closely are you sticking to your category targets?"
            >
              {charts?.budgetVsActual && charts.budgetVsActual.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={charts.budgetVsActual}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="category"
                      stroke="var(--text-muted)"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="var(--text-muted)"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `${currencySymbol}${val}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{value}</span>}
                    />
                    <Bar dataKey="budget" name="Budget Limit" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Actual Spent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    No category budgets established yet.
                  </p>
                  <a href="/budgets" className="btn btn-secondary btn-sm">
                    Set Category Budgets
                  </a>
                </div>
              )}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
