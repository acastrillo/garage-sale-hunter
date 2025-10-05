import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface GeocodeResult {
  latitude: number;
  longitude: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeocodeResult | { error: string }>
) {
  const query = (req.query.q as string | undefined)?.trim();

  if (!query) {
    res.status(400).json({ error: 'Missing query parameter "q"' });
    return;
  }

  try {
    const { data } = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          format: 'json',
          limit: 1,
          q: query
        },
        headers: {
          'User-Agent': 'GarageSaleHunter/0.1 (https://garage-sale-hunter.example)'
        },
        timeout: 5000
      }
    );

    if (Array.isArray(data) && data.length > 0) {
      const result = data[0];
      res.status(200).json({
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon)
      });
      return;
    }

    res.status(404).json({ error: 'No results found' });
  } catch (error) {
    console.error('Geocoding failed', error);
    res.status(500).json({ error: 'Geocoding failed' });
  }
}
