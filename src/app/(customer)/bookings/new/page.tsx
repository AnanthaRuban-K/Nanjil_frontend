"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { z } from "zod";
import { api, type Booking } from "@/lib/api";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleEllipsis,
  FileText,
  MapPin,
  PlusCircle,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const schema = z.object({
  serviceType: z
    .string()
    .trim()
    .min(2, "Select a service")
    .max(100, "Service type must be shorter"),
  preferredDate: z
    .string()
    .trim()
    .min(1, "Preferred date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid date"),
  serviceAddress: z
    .string()
    .trim()
    .min(10, "Enter a complete service address")
    .max(500, "Address is too long"),
  issueDescription: z
    .string()
    .trim()
    .min(10, "Describe the issue in at least 10 characters")
    .max(2000, "Description is too long"),
});

type FormData = z.infer<typeof schema>;

const SERVICE_OPTIONS = [
  "Electrical Repair",
  "Plumbing Repair",
  "Fan / Light Installation",
  "Switchboard / Wiring",
  "Water Leakage",
  "Motor / Pump Service",
  "Bathroom Fitting",
  "General Maintenance",
];

export default function NewBookingPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [customService, setCustomService] = useState(false);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType: "",
      preferredDate: minDate,
      serviceAddress: "",
      issueDescription: "",
    },
  });

  const selectedService = watch("serviceType");
  const issueDescription = watch("issueDescription");

  const chooseService = (serviceType: string) => {
    setCustomService(false);
    setValue("serviceType", serviceType, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const chooseOtherService = () => {
    setCustomService(true);
    setValue("serviceType", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: FormData) => {
    setServerError("");
    setLoading(true);

    try {
      const res = await api.post<{ data: Booking }>("/bookings", data);
      router.push(`/bookings/${res.data.data.id}`);
    } catch (err) {
      if (err instanceof AxiosError) {
        setServerError(
          err.response?.data?.message ||
            "Unable to create booking. Please check the details and try again."
        );
      } else {
        setServerError("Unable to create booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-[#12355B]"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
          <div className="border-b border-[#E7EEF5] bg-[#0F2F57] px-5 py-6 text-white sm:px-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <ShieldCheck size={14} />
              Nanjil MEP Service Request
            </div>
            <h1 className="text-2xl font-bold">Create New Booking</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Share the service type, preferred date, address, and issue details
              so the team can assign the right technician.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5 sm:p-6">
            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#12355B]">
                <Wrench size={16} />
                Service Type
              </label>
              {!customService && <input type="hidden" {...register("serviceType")} />}
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((label) => {
                  const active = selectedService === label && !customService;

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => chooseService(label)}
                      className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
                        active
                          ? "border-[#37B8D8] bg-[#E7F8FC] text-[#0E7892] ring-2 ring-[#37B8D8]/15"
                          : "border-[#D7E4EE] bg-white text-slate-600 hover:border-[#37B8D8]/60 hover:bg-[#F8FBFD] hover:text-[#12355B]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={chooseOtherService}
                  className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
                    customService
                      ? "border-[#F7941D] bg-[#FFF4E2] text-[#B96000] ring-2 ring-[#F7941D]/15"
                      : "border-[#D7E4EE] bg-white text-slate-600 hover:border-[#F7941D]/60 hover:bg-[#FFF9EF] hover:text-[#B96000]"
                  }`}
                >
                  <CircleEllipsis size={17} />
                  Other
                </button>
              </div>

              {customService && (
                <div className="mt-3">
                  <input
                    placeholder="Example: Inverter service, geyser issue, drainage block"
                    className={`h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20 ${
                      errors.serviceType ? "border-red-300" : "border-[#D7E4EE]"
                    }`}
                    {...register("serviceType")}
                  />
                </div>
              )}
              {errors.serviceType && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.serviceType.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[#12355B]">
                <CalendarDays size={16} />
                Preferred Date
              </label>
              <input
                type="date"
                min={minDate}
                className={`h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20 ${
                  errors.preferredDate ? "border-red-300" : "border-[#D7E4EE]"
                }`}
                {...register("preferredDate")}
              />
              {errors.preferredDate && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.preferredDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[#12355B]">
                <MapPin size={16} />
                Service Address
              </label>
              <textarea
                rows={3}
                placeholder="House number, street, area, city, landmark"
                className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20 ${
                  errors.serviceAddress ? "border-red-300" : "border-[#D7E4EE]"
                }`}
                {...register("serviceAddress")}
              />
              {errors.serviceAddress && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.serviceAddress.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[#12355B]">
                <FileText size={16} />
                Issue Description
              </label>
              <textarea
                rows={5}
                placeholder="Example: Kitchen tap is leaking continuously, need inspection and repair."
                className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20 ${
                  errors.issueDescription ? "border-red-300" : "border-[#D7E4EE]"
                }`}
                {...register("issueDescription")}
              />
              <div className="mt-1 flex items-center justify-between gap-3">
                {errors.issueDescription ? (
                  <p className="text-xs text-red-600">
                    {errors.issueDescription.message}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Mention location, urgency, and what you already checked.
                  </p>
                )}
                <span className="shrink-0 text-xs text-slate-400">
                  {issueDescription?.length || 0}/2000
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E7EEF5] pt-5 sm:flex-row sm:justify-end">
              <Link href="/dashboard">
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#D7E4EE] px-4 text-sm font-semibold text-[#12355B] transition-colors hover:bg-[#F4F8FB] sm:w-auto"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#F7941D] px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-[#e8820f] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <PlusCircle size={17} />
                {loading ? "Creating..." : "Create Booking"}
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E7F8FC]">
              <CheckCircle2 size={21} className="text-[#0E7892]" />
            </div>
            <h2 className="mt-4 font-semibold text-[#12355B]">
              Before you submit
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>Use a reachable address with a nearby landmark.</p>
              <p>Add photos or payment details later if the team requests them.</p>
              <p>You can track the booking status from My Bookings.</p>
            </div>
          </div>

          <div className="rounded-lg border border-[#D7E4EE] bg-[#FFF4E2] p-5">
            <h2 className="font-semibold text-[#12355B]">Service note</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Clear issue details help the admin assign an electrical or plumbing
              technician faster.
            </p>
          </div>

          <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-[#12355B]">What happens next</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E7F8FC] text-xs font-bold text-[#0E7892]">
                  1
                </span>
                <p>Admin reviews your request and confirms availability.</p>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E7F8FC] text-xs font-bold text-[#0E7892]">
                  2
                </span>
                <p>A technician is assigned based on service type.</p>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E7F8FC] text-xs font-bold text-[#0E7892]">
                  3
                </span>
                <p>You can follow updates from My Bookings.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
