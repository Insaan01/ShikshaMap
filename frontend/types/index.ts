export interface DistrictMetrics {
  district_name: string;
  schools?: string;
  literacy?: string;
  poverty?: string;
}

export interface StateMetrics {
  schools: string;
  literacy: string;
  poverty: string;
  activeNGOs?: number;
}

export interface NGO {
  id: number;
  org_name: string;
  email: string;
  state: string;
  org_type?: string;
  is_approved: boolean;
}

export interface District extends DistrictMetrics {
  schools?: string;
  literacy?: string;
}

export const DUMMY_DISTRICT_STATS: Record<string, { schools: string; literacy: string; poverty: string }> = {
  Bhopal: { schools: "1,245", literacy: "80.37%", poverty: "12.4%" },
  Indore: { schools: "1,890", literacy: "80.87%", poverty: "10.2%" },
  Gwalior: { schools: "1,102", literacy: "76.65%", poverty: "15.1%" },
  Jabalpur: { schools: "1,450", literacy: "81.07%", poverty: "11.8%" },
  Ujjain: { schools: "980", literacy: "72.34%", poverty: "18.3%" },
  Sagar: { schools: "1,340", literacy: "76.46%", poverty: "14.5%" },
  Rewa: { schools: "1,120", literacy: "71.62%", poverty: "19.2%" },
  Satna: { schools: "1,050", literacy: "72.26%", poverty: "17.8%" },
  Default: { schools: "850", literacy: "68.50%", poverty: "16.0%" }
};