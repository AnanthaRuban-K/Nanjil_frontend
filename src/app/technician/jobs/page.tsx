"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, type Booking } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  UserRound,
  Wrench,
} from "lucide-react";

export const dynamic = "force-dynamic";

const limit = 10;

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

export default function TechnicianJobsPage() {
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.get("/technician/jobs", {
        params: { page, limit },
      });
      setJobs(res.data.data);
      setTotal(res.data.meta.total);
    } catch {
      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredJobs = jobs.filter((job) => {
    const text = search.trim().toLowerCase();
    if (statusFilter && job.status !== statusFilter) return false;
    if (!text) return true;

    return [
      job.bookingReference,
      job.customer?.fullName,
      job.customer?.phone,
      job.serviceType,
      job.status,
      job.serviceAddress,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(text);
  });

  const activeCount = jobs.filter(
    (job) => job.status === "CONFIRMED" || job.status === "IN_PROGRESS"
  ).length;
  const completedCount = jobs.filter((job) => job.status === "COMPLETED").length;
  const pendingStartCount = jobs.filter((job) => job.status === "CONFIRMED").length;

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <section className="rounded-lg bg-[#0F2F57] p-5 text-white shadow-xl shadow-[#0F2F57]/10 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <SlidersHorizontal size={14} />
              Technician operations
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">My Jobs</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Review assigned jobs, call customers, check service addresses, and
              open job details to update progress.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase text-white/60">
              Action queue
            </p>
            <p className="mt-1 text-2xl font-bold">{pendingStartCount}</p>
            <p className="text-sm text-white/70">jobs ready to start</p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Total Assigned",
            value: total,
            icon: BriefcaseBusiness,
            color: "bg-[#E7F8FC] text-[#0E7892]",
          },
          {
            label: "Ready / Active",
            value: activeCount,
            icon: Clock,
            color: "bg-[#FFF4E2] text-[#F7941D]",
          },
          {
            label: "Completed",
            value: completedCount,
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

      {pendingStartCount > 0 && !loading && (
        <div className="rounded-lg border border-[#FAD9A7] bg-[#FFF4E2] px-4 py-3 text-sm text-[#8A4A00]">
          {pendingStartCount} assigned job{pendingStartCount > 1 ? "s are" : " is"} ready to start.
        </div>
      )}

      <section className="overflow-hidden rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
        <div className="border-b border-[#E7EEF5] p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-[#12355B]">Assigned Jobs</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Showing your latest assigned service jobs
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-[220px_1fr] lg:items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-[#D7E4EE] bg-white px-3 text-sm outline-none transition focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
            >
              <option value="">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ref, customer, phone, service, address"
                className="h-10 w-full rounded-lg border border-[#D7E4EE] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
              />
            </div>
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
        ) : jobs.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#E7F8FC]">
              <BriefcaseBusiness size={26} className="text-[#0E7892]" />
            </div>
            <h3 className="font-semibold text-[#12355B]">No jobs assigned</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
              New confirmed service jobs assigned by admin will appear here.
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold text-[#12355B]">No matching jobs</p>
            <p className="mt-1 text-sm text-slate-500">
              Try another reference, customer, service, or status.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-[#E7EEF5]">
                <thead className="bg-[#F8FBFD]">
                  <tr>
                    {[
                      "Reference",
                      "Customer",
                      "Phone",
                      "Service",
                      "Scheduled",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF3F7]">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="transition-colors hover:bg-[#F8FBFD]">
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#12355B]">
                        {job.bookingReference}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {job.customer?.fullName ?? "-"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm">
                        {job.customer?.phone ? (
                          <a
                            href={`tel:${job.customer.phone}`}
                            className="font-medium text-[#0E7892] hover:text-[#12355B]"
                          >
                            {job.customer.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="max-w-[240px] truncate px-5 py-4 text-sm text-slate-700">
                        {job.serviceType}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDate(job.scheduledDate || job.preferredDate)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Badge status={job.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <Link
                          href={`/technician/jobs/${job.id}`}
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

            <div className="divide-y divide-[#EEF3F7] lg:hidden">
              {filteredJobs.map((job) => (
                <article key={job.id} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
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

                  <div className="mt-4 grid gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <UserRound size={15} className="text-[#0E7892]" />
                      {job.customer?.fullName ?? "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={15} className="text-[#0E7892]" />
                      {job.customer?.phone ? (
                        <a
                          href={`tel:${job.customer.phone}`}
                          className="font-medium text-[#0E7892]"
                        >
                          {job.customer.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={15} className="text-[#F7941D]" />
                      {formatDate(job.scheduledDate || job.preferredDate)}
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={15} className="mt-0.5 text-[#0E7892]" />
                      <span className="line-clamp-2">{job.serviceAddress}</span>
                    </div>
                  </div>

                  <Link
                    href={`/technician/jobs/${job.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#F7941D] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e8820f]"
                  >
                    Open Job
                    <ArrowRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {!loading && jobs.length > 0 && !search.trim() && (
        <Pagination page={page} limit={limit} total={total} onChange={setPage} />
      )}
    </div>
  );
}
