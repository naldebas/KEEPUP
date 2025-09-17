import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { api } from '../../../sdk';
import type { TopCustomer } from '../../../types';

const tierColorMap = {
    Platinum: 'bg-accent-100 text-accent-800',
    Gold: 'bg-primary-100 text-primary-800',
    Silver: 'bg-slate-200 text-slate-800',
    Discovery: 'bg-slate-100 text-slate-700',
};

const TopCustomersWidget: React.FC = () => {
  const [customers, setCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use the new SDK to fetch data
        const data = await api.customers.getTopCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch top customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers (by CLV)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flow-root" style={{height: '250px', overflowY: 'auto'}}>
          {loading ? (
            <div className="space-y-4 pt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul role="list" className="-my-5 divide-y divide-slate-200">
              {customers.map((customer) => (
                <li key={customer.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {customer.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{customer.name}</p>
                      <p className="text-sm text-slate-500 truncate">
                          CLV: ${customer.clv.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierColorMap[customer.tier]}`}>
                          {customer.tier}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopCustomersWidget;