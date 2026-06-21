"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Booking } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  BookOpen,
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  ShieldCheck,
  Wrench,
  PhoneCall,
} from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bookings/my", { params: { page: 1, limit: 5 } })
      .then((res) => {
        setBookings(res.data.data);
        setTotal(res.data.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCount = bookings.filter(
    (b) => b.status !== "COMPLETED" && b.status !== "CANCELLED"
  ).length;

  const completedCount = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-[#FFF4E2] text-[#B96000]";
      case "CONFIRMED":
        return "bg-[#E7F8FC] text-[#0E7892]";
      case "IN_PROGRESS":
        return "bg-[#EAF0F8] text-[#12355B]";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-lg bg-[#0F2F57] text-white shadow-xl shadow-[#0F2F57]/10">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_320px] lg:p-8">
          <div className="min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <ShieldCheck size={14} />
              Verified electrical and plumbing support
            </div>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              Welcome back, {user?.fullName || "Customer"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
              Track service progress, review recent visits, and book trusted
              Nanjil MEP technicians whenever your home needs attention.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/bookings/new">
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#F7941D] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#e8820f] sm:w-auto">
                  <PlusCircle size={17} />
                  New Booking
                </button>
              </Link>
              <Link href="/bookings">
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 sm:w-auto">
                  <BookOpen size={17} />
                  View My Bookings
                </button>
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#37B8D8]">
                <Wrench size={21} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Priority Service Desk</p>
                <p className="mt-0.5 text-xs text-white/65">
                  Fast help for active bookings
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xl font-bold">
                  {loading ? "-" : activeCount}
                </p>
                <p className="text-xs text-white/65">Active jobs</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xl font-bold">
                  {loading ? "-" : completedCount}
                </p>
                <p className="text-xs text-white/65">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-500">
              Total Bookings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7F8FC]">
              <BookOpen size={18} className="text-[#0E7892]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#12355B]">
            {loading ? "-" : total}
          </p>
        </div>

        <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-500">
              Active Work
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF4E2]">
              <Clock size={18} className="text-[#F7941D]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#12355B]">
            {loading ? "-" : activeCount}
          </p>
        </div>

        <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-500">Completed</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#12355B]">
            {loading ? "-" : completedCount}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <section className="overflow-hidden rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#E7EEF5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-[#12355B]">Recent Bookings</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Latest requests and service progress
              </p>
            </div>
            {total > 5 && (
              <Link
                href="/bookings"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#0E7892] hover:text-[#12355B]"
              >
                View all <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="space-y-4 p-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-3">
                  <div className="h-11 w-11 rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-slate-100" />
                    <div className="h-3 w-1/2 rounded bg-slate-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#E7F8FC]">
                <BookOpen size={26} className="text-[#0E7892]" />
              </div>
              <p className="font-semibold text-[#12355B]">No bookings yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                Create your first request and track technician updates from here.
              </p>
              <Link href="/bookings/new">
                <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#F7941D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e8820f]">
                  <PlusCircle size={16} />
                  Create Booking
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#EEF3F7]">
              {bookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/bookings/${b.id}`}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-[#F8FBFD] sm:grid-cols-[44px_1fr_auto_20px] sm:items-center sm:gap-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E7F8FC]">
                    <BookOpen size={19} className="text-[#0E7892]" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#12355B]">
                      {b.serviceType}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span>{b.bookingReference}</span>
                      <span className="hidden sm:inline">-</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={12} />
                        {formatDate(b.preferredDate)}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(b.status)}`}
                  >
                    {b.status.replace("_", " ")}
                  </span>

                  <ChevronRight
                    size={17}
                    className="hidden text-slate-300 sm:block"
                  />
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FFF4E2]">
              <PhoneCall size={20} className="text-[#F7941D]" />
            </div>
            <h3 className="mt-4 font-semibold text-[#12355B]">
              Need urgent help?
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Create a booking with clear issue details so the right technician
              can be assigned faster.
            </p>
            <Link href="/bookings/new">
              <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D7E4EE] px-4 py-2.5 text-sm font-semibold text-[#12355B] transition-colors hover:bg-[#F4F8FB]">
                <PlusCircle size={16} />
                Book Service
              </button>
            </Link>
          </div>

          <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-[#12355B]">Service Promise</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex gap-3">
                <CheckCircle2 size={17} className="mt-0.5 text-emerald-600" />
                <span>Verified technicians for every assignment</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 size={17} className="mt-0.5 text-emerald-600" />
                <span>Transparent status tracking after booking</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 size={17} className="mt-0.5 text-emerald-600" />
                <span>Electrical and plumbing support in one place</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
