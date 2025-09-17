import { login, logout, signup } from '../services/mockApi';
import type { User, UserSignUpData } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

const mockLogin = (email: string, password_unused: string): Promise<LoginResponse> => {
  return login(email);
};

const mockSignup = (data: UserSignUpData): Promise<LoginResponse> => {
  return signup(data);
};

const mockLogout = (): Promise<void> => {
  return logout();
};

export const authApi = {
  login: mockLogin,
  signup: mockSignup,
  logout: mockLogout,
};