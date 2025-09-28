export interface GhgEmission {
  yearMonth: string; // "2025-01", "2025-02", "2025-03"
  source: string; // gasoline, lpg, diesel, etc
  emissions: number; // tons of CO2 equivalent
}

export interface Company {
  id: string;
  name: string;
  country: string; // Country.code
  emissions: GhgEmission[];
}

export interface Post {
  id: string;
  title: string;
  resourceUid: string; // Company.id
  dateTime: string; // e.g., "2024-02"
  content: string;
}

export interface Country {
  code: string;
  name: string;
  flag?: string;
}

// UI 관련 타입들
export interface EmissionSummary {
  totalEmissions: number;
  monthlyChange: number;
  averageEmissions: number;
}

export interface ChartDataPoint {
  month: string;
  emissions: number;
  source?: string;
}

export interface DashboardFilters {
  selectedCompany?: string;
  selectedCountry?: string;
  selectedSource?: string;
  dateRange: {
    start: string;
    end: string;
  };
}