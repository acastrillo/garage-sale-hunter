import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';

export default function GarageSaleHunterApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Garage Sale Hunter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Discover nearby garage, tag, and estate sales with a homey and trusted experience."
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
