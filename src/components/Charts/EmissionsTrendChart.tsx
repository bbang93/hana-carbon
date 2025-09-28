'use client';

import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Bar
} from 'recharts';
import { filteredEmissionsAtom } from '@/store/atoms';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/styles/tokens';
import { zIndex } from '@/styles/zIndex';
import { Card } from '@/components/UI';

interface EmissionsTrendChartProps {
  height?: number;
  showBar?: boolean;
}

const EmissionsTrendChart: React.FC<EmissionsTrendChartProps> = ({
  height = 400,
  showBar = false
}) => {
  const [emissions] = useAtom(filteredEmissionsAtom);
  const { colors } = useTheme();

  const chartData = useMemo(() => {
    const dataMap = new Map<string, {
      month: string;
      total: number;
      cumulative: number;
      companies: number;
      avgPerCompany: number;
    }>();

    emissions.forEach(emission => {
      const key = emission.yearMonth;
      if (!dataMap.has(key)) {
        dataMap.set(key, {
          month: key,
          total: 0,
          cumulative: 0,
          companies: new Set<string>().size,
          avgPerCompany: 0
        });
      }
      const data = dataMap.get(key)!;
      data.total += emission.emissions;
    });

    const sortedData = Array.from(dataMap.values()).sort((a, b) => a.month.localeCompare(b.month));

    let runningTotal = 0;
    return sortedData.map(data => {
      runningTotal += data.total;
      const companyIds = new Set(emissions.filter(e => e.yearMonth === data.month).map(e => e.companyId));
      return {
        ...data,
        cumulative: runningTotal,
        companies: companyIds.size,
        avgPerCompany: companyIds.size > 0 ? Math.round(data.total / companyIds.size) : 0
      };
    });
  }, [emissions]);

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: designTokens.borderRadius.md,
          padding: designTokens.spacing.md,
          boxShadow: designTokens.shadows.lg,
          zIndex: zIndex.tooltip
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#374151' }}>
            {label || 'Unknown'}
          </p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{
              margin: '4px 0',
              color: entry.color,
              fontSize: '14px'
            }}>
              {entry.name === 'total' && '월간 배출량: '}
              {entry.name === 'cumulative' && '누적 배출량: '}
              {entry.name === 'avgPerCompany' && '회사당 평균: '}
              <span style={{ fontWeight: '600' }}>
                {entry.value?.toLocaleString() || '0'}
                {entry.name !== 'companies' ? ' tons CO₂' : '개'}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card style={{ height: height + 80 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '700',
          color: '#0f172a'
        }}>
          📈 배출량 추이 분석
        </h3>
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10b981'
            }} />
            월간 배출량
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#3b82f6'
            }} />
            누적 배출량
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => {
              const [, month] = value.split('-');
              return `${month}월`;
            }}
          />
          <YAxis
            yAxisId="left"
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {showBar && (
            <Bar
              yAxisId="left"
              dataKey="avgPerCompany"
              fill="#8b5cf6"
              fillOpacity={0.6}
              name="회사당 평균"
              radius={[4, 4, 0, 0]}
            />
          )}

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: 'white' }}
            name="월간 배출량"
            activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulative"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="8 8"
            dot={{ r: 4, fill: '#3b82f6' }}
            name="누적 배출량"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* 인사이트 패널 */}
      <div style={{
        marginTop: '16px',
        padding: '16px',
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        borderRadius: '12px',
        border: '1px solid #bbf7d0'
      }}>
        <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <div>
            <span style={{ color: '#065f46', fontWeight: '600' }}>💡 인사이트: </span>
            <span style={{ color: '#047857' }}>
              {chartData.length > 1 ?
                (chartData[chartData.length - 1].total > chartData[chartData.length - 2].total ?
                  '배출량이 증가 추세입니다' :
                  '배출량이 감소 추세입니다') :
                '데이터 분석 중...'
              }
            </span>
          </div>
          <div>
            <span style={{ color: '#065f46', fontWeight: '600' }}>📊 총 누적: </span>
            <span style={{ color: '#047857', fontWeight: '600' }}>
              {chartData.length > 0 ?
                `${chartData[chartData.length - 1].cumulative.toLocaleString()} tons CO₂` :
                '0 tons'
              }
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmissionsTrendChart;