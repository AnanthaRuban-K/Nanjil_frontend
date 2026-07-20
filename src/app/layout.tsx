import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

// Strict nonce-based CSP requires request-time rendering so Next.js can attach
// the per-request nonce to its framework and hydration scripts.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nanjil MEP Service",
  description: "Local Electrical & Plumbing Booking System",
  icons: {
    icon: "/Nanjil.png",
    shortcut: "/Nanjil.png",
    apple: "/Nanjil.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
