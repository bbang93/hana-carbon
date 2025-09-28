'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { companiesAtom, dashboardFiltersAtom, countriesAtom } from '@/store/atoms';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/styles/tokens';
import { Card } from '@/components/UI';

const CompanyFilter: React.FC = () => {
  const [companies] = useAtom(companiesAtom);
  const [countries] = useAtom(countriesAtom);
  const [filters, setFilters] = useAtom(dashboardFiltersAtom);
  const { colors } = useTheme();

  const handleCompanyChange = (companyId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCompany: companyId === 'all' ? undefined : companyId
    }));
  };

  const handleCountryChange = (countryCode: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCountry: countryCode === 'all' ? undefined : countryCode,
      selectedCompany: undefined // 국가 변경 시 회사 필터 초기화
    }));
  };

  // 선택된 국가에 따른 회사 필터링
  const filteredCompanies = companies.filter(company =>
    !filters.selectedCountry || company.country === filters.selectedCountry
  );

  const selectStyle = {
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    border: `1px solid ${colors.border}`,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: designTokens.typography.fontSizes.sm,
    minWidth: '200px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    ':focus': {
      borderColor: colors.primary
    }
  };

  return (
    <Card style={{ marginBottom: designTokens.spacing.lg }}>
      <h3 style={{
        fontSize: designTokens.typography.fontSizes.lg,
        fontWeight: designTokens.typography.fontWeights.semibold,
        marginBottom: designTokens.spacing.md,
        color: colors.text,
        display: 'flex',
        alignItems: 'center',
        gap: designTokens.spacing.sm
      }}>
        🏢 회사별 필터링
      </h3>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: designTokens.spacing.md,
        alignItems: 'center'
      }}>
        {/* 국가 필터 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.xs }}>
          <label style={{
            fontSize: designTokens.typography.fontSizes.sm,
            fontWeight: designTokens.typography.fontWeights.medium,
            color: colors.textSecondary
          }}>
            국가별 필터
          </label>
          <select
            value={filters.selectedCountry || 'all'}
            onChange={(e) => handleCountryChange(e.target.value)}
            style={selectStyle}
          >
            <option value="all">전체 국가</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* 회사 필터 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing.xs }}>
          <label style={{
            fontSize: designTokens.typography.fontSizes.sm,
            fontWeight: designTokens.typography.fontWeights.medium,
            color: colors.textSecondary
          }}>
            회사별 필터
          </label>
          <select
            value={filters.selectedCompany || 'all'}
            onChange={(e) => handleCompanyChange(e.target.value)}
            style={selectStyle}
            disabled={filteredCompanies.length === 0}
          >
            <option value="all">전체 회사</option>
            {filteredCompanies.map(company => {
              const countryFlag = countries.find(c => c.code === company.country)?.flag || '🌍';
              return (
                <option key={company.id} value={company.id}>
                  {countryFlag} {company.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* 필터 초기화 버튼 */}
        {(filters.selectedCompany || filters.selectedCountry) && (
          <button
            onClick={() => setFilters(prev => ({
              ...prev,
              selectedCompany: undefined,
              selectedCountry: undefined
            }))}
            style={{
              padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
              border: `1px solid ${colors.border}`,
              borderRadius: designTokens.borderRadius.md,
              backgroundColor: colors.background,
              color: colors.textSecondary,
              fontSize: designTokens.typography.fontSizes.sm,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginTop: '20px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.color = colors.textSecondary;
            }}
          >
            🔄 필터 초기화
          </button>
        )}
      </div>

      {/* 현재 필터 상태 표시 */}
      {(filters.selectedCompany || filters.selectedCountry) && (
        <div style={{
          marginTop: designTokens.spacing.md,
          padding: designTokens.spacing.sm,
          backgroundColor: colors.primary + '10',
          borderRadius: designTokens.borderRadius.sm,
          fontSize: designTokens.typography.fontSizes.sm,
          color: colors.textSecondary
        }}>
          <strong>현재 필터:</strong>{' '}
          {filters.selectedCountry && (
            <span>
              국가: {countries.find(c => c.code === filters.selectedCountry)?.flag} {countries.find(c => c.code === filters.selectedCountry)?.name}
              {filters.selectedCompany && ' → '}
            </span>
          )}
          {filters.selectedCompany && (
            <span>
              회사: {companies.find(c => c.id === filters.selectedCompany)?.name}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

export default CompanyFilter;