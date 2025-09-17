import { useState, useCallback } from 'react';
import { useToasts } from '../context/ToastContext';

type ApiFunction<T, P extends any[]> = (...args: P) => Promise<T>;

interface UseApiResult<T, P extends any[]> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    request: (...args: P) => Promise<T | undefined>;
}

export const useApi = <T, P extends any[]>(
    apiFunc: ApiFunction<T, P>
): UseApiResult<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const { addToast } = useToasts();

    const request = useCallback(async (...args: P) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiFunc(...args);
            setData(result);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'An unexpected error occurred.';
            setError(err);
            addToast(errorMessage, 'error');
            // Allow the component to handle the error further if needed
            throw err; 
        } finally {
            setLoading(false);
        }
    }, [apiFunc, addToast]);

    return { data, loading, error, request };
};

// Hook specifically for mutations (create, update, delete) where we don't need to store the response data
export const useApiMutation = <T, P extends any[]>(
    apiFunc: ApiFunction<T, P>,
    successMessage?: string
) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const { addToast } = useToasts();

    const mutate = useCallback(async (...args: P) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiFunc(...args);
            if (successMessage) {
                addToast(successMessage, 'success');
            }
            return result;
        } catch (err: any) {
             const errorMessage = err.message || 'An unexpected error occurred.';
            setError(err);
            addToast(errorMessage, 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunc, addToast, successMessage]);

    return { mutate, loading, error };
}
