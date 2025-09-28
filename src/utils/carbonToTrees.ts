/**
 * 탄소 배출량을 나무로 변환하는 유틸리티 함수들
 *
 * ✨ 기준 설명:
 * - 성인 소나무 (수령 20년, 높이 10m, 지름 25cm)
 * - 연간 CO2 흡수량: 22kg
 * - 비교 대상: 아파트 대형 수목 기준
 *
 * 📊 출처 데이터:
 * - 산림청 탁소흡수량 공식 데이터
 * - 한국임업진흥원 산림탁소연구소 연구결과
 * - FAO(유엔식량농업기구) 글로벌 산림 데이터
 *
 * ⚠️ 주의사항:
 * 같은 종류 나무라도 수령, 크기, 토양, 기후에 따라 차이가 있음
 * (예: 어린 나무 5-10kg/년, 대형 나무 50-100kg/년)
 */

/**
 * 탄소 배출량을 나무 구하기 효과로 변환
 * 기준: 성인 소나무(수령 20년, 높이 10m) 1그루가 1년간 약 22kg의 CO2를 흡수
 * 출처: 산림청 탄소흡수량 공식 데이터 기준
 * 참고: 같은 종류 나무라도 수령, 크기, 환경에 따라 차이가 있음
 */
export const TREE_CO2_ABSORPTION_PER_YEAR = 22; // kg CO2 per tree per year

/**
 * 나무 관련 환경 효과 상수들
 */
export const TREE_CONSTANTS = {
  OXYGEN_PRODUCTION_PER_TREE_PER_YEAR: 260, // kg - 나무 1그루당 연간 산소 생산량 (성인 4명 1년 사용량)
  AIR_POLLUTION_REMOVAL_PER_TREE_PER_YEAR: 27, // kg - 나무 1그루당 연간 대기오염물질 제거량
  TREES_PER_SMALL_FOREST: 100, // 그루 - 작은 숲 형성을 위한 최소 나무 수 (국립공원 기준)
  FOREST_AREA_PER_100_TREES: 0.5, // 축구장 기준 (100그루 = 축구장 0.5개 크기 = 3,500m²)

  // 비교 기준 상수들
  CAR_CO2_PER_KM: 4.6, // kg CO2 per km - 일반 승용차 기준
  HOUSEHOLD_MONTHLY_ELECTRICITY: 350, // kWh - 4인 가족 월 평균 전기 사용량
  ELECTRICITY_CO2_PER_KWH: 0.4575 // kg CO2 per kWh - 한국 전력 CO2 배출계수
};

/**
 * 톤 단위 CO2를 나무 개수로 변환
 * @param co2Tons CO2 배출량 (톤)
 * @returns 구할 수 있는 나무 개수
 */
export const convertCO2ToTrees = (co2Tons: number): number => {
  const co2Kg = co2Tons * 1000; // 톤을 kg으로 변환
  return Math.floor(co2Kg / TREE_CO2_ABSORPTION_PER_YEAR);
};

/**
 * 나무 개수를 CO2 흡수량(톤)으로 변환
 * @param treeCount 나무 개수
 * @returns CO2 흡수량 (톤)
 */
export const convertTreesToCO2 = (treeCount: number): number => {
  return (treeCount * TREE_CO2_ABSORPTION_PER_YEAR) / 1000;
};

/**
 * 배출량 감소효과를 다양한 환경 지표로 변환
 * @param co2ReductionTons 감소된 CO2 량 (톤)
 */
export const getEnvironmentalImpact = (co2ReductionTons: number) => {
  const savedTrees = convertCO2ToTrees(co2ReductionTons);

  return {
    savedTrees,
    equivalentForests: Math.floor(savedTrees / TREE_CONSTANTS.TREES_PER_SMALL_FOREST),
    oxygenProduced: Math.floor(savedTrees * TREE_CONSTANTS.OXYGEN_PRODUCTION_PER_TREE_PER_YEAR),
    airPurified: Math.floor(savedTrees * TREE_CONSTANTS.AIR_POLLUTION_REMOVAL_PER_TREE_PER_YEAR),
    carbonStored: co2ReductionTons,
    forestAreaInSoccerFields: Number((savedTrees * TREE_CONSTANTS.FOREST_AREA_PER_100_TREES / 100).toFixed(1))
  };
};

/**
 * 배출량 트렌드를 기반으로 환경 효과 계산
 * @param monthlyEmissions 월별 배출량 배열
 */
export const calculateEnvironmentalTrend = (monthlyEmissions: number[]) => {
  if (monthlyEmissions.length < 2) return null;

  const lastMonth = monthlyEmissions[monthlyEmissions.length - 1];
  const previousMonth = monthlyEmissions[monthlyEmissions.length - 2];
  const reduction = previousMonth - lastMonth;

  // 감소가 있을 때만 긍정적 효과 계산
  if (reduction > 0) {
    return {
      reduction,
      impact: getEnvironmentalImpact(reduction),
      trend: 'improving' as const
    };
  } else {
    return {
      reduction: Math.abs(reduction),
      impact: getEnvironmentalImpact(Math.abs(reduction)),
      trend: 'worsening' as const
    };
  }
};

/**
 * 나무 아이콘을 단계별로 반환 (성장 단계)
 * @param healthScore 0-100 건강도 점수
 */
export const getTreeIcon = (healthScore: number): string => {
  if (healthScore >= 80) return '🌳'; // 건강한 큰 나무
  if (healthScore >= 60) return '🌲'; // 중간 나무
  if (healthScore >= 40) return '🌱'; // 새싹
  if (healthScore >= 20) return '🪴'; // 화분 식물
  return '🌿'; // 잎사귀
};

/**
 * 환경 등급 계산 (A-F 등급)
 * 기준: 글로벌 친환경 기업 벤치마킹 및 탄소중립 목표 기준
 * @param co2PerMonth 월평균 CO2 배출량 (톤)
 */
export const calculateEnvironmentalGrade = (co2PerMonth: number): {
  grade: string;
  color: string;
  description: string;
  benchmark: string;
  globalPercentile: string;
} => {
  if (co2PerMonth <= 50) {
    return {
      grade: 'A+',
      color: '#22c55e',
      description: '매우 우수',
      benchmark: '글로벌 탄소중립 선도기업 수준',
      globalPercentile: '상위 5%'
    };
  } else if (co2PerMonth <= 100) {
    return {
      grade: 'A',
      color: '#16a34a',
      description: '우수',
      benchmark: '친환경 인증기업 평균 수준',
      globalPercentile: '상위 20%'
    };
  } else if (co2PerMonth <= 150) {
    return {
      grade: 'B',
      color: '#65a30d',
      description: '양호',
      benchmark: '업계 우수기업 평균 수준',
      globalPercentile: '상위 40%'
    };
  } else if (co2PerMonth <= 200) {
    return {
      grade: 'C',
      color: '#ca8a04',
      description: '보통',
      benchmark: '일반 기업 평균 수준',
      globalPercentile: '상위 60%'
    };
  } else if (co2PerMonth <= 300) {
    return {
      grade: 'D',
      color: '#ea580c',
      description: '주의',
      benchmark: '개선 필요 기업 수준',
      globalPercentile: '하위 40%'
    };
  } else {
    return {
      grade: 'F',
      color: '#dc2626',
      description: '위험',
      benchmark: '탄소집약적 산업 수준',
      globalPercentile: '하위 20%'
    };
  }
};