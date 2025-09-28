'use client';

import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart
} from 'recharts';
import { filteredEmissionsAtom } from '@/store/atoms';
import { useTheme } from '@/hooks/useTheme';
import { convertCO2ToTrees, calculateEnvironmentalTrend } from '@/utils/carbonToTrees';

interface TreeSavingChartProps {
  height?: number;
}

const TreeSavingChart: React.FC<TreeSavingChartProps> = ({
  height = 400
}) => {
  const [emissions] = useAtom(filteredEmissionsAtom);
  const { colors, theme } = useTheme();

  const chartData = useMemo(() => {
    const dataMap = new Map<string, {
      month: string;
      emissions: number;
      savedTrees: number;
      cumulativeTrees: number;
    }>();

    // 월별 배출량 집계
    emissions.forEach(emission => {
      const key = emission.yearMonth;
      if (!dataMap.has(key)) {
        dataMap.set(key, {
          month: key,
          emissions: 0,
          savedTrees: 0,
          cumulativeTrees: 0
        });
      }
      const data = dataMap.get(key)!;
      data.emissions += emission.emissions;
    });

    const sortedData = Array.from(dataMap.values()).sort((a, b) => a.month.localeCompare(b.month));

    // 이전 월 대비 감소량으로 구한 나무 계산
    let cumulativeTrees = 0;
    return sortedData.map((data, index) => {
      let savedTreesThisMonth = 0;

      if (index > 0) {
        const previousEmissions = sortedData[index - 1].emissions;
        const reduction = previousEmissions - data.emissions;

        if (reduction > 0) {
          savedTreesThisMonth = convertCO2ToTrees(reduction);
          cumulativeTrees += savedTreesThisMonth;
        }
      }

      return {
        ...data,
        savedTrees: savedTreesThisMonth,
        cumulativeTrees
      };
    });
  }, [emissions]);

  const totalSavedTrees = chartData.reduce((sum, data) => sum + data.savedTrees, 0);
  const latestTrend = useMemo(() => {
    const monthlyEmissions = chartData.map(d => d.emissions);
    return calculateEnvironmentalTrend(monthlyEmissions);
  }, [chartData]);

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      value: number;
      name: string;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const savedTrees = payload.find(p => p.name === 'savedTrees')?.value || 0;
      const cumulativeTrees = payload.find(p => p.name === 'cumulativeTrees')?.value || 0;

      return (
        <div style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          padding: '16px',
          boxShadow: `0 8px 25px ${colors.border}80`,
          color: colors.text
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>🌳</span>
            <span style={{ fontWeight: '700', fontSize: '16px' }}>
              {label}
            </span>
          </div>

          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            <div style={{ color: colors.success, fontWeight: '600', marginBottom: '4px' }}>
              🌱 이번 달 구한 나무: {savedTrees.toLocaleString()}그루
            </div>
            <div style={{ color: colors.primary, fontWeight: '600', marginBottom: '4px' }}>
              🌲 누적 구한 나무: {cumulativeTrees.toLocaleString()}그루
            </div>
            <div style={{ color: colors.textSecondary, fontSize: '12px' }}>
              💨 산소 생산량: {Math.floor(savedTrees * 260).toLocaleString()}kg
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: colors.surface,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: `0 4px 12px ${colors.border}40`,
      border: `1px solid ${colors.border}`,
      height: height + 120
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            color: colors.text,
            marginBottom: '8px'
          }}>
            🌳 탄소 감축으로 구한 나무들
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: colors.textSecondary
          }}>
            배출량 감소 = 더 많은 나무를 구할 수 있어요!
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: colors.success
            }} />
            월별 구한 나무
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: colors.primary
            }} />
            누적 나무 수
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} />
          <XAxis
            dataKey="month"
            stroke={colors.chart.axis}
            fontSize={12}
            tickFormatter={(value) => {
              const [, month] = value.split('-');
              return `${month}월`;
            }}
          />
          <YAxis
            yAxisId="trees"
            stroke={colors.chart.axis}
            fontSize={12}
            tickFormatter={(value) => `${value}그루`}
          />
          <YAxis
            yAxisId="cumulative"
            orientation="right"
            stroke={colors.chart.axis}
            fontSize={12}
            tickFormatter={(value) => `${value}그루`}
          />
          <Tooltip content={<CustomTooltip />} />

          <Bar
            yAxisId="trees"
            dataKey="savedTrees"
            fill={colors.success}
            fillOpacity={0.7}
            name="savedTrees"
            radius={[4, 4, 0, 0]}
          />

          <Area
            yAxisId="cumulative"
            type="monotone"
            dataKey="cumulativeTrees"
            stroke={colors.primary}
            strokeWidth={3}
            fill={colors.primary}
            fillOpacity={0.1}
            name="cumulativeTrees"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* 하단 인사이트 패널 */}
      <div style={{
        marginTop: '16px',
        padding: '16px',
        background: theme === 'dark' ? '#0f2f0f' : '#f0fdf4',
        borderRadius: '12px',
        border: `1px solid ${theme === 'dark' ? '#166534' : '#bbf7d0'}`
      }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: colors.success, marginBottom: '4px' }}>
              🌳 {totalSavedTrees.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: colors.textSecondary }}>총 구한 나무</div>
          </div>

          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: colors.primary, marginBottom: '4px' }}>
              🌲 {Math.floor(totalSavedTrees / 100)}
            </div>
            <div style={{ fontSize: '14px', color: colors.textSecondary }}>형성된 작은 숲</div>
          </div>

          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: colors.primary, marginBottom: '4px' }}>
              💨 {Math.floor(totalSavedTrees * 260).toLocaleString()}kg
            </div>
            <div style={{ fontSize: '14px', color: colors.textSecondary }}>연간 산소 생산량</div>
          </div>

          {latestTrend && (
            <div style={{ marginLeft: 'auto' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                background: latestTrend.trend === 'improving' ? colors.success + '20' : colors.warning + '20',
                color: latestTrend.trend === 'improving' ? colors.success : colors.warning
              }}>
                <span style={{ fontSize: '16px' }}>
                  {latestTrend.trend === 'improving' ? '📈' : '📉'}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  {latestTrend.trend === 'improving' ? '환경 개선' : '주의 필요'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeSavingChart;