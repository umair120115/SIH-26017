import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DoLR · LARR Act 2013 Predictive Analytics & Delay Detection Platform",
  description: "AI-powered statutory delay detection, TreeSHAP explainability, prescriptive optimization, and dynamic legal RAG platform for the Department of Land Resources (SIH26017).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050811] text-slate-100 antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
