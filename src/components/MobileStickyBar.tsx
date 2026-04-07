// components/MobileStickyBar.tsx

import Link from "next/link";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { CONTACT_CONFIG } from "@/config/contact";

export default function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
      <div className="grid grid-cols-3 divide-x divide-gray-200">
        <Link
          href={CONTACT_CONFIG.callUrl}
          className="flex flex-col items-center justify-center gap-1 py-3 text-[#F57C00] transition-colors active:bg-orange-50"
          aria-label="Call"
        >
          <Phone size={20} />
          <span className="text-xs font-semibold">Call</span>
        </Link>

        <Link
          href={CONTACT_CONFIG.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-3 text-green-600 transition-colors active:bg-green-50"
          aria-label="WhatsApp"
        >
          <MessageCircle size={20} />
          <span className="text-xs font-semibold">WhatsApp</span>
        </Link>

        <Link
          href={CONTACT_CONFIG.bookingUrl}
          className="flex flex-col items-center justify-center gap-1 py-3 text-[#0F2F6B] transition-colors active:bg-blue-50"
          aria-label="Book online"
        >
          <Calendar size={20} />
          <span className="text-xs font-semibold">Book</span>
        </Link>
      </div>
    </div>
  );
}