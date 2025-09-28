import { Company, Post, Country } from '@/types';

console.log('📊 MockData: 더미 데이터 파일 로드됨');

export const countries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
];

export const companies: Company[] = [
  {
    id: "c1",
    name: "Acme Corp",
    country: "US",
    emissions: [
      { yearMonth: "2024-01", source: "gasoline", emissions: 120 },
      { yearMonth: "2024-02", source: "gasoline", emissions: 110 },
      { yearMonth: "2024-03", source: "gasoline", emissions: 95 },
      { yearMonth: "2024-04", source: "gasoline", emissions: 105 },
      { yearMonth: "2024-05", source: "gasoline", emissions: 88 },
      { yearMonth: "2024-06", source: "gasoline", emissions: 92 },
      { yearMonth: "2024-01", source: "diesel", emissions: 80 },
      { yearMonth: "2024-02", source: "diesel", emissions: 75 },
      { yearMonth: "2024-03", source: "diesel", emissions: 70 },
    ]
  },
  {
    id: "c2",
    name: "Globex Industries",
    country: "DE",
    emissions: [
      { yearMonth: "2024-01", source: "gasoline", emissions: 80 },
      { yearMonth: "2024-02", source: "gasoline", emissions: 105 },
      { yearMonth: "2024-03", source: "gasoline", emissions: 120 },
      { yearMonth: "2024-04", source: "gasoline", emissions: 115 },
      { yearMonth: "2024-05", source: "gasoline", emissions: 125 },
      { yearMonth: "2024-06", source: "gasoline", emissions: 135 },
      { yearMonth: "2024-01", source: "lpg", emissions: 60 },
      { yearMonth: "2024-02", source: "lpg", emissions: 65 },
      { yearMonth: "2024-03", source: "lpg", emissions: 55 },
    ]
  },
  {
    id: "c3",
    name: "TechNova Solutions",
    country: "JP",
    emissions: [
      { yearMonth: "2024-01", source: "electricity", emissions: 200 },
      { yearMonth: "2024-02", source: "electricity", emissions: 195 },
      { yearMonth: "2024-03", source: "electricity", emissions: 180 },
      { yearMonth: "2024-04", source: "electricity", emissions: 175 },
      { yearMonth: "2024-05", source: "electricity", emissions: 160 },
      { yearMonth: "2024-06", source: "electricity", emissions: 150 },
    ]
  },
];

export const posts: Post[] = [
  {
    id: "p1",
    title: "2024년 Q1 지속가능성 보고서",
    resourceUid: "c1",
    dateTime: "2024-03",
    content: "1분기 CO2 배출량이 전년 대비 15% 감소했습니다."
  },
  {
    id: "p2",
    title: "신규 환경 정책 도입",
    resourceUid: "c2",
    dateTime: "2024-02",
    content: "탄소 중립 목표 달성을 위한 새로운 정책을 도입했습니다."
  },
];

console.log('📊 MockData: 더미 데이터 생성 완료');
console.log('📊 MockData: 국가 수 =', countries.length);
console.log('📊 MockData: 회사 수 =', companies.length);
console.log('📊 MockData: 총 배출량 데이터 포인트 =',
  companies.reduce((total, company) => total + company.emissions.length, 0));