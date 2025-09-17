// Fix: Implement the UpgradeTooltip component.
import React, { ReactNode } from 'react';

interface UpgradeTooltipProps {
  children: ReactNode;
  featureEnabled: boolean;
  message?: string;
}

/**
 * A wrapper component that disables its child and shows a tooltip
 * if a specific feature is not enabled for the user.
 */
const UpgradeTooltip: React.FC<UpgradeTooltipProps> = ({ 
  children, 
  featureEnabled,
  message = "Upgrade your plan to access this feature." 
}) => {
  if (featureEnabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      {/* Disable the child element */}
      <div className="disabled-child opacity-50 cursor-not-allowed">
        {children}
      </div>
      {/* Tooltip that appears on hover */}
      <div className="absolute bottom-full mb-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
        {message}
      </div>
    </div>
  );
};

export default UpgradeTooltip;
