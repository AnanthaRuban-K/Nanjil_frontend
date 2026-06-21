"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, type Booking } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  PlusCircle,
  Search,
} from "lucide-react";

const limit = 10;

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.get("/bookings/my", {
        params: { page, limit },
      });
      setBookings(res.data.data);
      setTotal(res.data.meta.total);
    } catch {
      setError("Unable to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredBookings = bookings.filter((booking) => {
    const search = query.trim().toLowerCase();
    if (!search) return true;

    return [
      booking.bookingReference,
      booking.serviceType,
      booking.status,
      booking.paymentStatus,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(search));
  });

  const activeCount = bookings.filter(
    (b) => b.status !== "COMPLETED" && b.status !== "CANCELLED"
  ).length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      <section className="rounded-lg bg-[#0F2F57] p-5 text-white shadow-xl shadow-[#0F2F57]/10 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <BookOpen size={14} />
              Customer booking center
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">My Bookings</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              View service requests, check progress, and open booking details
              whenever you need an update.
            </p>
          </div>

          <Link href="/bookings/new">
            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#F7941D] px-4 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#e8820f] sm:w-auto">
              <PlusCircle size={17} />
              New Booking
            </button>
          </Link>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[#D7E4EE] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-bold text-[#12355B]">
                {loading ? "-" : total}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7F8FC]">
              <BookOpen size={18} className="text-[#0E7892]" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-[#D7E4EE] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Active</p>
              <p className="mt-1 text-2xl font-bold text-[#12355B]">
                {loading ? "-" : activeCount}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF4E2]">
              <Clock size={18} className="text-[#F7941D]" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-[#D7E4EE] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="mt-1 text-2xl font-bold text-[#12355B]">
                {loading ? "-" : completedCount}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#E7EEF5] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-semibold text-[#12355B]">Booking History</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Showing latest requests from your account
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bookings"
              className="h-10 w-full rounded-lg border border-[#D7E4EE] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
            />
          </div>
        </div>

        {error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={load}
              className="mt-4 rounded-lg border border-[#D7E4EE] px-4 py-2 text-sm font-semibold text-[#12355B] hover:bg-[#F4F8FB]"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3 p-4 sm:p-5">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3 rounded-lg border border-[#EEF3F7] p-4"
              >
                <div className="h-11 w-11 rounded-lg bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                  <div className="h-3 w-1/2 rounded bg-slate-50" />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#E7F8FC]">
              <BookOpen size={26} className="text-[#0E7892]" />
            </div>
            <h3 className="font-semibold text-[#12355B]">No bookings yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Create your first service request and track every update from here.
            </p>
            <Link href="/bookings/new">
              <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#F7941D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e8820f]">
                <PlusCircle size={16} />
                Create Booking
              </button>
            </Link>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold text-[#12355B]">No matching bookings</p>
            <p className="mt-1 text-sm text-slate-500">
              Try another reference, service, or status.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-[#E7EEF5]">
                <thead className="bg-[#F8FBFD]">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Reference
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Service
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Date
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Payment
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF3F7]">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-[#F8FBFD]"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#12355B]">
                        {booking.bookingReference}
                      </td>
                      <td className="max-w-[240px] truncate px-5 py-4 text-sm text-slate-700">
                        {booking.serviceType}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDate(booking.preferredDate)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Badge status={booking.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Badge status={booking.paymentStatus} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-[#0E7892] hover:text-[#12355B]"
                        >
                          View
                          <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#EEF3F7] md:hidden">
              {filteredBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="block p-4 transition-colors hover:bg-[#F8FBFD]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#12355B]">
                        {booking.serviceType}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {booking.bookingReference}
                      </p>
                    </div>
                    <ArrowRight size={17} className="mt-1 shrink-0 text-slate-300" />
                  </div>

                  <div className="mt-4 grid gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-[#0E7892]" />
                      {formatDate(booking.preferredDate)}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Clock size={14} className="text-[#F7941D]" />
                      <Badge status={booking.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CreditCard size={14} className="text-[#0E7892]" />
                      <Badge status={booking.paymentStatus} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {!loading && bookings.length > 0 && !query.trim() && (
        <Pagination page={page} limit={limit} total={total} onChange={setPage} />
      )}
    </div>
  );
}
