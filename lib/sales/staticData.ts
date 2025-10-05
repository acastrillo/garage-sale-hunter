import { SaleListing } from '../types';

export const fallbackSales: SaleListing[] = [
  {
    id: 'fallback-1',
    title: 'Sunny Saturday Garage Sale',
    description:
      'Family-friendly sale with vintage kitchenware, kids clothes, and a cozy lemonade stand. Perfect for a relaxed Saturday stroll.',
    address: '123 Maple Lane',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62704',
    latitude: 39.7817,
    longitude: -89.6501,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    startTime: '08:00',
    endTime: '15:00',
    source: 'community',
    tags: ['multi-family', 'vintage', 'kid-friendly'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'fallback-2',
    title: 'Estate Sale with Antique Finds',
    description:
      'Estate sale featuring restored furniture, collectible dish sets, and hand-crafted quilts. Sourced from EstateSales.net.',
    address: '45 Willow Creek Drive',
    city: 'Madison',
    state: 'WI',
    postalCode: '53711',
    latitude: 43.0731,
    longitude: -89.4012,
    startDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    startTime: '09:00',
    endTime: '17:00',
    source: 'scraped',
    sourceUrl: 'https://www.estatesales.net/',
    tags: ['antiques', 'furniture'],
    createdAt: new Date().toISOString()
  }
];
