// Fix: Create the QuickStats component to display KPI cards on the dashboard.
import React, { useState, useEffect } from 'react';
import { KpiCard } from '../ui/KpiCard';
import { getQuickStats } from '../../services/mockApi';
import type { QuickStatsData } from '../../types';

const QuickStats: React.FC = () => {
  const [stats, setStats] = useState<QuickStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getQuickStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch quick stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  }

  const formatChange = (change: number) => `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total Revenue"
        value={stats ? formatCurrency(stats.totalRevenue.value) : ''}
        change={stats ? formatChange(stats.totalRevenue.change) : ''}
        changeType={stats && stats.totalRevenue.change >= 0 ? 'increase' : 'decrease'}
        loading={loading}
      />
      <KpiCard
        title="New Customers"
        value={stats ? stats.newCustomers.value.toLocaleString() : ''}
        change={stats ? formatChange(stats.newCustomers.change) : ''}
        changeType={stats && stats.newCustomers.change >= 0 ? 'increase' : 'decrease'}
        loading={loading}
      />
      <KpiCard
        title="Avg. Revenue / User"
        value={stats ? formatCurrency(stats.avgRevenuePerUser.value) : ''}
        change={stats ? formatChange(stats.avgRevenuePerUser.change) : ''}
        changeType={stats && stats.avgRevenuePerUser.change >= 0 ? 'increase' : 'decrease'}
        loading={loading}
      />
      <KpiCard
        title="Conversion Rate"
        value={stats ? `${stats.conversionRate.value.toFixed(1)}%` : ''}
        change={stats ? formatChange(stats.conversionRate.change) : ''}
        changeType={stats && stats.conversionRate.change >= 0 ? 'increase' : 'decrease'}
        loading={loading}
      />
    </div>
  );
};

export default QuickStats;
