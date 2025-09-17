// Fix: Implement the RevenueTrendsWidget.
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { api } from '../../../sdk';
import type { TimeSeriesData } from '../../../types';
import { Skeleton } from '../../ui/Skeleton';

const RevenueTrendsWidget: React.FC<{ timePeriod: number }> = ({ timePeriod }) => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await api.analytics.getRevenueTrends(timePeriod);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch revenue trends:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timePeriod]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : data.length > 0 ? (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="#64748b"
                  tickFormatter={(value) => `$${Number(value) / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{
                    borderRadius: '0.75rem',
                    borderColor: '#e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number) => [
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    }).format(value),
                    'Revenue',
                  ]}
                />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-slate-500">
            No revenue data available for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueTrendsWidget;