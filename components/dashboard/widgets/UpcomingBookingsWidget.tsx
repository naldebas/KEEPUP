import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { api } from '../../../sdk';
import type { Reservation } from '../../../types';
import { Skeleton } from '../../ui/Skeleton';
import { Badge } from '../../ui/Badge';
import { NavLink } from 'react-router-dom';

const UpcomingBookingsWidget: React.FC = () => {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const allReservations = await api.booking.list();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today for comparison

        const upcoming = allReservations
          .filter(res => {
            const utcDate = new Date(res.date + 'T00:00:00Z');
            return (res.status === 'Pending' || res.status === 'Confirmed') && utcDate >= today;
          })
          .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
          .slice(0, 5);

        setBookings(upcoming);
      } catch (error) {
        console.error("Failed to fetch upcoming bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const statusVariantMap: { [key in Reservation['status']]: 'success' | 'warning' | 'destructive' | 'default' } = {
      'Confirmed': 'success',
      'Pending': 'warning',
      'Cancelled': 'destructive',
      'Completed': 'default'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Upcoming Bookings</CardTitle>
            <NavLink to="/reservations" className="text-sm font-medium text-primary-500 hover:text-primary-900">
                View All &rarr;
            </NavLink>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4 pt-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : bookings.length > 0 ? (
           <div className="flow-root">
            <ul role="list" className="-my-4 divide-y divide-gray-200">
              {bookings.map((booking) => (
                <li key={booking.id} className="py-4">
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4 items-center">
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{booking.customerName}</p>
                      <p className="text-sm text-gray-500 truncate">{booking.partySize} {booking.partySize > 1 ? 'guests' : 'guest'}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-700">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })}</p>
                      <p className="text-sm text-gray-500">{booking.time}</p>
                    </div>
                    <div className="text-right">
                       <Badge variant={statusVariantMap[booking.status]}>
                         {booking.status}
                       </Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
            No upcoming bookings.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingBookingsWidget;
