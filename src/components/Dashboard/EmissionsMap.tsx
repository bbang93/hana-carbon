'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useAtom } from 'jotai';
import { Treemap, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Globe, BarChart3, Map as MapIcon, Layers } from 'lucide-react';
import { filteredEmissionsAtom } from '@/store/atoms';

interface TreemapData {
  name: string;
  size: number;
  color: string;
  country?: string;
  emissions: number;
  percentage: number;
}

interface CountryData {
  country: string;
  totalEmissions: number;
  companies: number;
  color: string;
  intensity: number;
}

const EmissionsMap: React.FC = () => {
  const [emissions] = useAtom(filteredEmissionsAtom);
  const [viewMode, setViewMode] = useState<'treemap' | 'heatmap'>('treemap');

  // 회사별 TreeMap 데이터
  const companyTreemapData = useMemo<TreemapData[]>(() => {
    const companyTotals = new Map<string, { emissions: number; country: string }>();

    emissions.forEach(item => {
      const key = item.companyName;
      if (!companyTotals.has(key)) {
        companyTotals.set(key, { emissions: 0, country: item.country || 'Unknown' });
      }
      companyTotals.get(key)!.emissions += item.emissions;
    });

    const totalEmissions = Array.from(companyTotals.values())
      .reduce((sum, item) => sum + item.emissions, 0);

    // 환경 친화적 색상 팔레트 (자연에서 영감을 받은 그린/블루 계열)
    const colors = [
      '#2E8B57', // 바다 초록
      '#228B22', // 숲 초록
      '#32CD32', // 라임 초록
      '#00CED1', // 청록색
      '#20B2AA', // 연한 바다 초록
      '#008B8B', // 진한 청록
      '#3CB371', // 중간 바다 초록
      '#66CDAA', // 아쿠아마린
      '#98FB98', // 연한 초록
      '#90EE90', // 연한 초록
      '#8FBC8F', // 진한 바다 초록
      '#006400', // 진한 초록
      '#4682B4', // 강철 파랑
      '#5F9EA0', // 카뎃 블루
      '#48D1CC'  // 중간 터키석
    ];

    const result = Array.from(companyTotals.entries())
      .sort(([,a], [,b]) => b.emissions - a.emissions)
      .slice(0, 15) // 상위 15개 회사만
      .map(([company, data], index) => ({
        name: company,
        size: data.emissions,
        color: colors[index % colors.length],
        country: data.country,
        emissions: data.emissions,
        percentage: (data.emissions / totalEmissions) * 100
      }));

    return result;
  }, [emissions]);

  // 국가별 히트맵 데이터
  const countryHeatmapData = useMemo<CountryData[]>(() => {
    const countryTotals = new Map<string, { emissions: number; companies: Set<string> }>();

    emissions.forEach(item => {
      const country = item.country || 'Unknown';
      if (!countryTotals.has(country)) {
        countryTotals.set(country, { emissions: 0, companies: new Set() });
      }
      const countryData = countryTotals.get(country)!;
      countryData.emissions += item.emissions;
      countryData.companies.add(item.companyName);
    });

    const maxEmissions = Math.max(...Array.from(countryTotals.values()).map(d => d.emissions));

    // 환경 친화적 히트맵 색상 (연한 초록에서 진한 초록으로)
    const colors = ['#E8F5E8', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20'];

    return Array.from(countryTotals.entries())
      .sort(([,a], [,b]) => b.emissions - a.emissions)
      .map(([country, data]) => {
        const intensity = data.emissions / maxEmissions;
        const colorIndex = Math.min(Math.floor(intensity * colors.length), colors.length - 1);

        return {
          country,
          totalEmissions: data.emissions,
          companies: data.companies.size,
          color: colors[colorIndex],
          intensity: intensity * 100
        };
      });
  }, [emissions]);

  const CustomTreemapTooltip = useCallback(({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900 p-4 border border-green-200 dark:border-gray-600 rounded-xl shadow-xl backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
            <div className="font-bold text-green-800 dark:text-green-200">
              {data.name}
            </div>
          </div>
          <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
            <div className="flex items-center space-x-2">
              <span>🌍</span>
              <span>국가: {data.country}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>💨</span>
              <span>배출량: {data.emissions.toLocaleString()} tons CO₂</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📊</span>
              <span>비율: {data.percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-300 to-teal-400 opacity-5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.05),transparent_50%)]"></div>

      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-emerald-200/50 dark:border-emerald-800/30">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                <Globe className="h-8 w-8 text-white drop-shadow-sm" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-xs">🌿</span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-1">
                {viewMode === 'treemap' ? 'Carbon Footprint' : 'Global Impact'}
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                {viewMode === 'treemap' ? '🌱 기업별 탄소 배출량 분석' : '🌍 국가별 환경 영향도 현황'}
              </p>
            </div>
          </div>

          {/* 뷰 모드 선택 */}
          <div className="relative">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-2 shadow-lg border-2 border-emerald-200/50 dark:border-emerald-800/30">
              <button
                onClick={() => setViewMode('treemap')}
                className={`group relative p-4 rounded-xl transition-all duration-500 transform ${
                  viewMode === 'treemap'
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl scale-110 -rotate-1'
                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-600 hover:scale-105'
                }`}
                title="TreeMap View"
              >
                <Layers className={`h-6 w-6 transition-transform duration-300 ${viewMode === 'treemap' ? 'scale-110' : 'group-hover:scale-110'}`} />
                {viewMode === 'treemap' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`group relative p-4 rounded-xl transition-all duration-500 transform ${
                  viewMode === 'heatmap'
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl scale-110 rotate-1'
                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-600 hover:scale-105'
                }`}
                title="Heatmap View"
              >
                <Globe className={`h-6 w-6 transition-transform duration-300 ${viewMode === 'heatmap' ? 'scale-110' : 'group-hover:scale-110'}`} />
                {viewMode === 'heatmap' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 시각화 영역 */}
        <div className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-green-100/50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-3xl"></div>
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-emerald-200/30 dark:border-emerald-800/30">
            {viewMode === 'treemap' ? (
              <>
                <ResponsiveContainer width="100%" height={400}>
                  <Treemap
                    data={companyTreemapData}
                    dataKey="size"
                    aspectRatio={4/3}
                    stroke="#fff"
                    fill="#8884d8"
                    isAnimationActive={false}
                  >
                    <Tooltip content={<CustomTreemapTooltip />} />
                  </Treemap>
                </ResponsiveContainer>

                {/* TreeMap 범례 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-green-200 dark:border-gray-600">
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    상위 기업별 탄소 배출량
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {companyTreemapData.slice(0, 10).map((item, index) => (
                      <div key={item.name} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate font-medium">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 국가별 히트맵 (카드 형태) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 h-96 overflow-y-auto">
                  {countryHeatmapData.map((country, index) => (
                    <div
                      key={country.country}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                      style={{
                        backgroundColor: country.color,
                        color: country.intensity > 50 ? '#fff' : '#000'
                      }}
                    >
                      <div className="font-semibold text-sm mb-1">
                        {country.country}
                      </div>
                      <div className="text-xs space-y-1">
                        <div>{country.totalEmissions.toLocaleString()} tons</div>
                        <div>{country.companies}개 회사</div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full opacity-80" />
                          <span>{country.intensity.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 히트맵 범례 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-green-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-green-800 dark:text-green-300 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      환경 영향도 (상대적)
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">친환경</span>
                      <div className="flex space-x-1">
                        {['#E8F5E8', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20'].map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-sm border border-green-200 dark:border-gray-600 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-green-800 dark:text-green-300 font-medium">고배출</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 설명 */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-blue-200 dark:border-gray-600">
          {viewMode === 'treemap' ? (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">탄소 발자국 비교 분석</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">각 기업의 탄소 배출량을 시각적 면적으로 비교합니다. 더 큰 면적은 더 많은 환경 영향을 의미합니다.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">글로벌 환경 영향도</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">국가별 탄소 배출량을 친환경 색상 그라데이션으로 표현합니다. 진한 녹색일수록 높은 배출량을 나타냅니다.</p>
              </div>
            </div>
          )}
        </div>

        {/* 통계 요약 */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-emerald-200 dark:border-emerald-700 text-center transform group-hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                {viewMode === 'treemap' ? companyTreemapData.length : countryHeatmapData.length}
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 font-bold">
                {viewMode === 'treemap' ? '🏢 참여 기업' : '🌍 참여 국가'}
              </div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-blue-200 dark:border-blue-700 text-center transform group-hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {viewMode === 'treemap'
                  ? Math.round(companyTreemapData.reduce((sum, item) => sum + item.emissions, 0) / 1000) + 'K'
                  : Math.round(countryHeatmapData.reduce((sum, item) => sum + item.totalEmissions, 0) / 1000) + 'K'
                }
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 font-bold">💨 총 배출량 (K tons)</div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-orange-200 dark:border-orange-700 text-center transform group-hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2 truncate">
                {viewMode === 'treemap'
                  ? companyTreemapData[0]?.name.substring(0, 6) + '...' || 'N/A'
                  : countryHeatmapData[0]?.country || 'N/A'
                }
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300 font-bold">⚠️ 최대 배출원</div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-red-200 dark:border-red-700 text-center transform group-hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">
                {viewMode === 'treemap'
                  ? (companyTreemapData[0]?.percentage || 0).toFixed(0) + '%'
                  : (countryHeatmapData[0]?.intensity || 0).toFixed(0) + '%'
                }
              </div>
              <div className="text-sm text-red-700 dark:text-red-300 font-bold">📊 최대 점유율</div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionsMap;