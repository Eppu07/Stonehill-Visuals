import './globals.css';

export const metadata = {
  title: 'Valokuvaaja Seinäjoki – Elias Kivimäki | stonehill.architect',
  description: 'Elias Kivimäki – ammattitaitoinen valokuvaaja ja videokuvaaja Seinäjoella ja Etelä-Pohjanmaalla. Valokuvaus, videotuotanto ja some-hallinnointi. Varaa kuvaus helposti.',
  keywords: 'valokuvaaja Seinäjoki, videotuotanto Seinäjoki, valokuvaaja Etelä-Pohjanmaa, häävideo, tapahtumavideo, markkinointivideo, somehallinnointi, Elias Kivimäki, stonehill.architect',
  authors: [{ name: 'Elias Kivimäki – stonehill.architect' }],
  alternates: { canonical: 'https://stonehillvisuals.fi/' },
  openGraph: {
    type: 'website',
    url: 'https://stonehillvisuals.fi/',
    title: 'Valokuvaaja Seinäjoki – Elias Kivimäki | stonehill.architect',
    description: 'Ammattitaitoinen valokuvaaja ja videotuottaja Seinäjoella. Valokuvaus, videotuotanto ja somehallinnointi.',
    siteName: 'stonehill.architect',
    locale: 'fi_FI',
    images: [{ url: 'https://stonehillvisuals.fi/kuvat%20ja%20videot/_DSC9541.jpg', width: 1200, height: 630 }]
  }
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://stonehillvisuals.fi/#business',
      name: 'stonehill.architect',
      alternateName: 'Elias Kivimäki Valokuvaaja',
      description: 'Ammattitaitoinen valokuvaaja ja videokuvaaja Seinäjoella ja Etelä-Pohjanmaalla. Valokuvaus, videotuotanto ja somehallinnointi.',
      url: 'https://stonehillvisuals.fi',
      email: 'elias.kivimaki@gmail.com',
      image: 'https://stonehillvisuals.fi/kuvat%20ja%20videot/_DSC9541.jpg',
      priceRange: '€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Opaalikatu 4',
        addressLocality: 'Seinäjoki',
        postalCode: '60100',
        addressCountry: 'FI',
        addressRegion: 'Etelä-Pohjanmaa'
      },
      geo: { '@type': 'GeoCoordinates', latitude: '62.7867', longitude: '22.8287' },
      areaServed: [
        { '@type': 'City', name: 'Seinäjoki' },
        { '@type': 'State', name: 'Etelä-Pohjanmaa' }
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Palvelut',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Valokuvaus Seinäjoki' }, price: '80', priceCurrency: 'EUR' },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Videotuotanto Seinäjoki' }, price: '400', priceCurrency: 'EUR' },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Somehallinnointi' }, price: '350', priceCurrency: 'EUR' }
        ]
      },
      sameAs: ['https://www.instagram.com/stonehillvisuals']
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="fi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
