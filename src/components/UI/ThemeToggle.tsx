'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        color: colors.text,
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: `0 2px 4px ${colors.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = `0 4px 8px ${colors.border}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 2px 4px ${colors.border}`;
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span style={{ fontSize: '16px' }}>
        {isDark ? '☀️' : '🌙'}
      </span>
      <span>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};

export default ThemeToggle;