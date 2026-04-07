// components/CallCTA.tsx

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { CONTACT_CONFIG } from "@/config/contact";

export default function CallCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F2F6B] to-[#061640] text-white">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#3CC3D6]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#F57C00]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
        <h2 className="text-2xl font-extrabold md:text-4xl">
          Need Immediate Service?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-blue-200 md:text-lg">
          Our technicians are ready to help. Call now or send a WhatsApp message
          for instant support.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={CONTACT_CONFIG.callUrl}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#F57C00] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:bg-[#e06800] sm:w-auto"
          >
            <Phone size={22} />
            Call Now
          </Link>

          <Link
            href={CONTACT_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105 hover:bg-green-600 sm:w-auto"
          >
            <MessageCircle size={22} />
            WhatsApp Us
          </Link>
        </div>

        <p className="mt-6 text-sm text-blue-300">
          Available Mon–Sat, 8 AM – 8 PM &nbsp;|&nbsp; Emergency services 24/7
        </p>
      </div>
    </section>
  );
}