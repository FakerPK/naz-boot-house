import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Naz Boot House',
  description: 'Manage products for Naz Boot House',
};

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#1e3a5f" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="NBH Admin" />
      <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      <link rel="icon" type="image/svg+xml" sizes="192x192" href="/icons/icon-192.svg" />
      <link rel="icon" type="image/svg+xml" sizes="512x512" href="/icons/icon-512.svg" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(reg => console.log('SW registered:', reg.scope))
                  .catch(err => console.log('SW registration failed:', err));
              });
            }
          `,
        }}
      />
      {children}
    </>
  );
}