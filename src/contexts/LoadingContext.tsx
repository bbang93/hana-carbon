'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAtom } from 'jotai';
import { isLoadingAtom, loadingMessageAtom } from '@/store/atoms';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setLoadingMessage: (message: string) => void;
  withLoading: <T>(asyncFn: () => Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  console.log('🔄 LoadingProvider: 컴포넌트 렌더링');

  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);

  console.log('🔄 LoadingProvider: isLoading =', isLoading);
  console.log('🔄 LoadingProvider: loadingMessage =', loadingMessage);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const withLoading = async <T,>(asyncFn: () => Promise<T>, message?: string): Promise<T> => {
    if (message) {
      setLoadingMessage(message);
    }
    setLoading(true);
    try {
      const [result] = await Promise.all([
        asyncFn(),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);
      return result;
    } finally {
      setLoading(false);
      setLoadingMessage('데이터를 불러오는 중...');
    }
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        setLoadingMessage,
        withLoading
      }}
    >
      {children}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }}></div>
            <div style={{ fontSize: '16px', color: '#64748b' }}>
              {loadingMessage}
            </div>
          </div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};