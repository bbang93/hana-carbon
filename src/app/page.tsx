'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { TrendingUp, TrendingDown, Factory, Target, Building2, Calendar } from 'lucide-react';
import { filteredEmissionsAtom } from '@/store/atoms';
import EmissionsChart from '@/components/Dashboard/EmissionsChart';
import CompanyTable from '@/components/Dashboard/CompanyTable';
import EmissionsMap from '@/components/Dashboard/EmissionsMap';
import AnimatedCounter from '@/components/UI/AnimatedCounter';
import LoadingSkeleton from '@/components/UI/LoadingSkeleton';

interface DashboardMetrics {
  totalEmissions: number;
  monthlyChange: number;
  topCompany: string;
  targetProgress: number;
  lastUpdated: Date;
}

const Dashboard: React.FC = () => {
  const [emissions] = useAtom(filteredEmissionsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  // metrics state 제거됨 - calculatedMetrics useMemo로 대체

  // useEffect 문제로 인해 주석 처리, 초기값으로 직접 설정
  // useEffect(() => {
  //   console.log('🏠 Dashboard: useEffect 마운트 확인 실행');
  //   setIsMounted(true);
  //   setIsLoading(false);
  //   console.log('🏠 Dashboard: 상태 업데이트 완료 - isMounted: true, isLoading: false');
  // }, []);

  // useEffect 문제로 인해 주석 처리, 데이터는 실시간 계산으로 변경
  // useEffect(() => {
  //   console.log('🏠 Dashboard: useEffect 데이터 계산 실행, isMounted =', isMounted, 'emissions.length =', emissions.length);
  //   if (!isMounted) {
  //     console.log('🏠 Dashboard: 아직 마운트되지 않음, 리턴');
  //     return;
  //   }

  //   if (emissions.length > 0) {
  //     console.log('🏠 Dashboard: 배출량 데이터 처리 시작');
  //     const totalEmissions = emissions.reduce((sum, item) => sum + item.emissions, 0);

  //     // 월별 변화 계산 (더미 데이터)
  //     const monthlyChange = -12.5;

  //     // 최대 배출 회사 찾기
  //     const companiesMap = new Map<string, number>();
  //     emissions.forEach(item => {
  //       companiesMap.set(item.companyName, (companiesMap.get(item.companyName) || 0) + item.emissions);
  //     });

  //     const topCompany = [...companiesMap.entries()]
  //       .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Green Energy Corp';

  //     // 목표 대비 진행률 (더미 데이터)
  //     const targetProgress = 73.2;

  //     setMetrics({
  //       totalEmissions,
  //       monthlyChange,
  //       topCompany,
  //       targetProgress,
  //       lastUpdated: new Date()
  //     });
  //   }
  // }, [emissions, isMounted]);

  // 메트릭 계산을 useMemo로 최적화
  const calculatedMetrics = useMemo(() => {
    if (emissions.length === 0) {
      return {
        totalEmissions: 0,
        monthlyChange: 0,
        topCompany: 'No Data',
        targetProgress: 0,
        lastUpdated: new Date('2024-06-01')
      };
    }

    const totalEmissions = emissions.reduce((sum, item) => sum + item.emissions, 0);

    // 최대 배출 회사 찾기
    const companiesMap = new Map<string, number>();
    emissions.forEach(item => {
      companiesMap.set(item.companyName, (companiesMap.get(item.companyName) || 0) + item.emissions);
    });

    const topCompany = [...companiesMap.entries()]
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Green Energy Corp';

    return {
      totalEmissions,
      monthlyChange: -12.5,
      topCompany,
      targetProgress: 73.2,
      lastUpdated: new Date('2024-06-01')
    };
  }, [emissions]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <LoadingSkeleton variant="card" count={4} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton variant="chart" count={2} />
        </div>
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* 핵심 지표 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="총 배출량"
          value={calculatedMetrics.totalEmissions}
          suffix=" tons CO₂"
          icon={<Factory className="h-8 w-8" />}
          trend="neutral"
          bgColor="bg-blue-500"
        />

        <MetricCard
          title="전월 대비"
          value={calculatedMetrics.monthlyChange}
          suffix="%"
          icon={calculatedMetrics.monthlyChange >= 0 ? <TrendingUp className="h-8 w-8" /> : <TrendingDown className="h-8 w-8" />}
          trend={calculatedMetrics.monthlyChange >= 0 ? "up" : "down"}
          bgColor={calculatedMetrics.monthlyChange >= 0 ? "bg-red-500" : "bg-green-500"}
        />

        <MetricCard
          title="최대 배출 회사"
          value={calculatedMetrics.topCompany}
          icon={<Building2 className="h-8 w-8" />}
          trend="neutral"
          bgColor="bg-purple-500"
          isText
        />

        <MetricCard
          title="목표 대비 진행률"
          value={calculatedMetrics.targetProgress}
          suffix="%"
          icon={<Target className="h-8 w-8" />}
          trend="up"
          bgColor="bg-green-500"
        />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmissionsChart />
        <EmissionsMap />
      </div>

      {/* 회사 테이블 */}
      <CompanyTable />

    </div>
  );
};

// MetricCard 컴포넌트
interface MetricCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  bgColor: string;
  isText?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  suffix = '',
  icon,
  trend,
  bgColor,
  isText = false
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 ${
      trend === 'up' ? 'border-green-500' : trend === 'down' ? 'border-red-500' : 'border-blue-500'
    } hover-lift transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {isText ? (
              <span className="text-lg">{value}</span>
            ) : (
              <AnimatedCounter
                value={typeof value === 'number' ? value : 0}
                suffix={suffix}
                decimals={suffix === '%' ? 1 : 0}
                duration={800}
              />
            )}
          </div>
        </div>
        <div className={`${bgColor} p-3 rounded-full text-white`}>
          {icon}
        </div>
      </div>

      {trend !== 'neutral' && (
        <div className={`flex items-center mt-2 text-sm ${
          trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span>{trend === 'up' ? '증가' : '감소'} 추세</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;