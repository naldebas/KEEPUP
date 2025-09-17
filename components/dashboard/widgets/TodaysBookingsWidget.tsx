import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { api } from '../../../sdk';
import type { Reservation } from '../../../types';
import { Skeleton } from '../../ui/Skeleton';

const TodaysBookingsWidget: React.FC = () => {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await api.analytics.getTodaysBookings();
        setBookings(result);
      } catch (error) {
        console.error("Failed to fetch today's bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Arrivals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flow-root" style={{ height: '250px', overflowY: 'auto' }}>
            {loading ? (
                <div className="space-y-4 pt-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : bookings.length > 0 ? (
                <ul role="list" className="-my-4 divide-y divide-slate-200">
                {bookings.map((booking) => (
                    <li key={booking.id} className="py-3">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-lg bg-accent-100 text-accent-800 flex flex-col items-center justify-center font-bold">
                                    <span className="text-xs -mb-1">{new Date(`1970-01-01T${booking.time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).split(' ')[1]}</span>
                                    <span className="text-lg">{new Date(`1970-01-01T${booking.time}`).toLocaleTimeString([], { hour: 'numeric', hour12: false })}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                    {booking.customerName}
                                    {booking.tableNumber && <span className="text-slate-500 font-normal"> &bull; Table {booking.tableNumber}</span>}
                                </p>
                                {booking.notes ? (
                                    <p className="text-sm text-primary-800 bg-primary-100 rounded-md px-2 py-1 mt-1 truncate">
                                        {booking.notes}
                                    </p>
                                ) : (
                                    <p className="text-sm text-slate-500 italic mt-1">No special requests.</p>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
                </ul>
            ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                    No bookings for today.
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysBookingsWidget;