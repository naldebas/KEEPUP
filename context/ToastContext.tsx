import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { ToastMessage, ToastContextType } from '../types';

const ToastContext = createContext<ToastContextType & { toasts: ToastMessage[]; removeToast: (id: number) => void; } | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    
    const removeToast = useCallback((id: number) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
        const id = Date.now();
        setToasts(currentToasts => [...currentToasts, { id, message, type }]);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToasts = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToasts must be used within a ToastProvider');
    }
    return context;
};
