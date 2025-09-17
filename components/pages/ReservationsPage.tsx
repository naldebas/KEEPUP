

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../sdk';
import type { Reservation } from '../../types';
import { Button } from '../ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/Table';
import Modal from '../ui/Modal';
import BookingForm from '../reservations/BookingForm';
import { useToasts } from '../../context/ToastContext';
import { Badge } from '../ui/Badge';
import TableSkeleton from '../skeletons/TableSkeleton';

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const { addToast } = useToasts();

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.booking.list();
      // sort by date and time
      data.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
      setReservations(data);
    } catch (error) {
      addToast('Failed to fetch reservations.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleOpenModal = (reservation: Reservation | null = null) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  const handleSaveReservation = async (formData: Omit<Reservation, 'id'>) => {
    setIsSaving(true);
    try {
      if (selectedReservation) {
        await api.booking.update(selectedReservation.id, formData);
        addToast('Reservation updated successfully!', 'success');
      } else {
        await api.booking.create(formData);
        addToast('Reservation created successfully!', 'success');
      }
      handleCloseModal();
      fetchReservations();
    } catch (error) {
      addToast('Failed to save reservation.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await api.booking.deleteById(id);
        addToast('Reservation deleted successfully!', 'success');
        fetchReservations();
      } catch (error) {
        addToast('Failed to delete reservation.', 'error');
      }
    }
  };

  const statusVariantMap: { [key in Reservation['status']]: 'success' | 'warning' | 'destructive' | 'default' } = {
      'Confirmed': 'success',
      'Pending': 'warning',
      'Cancelled': 'destructive',
      'Completed': 'default'
  }

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Reservations</h1>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Add Reservation
          </Button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          {loading ? (
            <TableSkeleton rows={10} columns={6} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium text-slate-900">{res.customerName}</TableCell>
                    <TableCell className="text-slate-700">{new Date(res.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</TableCell>
                    <TableCell className="text-slate-700">{res.time}</TableCell>
                    <TableCell className="text-slate-700">{res.partySize}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[res.status]}>
                        {res.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleOpenModal(res)}>Edit</Button>
                        <Button onClick={() => handleDeleteReservation(res.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedReservation ? 'Edit Reservation' : 'Add Reservation'}
      >
        <BookingForm
          reservation={selectedReservation}
          onSubmit={handleSaveReservation}
          onCancel={handleCloseModal}
          isSaving={isSaving}
        />
      </Modal>
    </main>
  );
};

export default ReservationsPage;