'use client';

import React, { useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { filteredEmissionsAtom } from '@/store/atoms';

interface CompanyData {
  company: string;
  country: string;
  totalEmissions: number;
  avgEmissions: number;
  dataPoints: number;
  lastUpdate: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

type SortField = 'company' | 'country' | 'totalEmissions' | 'avgEmissions' | 'dataPoints';
type SortDirection = 'asc' | 'desc';

const CompanyTable: React.FC = () => {
  const [emissions] = useAtom(filteredEmissionsAtom);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('totalEmissions');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [countryFilter, setCountryFilter] = useState('');

  // 회사별 데이터 집계
  const companyData = useMemo<CompanyData[]>(() => {
    const companyMap = new Map<string, {
      emissions: number[];
      country: string;
      yearMonths: string[];
    }>();

    // 데이터 그룹화
    emissions.forEach(item => {
      const key = item.companyName;
      if (!companyMap.has(key)) {
        companyMap.set(key, {
          emissions: [],
          country: item.country || 'Unknown',
          yearMonths: []
        });
      }

      const companyInfo = companyMap.get(key)!;
      companyInfo.emissions.push(item.emissions);
      companyInfo.yearMonths.push(item.yearMonth);
    });

    // 회사별 통계 계산
    return Array.from(companyMap.entries()).map(([company, data]) => {
      const totalEmissions = data.emissions.reduce((sum, val) => sum + val, 0);
      const avgEmissions = totalEmissions / data.emissions.length;

      // 트렌드 계산 (최근 2개월 비교)
      const sortedData = data.yearMonths
        .map((month, index) => ({ month, emission: data.emissions[index] }))
        .sort((a, b) => a.month.localeCompare(b.month));

      let trend: 'up' | 'down' | 'stable' = 'stable';
      let trendValue = 0;

      if (sortedData.length >= 2) {
        const latest = sortedData[sortedData.length - 1].emission;
        const previous = sortedData[sortedData.length - 2].emission;
        const change = ((latest - previous) / previous) * 100;

        trendValue = Math.abs(change);
        trend = change > 5 ? 'up' : change < -5 ? 'down' : 'stable';
      }

      const lastUpdate = data.yearMonths.sort().reverse()[0] || '';

      return {
        company,
        country: data.country,
        totalEmissions,
        avgEmissions,
        dataPoints: data.emissions.length,
        lastUpdate,
        trend,
        trendValue
      };
    });
  }, [emissions]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return companyData.filter(item => {
      const matchesSearch = item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = !countryFilter || item.country === countryFilter;
      return matchesSearch && matchesCountry;
    });
  }, [companyData, searchTerm, countryFilter]);

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // 페이지네이션
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const countries = useMemo(() => {
    return Array.from(new Set(companyData.map(item => item.country))).sort();
  }, [companyData]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
      )}
    </button>
  );

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ChevronUp className="h-4 w-4 text-red-500" />;
      case 'down': return <ChevronDown className="h-4 w-4 text-green-500" />;
      default: return <span className="w-4 h-4 text-gray-400">—</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            회사별 배출량 현황
          </h3>

          {/* 검색 및 필터 */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {/* 국가 필터 */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">모든 국가</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="회사명 또는 국가 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
              />
            </div>
          </div>
        </div>

        {/* 결과 정보 */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          총 {filteredData.length}개 회사 | {sortedData.reduce((sum, item) => sum + item.totalEmissions, 0).toLocaleString()} tons CO₂
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <SortButton field="company">회사명</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="country">국가</SortButton>
              </th>
              <th className="px-6 py-3 text-right">
                <SortButton field="totalEmissions">총 배출량</SortButton>
              </th>
              <th className="px-6 py-3 text-right">
                <SortButton field="avgEmissions">평균 배출량</SortButton>
              </th>
              <th className="px-6 py-3 text-center">
                <SortButton field="dataPoints">데이터 수</SortButton>
              </th>
              <th className="px-6 py-3 text-center">트렌드</th>
              <th className="px-6 py-3 text-center">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((company, index) => (
              <tr
                key={company.company}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setSelectedCompany(company)}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {company.company}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    최근 업데이트: {company.lastUpdate}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {company.country}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {company.totalEmissions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    tons CO₂
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-gray-900 dark:text-white">
                    {company.avgEmissions.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    tons/월
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {company.dataPoints}개
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {getTrendIcon(company.trend)}
                    {company.trend !== 'stable' && (
                      <span className={`text-xs font-medium ${
                        company.trend === 'up' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {company.trendValue.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCompany(company);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="상세 보기"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="더 보기"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedData.length)} / {sortedData.length}개
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                      pageNum === currentPage
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상세 모달 */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedCompany.company} 상세 정보
                </h4>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">국가</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedCompany.country}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">총 배출량</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedCompany.totalEmissions.toLocaleString()} tons CO₂
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">평균 배출량</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedCompany.avgEmissions.toFixed(1)} tons CO₂/월
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">데이터 포인트</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedCompany.dataPoints}개
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  닫기
                </button>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>상세 분석</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyTable;