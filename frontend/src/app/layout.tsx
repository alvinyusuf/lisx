import '@rainbow-me/rainbowkit/styles.css';

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from '@/contexts/wagmi-provider';
import { cookieToInitialState } from 'wagmi';
import { getConfig } from '@/configs/wagmi';
import { headers } from 'next/headers';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie')
  )

  return (
    <html lang="en">
      <body className='w-screen px-10'>
        <Providers initialState={initialState}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
