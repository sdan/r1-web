import Providers from '@components/Providers';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-us">
      <body className="theme-light">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
