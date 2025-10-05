export type SaleSource = 'community' | 'scraped';

export interface SaleListing {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  source: SaleSource;
  sourceUrl?: string;
  tags: string[];
  createdAt: string;
}

export interface SalesResponse {
  sales: SaleListing[];
  generatedAt: string;
}
