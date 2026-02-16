import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import { Providers } from "@/app/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GREEN & BLACK — Chemical Tanker Brokerage",
  description: "Advanced Brokerage Management System",
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${jetBrainsMono.variable}`}>
        <Providers>
          <div className="app-container">
            <Sidebar />
            <div className="content-wrapper">
              <Header />
              <main className="main">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
