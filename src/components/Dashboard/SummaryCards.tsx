'use client';

import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import { filteredEmissionsAtom } from '@/store/atoms';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/styles/tokens';
import { MetricCard } from '@/components/UI';

const SummaryCards: React.FC = () => {
  const [emissions] = useAtom(filteredEmissionsAtom);
  const { colors } = useTheme();

  const summaryData = useMemo(() => {
    if (emissions.length === 0) {
      return {
        totalEmissions: 0,
        averageEmissions: 0,
        companyCount: 0,
        sourceCount: 0,
        currentMonthly: 0,
        trend: 0
      };
    }

    const totalEmissions = emissions.reduce((sum, e) => sum + e.emissions, 0);
    const companyCount = new Set(emissions.map(e => e.companyId)).size;
    const sourceCount = new Set(emissions.map(e => e.source)).size;

    // 월별 데이터로 트렌드 계산
    const monthlyData = new Map<string, number>();
    emissions.forEach(e => {
      const month = e.yearMonth;
      monthlyData.set(month, (monthlyData.get(month) || 0) + e.emissions);
    });

    const months = Array.from(monthlyData.keys()).sort();
    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];

    const currentTotal = monthlyData.get(currentMonth) || 0;
    const previousTotal = monthlyData.get(previousMonth) || 0;
    const trend = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

    return {
      totalEmissions: Math.round(totalEmissions),
      averageEmissions: Math.round(totalEmissions / emissions.length),
      companyCount,
      sourceCount,
      currentMonthly: Math.round(currentTotal),
      trend: Math.round(trend * 10) / 10
    };
  }, [emissions]);

  const getTrendInfo = (trend: number) => {
    if (trend > 0) {
      return {
        direction: 'up' as const,
        value: `+${trend}%`,
        label: '전월 대비'
      };
    } else if (trend < 0) {
      return {
        direction: 'down' as const,
        value: `${trend}%`,
        label: '전월 대비'
      };
    }
    return {
      direction: 'neutral' as const,
      value: '0%',
      label: '변화 없음'
    };
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: designTokens.spacing.lg,
      marginBottom: designTokens.spacing.xl
    }}>
      <MetricCard
        icon="📊"
        title="총 배출량"
        value={summaryData.totalEmissions.toLocaleString()}
        subtitle="tons CO₂"
        color={colors.primary}
        iconBackground={colors.primary + '20'}
      />

      <MetricCard
        icon="📈"
        title="이번 달 배출량"
        value={summaryData.currentMonthly.toLocaleString()}
        subtitle="tons CO₂"
        color={summaryData.trend <= 0 ? colors.success : colors.warning}
        iconBackground={(summaryData.trend <= 0 ? colors.success : colors.warning) + '20'}
        trend={getTrendInfo(summaryData.trend)}
      />

      <MetricCard
        icon="🏢"
        title="활성 회사"
        value={summaryData.companyCount}
        subtitle="개 회사"
        color={colors.chart.secondary}
        iconBackground={colors.chart.secondary + '20'}
      />

      <MetricCard
        icon="⚡"
        title="배출원 종류"
        value={summaryData.sourceCount}
        subtitle="종류"
        color={colors.success}
        iconBackground={colors.success + '20'}
      />
    </div>
  );
};

export default SummaryCards;