import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { api } from '../../../sdk';
import type { Reservation } from '../../../types';
import { cn } from '../../../lib/utils';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  bookingCount: number;
}

const BookingCalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateCalendar = async () => {
      setLoading(true);
      try {
        const reservations = await api.booking.list();
        const bookingsByDay: { [key: string]: number } = reservations.reduce((acc, res) => {
          const day = new Date(res.date).toDateString();
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

        const calendarDays: CalendarDay[] = [];
        for (let i = 0; i < 42; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          calendarDays.push({
            date,
            isCurrentMonth: date.getMonth() === month,
            bookingCount: bookingsByDay[date.toDateString()] || 0,
          });
        }
        setDays(calendarDays);
      } catch (error) {
        console.error("Failed to generate calendar data:", error);
      } finally {
        setLoading(false);
      }
    };

    generateCalendar();
  }, [currentDate]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle>Booking Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <button onClick={() => changeMonth(-1)}>&lt;</button>
            <span className="text-sm font-medium">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)}>&gt;</button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded-md"></div>
        ) : (
            <div className="grid grid-cols-7 gap-1">
              {weekdays.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">{day}</div>
              ))}
              {days.map(({ date, isCurrentMonth, bookingCount }, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-20 border border-gray-200 rounded-md p-1 text-xs flex flex-col",
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                  )}
                >
                  <span>{date.getDate()}</span>
                  {bookingCount > 0 && (
                     <div className="mt-1 flex-grow flex items-center justify-center">
                        <span className="inline-flex items-center justify-center text-center text-white text-xs font-bold h-6 w-6 rounded-full bg-primary-500">
                           {bookingCount}
                        </span>
                     </div>
                  )}
                </div>
              ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCalendarWidget;
