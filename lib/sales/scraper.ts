import axios from 'axios';
import * as cheerio from 'cheerio';
import { SaleListing } from '../types';
import { fallbackSales } from './staticData';

const ESTATE_SALES_NET = 'https://www.estatesales.net/estate-sales';
const GARAGE_SALE_FINDER = 'https://gsalr.com/';

function parseDate(dateText: string): string | undefined {
  const normalized = dateText.trim().replace(/\s+/g, ' ');
  const parsed = Date.parse(normalized);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString();
  }
  return undefined;
}

async function scrapeEstateSalesNet(): Promise<SaleListing[]> {
  try {
    const { data } = await axios.get(ESTATE_SALES_NET, {
      headers: {
        'User-Agent':
          'GarageSaleHunterBot/0.1 (+https://garage-sale-hunter.example)'
      },
      timeout: 5000
    });

    const $ = cheerio.load(data);
    const listings: SaleListing[] = [];

    $('.sale-card').each((_, element) => {
      const title = $(element).find('.sale-title').text().trim();
      const address = $(element).find('.sale-address').text().trim();
      const dateRange = $(element).find('.sale-dates').text().trim();
      const url = $(element).find('a.sale-title').attr('href');

      if (!title || !address || !dateRange) return;

      const [startRaw, endRaw] = dateRange.split('to').map((part) => part.trim());

      listings.push({
        id: `estatesales-${Buffer.from(title + address).toString('base64')}`,
        title,
        description: `${title} — discovered on EstateSales.net`,
        address,
        city: '',
        state: '',
        postalCode: '',
        latitude: 0,
        longitude: 0,
        startDate: parseDate(startRaw) ?? new Date().toISOString(),
        endDate: parseDate(endRaw ?? startRaw) ?? new Date().toISOString(),
        source: 'scraped',
        sourceUrl: url ? new URL(url, ESTATE_SALES_NET).toString() : ESTATE_SALES_NET,
        tags: ['estate sale'],
        createdAt: new Date().toISOString()
      });
    });

    return listings;
  } catch (error) {
    console.warn('Failed to scrape EstateSales.net', error);
    return [];
  }
}

async function scrapeGarageSaleFinder(): Promise<SaleListing[]> {
  try {
    const { data } = await axios.get(GARAGE_SALE_FINDER, {
      headers: {
        'User-Agent':
          'GarageSaleHunterBot/0.1 (+https://garage-sale-hunter.example)'
      },
      timeout: 5000
    });

    const $ = cheerio.load(data);
    const listings: SaleListing[] = [];

    $('.event-list .event').each((_, element) => {
      const title = $(element).find('.event-title').text().trim();
      const address = $(element).find('.event-location').text().trim();
      const dateText = $(element).find('.event-date').text().trim();
      const url = $(element).find('a').attr('href');

      if (!title || !address || !dateText) return;

      listings.push({
        id: `gsalr-${Buffer.from(title + address).toString('base64')}`,
        title,
        description: `${title} — collected from Gsalr.com`,
        address,
        city: '',
        state: '',
        postalCode: '',
        latitude: 0,
        longitude: 0,
        startDate: parseDate(dateText) ?? new Date().toISOString(),
        endDate: parseDate(dateText) ?? new Date().toISOString(),
        source: 'scraped',
        sourceUrl: url ? new URL(url, GARAGE_SALE_FINDER).toString() : GARAGE_SALE_FINDER,
        tags: ['garage sale'],
        createdAt: new Date().toISOString()
      });
    });

    return listings;
  } catch (error) {
    console.warn('Failed to scrape Gsalr.com', error);
    return [];
  }
}

export async function scrapeAllSales(): Promise<SaleListing[]> {
  const [estateSales, garageSales] = await Promise.all([
    scrapeEstateSalesNet(),
    scrapeGarageSaleFinder()
  ]);

  const scraped = [...estateSales, ...garageSales];

  if (scraped.length === 0) {
    return fallbackSales;
  }

  return scraped.concat(
    fallbackSales.filter((sale) => sale.source === 'community')
  );
}
