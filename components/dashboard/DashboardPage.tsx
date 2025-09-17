// Fix: Implement the DashboardPage, the main view after login.
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { downloadCSV } from '../../lib/utils';
import { api } from '../../sdk';
import QuickStats from './QuickStats';
import { Button } from '../ui/Button';
import RevenueTrendsWidget from './widgets/RevenueTrendsWidget';
import CustomerGrowthWidget from './widgets/CustomerGrowthWidget';
import TopCustomersWidget from './widgets/TopCustomersWidget';
import LoyaltyEngagementWidget from './widgets/LoyaltyEngagementWidget';
import UpcomingBookingsWidget from './widgets/UpcomingBookingsWidget';
import UpgradeTooltip from '../shared/UpgradeTooltip';
import TodaysBookingsWidget from './widgets/TodaysBookingsWidget';

type TimePeriod = 7 | 30 | 90;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { enableExport } = useFeatureFlags();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(30);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!enableExport) return;
    setIsExporting(true);
    try {
      const csvData = await api.analytics.exportDashboard(timePeriod);
      downloadCSV(csvData, `dashboard-export-${timePeriod}d.csv`);
    } catch (error) {
      console.error('Failed to export data', error);
      // In a real app, show a toast notification
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Welcome, {user?.name}!</h1>
            <p className="text-sm text-slate-500">
              Here's your business overview for the last {timePeriod} days.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div>
              {[7, 30, 90].map((period) => (
                <Button
                  key={period}
                  onClick={() => setTimePeriod(period as TimePeriod)}
                  isActive={timePeriod === period}
                >
                  {period}d
                </Button>
              ))}
            </div>
            <UpgradeTooltip featureEnabled={enableExport}>
              <Button
                variant="primary"
                onClick={handleExport}
                disabled={isExporting || !enableExport}
              >
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </Button>
            </UpgradeTooltip>
          </div>
        </div>
        
        {/* Quick Stats */}
        <QuickStats />

        {/* Main Dashboard Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <RevenueTrendsWidget timePeriod={timePeriod} />
            <CustomerGrowthWidget timePeriod={timePeriod} />
            <UpcomingBookingsWidget />
          </div>

          {/* Side Column */}
          <div className="lg:col-span-1 space-y-6">
            <TodaysBookingsWidget />
            <TopCustomersWidget />
            <LoyaltyEngagementWidget />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;