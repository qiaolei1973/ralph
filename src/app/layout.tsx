import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ralph - AI Task Management',
  description: 'Intelligent task management with Claude AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
