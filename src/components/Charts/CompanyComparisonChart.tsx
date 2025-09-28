'use client';

import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { filteredCompaniesAtom, countriesAtom } from '@/store/atoms';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/styles/tokens';
import { Card } from '@/components/UI';

const CompanyComparisonChart: React.FC = () => {
  const [companies] = useAtom(filteredCompaniesAtom);
  const [countries] = useAtom(countriesAtom);
  const { colors } = useTheme();

  const chartData = useMemo(() => {
    return companies
      .map(company => {
        const totalEmissions = company.emissions.reduce((sum, e) => sum + e.emissions, 0);
        const countryData = countries.find(c => c.code === company.country);

        return {
          name: company.name,
          emissions: totalEmissions,
          country: company.country,
          flag: countryData?.flag || '🌍',
          dataPoints: company.emissions.length,
          avgMonthly: Math.round(totalEmissions / (company.emissions.length || 1))
        };
      })
      .sort((a, b) => b.emissions - a.emissions)
      .slice(0, 10);
  }, [companies, countries]);

  const chartColors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#14b8a6'
  ];

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: {
        name: string;
        emissions: number;
        country: string;
        flag: string;
        dataPoints: number;
        avgMonthly: number;
      };
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (!data) return null;

      return (
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>{data.flag || '🌍'}</span>
            <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '16px' }}>
              {label || data.name || 'Unknown'}
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            국가: {data.country || 'Unknown'}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
            총 배출량: {payload[0].value?.toLocaleString() || '0'} tons CO₂
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
            데이터 포인트: {data.dataPoints || 0}개
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            월 평균: {data.avgMonthly?.toLocaleString() || '0'} tons CO₂
          </div>
        </div>
      );
    }
    return null;
  };

  interface LabelProps {
    x?: number;
    y?: number;
    width?: number;
    value?: number;
    payload?: {
      flag?: string;
    };
  }

  const CustomLabel = (props: LabelProps) => {
    const { x = 0, y = 0, width = 0, payload } = props;
    if (!payload || !payload.flag) return null;

    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#374151"
        textAnchor="middle"
        fontSize={12}
        fontWeight="600"
      >
        {payload.flag}
      </text>
    );
  };

  return (
    <Card style={{ height: 'auto', minHeight: '500px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: designTokens.typography.fontSizes.xl,
          fontWeight: designTokens.typography.fontWeights.bold,
          color: colors.text
        }}>
          🏢 회사별 배출량 순위 (TOP 10)
        </h3>
        <div style={{
          padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
          background: colors.success + '20',
          borderRadius: designTokens.borderRadius.md,
          fontSize: designTokens.typography.fontSizes.sm,
          color: colors.success,
          fontWeight: designTokens.typography.fontWeights.semibold,
          border: `1px solid ${colors.success}40`
        }}>
          총 {companies.length}개 회사
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="emissions"
            radius={[8, 8, 0, 0]}
            label={<CustomLabel />}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 하단 인사이트 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: designTokens.spacing.md,
        marginTop: designTokens.spacing.md,
        padding: designTokens.spacing.md,
        background: colors.surfaceSecondary,
        borderRadius: designTokens.borderRadius.lg,
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: designTokens.typography.fontSizes['2xl'],
            fontWeight: designTokens.typography.fontWeights.extrabold,
            color: colors.text
          }}>
            {chartData.length > 0 ? chartData[0].emissions.toLocaleString() : '0'}
          </div>
          <div style={{
            fontSize: designTokens.typography.fontSizes.sm,
            color: colors.textSecondary
          }}>최대 배출량 (tons)</div>
          <div style={{
            fontSize: designTokens.typography.fontSizes.xs,
            color: colors.primary,
            fontWeight: designTokens.typography.fontWeights.semibold
          }}>
            {chartData.length > 0 ? chartData[0].name : '-'}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: designTokens.typography.fontSizes['2xl'],
            fontWeight: designTokens.typography.fontWeights.extrabold,
            color: colors.text
          }}>
            {chartData.length > 0 ?
              Math.round(chartData.reduce((sum, c) => sum + c.emissions, 0) / chartData.length).toLocaleString() :
              '0'
            }
          </div>
          <div style={{
            fontSize: designTokens.typography.fontSizes.sm,
            color: colors.textSecondary
          }}>평균 배출량 (tons)</div>
          <div style={{
            fontSize: designTokens.typography.fontSizes.xs,
            color: colors.textSecondary
          }}>TOP 10 기준</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: designTokens.typography.fontSizes['2xl'],
            fontWeight: designTokens.typography.fontWeights.extrabold,
            color: colors.text
          }}>
            {new Set(chartData.map(c => c.country)).size}
          </div>
          <div style={{
            fontSize: designTokens.typography.fontSizes.sm,
            color: colors.textSecondary
          }}>관련 국가 수</div>
          <div style={{
            fontSize: designTokens.typography.fontSizes.xs,
            color: colors.textSecondary,
            display: 'flex',
            justifyContent: 'center',
            gap: designTokens.spacing.xs,
            marginTop: designTokens.spacing.xs
          }}>
            {Array.from(new Set(chartData.map(c => c.flag))).slice(0, 3).map((flag, i) => (
              <span key={i} style={{ fontSize: designTokens.typography.fontSizes.base }}>{flag}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompanyComparisonChart;