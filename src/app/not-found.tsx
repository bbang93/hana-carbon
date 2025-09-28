'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 아이콘 */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>

          {/* 404 제목 */}
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            페이지를 찾을 수 없습니다
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            URL을 다시 확인해 주세요.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <Home className="h-4 w-4 mr-2" />
            홈으로 돌아가기
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            이전 페이지로
          </button>
        </div>

        {/* 도움말 링크 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            여전히 문제가 있나요?{' '}
            <Link
              href="/support"
              className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
            >
              고객 지원팀에 문의하세요
            </Link>
          </p>
        </div>
      </div>

      {/* 추천 페이지 */}
      <div className="mt-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            다른 페이지를 찾고 계신가요?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/"
              className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
            >
              <div className="flex items-center mb-2">
                <Home className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="font-medium text-gray-900 dark:text-white">대시보드</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                탄소 배출량 현황을 확인하세요
              </p>
            </Link>

            <Link
              href="/emissions"
              className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
            >
              <div className="flex items-center mb-2">
                <Search className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="font-medium text-gray-900 dark:text-white">배출량 분석</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                상세한 배출량 데이터를 분석하세요
              </p>
            </Link>

            <Link
              href="/companies"
              className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
            >
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="font-medium text-gray-900 dark:text-white">기업 관리</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                기업별 배출량을 관리하세요
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;