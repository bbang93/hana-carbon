'use client';

import React, { useState, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/styles/tokens';
import Header from './Header';
import NavigationDrawer from './NavigationDrawer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  maxWidth?: string;
  background?: 'default' | 'surface';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  showHeader = true,
  showNavigation = true,
  maxWidth = '1400px',
  background = 'default'
}) => {
  const { colors } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastUpdateTime] = useState(new Date());

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen);
  }, [isDrawerOpen]);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const containerBackground = background === 'surface' ? colors.surface : colors.background;

  return (
    <div style={{
      minHeight: '100vh',
      background: containerBackground,
      transition: designTokens.transitions.normal
    }}>
      {/* Navigation Drawer */}
      {showNavigation && (
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
        />
      )}

      {/* Header */}
      {showHeader && (
        <Header
          onMenuToggle={handleDrawerToggle}
          isMenuOpen={isDrawerOpen}
          lastUpdateTime={lastUpdateTime}
        />
      )}

      {/* Main Content */}
      <main
        style={{
          padding: designTokens.spacing.xl,
          maxWidth,
          margin: '0 auto',
          minHeight: showHeader ? 'calc(100vh - 120px)' : '100vh'
        }}
        role="main"
        aria-label="대시보드 메인 콘텐츠"
      >
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: designTokens.spacing['3xl'],
        padding: designTokens.spacing.xl,
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.success})`,
        borderRadius: designTokens.borderRadius.xl,
        color: 'white',
        margin: `${designTokens.spacing.xl} auto 0 auto`,
        maxWidth
      }}>
        <h2 style={{
          fontSize: designTokens.typography.fontSizes['2xl'],
          fontWeight: designTokens.typography.fontWeights.bold,
          margin: `0 0 ${designTokens.spacing.md} 0`
        }}>
          탄소 중립을 위한 여정
        </h2>
        <p style={{
          fontSize: designTokens.typography.fontSizes.base,
          margin: 0,
          opacity: 0.9,
          lineHeight: designTokens.typography.lineHeights.relaxed
        }}>
          지속가능한 미래를 위해 함께 노력하고 있습니다.
          더 나은 내일을 위한 HanaLoop의 혁신적 솔루션을 경험해보세요.
        </p>
      </footer>
    </div>
  );
};

export default DashboardLayout;