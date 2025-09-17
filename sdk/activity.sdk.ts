import * as mockApi from '../services/mockApi';
import type { Activity } from '../types';

const list = (): Promise<Activity[]> => mockApi.listActivities();

const create = (data: Omit<Activity, 'id'>): Promise<Activity> => mockApi.createActivity(data);

const update = (id: string, data: Partial<Omit<Activity, 'id'>>): Promise<Activity> => mockApi.updateActivity(id, data);

const deleteById = (id: string): Promise<void> => mockApi.deleteActivity(id);

export const activityApi = {
  list,
  create,
  update,
  deleteById,
};
