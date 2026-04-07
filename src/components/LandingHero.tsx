// components/LandingHero.tsx

import Link from "next/link";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { CONTACT_CONFIG } from "@/config/contact";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F2F6B] via-[#0a2255] to-[#061640] text-white">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#3CC3D6]" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#F57C00]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
        {/* Location badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          Serving {CONTACT_CONFIG.serviceArea} &amp; Surrounding Areas
        </div>

        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Expert Electrical &amp;
          <br />
          Plumbing Services
          <span className="mt-2 block text-[#3CC3D6]">At Your Doorstep</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100 md:mt-6 md:text-lg">
          Trusted technicians for all your home repair needs. Fast response,
          quality work, and transparent pricing.
        </p>

        {/* Three main CTA buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-10 md:gap-4">
          <Link
            href={CONTACT_CONFIG.callUrl}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#F57C00] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:bg-[#e06800] sm:w-auto"
            aria-label="Call now for service"
          >
            <Phone size={22} />
            Call Now
          </Link>

          <Link
            href={CONTACT_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105 hover:bg-green-600 sm:w-auto"
            aria-label="Book via WhatsApp"
          >
            <MessageCircle size={22} />
            WhatsApp Booking
          </Link>

          <Link
            href={CONTACT_CONFIG.bookingUrl}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-8 py-4 text-lg font-bold text-[#0F2F6B] shadow-lg transition-all hover:scale-105 hover:bg-gray-100 sm:w-auto"
            aria-label="Book service online"
          >
            <Calendar size={22} />
            Book Online
          </Link>
        </div>

        <p className="mt-6 text-sm text-blue-200">
          ⭐ Rated 4.8/5 by 500+ customers
        </p>
      </div>
    </section>
  );
}