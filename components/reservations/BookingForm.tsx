// Fix: Implement the BookingForm for adding and editing reservations.
import React, { useState, useEffect } from 'react';
import type { Reservation, Activity } from '../../types';
import { api } from '../../sdk';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';

interface BookingFormProps {
  reservation: Reservation | null;
  onSubmit: (data: Omit<Reservation, 'id'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ reservation, onSubmit, onCancel, isSaving }) => {
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState<number | ''>('');
  const [status, setStatus] = useState<Reservation['status']>('Pending');
  const [tableNumber, setTableNumber] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [activityId, setActivityId] = useState<string | undefined>(undefined);
  const [activities, setActivities] = useState<Activity[]>([]);


  useEffect(() => {
    const fetchActivities = async () => {
        try {
            const data = await api.activity.list();
            // Filter for upcoming activities
            const upcoming = data.filter(a => new Date(a.date) >= new Date(new Date().toISOString().split('T')[0]));
            setActivities(upcoming);
        } catch (error) {
            console.error("Failed to fetch activities for form");
        }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    if (reservation) {
      setCustomerName(reservation.customerName);
      setDate(reservation.date);
      setTime(reservation.time);
      setPartySize(reservation.partySize);
      setStatus(reservation.status);
      setTableNumber(reservation.tableNumber || '');
      setNotes(reservation.notes || '');
      setActivityId(reservation.activityId);
    } else {
      // Reset form for new reservation
      const today = new Date().toISOString().split('T')[0];
      setCustomerName('');
      setDate(today);
      setTime('19:00');
      setPartySize('');
      setStatus('Pending');
      setTableNumber('');
      setNotes('');
      setActivityId(undefined);
    }
  }, [reservation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof partySize === 'number' && partySize > 0) {
      onSubmit({ 
        customerName, 
        date, 
        time, 
        partySize, 
        status,
        tableNumber: tableNumber ? Number(tableNumber) : undefined,
        notes,
        activityId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
          Customer Name
        </label>
        <Input
          id="customerName"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="partySize" className="block text-sm font-medium text-gray-700">
            Party Size
          </label>
          <Input
            id="partySize"
            type="number"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            required
            min="1"
          />
        </div>
        <div>
          <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">
            Table Number
          </label>
          <Input
            id="tableNumber"
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            min="1"
          />
        </div>
      </div>
      <div>
        <label htmlFor="activityId" className="block text-sm font-medium text-gray-700">
          Link to Activity (Optional)
        </label>
        <Select
          id="activityId"
          value={activityId || ''}
          onChange={(e) => setActivityId(e.target.value || undefined)}
          className="mt-1"
        >
          <option value="">None</option>
          {activities.map(activity => (
            <option key={activity.id} value={activity.id}>
              {activity.title} ({activity.date})
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes / Special Requests
        </label>
        <Textarea 
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="e.g., Birthday celebration, window seat..."
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Reservation['status'])}
            className="mt-1"
        >
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Cancelled</option>
            <option>Completed</option>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Reservation'}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;