"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type DashboardSummary } from "@/lib/api";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  IndianRupee,
  RefreshCw,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

export const dynamic = "force-dynamic";

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.get("/admin/dashboard/summary");
      setData(res.data.data);
    } catch {
      setError("Unable to load dashboard summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cards = [
    {
      label: "Total Bookings",
      value: data?.totalBookings,
      icon: BookOpen,
      color: "bg-[#E7F8FC] text-[#0E7892]",
    },
    {
      label: "Pending",
      value: data?.pending,
      icon: Clock,
      color: "bg-[#FFF4E2] text-[#F7941D]",
    },
    {
      label: "Confirmed",
      value: data?.confirmed,
      icon: CheckCircle2,
      color: "bg-[#E7F8FC] text-[#0E7892]",
    },
    {
      label: "In Progress",
      value: data?.inProgress,
      icon: Wrench,
      color: "bg-[#EAF0F8] text-[#12355B]",
    },
    {
      label: "Completed Today",
      value: data?.completedToday,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Unpaid Completed",
      value: data?.unpaidCompleted,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Revenue Collected",
      value:
        typeof data?.totalRevenueCollected === "number"
          ? formatCurrency(data.totalRevenueCollected)
          : undefined,
      icon: IndianRupee,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <section className="rounded-lg bg-[#0F2F57] p-5 text-white shadow-xl shadow-[#0F2F57]/10 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <ShieldCheck size={14} />
              Admin command center
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Monitor booking flow, technician workload, payment status, and
              service revenue from one operational overview.
            </p>
          </div>
          <button
            onClick={load}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/15 sm:w-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-lg border border-[#D7E4EE] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-[#12355B]">
                  {loading ? "-" : value ?? "-"}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#12355B]">Operational Focus</h2>
          <p className="mt-1 text-sm text-slate-500">
            Prioritize these queues to keep service delivery moving.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Pending assignment",
                value: data?.pending ?? 0,
                href: "/admin/bookings",
                tone: "bg-[#FFF4E2] text-[#B96000]",
              },
              {
                label: "Jobs in progress",
                value: data?.inProgress ?? 0,
                href: "/admin/bookings",
                tone: "bg-[#EAF0F8] text-[#12355B]",
              },
              {
                label: "Completed unpaid",
                value: data?.unpaidCompleted ?? 0,
                href: "/admin/bookings",
                tone: "bg-red-50 text-red-600",
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg border border-[#E7EEF5] p-4 transition-colors hover:bg-[#F8FBFD]"
              >
                <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.tone}`}>
                  {loading ? "-" : item.value}
                </div>
                <p className="mt-3 text-sm font-semibold text-[#12355B]">
                  {item.label}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#0E7892]">
                  Review <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-[#12355B]">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              {[
                { label: "Manage Bookings", href: "/admin/bookings", icon: BookOpen },
                { label: "Technicians", href: "/admin/technicians", icon: Users },
                { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between rounded-lg border border-[#E7EEF5] px-3 py-3 text-sm font-semibold text-[#12355B] transition-colors hover:bg-[#F8FBFD]"
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon size={16} className="text-[#0E7892]" />
                    {label}
                  </span>
                  <ArrowRight size={15} className="text-slate-300" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#D7E4EE] bg-[#F8FBFD] p-5">
            <h2 className="font-semibold text-[#12355B]">Admin Reminder</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Assign pending bookings quickly, verify submitted UPI payments,
              and keep completed service amounts updated for accurate revenue.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
