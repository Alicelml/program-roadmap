import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Program Roadmap | Adelaide University",
    template: "%s | Program Roadmap",
  },
  description:
    "Explore your academic journey, discover career pathways, and connect with industry. Your program roadmap starts here.",
  keywords: ["university", "programs", "roadmap", "careers", "alumni", "industry"],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Program Roadmap",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
