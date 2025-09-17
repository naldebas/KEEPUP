// Fix: Implement the AuthContext to manage application-wide authentication state.
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from '../sdk';
import type { User, UserSignUpData } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password_unused: string) => Promise<void>;
  signup: (data: UserSignUpData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  initialLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for an existing session from sessionStorage
    const checkSession = () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        const storedToken = sessionStorage.getItem('authToken');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from session storage", error);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
      } finally {
        setInitialLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password_unused: string) => {
    setLoading(true);
    try {
      const response = await api.auth.login(email, password_unused);
      setUser(response.user);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      sessionStorage.setItem('authToken', response.token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: UserSignUpData) => {
    setLoading(true);
    try {
      const response = await api.auth.signup(data);
      setUser(response.user);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      sessionStorage.setItem('authToken', response.token);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await api.auth.logout();
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, loading, initialLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};