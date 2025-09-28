'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/styles/tokens';
import Card from './Card';

interface MetricCardProps {
  icon?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  iconBackground?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    label: string;
  };
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color,
  iconBackground,
  trend,
  loading = false
}) => {
  const { colors, theme } = useTheme();

  const displayColor = color || colors.text;
  const displayIconBg = iconBackground || (theme === 'dark' ? '#1e293b' : '#f1f5f9');

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: designTokens.borderRadius.full,
            background: colors.surfaceSecondary,
            margin: '0 auto 16px auto',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <div style={{
            height: '16px',
            background: colors.surfaceSecondary,
            borderRadius: designTokens.borderRadius.sm,
            marginBottom: '8px',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <div style={{
            height: '32px',
            background: colors.surfaceSecondary,
            borderRadius: designTokens.borderRadius.sm,
            animation: 'pulse 2s ease-in-out infinite'
          }} />
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: displayColor
      }} />

      {/* Icon */}
      {icon && (
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: designTokens.borderRadius.full,
          background: displayIconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          margin: '0 auto 16px auto'
        }}>
          {icon}
        </div>
      )}

      {/* Title */}
      <h4 style={{
        margin: '0 0 8px 0',
        fontSize: designTokens.typography.fontSizes.sm,
        fontWeight: designTokens.typography.fontWeights.semibold,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {title}
      </h4>

      {/* Value */}
      <div style={{
        fontSize: designTokens.typography.fontSizes['3xl'],
        fontWeight: designTokens.typography.fontWeights.extrabold,
        color: displayColor,
        marginBottom: '8px',
        lineHeight: designTokens.typography.lineHeights.tight
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p style={{
          margin: '0 0 12px 0',
          fontSize: designTokens.typography.fontSizes.xs,
          color: colors.textSecondary
        }}>
          {subtitle}
        </p>
      )}

      {/* Trend indicator */}
      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          fontSize: designTokens.typography.fontSizes.xs,
          color: trend.direction === 'up' ? colors.success :
                trend.direction === 'down' ? colors.error : colors.textSecondary
        }}>
          <span>
            {trend.direction === 'up' ? '↗️' : trend.direction === 'down' ? '↘️' : '➡️'}
          </span>
          <span style={{ fontWeight: designTokens.typography.fontWeights.semibold }}>
            {trend.value}
          </span>
          <span>{trend.label}</span>
        </div>
      )}
    </Card>
  );
};

export default MetricCard;