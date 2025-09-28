'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/styles/tokens';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  style,
  ...ariaProps
}) => {
  const { colors } = useTheme();

  const sizeStyles = {
    sm: {
      padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
      fontSize: designTokens.typography.fontSizes.sm
    },
    md: {
      padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
      fontSize: designTokens.typography.fontSizes.base
    },
    lg: {
      padding: `${designTokens.spacing.lg} ${designTokens.spacing.xl}`,
      fontSize: designTokens.typography.fontSizes.lg
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: colors.surface,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          ':hover': {
            background: colors.surfaceSecondary
          }
        };
      case 'outline':
        return {
          background: 'transparent',
          color: colors.primary,
          border: `1px solid ${colors.primary}`,
          ':hover': {
            background: `${colors.primary}10`
          }
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: colors.text,
          border: 'none',
          ':hover': {
            background: colors.surfaceSecondary
          }
        };
      default: // primary
        return {
          background: colors.primary,
          color: 'white',
          border: 'none',
          ':hover': {
            background: colors.success
          }
        };
    }
  };

  const variantStyles = getVariantStyles();
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        ...sizeStyles[size],
        ...variantStyles,
        borderRadius: designTokens.borderRadius.lg,
        fontWeight: designTokens.typography.fontWeights.semibold,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: designTokens.transitions.normal,
        opacity: isDisabled ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: designTokens.spacing.sm,
        boxShadow: variant === 'primary' ? `0 2px 8px ${colors.primary}40` : 'none',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
      {...ariaProps}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {children}
    </button>
  );
};

export default Button;