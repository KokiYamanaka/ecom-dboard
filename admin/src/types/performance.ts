export interface PerformanceData {
  _id: string;
  brand: string;
  product_name_identifier: string;
  official_product: string;
  match_score: number;
  status: string;
  pct_change: number;
  pct_change_available_start_month: number;
  new_product: string;
  starting_month: string;
  ending_month: string;
  memo?: string;
  flag?: string;
  [key: string]: any;
}
