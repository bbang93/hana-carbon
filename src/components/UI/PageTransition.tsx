'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  console.log('🔄 PageTransition: 렌더링, pathname =', pathname);
  console.log('🔄 PageTransition: isLoading =', isLoading);

  useEffect(() => {
    console.log('🔄 PageTransition: useEffect 실행, 경로 변경 =', pathname);
    setIsLoading(true);

    const timer = setTimeout(() => {
      console.log('🔄 PageTransition: 페이지 전환 완료');
      setDisplayChildren(children);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div className="relative min-h-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {/* Page content with fade transition */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isLoading
            ? 'opacity-0 transform translate-y-2'
            : 'opacity-100 transform translate-y-0'
        }`}
      >
        {displayChildren}
      </div>
    </div>
  );
};

export default PageTransition;