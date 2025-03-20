import type React from 'react';
import '@/app/globals.css';
import { Press_Start_2P } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

// Header font
export const pressStart2P = Press_Start_2P({
  weight: '400', // Press Start 2P geralmente só tem o peso 400
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
