import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Logo } from '../shared/Logo';
import { SpinnerIcon, AlertTriangleIcon } from '../shared/icons';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
        setError('All fields are required.');
        return;
    }
    try {
      await signup({ name, email, password_unused: password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create an account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="h-8 w-auto mx-auto" />
        <h2 className="mt-6 text-center text-2xl font-bold text-slate-800">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <NavLink to="/login" className="font-medium text-primary-600 hover:text-primary-700">
            sign in to your existing account
          </NavLink>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            </div>
            
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
                  autoComplete="new-password"
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
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;