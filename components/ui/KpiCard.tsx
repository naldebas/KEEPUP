import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  loading?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeType, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-md animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  return (
    <Card>
        <CardHeader className="p-5 pb-0">
            <CardTitle className="text-sm font-medium text-slate-500 truncate">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-1 p-5">
             <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-slate-900">{value}</p>
                {change && (
                    <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                        changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {change}
                    </p>
                )}
            </div>
        </CardContent>
    </Card>
  );
};

export { KpiCard };