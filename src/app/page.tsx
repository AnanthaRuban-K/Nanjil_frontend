// app/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CONTACT_CONFIG } from "@/config/contact";

import EmergencyCallBar from "@/components/EmergencyCallBar";
import LandingHero from "@/components/LandingHero";
import TrustSection from "@/components/TrustSection";
import ServiceGrid from "@/components/ServiceGrid";
import HowItWorks from "@/components/HowItWorks";
import CallCTA from "@/components/CallCTA";
import MobileStickyBar from "@/components/MobileStickyBar";
import Image from "next/image";
export const dynamic = "force-dynamic";
/* ───── SEO Metadata ───── */
export const metadata: Metadata = {
  title: "Electrical & Plumbing Service in Nagercoil | Nanjil MEP",
  description:
    "Fast electrical and plumbing repair services in Nagercoil. Book online or call for immediate technician support.",
  keywords: [
    "electrician nagercoil",
    "plumber nagercoil",
    "electrical repair",
    "plumbing service",
    "Nanjil MEP",
    "home repair nagercoil",
  ],
  openGraph: {
    title: "Electrical & Plumbing Service in Nagercoil | Nanjil MEP",
    description:
      "Fast electrical and plumbing repair services in Nagercoil. Book online or call for immediate technician support.",
    type: "website",
  },
};

/* ───── Page ───── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20 md:pb-0">
      {/* ── Sticky Emergency Bar ── */}
      <EmergencyCallBar />

      {/* ── Header ── */}
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5">
              <div className="flex  items-center justify-center">
                              <Image
                src="/Nanjil.png"
                alt="Nanjil MEP Logo"
                width={120}
                height={120}
                className="object-contain"
              />
              </div>
            </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#1E2A38] md:flex">
            <a
              href="#services"
              className="transition-colors hover:text-[#0F2F6B]"
            >
              Services
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-[#0F2F6B]"
            >
              How It Works
            </a>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <LandingHero />

      {/* ── Trust Badges ── */}
      <TrustSection />

      {/* ── Services ── */}
      <ServiceGrid />

      {/* ── How It Works ── */}
      <HowItWorks />

      {/* ── CTA ── */}
      <CallCTA />

      {/* ── Footer ── */}
      <footer className="bg-[#1E2A38] text-gray-400">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F2F6B]">
                  <Zap size={18} className="text-[#3CC3D6]" />
                </div>
                <span className="text-lg font-extrabold text-white">
                  Nanjil <span className="text-[#F57C00]">MEP</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                Professional electrical and plumbing services in Nagercoil.
                Trusted by 500+ families for quality home repairs.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#services"
                    className="transition-colors hover:text-[#3CC3D6]"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="transition-colors hover:text-[#3CC3D6]"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="transition-colors hover:text-[#3CC3D6]"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="transition-colors hover:text-[#3CC3D6]"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li>📍 Nagercoil, Tamil Nadu</li>
                <li>📞 {CONTACT_CONFIG.phoneDisplay}</li>
                <li>⏰ Mon–Sat, 8 AM – 8 PM</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm">
            © {new Date().getFullYear()} {CONTACT_CONFIG.companyName}. All
            rights reserved.
          </div>
        </div>
      </footer>

      {/* ── Mobile Sticky Booking Bar ── */}
      <MobileStickyBar />
    </div>
  );
}