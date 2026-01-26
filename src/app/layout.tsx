import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Framo - Frame screenshots. Nothing else.',
  description: 'Add beautiful gradient backgrounds to your screenshots without changing a single pixel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
