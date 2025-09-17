import * as mockApi from '../services/mockApi';
import type { User, UserFormData } from '../types';

const list = (): Promise<User[]> => mockApi.listUsers();

// The creator user is needed to determine the plan for the new user.
const create = (data: UserFormData, creator: User): Promise<User> => mockApi.createUser(data, creator);

const update = (id: string, data: Partial<UserFormData>): Promise<User> => mockApi.updateUser(id, data);

const deleteById = (id: string): Promise<void> => mockApi.deleteUser(id);

export const userApi = {
  list,
  create,
  update,
  deleteById,
};
