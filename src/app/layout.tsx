import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AXIPAYS Payment Platform",
  description:
    "Secure payment processing platform with real-time transaction dashboard. Process payments safely with HMAC-authenticated API integration.",
  keywords: ["payment", "fintech", "checkout", "transactions", "dashboard"],
  authors: [{ name: "AXIPAYS" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-page text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
