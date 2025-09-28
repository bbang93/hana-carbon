'use client';

import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { filteredEmissionsAtom } from '@/store/atoms';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/styles/tokens';
import { Card } from '@/components/UI';

const SourcePieChart: React.FC = () => {
  const [emissions] = useAtom(filteredEmissionsAtom);
  const { colors } = useTheme();

  const chartData = useMemo(() => {
    const sourceMap = new Map<string, { value: number; percentage: number; count: number }>();
    const totalEmissions = emissions.reduce((sum, e) => sum + e.emissions, 0);

    emissions.forEach(emission => {
      const current = sourceMap.get(emission.source) || { value: 0, percentage: 0, count: 0 };
      sourceMap.set(emission.source, {
        value: current.value + emission.emissions,
        percentage: 0,
        count: current.count + 1
      });
    });

    return Array.from(sourceMap.entries())
      .map(([source, data]) => ({
        name: source,
        value: data.value,
        percentage: totalEmissions > 0 ? (data.value / totalEmissions) * 100 : 0,
        count: data.count
      }))
      .sort((a, b) => b.value - a.value);
  }, [emissions]);

  const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

  const sourceIcons: Record<string, string> = {
    '전력': '⚡',
    '가스': '🔥',
    '연료': '⛽',
    '운송': '🚛',
    '기타': '🏭',
    'electricity': '⚡',
    'naturalgas': '🔥',
    'gasoline': '⛽',
    'diesel': '🚗',
    'lpg': '🔥'
  };

  return (
    <Card style={{ height: 'auto', minHeight: '400px' }}>
      <h3 style={{
        margin: `0 0 ${designTokens.spacing.lg} 0`,
        fontSize: designTokens.typography.fontSizes.xl,
        fontWeight: designTokens.typography.fontWeights.bold,
        textAlign: 'center',
        color: colors.text
      }}>
        📊 배출원별 비율
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              if (!data) return null;

              return (
                <div style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: designTokens.borderRadius.md,
                  padding: designTokens.spacing.md,
                  boxShadow: designTokens.shadows.lg
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>{sourceIcons[data.name] || '📊'}</span>
                    <span style={{ fontWeight: '600', color: '#374151' }}>{data.name || 'Unknown'}</span>
                  </div>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>배출량: </span>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>
                      {data.value?.toLocaleString() || '0'} tons CO₂
                    </span>
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>비율: </span>
                    <span style={{ fontWeight: '600', color: '#3b82f6' }}>
                      {data.percentage?.toFixed(1) || '0'}%
                    </span>
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#9ca3af' }}>
                    데이터 포인트: {data.count || 0}개
                  </p>
                </div>
              );
            }
            return null;
          }} />
        </PieChart>
      </ResponsiveContainer>

      {/* 하단 범례 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: designTokens.spacing.md,
        marginTop: designTokens.spacing.md,
        padding: designTokens.spacing.md,
        background: colors.surfaceSecondary,
        borderRadius: designTokens.borderRadius.lg,
        border: `1px solid ${colors.border}`
      }}>
        {chartData.slice(0, 4).map((item, index) => (
          <div key={item.name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: designTokens.spacing.sm
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: chartColors[index],
              flexShrink: 0
            }} />
            <div style={{ fontSize: designTokens.typography.fontSizes.xs }}>
              <div style={{
                fontWeight: designTokens.typography.fontWeights.semibold,
                color: colors.text
              }}>
                {sourceIcons[item.name] || '📊'} {item.name}
              </div>
              <div style={{ color: colors.textSecondary }}>
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SourcePieChart;