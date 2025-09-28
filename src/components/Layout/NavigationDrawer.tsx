'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { dashboardFiltersAtom } from '@/store/atoms';
import { zIndex } from '@/styles/zIndex';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useAtom(dashboardFiltersAtom);
  const [activeSection, setActiveSection] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: '대시보드', path: '/' },
    { id: 'emissions', icon: '🌱', label: '탄소 배출량', path: '/emissions' },
    { id: 'companies', icon: '🏢', label: '회사 관리', path: '/companies' },
    { id: 'posts', icon: '📝', label: '게시물 관리', path: '/posts' },
    { id: 'analytics', icon: '📈', label: '분석 리포트', path: '/analytics' },
    { id: 'settings', icon: '⚙️', label: '설정', path: '/settings' }
  ];

  const filterYears = ['2024', '2023', '2022', '2021'];
  const filterSources = ['전력', '가스', '연료', '운송', '기타'];

  return (
    <>
      {/* 백드롭 */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: zIndex.drawer - 1,
            transition: 'opacity 0.3s ease'
          }}
          onClick={onClose}
        />
      )}

      {/* 네비게이션 드로어 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-320px',
          width: '320px',
          height: '100vh',
          backgroundColor: '#ffffff',
          boxShadow: '2px 0 20px rgba(0, 0, 0, 0.15)',
          zIndex: zIndex.drawer,
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* 헤더 */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #10b981, #059669)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h2 style={{
              margin: 0,
              color: 'white',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              🌱 HanaLoop
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                padding: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ✕
            </button>
          </div>
          <p style={{
            margin: 0,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '14px'
          }}>
            탄소 배출량 관리 시스템
          </p>
        </div>

        {/* 메뉴 아이템 */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 0' }}>
          <nav>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 24px',
                  border: 'none',
                  background: activeSection === item.id ? '#f0fdf4' : 'transparent',
                  color: activeSection === item.id ? '#059669' : '#374151',
                  fontSize: '16px',
                  fontWeight: activeSection === item.id ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderLeft: activeSection === item.id ? '4px solid #10b981' : '4px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* 필터 섹션 */}
          <div style={{
            margin: '24px 16px 16px',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151'
            }}>
              🔍 필터
            </h3>

            {/* 연도 필터 */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                연도
              </label>
              <select
                value={filters.dateRange.start.split('-')[0]}
                onChange={(e) => {
                  const year = e.target.value;
                  setFilters({
                    ...filters,
                    dateRange: {
                      start: `${year}-01`,
                      end: `${year}-12`
                    }
                  });
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="">모든 연도</option>
                {filterYears.map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
            </div>

            {/* 배출원 필터 */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                배출원
              </label>
              <select
                value={filters.selectedSource || ''}
                onChange={(e) => setFilters({ ...filters, selectedSource: e.target.value || undefined })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="">모든 배출원</option>
                {filterSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            {/* 필터 리셋 버튼 */}
            <button
              onClick={() => setFilters({
                selectedCompany: undefined,
                selectedCountry: undefined,
                selectedSource: undefined,
                dateRange: {
                  start: '2024-01',
                  end: '2024-06'
                }
              })}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
            >
              필터 초기화
            </button>
          </div>
        </div>

        {/* 푸터 */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            © 2024 HanaLoop
            <br />
            Carbon Emissions Dashboard
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;