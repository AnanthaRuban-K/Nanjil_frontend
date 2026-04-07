// components/ServiceGrid.tsx

import {
  Zap,
  Wind,
  AlertTriangle,
  Droplets,
  Wrench,
  Settings,
  Droplet,
} from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Electrical Repair",
    desc: "Wiring issues, short circuits, switch & socket repairs for homes and offices.",
  },
  {
    icon: Wind,
    title: "Fan Installation",
    desc: "Ceiling fan, exhaust fan installation, repair, and speed regulation.",
  },
  {
    icon: AlertTriangle,
    title: "MCB Tripping Fix",
    desc: "Circuit breaker troubleshooting, power trip diagnosis, and panel repair.",
  },
  {
    icon: Droplets,
    title: "Pipe Leak Repair",
    desc: "Water pipe leak detection, joint repair, and pipe replacement.",
  },
  {
    icon: Wrench,
    title: "Bathroom Fitting",
    desc: "Tap installation, shower fitting, basin and commode setup.",
  },
  {
    icon: Settings,
    title: "Motor Pump Repair",
    desc: "Water pump repair, motor winding, starter and pressure issues.",
  },
  {
    icon: Droplet,
    title: "Water Tank Overflow Fix",
    desc: "Float valve repair, overflow pipe fix, and tank automation setup.",
  },
];

export default function ServiceGrid() {
  return (
    <section id="services" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-extrabold text-[#1E2A38] md:text-3xl">
            Our <span className="text-[#0F2F6B]">Services</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Professional electrical and plumbing solutions for your home and
            office
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group cursor-pointer rounded-2xl border border-transparent bg-[#F5F7FA] p-6 transition-all duration-300 hover:border-[#3CC3D6]/30 hover:bg-white hover:shadow-lg hover:shadow-[#3CC3D6]/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0F2F6B]/10 transition-colors duration-300 group-hover:bg-[#0F2F6B]">
                <service.icon
                  size={28}
                  className="text-[#0F2F6B] transition-colors duration-300 group-hover:text-white"
                />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#1E2A38]">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}