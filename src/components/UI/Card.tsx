'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/styles/tokens';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  background?: 'surface' | 'surfaceSecondary' | 'gradient';
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  style,
  padding = 'lg',
  shadow = 'md',
  border = true,
  background = 'surface'
}) => {
  const { colors } = useTheme();

  const paddingMap = {
    sm: designTokens.spacing.md,
    md: designTokens.spacing.lg,
    lg: designTokens.spacing.xl,
    xl: designTokens.spacing['2xl']
  };

  const getBackground = () => {
    switch (background) {
      case 'surfaceSecondary':
        return colors.surfaceSecondary;
      case 'gradient':
        return `linear-gradient(135deg, ${colors.surface}, ${colors.background})`;
      default:
        return colors.surface;
    }
  };

  return (
    <div
      className={className}
      style={{
        background: getBackground(),
        borderRadius: designTokens.borderRadius.xl,
        padding: paddingMap[padding],
        boxShadow: `${designTokens.shadows[shadow]}, 0 0 0 1px ${colors.border}20`,
        border: border ? `1px solid ${colors.border}` : 'none',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Card;