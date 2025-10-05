import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeAllSales } from '../../lib/sales/scraper';
import type { SalesResponse } from '../../lib/types';

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

let cachedResponse: SalesResponse | null = null;
let lastFetchedAt = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SalesResponse>
) {
  const now = Date.now();

  if (!cachedResponse || now - lastFetchedAt > CACHE_DURATION_MS) {
    const sales = await scrapeAllSales();
    cachedResponse = {
      sales,
      generatedAt: new Date().toISOString()
    };
    lastFetchedAt = now;
  }

  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
  res.status(200).json(cachedResponse);
}
