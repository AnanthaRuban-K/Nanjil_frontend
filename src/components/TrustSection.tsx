// components/TrustSection.tsx

import { CheckCircle, ShieldCheck, Clock, Star } from "lucide-react";

const trustItems = [
  {
    icon: CheckCircle,
    label: "500+ Jobs Completed",
    sub: "Trusted by hundreds of families",
  },
  {
    icon: ShieldCheck,
    label: "Verified Technicians",
    sub: "Background-checked professionals",
  },
  {
    icon: Clock,
    label: "Same Day Service",
    sub: "Quick response guaranteed",
  },
  {
    icon: Star,
    label: "Transparent Pricing",
    sub: "No hidden charges ever",
  },
];

export default function TrustSection() {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3CC3D6]/10">
                <item.icon size={24} className="text-[#3CC3D6]" />
              </div>
              <h3 className="text-sm font-bold text-[#1E2A38] md:text-base">
                {item.label}
              </h3>
              <p className="text-xs text-gray-500 md:text-sm">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}