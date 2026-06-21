"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type RevenueAnalytics, type BookingAnalytics } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CreditCard,
  IndianRupee,
  Loader2,
  RefreshCw,
  Smartphone,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function getStatusBarColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-[#F7941D]";
    case "CONFIRMED":
      return "bg-[#37B8D8]";
    case "IN_PROGRESS":
      return "bg-[#12355B]";
    case "COMPLETED":
      return "bg-emerald-500";
    case "CANCELLED":
      return "bg-red-500";
    default:
      return "bg-slate-400";
  }
}

export default function AnalyticsPage() {
  const [dateFrom, setDateFrom] = useState(
    `${new Date().getFullYear()}-01-01`
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [bookingAnalytics, setBookingAnalytics] =
    useState<BookingAnalytics | null>(null);
  const [revLoading, setRevLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setBookingLoading(true);
    api
      .get("/admin/analytics/bookings")
      .then((res) => setBookingAnalytics(res.data.data))
      .catch(() => setError("Unable to load booking analytics."))
      .finally(() => setBookingLoading(false));
  }, []);

  const loadRevenue = async () => {
    setRevLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/analytics/revenue", {
        params: { date_from: dateFrom, date_to: dateTo },
      });
      setRevenue(res.data.data);
    } catch {
      setError("Unable to load revenue analytics.");
    } finally {
      setRevLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalStatusBookings = useMemo(() => {
    if (!bookingAnalytics) return 0;
    return Object.values(bookingAnalytics.byStatus).reduce(
      (sum, count) => sum + count,
      0
    );
  }, [bookingAnalytics]);

  const topTechnician = bookingAnalytics?.byTechnician[0];

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <section className="rounded-lg bg-[#0F2F57] p-5 text-white shadow-xl shadow-[#0F2F57]/10 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <BarChart3 size={14} />
              Business performance
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">Analytics</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Track revenue, payment mix, booking status, and technician
              completion performance.
            </p>
          </div>
          {topTechnician && (
            <div className="rounded-lg border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase text-white/60">
                Top technician
              </p>
              <p className="mt-1 text-lg font-bold">{topTechnician.technicianName}</p>
              <p className="text-sm text-white/70">
                {topTechnician.completedJobs} completed jobs
              </p>
            </div>
          )}
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-[#D7E4EE] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-semibold text-[#12355B]">Revenue Range</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Choose a period and refresh revenue totals.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <Input
              label="From"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              label="To"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <Button onClick={loadRevenue} loading={revLoading}>
              <RefreshCw size={16} />
              Apply
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: revenue ? formatCurrency(revenue.totalRevenue) : "-",
            icon: IndianRupee,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Cash",
            value: revenue ? formatCurrency(revenue.cashTotal) : "-",
            icon: CreditCard,
            color: "bg-[#E7F8FC] text-[#0E7892]",
          },
          {
            label: "UPI",
            value: revenue ? formatCurrency(revenue.upiTotal) : "-",
            icon: Smartphone,
            color: "bg-[#FFF4E2] text-[#F7941D]",
          },
          {
            label: "Paid Bookings",
            value: revenue ? revenue.totalPaidBookings : "-",
            icon: TrendingUp,
            color: "bg-[#EAF0F8] text-[#12355B]",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-lg border border-[#D7E4EE] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-[#12355B]">
                  {revLoading ? "-" : value}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <section className="rounded-lg border border-[#D7E4EE] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-[#12355B]">Bookings by Status</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Operational distribution across all bookings.
              </p>
            </div>
            <div className="rounded-full bg-[#E7F8FC] px-3 py-1 text-xs font-semibold text-[#0E7892]">
              {bookingLoading ? "-" : totalStatusBookings} total
            </div>
          </div>

          {bookingLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-100" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : bookingAnalytics && Object.keys(bookingAnalytics.byStatus).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(bookingAnalytics.byStatus).map(([status, count]) => {
                const percentage = totalStatusBookings
                  ? Math.round((count / totalStatusBookings) * 100)
                  : 0;

                return (
                  <div key={status}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <Badge status={status} />
                      <span className="text-sm font-semibold text-[#12355B]">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${getStatusBarColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center">
              <BriefcaseBusiness size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                No booking status data available.
              </p>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
          <div className="border-b border-[#E7EEF5] p-4 sm:p-5">
            <h2 className="font-semibold text-[#12355B]">
              Completed Jobs by Technician
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Technician completion leaderboard.
            </p>
          </div>

          {bookingLoading ? (
            <div className="space-y-3 p-4 sm:p-5">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-3 rounded-lg border border-[#EEF3F7] p-4"
                >
                  <div className="h-10 w-10 rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 rounded bg-slate-100" />
                    <div className="h-3 w-1/3 rounded bg-slate-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : bookingAnalytics && bookingAnalytics.byTechnician.length > 0 ? (
            <div className="divide-y divide-[#EEF3F7]">
              {bookingAnalytics.byTechnician.map((tech, index) => (
                <div
                  key={tech.technicianName}
                  className="flex items-center justify-between gap-4 p-4 sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E7F8FC] text-sm font-bold text-[#0E7892]">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#12355B]">
                        {tech.technicianName}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Completed service jobs
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#F8FBFD] px-3 py-1 text-sm font-semibold text-[#12355B]">
                    <UserCheck size={14} className="text-emerald-600" />
                    {tech.completedJobs}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <UserCheck size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                No completed job data available.
              </p>
            </div>
          )}
        </section>
      </div>

      {(revLoading || bookingLoading) && (
        <div className="fixed bottom-4 right-4 hidden items-center gap-2 rounded-lg bg-[#0F2F57] px-4 py-2 text-sm font-semibold text-white shadow-lg sm:flex">
          <Loader2 size={16} className="animate-spin" />
          Updating analytics
        </div>
      )}
    </div>
  );
}
