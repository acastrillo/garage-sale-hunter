import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { useEffect } from 'react';
import { SaleListing } from '../lib/types';

const markerIconData =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSczNicgaGVpZ2h0PSczNicgdmlld0JveD0nMCAwIDM2IDM2Jz48cGF0aCBmaWxsPScjZDk3NzU3JyBkPSdNMTggMGM2LjYgMCAxMiA1LjQgMTIgMTIgMCA3LjUtOS42IDE5LjItMTEuMyAyMS4xLS40LjUtMS4xLjUtMS41IDBDMTUuNiAzMS4yIDYgMTkuNSA2IDEyIDYgNS40IDExLjQgMCAxOCAweicvPjxjaXJjbGUgZmlsbD0nd2hpdGUnIGN4PScxOCcgY3k9JzEyJyByPSc1Jy8+PC9zdmc+';

const homeyIcon = new Icon({
  iconUrl: markerIconData,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -28]
});

function MapViewUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 0.75 });
  }, [center, map]);

  return null;
}

interface SaleMapProps {
  sales: SaleListing[];
  center: LatLngExpression;
  onSelect: (sale: SaleListing) => void;
}

export function SaleMap({ sales, center, onSelect }: SaleMapProps) {
  return (
    <div className="map-wrapper">
      <MapContainer center={center} zoom={11} scrollWheelZoom className="map">
        <MapViewUpdater center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sales.map((sale) => (
          <Marker
            position={[sale.latitude, sale.longitude] as LatLngExpression}
            key={sale.id}
            icon={homeyIcon}
            eventHandlers={{
              click: () => onSelect(sale)
            }}
          >
            <Popup>
              <strong>{sale.title}</strong>
              <br />
              {sale.address}
              <br />
              {new Date(sale.startDate).toLocaleDateString()} –{' '}
              {new Date(sale.endDate).toLocaleDateString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
