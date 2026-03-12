import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';

import Nav from './nav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NYC Parks Field Availability',
  description: 'Find field availability at parks in NYC',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏓</text></svg>" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics gaId={'G-TDSFEGWSMT'} />
        <div className='flex flex-col h-screen'>
          <Nav />
          <main className='flex-1 overflow-hidden'>{children}</main>
        </div>
      </body>
    </html>
  );
}
