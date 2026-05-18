import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPK Smartphone - Sistem Pendukung Keputusan Pemilihan Smartphone",
  description: "Aplikasi Sistem Pendukung Keputusan untuk pemilihan smartphone menggunakan metode SAW, SMART, Profile Matching, dan Goal Programming",
  keywords: ["SPK", "Smartphone", "SAW", "SMART", "Profile Matching", "Goal Programming"],
  authors: [{ name: "SPK Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8F9FF] text-[#1E3A5F]`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64 transition-all duration-300 pt-16 lg:pt-0">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
