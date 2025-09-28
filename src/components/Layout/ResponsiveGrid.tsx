'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/styles/tokens';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns: {
    default: string;
    md?: string;
    sm?: string;
  };
  gap?: string;
  style?: React.CSSProperties;
  className?: string;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns,
  gap = designTokens.spacing.xl,
  style,
  className
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const getGridColumns = () => {
    if (isMobile) return columns.sm || '1fr';
    if (isTablet) return columns.md || '1fr';
    return columns.default;
  };

  const getGap = () => {
    if (isMobile) return designTokens.spacing.lg;
    return gap;
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getGridColumns(),
    gap: getGap(),
    ...style
  };

  return (
    <div className={className} style={gridStyle}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;