// Fix: Implement the FeatureFlagContext for managing feature toggles.
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { UserPlan } from '../types';

// Define the shape of our feature flags
interface FeatureFlags {
  enableExport: boolean;
  // Add other flags here as needed
}

// Define the configuration for which plans get which features
const planFeatures: Record<UserPlan, FeatureFlags> = {
    Free: {
        enableExport: false,
    },
    Pro: {
        enableExport: true,
    },
    Enterprise: {
        enableExport: true,
    },
};

const FeatureFlagContext = createContext<FeatureFlags | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Determine flags based on user's plan, or default to Free plan flags if no user
  const flags = user ? planFeatures[user.plan] : planFeatures.Free;

  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
      throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};