'use client';

import React from 'react';
import { Provider } from 'jotai';
import { LoadingProvider } from '@/contexts/LoadingContext';
import DataInitializer from '@/components/DataInitializer';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  console.log('🔄 Providers: 컴포넌트 렌더링');

  return (
    <Provider>
      <LoadingProvider>
        <DataInitializer />
        {children}
      </LoadingProvider>
    </Provider>
  );
};

export default Providers;