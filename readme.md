# Garage Sale Hunter

Garage Sale Hunter is a Next.js web application that makes it easy to discover nearby garage, tag, and estate sales with a homey and trustworthy interface. Visitors can quickly share their location or search by zip code, explore an interactive map, switch to a list-focused view, and read detailed sale information pulled from community submissions and scraped listings.

## Features

- **Location-first onboarding** – The app immediately invites visitors to share their location or search by zip code.
- **Interactive map** – Powered by OpenStreetMap and Leaflet with warm, friendly styling and callouts for each sale.
- **List view toggle** – Users can swap between the map experience and a list-focused layout for easy scanning.
- **Sale details drawer** – Tapping a pin or list item reveals rich sale information, including dates, hours, tags, and a link back to the original source when the listing was scraped.
- **Background scraping** – Server-side scraping utilities collect fresh listings from popular public garage sale directories and blend them with curated fallback data so the interface always feels populated.
- **Geocoding helper** – A minimal API route proxies requests to OpenStreetMap&apos;s Nominatim service to convert zip codes into map coordinates.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [npm](https://www.npmjs.com/) 9 or newer (bundled with recent Node.js installers)

If you are using a cloud-based development environment (Gitpod, Codespaces, etc.), make sure the `3000` port is forwarded to your
local browser session.

### Install dependencies

From the project root run:

```bash
npm install
```

The project includes Leaflet and React Leaflet for mapping. The CSS for Leaflet is imported in `pages/_app.tsx`, so no additional
manual setup is required beyond installing the dependencies.

### Start the development server

Launch the Next.js development server:

```bash
npm run dev
```

By default the app serves on [http://localhost:3000](http://localhost:3000). When running inside a remote container, append
`-- --hostname 0.0.0.0` to expose the server to your browser, e.g. `npm run dev -- --hostname 0.0.0.0`.

On first load the site asks for your location to center the map. Approve the prompt in your browser to see nearby sales, or enter a
zip code in the search bar to move the map manually. The map view includes clickable pins; switch to the list view with the toggle
above the map if you prefer scanning the results.

### Build for production

To produce an optimized build and run it locally:

```bash
npm run build
npm start
```

## Scraping Notes

- Scraping is handled in `lib/sales/scraper.ts` using Axios and Cheerio.
- Listings are cached for 10 minutes by the `/api/sales` endpoint to avoid excessive outbound requests.
- When live scraping is unsuccessful, the app falls back to the warm and friendly sample data located in `lib/sales/staticData.ts` so the interface remains welcoming.
- Always respect the terms of service for third-party sites before deploying the scraper in production. Configure request headers, throttling, and source allowlists as needed.

## Geocoding

The `/api/geocode` endpoint proxies to Nominatim. In production usage, please:

- Add your contact information to the `User-Agent` header.
- Implement request throttling or caching as appropriate.
- Consider supplying your own geocoding data store if traffic is expected to be high.

## Technology

- [Next.js](https://nextjs.org/) for the application framework and API routes.
- [React Leaflet](https://react-leaflet.js.org/) and [Leaflet](https://leafletjs.com/) for mapping.
- [SWR](https://swr.vercel.app/) for lightweight data fetching.
- [Axios](https://axios-http.com/) and [Cheerio](https://cheerio.js.org/) for scraping.

## License

This project is provided as-is for demonstration purposes.
