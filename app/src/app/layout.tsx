import type { Metadata, Viewport } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Chatout · PayPal checkout inside AI chats',
  description: 'Catalog cards, a multi-store cart and one PayPal approval, inside the conversation.'
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#050202' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" />
      </head>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
