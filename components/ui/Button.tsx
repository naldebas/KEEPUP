
import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  variant?: 'default' | 'primary';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, isActive, variant, ...props }, ref) => {
    
    const getVariantClasses = () => {
        if (variant === 'primary') {
            return 'bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2';
        }
        // Default filter button style
        return cn(
            'px-3 py-1 text-sm font-semibold rounded-lg transition-colors',
            isActive
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
        );
    }
    
    return (
      <button
        className={cn(
          getVariantClasses(),
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };