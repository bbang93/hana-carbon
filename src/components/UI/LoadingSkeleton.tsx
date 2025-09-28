'use client';

import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'chart' | 'text' | 'avatar' | 'table';
  className?: string;
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  className = '',
  count = 1
}) => {
  const getSkeletonElement = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow ${className}`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow ${className}`}>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="flex items-end space-x-2 h-48">
              {[60, 40, 80, 33, 75, 50, 67, 40].map((height, i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-gray-700 rounded-t flex-1"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`animate-pulse space-y-2 ${className}`}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        );

      case 'avatar':
        return (
          <div className={`animate-pulse flex items-center space-x-3 ${className}`}>
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow ${className}`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="px-6 py-4 flex space-x-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className={`animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
        );
    }
  };

  if (count === 1) {
    return getSkeletonElement();
  }

  const elements = [];
  for (let i = 0; i < count; i++) {
    elements.push(
      <div key={`skeleton-${variant}-${i}`}>
        {getSkeletonElement()}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {elements}
    </div>
  );
};

export default LoadingSkeleton;