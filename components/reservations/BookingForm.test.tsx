import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookingForm from './BookingForm';
import React from 'react';
import type { Reservation } from '../../types';

const mockReservation: Reservation = {
  id: 'res1',
  customerName: 'John Doe',
  date: '2023-12-25',
  time: '20:00',
  partySize: 4,
  status: 'Confirmed',
};

describe('BookingForm', () => {
  it('renders correctly for a new reservation', () => {
    render(
      <BookingForm
        reservation={null}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    // Check if key fields are present and empty (or have defaults)
    expect((screen.getByLabelText('Customer Name') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Party Size') as HTMLInputElement).value).toBe('');
    expect(screen.getByRole('button', { name: 'Save Reservation' })).not.toBeNull();
  });

  it('pre-fills the form with data for an existing reservation', () => {
    render(
      <BookingForm
        reservation={mockReservation}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect((screen.getByLabelText('Customer Name') as HTMLInputElement).value).toBe(mockReservation.customerName);
    expect((screen.getByLabelText('Date') as HTMLInputElement).value).toBe(mockReservation.date);
    expect((screen.getByLabelText('Time') as HTMLInputElement).value).toBe(mockReservation.time);
    expect((screen.getByLabelText('Party Size') as HTMLInputElement).value).toBe(mockReservation.partySize.toString());
    expect((screen.getByLabelText('Status') as HTMLSelectElement).value).toBe(mockReservation.status);
  });

  it('calls onSubmit with the correct data when submitted', async () => {
    const handleSubmit = vi.fn();
    render(
      <BookingForm
        reservation={null}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Customer Name'), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '19:30' } });
    fireEvent.change(screen.getByLabelText('Party Size'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Pending' } });
    
    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: 'Save Reservation' }));

    // Check if onSubmit was called with the correct payload
    // Fix: Update expectation to match the full object submitted by the form.
    expect(handleSubmit).toHaveBeenCalledWith({
      customerName: 'Jane Smith',
      date: '2024-01-01',
      time: '19:30',
      partySize: 2,
      status: 'Pending',
      tableNumber: undefined,
      notes: '',
      activityId: undefined,
    });
  });

  it('calls onCancel when the cancel button is clicked', () => {
    const handleCancel = vi.fn();
    render(
      <BookingForm
        reservation={null}
        onSubmit={vi.fn()}
        onCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isSaving is true', () => {
    render(
      <BookingForm
        reservation={null}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        isSaving={true}
      />
    );

    // Fix: Use `toHaveProperty` to check for disabled state to avoid TypeScript errors with jest-dom matchers.
    expect(screen.getByRole('button', { name: 'Saving...' })).toHaveProperty('disabled', true);
    // Fix: Use `toHaveProperty` to check for disabled state to avoid TypeScript errors with jest-dom matchers.
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveProperty('disabled', true);
  });
});