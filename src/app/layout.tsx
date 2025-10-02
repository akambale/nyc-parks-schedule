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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics gaId={'G-TDSFEGWSMT'} />
        <div className='flex h-screen'>
          <Nav />
          <main className='flex-1 overflow-auto lg:ml-0'>{children}</main>
        </div>
      </body>
    </html>
  );
}
