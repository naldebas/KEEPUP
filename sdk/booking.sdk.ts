import * as mockApi from '../services/mockApi';
import type { Reservation } from '../types';

const list = (): Promise<Reservation[]> => mockApi.listReservations();

const create = (data: Omit<Reservation, 'id'>): Promise<Reservation> => mockApi.createReservation(data);

const update = (id: string, data: Partial<Omit<Reservation, 'id'>>): Promise<Reservation> => mockApi.updateReservation(id, data);

const deleteById = (id: string): Promise<void> => mockApi.deleteReservation(id);

export const bookingApi = {
  list,
  create,
  update,
  deleteById,
};