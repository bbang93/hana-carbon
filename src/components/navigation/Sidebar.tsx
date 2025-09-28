'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  FileText,
  Settings,
  Leaf
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Emissions', href: '/emissions', icon: BarChart3 },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  console.log('🗂️ Sidebar: 렌더링, 현재 경로 =', pathname);

  const DesktopSidebar = () => (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-green-600 dark:bg-green-700">
        <div className="flex items-center">
          <Leaf className="h-8 w-8 text-white" />
          <span className="ml-2 text-xl font-bold text-white">
            Carbon Dashboard
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  isActive
                    ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:text-green-200'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                  'group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-200'
                )}
              >
                <item.icon
                  className={classNames(
                    isActive
                      ? 'text-green-500 dark:text-green-300'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                    'mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-200'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">U</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                사용자
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                user@company.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MobileSidebar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <nav className="flex">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                isActive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300',
                'flex-1 flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors duration-200'
              )}
            >
              <item.icon
                className={classNames(
                  isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400',
                  'h-6 w-6 mb-1'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <DesktopSidebar />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <MobileSidebar />
      </div>
    </>
  );
};

export default Sidebar;