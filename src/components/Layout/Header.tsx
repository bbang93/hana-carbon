'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { isDarkModeAtom, themeAtom } from '@/store/atoms';
import {
  Bell,
  Search,
  Menu,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  console.log('📱 Header: 컴포넌트 렌더링 시작');

  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [showUserMenu, setShowUserMenu] = useState(false);

  console.log('📱 Header: 현재 다크모드 상태 =', isDarkMode);
  console.log('📱 Header: 현재 테마 =', theme);

  useEffect(() => {
    console.log('📱 Header: 다크모드 초기화 useEffect 실행');

    // 초기 다크모드 상태 확인
    const savedTheme = localStorage.getItem('theme');
    console.log('📱 Header: 저장된 테마 =', savedTheme);

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('📱 Header: 시스템 다크모드 선호 =', systemPrefersDark);

    const finalTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    console.log('📱 Header: 최종 테마 설정 =', finalTheme);

    setTheme(finalTheme as 'light' | 'dark');

    // DOM 직접 업데이트
    if (finalTheme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('📱 Header: 다크모드 클래스 추가됨');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('📱 Header: 다크모드 클래스 제거됨');
    }
  }, [setTheme]);

  const toggleDarkMode = () => {
    console.log('📱 Header: 다크모드 토글 클릭됨, 현재 상태 =', isDarkMode);
    console.log('📱 Header: 현재 document 클래스 =', document.documentElement.className);

    const newDarkMode = !isDarkMode;
    console.log('📱 Header: 새로운 다크모드 상태 =', newDarkMode);

    // Jotai atom을 통해 상태 변경 (DOM 업데이트도 자동으로 처리됨)
    setIsDarkMode(newDarkMode);

    console.log('📱 Header: 상태 변경 완료');

    // 추가 확인
    setTimeout(() => {
      console.log('📱 Header: 1초 후 확인 - localStorage theme =', localStorage.getItem('theme'));
      console.log('📱 Header: 1초 후 확인 - document.documentElement.classList =', document.documentElement.classList.toString());
      console.log('📱 Header: 1초 후 확인 - isDarkMode state =', isDarkMode);
      console.log('📱 Header: 1초 후 확인 - theme atom =', theme);
    }, 1000);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }) + ' ' + now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              onClick={onMobileMenuToggle}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="lg:hidden ml-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Carbon Dashboard
              </h1>
            </div>

            <div className="hidden md:block ml-4 lg:ml-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="검색..."
                />
              </div>
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {getCurrentDateTime()}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors duration-200"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors duration-200"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800"></span>
            </button>

            <div className="relative">
              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      관리자
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      admin@company.com
                    </div>
                  </div>
                  <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
                </div>
              </button>

              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <User className="mr-3 h-4 w-4" />
                    프로필
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    설정
                  </a>
                  <div className="border-t border-gray-100 dark:border-gray-600"></div>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    로그아웃
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="검색..."
          />
        </div>
      </div>

      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;