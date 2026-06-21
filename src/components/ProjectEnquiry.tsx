"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Home,
  MessageCircle,
  Ruler,
  Wrench,
} from "lucide-react";
import { CONTACT_CONFIG } from "@/config/contact";

const WORK_TYPES = [
  "Complete Electrical",
  "Complete Plumbing",
  "Electrical + Plumbing",
  "Renovation Work",
];

const BUILDING_TYPES = ["House", "Office", "Shop", "Apartment", "Other"];

export default function ProjectEnquiry() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    buildingType: "House",
    workType: "Electrical + Plumbing",
    location: "",
    area: "",
    message: "",
  });

  const whatsappText = [
    "Hi, I need a project enquiry from Nanjil MEP Service.",
    "",
    `Name: ${form.name || "-"}`,
    `Phone: ${form.phone || "-"}`,
    `Building Type: ${form.buildingType}`,
    `Work Required: ${form.workType}`,
    `Location: ${form.location || "-"}`,
    `Approx Area: ${form.area || "-"}`,
    `Details: ${form.message || "-"}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    whatsappText
  )}`;

  return (
    <section id="project-enquiry" className="bg-[#F4F8FB]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[1fr_440px] lg:py-20">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E7F8FC] px-3 py-1 text-xs font-bold text-[#0E7892]">
            <Building2 size={14} />
            New house, office & building works
          </div>
          <h2 className="text-2xl font-extrabold leading-tight text-[#12355B] md:text-4xl">
            Complete Electrical & Plumbing Project Work
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            For new houses, offices, shops, apartments, and commercial
            buildings, Nanjil MEP can handle complete electrical and plumbing
            planning, installation, fittings, and site coordination.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Full house wiring and DB setup",
              "Plumbing line work and fittings",
              "Office and commercial electrical work",
              "Site visit and project estimate",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg border border-[#D7E4EE] bg-white p-4"
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
                <span className="text-sm font-medium text-[#12355B]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#12355B]">
              <ClipboardList size={20} className="text-[#0E7892]" />
              Project Enquiry
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Send your requirement through WhatsApp for a site visit or
              estimate.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="h-11 rounded-lg border border-[#D7E4EE] px-3 text-sm outline-none focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
                className="h-11 rounded-lg border border-[#D7E4EE] px-3 text-sm outline-none focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#12355B]">
                <Home size={15} />
                Building Type
              </label>
              <div className="flex flex-wrap gap-2">
                {BUILDING_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, buildingType: type })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      form.buildingType === type
                        ? "border-[#37B8D8] bg-[#E7F8FC] text-[#0E7892]"
                        : "border-[#D7E4EE] text-slate-600 hover:bg-[#F8FBFD]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#12355B]">
                <Wrench size={15} />
                Work Required
              </label>
              <div className="flex flex-wrap gap-2">
                {WORK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, workType: type })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      form.workType === type
                        ? "border-[#F7941D] bg-[#FFF4E2] text-[#B96000]"
                        : "border-[#D7E4EE] text-slate-600 hover:bg-[#F8FBFD]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Location"
                className="h-11 rounded-lg border border-[#D7E4EE] px-3 text-sm outline-none focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
              />
              <div className="relative">
                <Ruler
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="Approx area / floors"
                  className="h-11 w-full rounded-lg border border-[#D7E4EE] pl-9 pr-3 text-sm outline-none focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
                />
              </div>
            </div>

            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              placeholder="Tell us about the site stage, rooms/floors, and any specific requirements."
              className="w-full resize-none rounded-lg border border-[#D7E4EE] px-3 py-2.5 text-sm outline-none focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
            />

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 text-sm font-bold text-white transition-colors hover:bg-green-600"
            >
              <MessageCircle size={17} />
              Send Enquiry on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
