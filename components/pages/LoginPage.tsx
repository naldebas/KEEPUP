// Fix: Implement the LoginPage component for user authentication.
import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Logo } from '../shared/Logo';
import { SpinnerIcon, AlertTriangleIcon } from '../shared/icons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password'); // Password is not used by mock API
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
        setError('Email address is required.');
        return;
    }
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please try again.');
    }
  };
  
  const handleTestLoginClick = (testEmail: string) => {
      setEmail(testEmail);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="h-8 w-auto mx-auto" />
        <h2 className="mt-6 text-center text-2xl font-bold text-slate-800">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <NavLink to="/signup" className="font-medium text-primary-600 hover:text-primary-700">
            create a new account
          </NavLink>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
                <div className="flex items-center space-x-2 text-sm text-red-600">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}

            <div>
              <Button type="submit" variant="primary" disabled={loading} className="w-full">
                {loading && <SpinnerIcon className="animate-spin h-5 w-5" />}
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Or use a test account
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Button onClick={() => handleTestLoginClick('staff@example.com')} className="w-full">
                  Staff
                </Button>
              </div>
              <div>
                <Button onClick={() => handleTestLoginClick('manager@example.com')} className="w-full">
                   Manager
                </Button>
              </div>
               <div>
                <Button onClick={() => handleTestLoginClick('admin@example.com')} className="w-full">
                   Admin
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;