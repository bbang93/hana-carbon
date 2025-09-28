import { atom } from 'jotai';
import { Company, Post, Country, DashboardFilters } from '@/types';

console.log('⚛️ Atoms: atoms.ts 파일 로드됨');

// 기본 데이터 atoms
export const companiesAtom = atom<Company[]>([]);
export const postsAtom = atom<Post[]>([]);
export const countriesAtom = atom<Country[]>([]);

// 로딩 상태 atoms
export const isLoadingAtom = atom<boolean>(false);
export const loadingMessageAtom = atom<string>('데이터를 불러오는 중...');

// 에러 상태 atoms
export const errorAtom = atom<string | null>(null);

// 대시보드 필터 상태
export const dashboardFiltersAtom = atom<DashboardFilters>({
  selectedCompany: undefined,
  selectedCountry: undefined,
  selectedSource: undefined,
  dateRange: {
    start: '2024-01',
    end: '2024-06'
  }
});

// 선택된 회사 atom (derived)
export const selectedCompanyAtom = atom(
  (get) => {
    const companies = get(companiesAtom);
    const filters = get(dashboardFiltersAtom);
    return companies.find(company => company.id === filters.selectedCompany);
  }
);

// 필터링된 회사들 atom (derived)
export const filteredCompaniesAtom = atom(
  (get) => {
    const companies = get(companiesAtom);
    const filters = get(dashboardFiltersAtom);

    return companies.filter(company => {
      if (filters.selectedCountry && company.country !== filters.selectedCountry) {
        return false;
      }
      return true;
    });
  }
);

// 필터링된 배출량 데이터 atom (derived)
export const filteredEmissionsAtom = atom(
  (get) => {
    const companies = get(filteredCompaniesAtom);
    const filters = get(dashboardFiltersAtom);

    console.log('⚛️ filteredEmissionsAtom: 계산 시작');
    console.log('⚛️ filteredEmissionsAtom: companies 수 =', companies.length);
    console.log('⚛️ filteredEmissionsAtom: filters =', filters);

    const result = companies.flatMap(company =>
      company.emissions.filter(emission => {
        // 날짜 범위 필터링
        if (emission.yearMonth < filters.dateRange.start ||
            emission.yearMonth > filters.dateRange.end) {
          return false;
        }

        // 소스 필터링
        if (filters.selectedSource && emission.source !== filters.selectedSource) {
          return false;
        }

        return true;
      }).map(emission => ({
        ...emission,
        companyId: company.id,
        companyName: company.name,
        country: company.country
      }))
    );

    console.log('⚛️ filteredEmissionsAtom: 필터링된 결과 수 =', result.length);

    return result;
  }
);

// 사이드바 상태
export const sidebarOpenAtom = atom<boolean>(false);

// 차트 타입 설정
export const chartTypeAtom = atom<'line' | 'bar' | 'area'>('line');

// 테마 설정
export const themeAtom = atom<'light' | 'dark'>('light');

// 다크모드 상태 atom (derived)
export const isDarkModeAtom = atom(
  (get) => get(themeAtom) === 'dark',
  (get, set, newValue: boolean) => {
    const newTheme = newValue ? 'dark' : 'light';
    set(themeAtom, newTheme);

    console.log('⚛️ isDarkModeAtom: 테마 변경 =', newTheme);

    // DOM 업데이트
    if (typeof document !== 'undefined') {
      if (newValue) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      console.log('⚛️ isDarkModeAtom: DOM 업데이트 완료, 클래스 =', document.documentElement.className);
    }
  }
);