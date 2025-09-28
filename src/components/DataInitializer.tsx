'use client';

import { useAtom } from 'jotai';
import { companiesAtom, postsAtom, countriesAtom } from '@/store/atoms';
import { companies, posts, countries } from '@/data/mockData';

const DataInitializer = () => {
  console.log('🔧 DataInitializer: 컴포넌트 렌더링');
  // Force rebuild

  const [, setCompanies] = useAtom(companiesAtom);
  const [, setPosts] = useAtom(postsAtom);
  const [, setCountries] = useAtom(countriesAtom);

  console.log('🔧 DataInitializer: setters 준비 완료');

  // 컴포넌트 바디에서 직접 데이터 초기화
  console.log('🔧 DataInitializer: 직접 데이터 초기화 시작');
  console.log('🔧 DataInitializer: 로드할 회사 데이터 =', companies);
  console.log('🔧 DataInitializer: 로드할 국가 데이터 =', countries);
  console.log('🔧 DataInitializer: 로드할 포스트 데이터 =', posts);

  try {
    setCompanies(companies);
    console.log('🔧 DataInitializer: 회사 데이터 설정 완료');

    setCountries(countries);
    console.log('🔧 DataInitializer: 국가 데이터 설정 완료');

    setPosts(posts);
    console.log('🔧 DataInitializer: 포스트 데이터 설정 완료');

    console.log('🔧 DataInitializer: 모든 데이터 초기화 완료');
  } catch (error) {
    console.error('🚨 DataInitializer: 데이터 설정 중 에러 =', error);
  }

  return null;
};

export default DataInitializer;