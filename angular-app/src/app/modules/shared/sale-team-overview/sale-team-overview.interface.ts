export interface IOverviewMetric {
  current: number;
  previous: number;
  growth_pct: number;
}

export interface IOverview {
  avg_revenue: IOverviewMetric;
  closed_deals: IOverviewMetric;
  quota_attainment: IOverviewMetric;
  win_rate: IOverviewMetric;
}

export interface IOverviewResponse {
  date_range: string;
  overview: IOverview;
}
