import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calculator - Ralph Demo',
  description: 'A simple calculator web interface built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <div className="container mx-auto py-8">{children}</div>
        <footer className="text-center py-4 text-gray-500 text-sm">
          <p>Built with Next.js 15 + TypeScript + Tailwind CSS</p>
          <p className="mt-1">
            CLI version still available:{' '}
            <code className="bg-gray-200 px-2 py-1 rounded">
              node dist/cli.js add 5 3
            </code>
          </p>
        </footer>
      </body>
    </html>
  );
}
