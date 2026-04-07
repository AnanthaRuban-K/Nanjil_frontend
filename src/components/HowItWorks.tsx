// components/HowItWorks.tsx

import { PhoneCall, UserCheck, MapPin, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    title: "Book Service or Call",
    desc: "Choose a service and book online, call, or WhatsApp us.",
    step: 1,
  },
  {
    icon: UserCheck,
    title: "Technician Assigned",
    desc: "A verified technician is matched and assigned to your request.",
    step: 2,
  },
  {
    icon: MapPin,
    title: "Technician Visits",
    desc: "Technician arrives at your location at the scheduled time.",
    step: 3,
  },
  {
    icon: CheckCircle,
    title: "Problem Fixed",
    desc: "Work completed with quality assurance and service warranty.",
    step: 4,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F5F7FA]">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-extrabold text-[#1E2A38] md:text-3xl">
            How It <span className="text-[#0F2F6B]">Works</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Get your problem fixed in 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Desktop connector line */}
              {index < steps.length - 1 && (
                <div className="pointer-events-none absolute left-[60%] top-10 hidden h-0.5 w-[80%] bg-[#3CC3D6]/30 lg:block">
                  <div className="absolute -top-1 right-0 h-2.5 w-2.5 rounded-full bg-[#3CC3D6]/50" />
                </div>
              )}

              {/* Icon box with step badge */}
              <div className="relative inline-flex">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg">
                  <step.icon size={32} className="text-[#0F2F6B]" />
                </div>
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F57C00] text-xs font-bold text-white shadow-md">
                  {step.step}
                </span>
              </div>

              <h3 className="mt-4 text-base font-bold text-[#1E2A38]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}