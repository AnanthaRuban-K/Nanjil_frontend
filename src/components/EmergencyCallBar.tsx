// components/EmergencyCallBar.tsx

import Link from "next/link";
import { Phone, Zap } from "lucide-react";
import { CONTACT_CONFIG } from "@/config/contact";

export default function EmergencyCallBar() {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm md:text-base">
        {/* Pulsing indicator dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-yellow-400" />
        </span>

        <Zap size={16} className="hidden sm:block shrink-0" />

        <span className="font-medium truncate">
          ⚡ Emergency Electrical or Plumbing Issue?
        </span>

        <Link
          href={CONTACT_CONFIG.callUrl}
          className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-red-600 transition-colors hover:bg-yellow-50"
          aria-label="Call for emergency service"
        >
          <Phone size={14} />
          Call Now
        </Link>
      </div>
    </div>
  );
}