import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { SearchControls } from '../components/SearchControls';
import { SaleList } from '../components/SaleList';
import { SaleDetailDrawer } from '../components/SaleDetailDrawer';
import type { SaleListing, SalesResponse } from '../lib/types';

const DynamicSaleMap = dynamic(
  () => import('../components/SaleMap').then((mod) => mod.SaleMap),
  { ssr: false }
);

type ViewMode = 'map' | 'list';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const { data, error, isLoading } = useSWR<SalesResponse>('/api/sales', fetcher, {
    refreshInterval: 5 * 60 * 1000
  });
  const [selectedSale, setSelectedSale] = useState<SaleListing | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]);

  const salesWithCoordinates = useMemo(() => {
    if (!data?.sales) return [];
    return data.sales
      .filter(
        (sale) =>
          Number.isFinite(sale.latitude) &&
          Number.isFinite(sale.longitude) &&
          (sale.latitude !== 0 || sale.longitude !== 0)
      )
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  }, [data?.sales]);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported on this device.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setIsLocating(false);
      },
      () => {
        alert('Unable to access your location.');
        setIsLocating(false);
      }
    );
  }, []);

  const handleSearchZip = useCallback(async (zip: string) => {
    try {
      const response = await axios.get('/api/geocode', { params: { q: zip } });
      const { latitude, longitude } = response.data;
      setMapCenter([latitude, longitude]);
    } catch (zipError) {
      console.error('Zip lookup failed', zipError);
      alert('Unable to find that zip code. Please try a different one.');
    }
  }, []);

  const handleSelectSale = useCallback((sale: SaleListing) => {
    setSelectedSale(sale);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedSale(null);
  }, []);

  return (
    <main>
      <SearchControls
        onGeolocate={handleLocateMe}
        onSearchZip={handleSearchZip}
        isLocating={isLocating}
      />

      <div className="view-toggle">
        <button
          className={viewMode === 'map' ? 'active' : ''}
          onClick={() => setViewMode('map')}
        >
          Map View
        </button>
        <button
          className={viewMode === 'list' ? 'active' : ''}
          onClick={() => setViewMode('list')}
        >
          List View
        </button>
      </div>

      {error ? (
        <p style={{ padding: '0 1.5rem 2rem', color: '#b91c1c' }}>
          We hit a snag fetching sales. Please refresh to try again.
        </p>
      ) : null}

      {isLoading && !data ? (
        <p style={{ padding: '0 1.5rem 2rem' }}>Gathering the warmest listings…</p>
      ) : null}

      <div className="content-wrapper">
        {viewMode === 'map' ? (
          <>
            <DynamicSaleMap
              sales={salesWithCoordinates}
              center={mapCenter}
              onSelect={handleSelectSale}
            />
            <SaleList sales={salesWithCoordinates} onSelect={handleSelectSale} />
          </>
        ) : null}

        {viewMode === 'list' ? (
          <SaleList sales={salesWithCoordinates} onSelect={handleSelectSale} />
        ) : null}
      </div>

      <SaleDetailDrawer sale={selectedSale} onClose={handleCloseDrawer} />
    </main>
  );
}
