// Fix: Implement the BookingStatusWidget.
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { api } from '../../../sdk';
import type { ReservationStatus } from '../../../types';
import { Skeleton } from '../../ui/Skeleton';
import { Badge } from '../../ui/Badge';

const statusVariantMap: { [key in ReservationStatus]: 'success' | 'warning' | 'destructive' | 'default' } = {
    'Confirmed': 'success',
    'Pending': 'warning',
    'Cancelled': 'destructive',
    'Completed': 'default'
}

const BookingStatusWidget: React.FC = () => {
  const [counts, setCounts] = useState<Record<ReservationStatus, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await api.analytics.getBookingStatusCounts();
        setCounts(result);
      } catch (error) {
        console.error("Failed to fetch booking status counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle>Today's Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="space-y-4 pt-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
            </div>
        ) : (
            <ul className="divide-y divide-gray-200">
                {counts && (Object.keys(counts) as ReservationStatus[]).map((status) => (
                    <li key={status} className="py-3 flex justify-between items-center text-sm">
                        <Badge variant={statusVariantMap[status]}>{status}</Badge>
                        <span className="font-medium">{counts[status]}</span>
                    </li>
                ))}
            </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingStatusWidget;
