import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Naz Boot House - Premium Footwear for Every Occasion',
  description: 'Discover premium shoes, slippers, school shoes, and sports footwear at Naz Boot House. Quality craftsmanship, comfortable fit, and timeless style.',
  keywords: ['shoes', 'footwear', 'slippers', 'school shoes', 'sports shoes', 'formal shoes', 'Pakistan'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased bg-stone-50`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
