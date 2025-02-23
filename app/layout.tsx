import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import ConfigureAmplifyClientSide from "./components/ConfigureAmplify";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Fava Health",
  description: "Pilot Program",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <ConfigureAmplifyClientSide/>
        <Nav />
        {children}
      </body>
    </html>
  );
}
