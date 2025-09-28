'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Eye, EyeOff } from 'lucide-react';
import { filteredEmissionsAtom } from '@/store/atoms';

interface ChartData {
  month: string;
  total: number;
  [key: string]: string | number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

const EmissionsChart: React.FC = () => {
  console.log('📊 EmissionsChart: 컴포넌트 렌더링 시작');
  const [emissions] = useAtom(filteredEmissionsAtom);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [visibleSeries, setVisibleSeries] = useState<Set<string>>(new Set());

  console.log('📊 EmissionsChart: emissions 개수 =', emissions.length);
  console.log('📊 EmissionsChart: chartType =', chartType);
  console.log('📊 EmissionsChart: visibleSeries =', Array.from(visibleSeries));

  // 회사 목록 계산
  const companies = emissions.length > 0
    ? Array.from(new Set(emissions.map(e => e.companyName))).slice(0, 5)
    : ['Green Energy Corp', 'Tech Solutions', 'Manufacturing Ltd', 'Transport Co'];

  // visibleSeries 초기화
  useEffect(() => {
    console.log('📊 EmissionsChart: useEffect - companies =', companies);
    if (visibleSeries.size === 0 && companies.length > 0) {
      console.log('📊 EmissionsChart: visibleSeries 초기화');
      setVisibleSeries(new Set(companies));
    }
  }, [companies.length, visibleSeries.size]);

  // 월별 데이터 그룹화 (더미 데이터 포함)
  const monthlyData = useMemo<ChartData[]>(() => {
    // 더미 데이터 생성
    const dummyData: ChartData[] = [
      { month: '2024/01', total: 1250, 'Green Energy Corp': 450, 'Tech Solutions': 320, 'Manufacturing Ltd': 280, 'Transport Co': 200 },
      { month: '2024/02', total: 1180, 'Green Energy Corp': 420, 'Tech Solutions': 300, 'Manufacturing Ltd': 260, 'Transport Co': 200 },
      { month: '2024/03', total: 1350, 'Green Energy Corp': 480, 'Tech Solutions': 340, 'Manufacturing Ltd': 310, 'Transport Co': 220 },
      { month: '2024/04', total: 1220, 'Green Energy Corp': 440, 'Tech Solutions': 310, 'Manufacturing Ltd': 270, 'Transport Co': 200 },
      { month: '2024/05', total: 1100, 'Green Energy Corp': 400, 'Tech Solutions': 280, 'Manufacturing Ltd': 250, 'Transport Co': 170 },
      { month: '2024/06', total: 1050, 'Green Energy Corp': 380, 'Tech Solutions': 270, 'Manufacturing Ltd': 240, 'Transport Co': 160 }
    ];

    if (emissions.length === 0) {
      return dummyData;
    }

    const groupedData = new Map<string, Map<string, number>>();

    emissions.forEach(item => {
      const month = item.yearMonth;
      const company = item.companyName;

      if (!groupedData.has(month)) {
        groupedData.set(month, new Map());
      }

      const monthData = groupedData.get(month)!;
      monthData.set(company, (monthData.get(company) || 0) + item.emissions);
    });

    console.log('📊 EmissionsChart: monthlyData 계산, companies =', companies);

    const result = Array.from(groupedData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, companyData]) => {
        const monthResult: ChartData = {
          month: month.replace('-', '/'),
          total: 0
        };

        let total = 0;
        companies.forEach(company => {
          const value = companyData.get(company) || 0;
          monthResult[company] = value;
          total += value;
        });

        monthResult.total = total;
        return monthResult;
      });

    console.log('📊 EmissionsChart: monthlyData 전체 =', result);
    return result;
  }, [emissions, visibleSeries.size]);

  // 회사별 총 배출량 (파이 차트용)
  const companyTotals = useMemo<PieData[]>(() => {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
      '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
    ];

    // 더미 데이터
    const dummyTotals = [
      { name: 'Green Energy Corp', value: 2570, color: colors[0] },
      { name: 'Tech Solutions', value: 1880, color: colors[1] },
      { name: 'Manufacturing Ltd', value: 1610, color: colors[2] },
      { name: 'Transport Co', value: 1150, color: colors[3] },
      { name: 'Retail Chain', value: 890, color: colors[4] },
      { name: 'Food Processing', value: 720, color: colors[5] }
    ];

    if (emissions.length === 0) {
      return dummyTotals;
    }

    const totals = new Map<string, number>();

    emissions.forEach(item => {
      totals.set(item.companyName, (totals.get(item.companyName) || 0) + item.emissions);
    });

    return Array.from(totals.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([company, total], index) => ({
        name: company,
        value: Math.round(total),
        color: colors[index % colors.length]
      }));
  }, [emissions]);

  const companyColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const toggleSeries = (company: string) => {
    const newVisible = new Set(visibleSeries);
    if (newVisible.has(company)) {
      newVisible.delete(company);
    } else {
      newVisible.add(company);
    }
    setVisibleSeries(newVisible);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload
            .filter((entry: any) => entry.dataKey !== 'total')
            .map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.dataKey}: {entry.value.toLocaleString()} tons CO₂
              </p>
            ))}
          {chartType !== 'pie' && (
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              총합: {payload.find((p: any) => p.dataKey === 'total')?.value?.toLocaleString()} tons CO₂
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                onClick={(data) => toggleSeries(data.dataKey as string)}
              />
              {companies.map((company, index) => (
                <Line
                  key={company}
                  type="monotone"
                  dataKey={company}
                  stroke={companyColors[index]}
                  strokeWidth={visibleSeries.has(company) ? 3 : 0}
                  dot={{ fill: companyColors[index], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: companyColors[index], strokeWidth: 2 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                onClick={(data) => toggleSeries(data.dataKey as string)}
              />
              {companies.map((company, index) => (
                <Bar
                  key={company}
                  dataKey={company}
                  fill={companyColors[index]}
                  fillOpacity={visibleSeries.has(company) ? 0.8 : 0.1}
                  stroke={companyColors[index]}
                  strokeWidth={1}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={companyTotals}
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={40}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                labelLine={false}
              >
                {companyTotals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString()} tons CO₂`, '배출량']}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  console.log('📊 EmissionsChart: 렌더 함수 호출, 리턴 준비');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          탄소 배출량 분석
        </h3>

        {/* 차트 타입 선택 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'line'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="라인 차트"
          >
            <LineChartIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'bar'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="바 차트"
          >
            <BarChart3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'pie'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="파이 차트"
          >
            <PieChartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 범례 토글 (라인/바 차트에서만) */}
      {chartType !== 'pie' && (
        <div className="flex flex-wrap gap-2 mb-4">
          {companies.map((company, index) => (
            <button
              key={company}
              onClick={() => toggleSeries(company)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-all ${
                visibleSeries.has(company)
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 opacity-50'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: companyColors[index] }}
              />
              <span>{company}</span>
              {visibleSeries.has(company) ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* 차트 */}
      <div className="w-full">
        {renderChart()}
      </div>

      {/* 차트 설명 */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {chartType === 'line' && (
          <p>📈 월별 탄소 배출량 추이를 시간순으로 보여줍니다. 범례를 클릭하여 특정 회사 데이터를 숨기거나 표시할 수 있습니다.</p>
        )}
        {chartType === 'bar' && (
          <p>📊 월별 회사별 배출량을 막대 그래프로 비교합니다. 범례를 클릭하여 특정 회사 데이터를 숨기거나 표시할 수 있습니다.</p>
        )}
        {chartType === 'pie' && (
          <p>🥧 전체 기간 동안 회사별 총 배출량 비율을 원형 차트로 보여줍니다.</p>
        )}
      </div>
    </div>
  );
};

export default EmissionsChart;