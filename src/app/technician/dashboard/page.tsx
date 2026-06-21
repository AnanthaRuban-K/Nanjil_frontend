"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Booking } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  RefreshCw,
  UserRound,
  Wrench,
} from "lucide-react";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "-";

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

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.get("/technician/jobs", {
        params: { page: 1, limit: 100 },
      });
      setJobs(res.data.data);
      setTotal(res.data.meta.total);
    } catch {
      setError("Unable to load technician dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const active = jobs.filter(
    (job) => job.status === "CONFIRMED" || job.status === "IN_PROGRESS"
  );
  const completed = jobs.filter((job) => job.status === "COMPLETED");
  const readyToStart = jobs.filter((job) => job.status === "CONFIRMED");
  const inProgress = jobs.filter((job) => job.status === "IN_PROGRESS");
  const recentJobs = active.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <section className="rounded-lg bg-[#0F2F57] p-5 text-white shadow-xl shadow-[#0F2F57]/10 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <Wrench size={14} />
              Field service dashboard
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome, {user?.fullName || "Technician"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Check today&apos;s assigned service jobs, call customers, and keep
              each booking status updated from the field.
            </p>
          </div>

          <Link href="/technician/jobs">
            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#F7941D] px-4 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#e8820f] sm:w-auto">
              View All Jobs
              <ArrowRight size={17} />
            </button>
          </Link>
        </div>
      </section>

      {error && (
        <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 font-semibold text-red-700"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Assigned",
            value: total,
            icon: BriefcaseBusiness,
            color: "bg-[#E7F8FC] text-[#0E7892]",
          },
          {
            label: "Ready to Start",
            value: readyToStart.length,
            icon: Clock,
            color: "bg-[#FFF4E2] text-[#F7941D]",
          },
          {
            label: "In Progress",
            value: inProgress.length,
            icon: Wrench,
            color: "bg-[#EAF0F8] text-[#12355B]",
          },
          {
            label: "Completed",
            value: completed.length,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-600",
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
                  {loading ? "-" : value}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#E7EEF5] p-4 sm:p-5">
            <div>
              <h2 className="font-semibold text-[#12355B]">Active Jobs</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Jobs that need field action
              </p>
            </div>
            <Link
              href="/technician/jobs"
              className="hidden text-sm font-semibold text-[#0E7892] hover:text-[#12355B] sm:inline-flex"
            >
              View all
            </Link>
          </div>

          {loading ? (
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
          ) : recentJobs.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#E7F8FC]">
                <CheckCircle2 size={26} className="text-[#0E7892]" />
              </div>
              <h3 className="font-semibold text-[#12355B]">No active jobs</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
                New confirmed or in-progress assignments will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EEF3F7]">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/technician/jobs/${job.id}`}
                  className="block p-4 transition-colors hover:bg-[#F8FBFD] sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#12355B]">
                        {job.bookingReference}
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {job.serviceType}
                      </p>
                    </div>
                    <Badge status={job.status} />
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <UserRound size={15} className="text-[#0E7892]" />
                      {job.customer?.fullName ?? "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={15} className="text-[#0E7892]" />
                      {job.customer?.phone ?? "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={15} className="text-[#F7941D]" />
                      {formatDate(job.scheduledDate || job.preferredDate)}
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={15} className="mt-0.5 text-[#0E7892]" />
                      <span className="line-clamp-1">{job.serviceAddress}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-[#12355B]">Operational Focus</h3>
            <p className="mt-1 text-sm text-slate-500">
              Prioritize the jobs that need immediate field action.
            </p>
            <div className="mt-4 space-y-2">
              {[
                {
                  label: "Ready to start",
                  value: readyToStart.length,
                  tone: "bg-[#FFF4E2] text-[#B96000]",
                },
                {
                  label: "Currently in progress",
                  value: inProgress.length,
                  tone: "bg-[#EAF0F8] text-[#12355B]",
                },
                {
                  label: "Completed jobs",
                  value: completed.length,
                  tone: "bg-emerald-50 text-emerald-700",
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  href="/technician/jobs"
                  className="flex items-center justify-between rounded-lg border border-[#E7EEF5] p-3 transition-colors hover:bg-[#F8FBFD]"
                >
                  <span className="text-sm font-semibold text-[#12355B]">
                    {item.label}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.tone}`}>
                    {loading ? "-" : item.value}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-[#12355B]">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              {[
                {
                  label: "Open Jobs",
                  href: "/technician/jobs",
                  icon: BriefcaseBusiness,
                },
                {
                  label: "Ready Jobs",
                  href: "/technician/jobs",
                  icon: Clock,
                },
                {
                  label: "Completed Work",
                  href: "/technician/jobs",
                  icon: BarChart3,
                },
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

          <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FFF4E2]">
              <Clock size={20} className="text-[#F7941D]" />
            </div>
            <h3 className="mt-4 font-semibold text-[#12355B]">
              Work Flow
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E7F8FC] text-xs font-bold text-[#0E7892]">
                  1
                </span>
                <p>Open the assigned job and verify customer details.</p>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E7F8FC] text-xs font-bold text-[#0E7892]">
                  2
                </span>
                <p>Start work when you arrive at the service location.</p>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E7F8FC] text-xs font-bold text-[#0E7892]">
                  3
                </span>
                <p>Mark completed after the issue is resolved.</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#D7E4EE] bg-[#F8FBFD] p-5">
            <h3 className="font-semibold text-[#12355B]">Service Reminder</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Call the customer before visiting and keep the booking status
              updated so the admin team can track progress clearly.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
