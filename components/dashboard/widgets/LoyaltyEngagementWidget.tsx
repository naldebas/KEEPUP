// Fix: Implement the LoyaltyEngagementWidget.
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { api } from '../../../sdk';
import type { LoyaltyEngagementData, Tier } from '../../../types';
import { Skeleton } from '../../ui/Skeleton';

const tierColorMap: Record<Tier, string> = {
    Platinum: '#0ea5e9', // sky-500
    Gold: '#f97316',     // orange-500
    Silver: '#64748b',   // slate-500
    Discovery: '#94a3b8',  // slate-400
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload[0].payload.totalMembers;
    const percentage = ((data.memberCount / total) * 100).toFixed(1);
    return (
      <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-md">
        <p className="font-semibold">{`${data.tier}`}</p>
        <p className="text-sm text-slate-700">{`Members: ${data.memberCount.toLocaleString()}`}</p>
        <p className="text-sm text-slate-500">{`(${percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

const LoyaltyEngagementWidget: React.FC = () => {
  const [data, setData] = useState<LoyaltyEngagementData[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await api.analytics.getLoyaltyEngagement();
        const total = result.reduce((sum, item) => sum + item.memberCount, 0);
        setData(result);
        setTotalMembers(total);
      } catch (error) {
        console.error("Failed to fetch loyalty engagement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = data.map(item => ({ ...item, totalMembers }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyalty Engagement</CardTitle>
      </CardHeader>
      <CardContent className="pt-4" style={{ height: '282px' }}>
         {loading ? (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
         ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="memberCount"
                nameKey="tier"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={tierColorMap[entry.tier]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconSize={10}
                iconType="circle"
                wrapperStyle={{ right: 0, top: '50%', transform: 'translateY(-50%)', lineHeight: '24px' }}
              />
            </PieChart>
          </ResponsiveContainer>
         )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyEngagementWidget;