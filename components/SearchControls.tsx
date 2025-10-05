import { FormEvent, useState } from 'react';

interface SearchControlsProps {
  onGeolocate: () => void;
  onSearchZip: (zip: string) => void;
  isLocating: boolean;
}

export function SearchControls({
  onGeolocate,
  onSearchZip,
  isLocating
}: SearchControlsProps) {
  const [zip, setZip] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (zip.trim()) {
      onSearchZip(zip.trim());
    }
  };

  return (
    <div className="search-controls">
      <div className="search-card">
        <h1>Find a Cozy Sale Nearby</h1>
        <p>
          Discover community garage, tag, and estate sales in a safe and
          welcoming experience. Start by sharing your location or enter a zip
          code to explore.
        </p>
        <div className="search-actions">
          <button
            type="button"
            className="primary"
            onClick={onGeolocate}
            disabled={isLocating}
          >
            {isLocating ? 'Locating…' : 'Find Near Me'}
          </button>
          <span className="separator">or</span>
          <form onSubmit={handleSubmit} className="zip-form">
            <label htmlFor="zip-input" className="sr-only">
              Enter Zip Code
            </label>
            <input
              id="zip-input"
              type="text"
              placeholder="Zip Code"
              value={zip}
              onChange={(event) => setZip(event.target.value)}
              pattern="\\d{5}"
              maxLength={5}
              inputMode="numeric"
              required
            />
            <button type="submit" className="secondary">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
