import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRAGATI-LARR // DoLR Statutory Decision Support System (RFCTLARR Act 2013)",
  description: "Government of India · Ministry of Rural Development · Department of Land Resources. AI statutory delay risk scoring, TreeSHAP feature attribution, Sec 19(2) lapsing radar, and legal RAG intelligence suite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#080C15] text-slate-100 antialiased min-h-screen selection:bg-blue-600/30 selection:text-blue-200`}>
        {children}
      </body>
    </html>
  );
}
