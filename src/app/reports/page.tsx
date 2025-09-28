'use client';

import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const reports = [
    {
      id: 1,
      title: '월간 탄소 배출량 보고서',
      description: '2024년 9월 전체 기업 탄소 배출량 현황',
      type: 'monthly',
      date: '2024-09-30',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      id: 2,
      title: '분기별 배출량 분석',
      description: '2024년 3분기 배출량 트렌드 및 분석',
      type: 'quarterly',
      date: '2024-09-30',
      size: '5.1 MB',
      status: 'processing'
    },
    {
      id: 3,
      title: '연간 지속가능성 보고서',
      description: '2023년 연간 환경 지속가능성 종합 보고서',
      type: 'yearly',
      date: '2024-01-31',
      size: '12.8 MB',
      status: 'completed'
    }
  ];

  const filteredReports = reports.filter(report =>
    selectedPeriod === 'all' || report.type === selectedPeriod
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            보고서 관리
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            탄소 배출량 보고서를 생성하고 관리하세요.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
          <FileText className="h-4 w-4 mr-2" />
          새 보고서 생성
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    총 보고서
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {reports.length}개
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    완료된 보고서
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {reports.filter(r => r.status === 'completed').length}개
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    처리 중
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {reports.filter(r => r.status === 'processing').length}개
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    이번 달 생성
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    2개
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 보고서 유형 필터 */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">보고서 유형</h3>
        </div>
        <div className="p-6">
          <div className="flex space-x-4">
            {[
              { key: 'monthly', label: '월간' },
              { key: 'quarterly', label: '분기별' },
              { key: 'yearly', label: '연간' }
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setSelectedPeriod(type.key as 'monthly' | 'quarterly' | 'yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === type.key
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 보고서 목록 */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            보고서 목록 ({filteredReports.length}개)
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {report.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {report.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(report.date).toLocaleDateString('ko-KR')}
                      </div>
                      <div>크기: {report.size}</div>
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          report.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {report.status === 'completed' ? '완료' : '처리 중'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {report.status === 'completed' && (
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Download className="h-4 w-4 mr-2" />
                      다운로드
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <span className="sr-only">메뉴</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 빠른 생성 섹션 */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">빠른 보고서 생성</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-400 dark:hover:border-green-500 transition-colors">
              <Calendar className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">월간 보고서</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">현재 월 기준</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-400 dark:hover:border-green-500 transition-colors">
              <BarChart3 className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">분기 보고서</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">현재 분기 기준</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-400 dark:hover:border-green-500 transition-colors">
              <PieChart className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">사용자 정의</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">기간 선택</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;