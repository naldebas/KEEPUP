// Fix: Implement the CustomerGrowthWidget.
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { api } from '../../../sdk';
import type { TimeSeriesData } from '../../../types';
import { Skeleton } from '../../ui/Skeleton';

const CustomerGrowthWidget: React.FC<{ timePeriod: number }> = ({ timePeriod }) => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await api.analytics.getCustomerGrowth(timePeriod);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch customer growth:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timePeriod]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Growth</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : data.length > 0 ? (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} stroke="#64748b"/>
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    borderRadius: '0.75rem',
                    borderColor: '#e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number) => [value, 'New Customers']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#c2410c"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#c2410c' }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-slate-500">
            No customer growth data available for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerGrowthWidget;