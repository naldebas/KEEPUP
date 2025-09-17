// Fix: Implement the root App component with routing and context providers.
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { FeatureFlagProvider } from './context/FeatureFlagContext';

import MainLayout from './components/layout/MainLayout';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import DashboardPage from './components/dashboard/DashboardPage';
import CustomersPage from './components/pages/CustomersPage';
import LoyaltyPage from './components/pages/LoyaltyPage';
import CampaignsPage from './components/pages/CampaignsPage';
import ReservationsPage from './components/pages/ReservationsPage';
import CalendarPage from './components/pages/CalendarPage';
import SettingsPage from './components/pages/SettingsPage';
import { Skeleton } from './components/ui/Skeleton';

// A wrapper for protected routes that checks for authentication.
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, initialLoading } = useAuth();
  
  if (initialLoading) {
    // Show a loading state while checking for session
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-64 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route 
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="loyalty" element={<LoyaltyPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="settings" element={<SettingsPage />} />
        {/* Add other nested routes for the main layout here */}
      </Route>
       <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <FeatureFlagProvider>
          <Router>
            <AppRoutes />
          </Router>
        </FeatureFlagProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;