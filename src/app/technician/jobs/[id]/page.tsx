"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { api, type Booking } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
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

function formatDateTime(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = async () => {
    setError("");
    setPageLoading(true);

    try {
      const res = await api.get("/technician/jobs", {
        params: { page: 1, limit: 100 },
      });
      const found = (res.data.data as Booking[]).find(
        (booking) => booking.id === params.id
      );
      if (found) setJob(found);
      else setError("Job not found");
    } catch {
      setError("Failed to load job details.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const updateStatus = async (status: string) => {
    setActionError("");
    setActionLoading(true);

    try {
      const res = await api.patch(`/technician/jobs/${params.id}/status`, {
        status,
      });
      setJob((current) => ({
        ...res.data.data,
        customer: current?.customer ?? res.data.data.customer,
      }));
    } catch (err) {
      if (err instanceof AxiosError) {
        setActionError(err.response?.data?.message || "Failed");
      } else {
        setActionError("Something went wrong");
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-100" />
        <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
          <div className="h-7 w-44 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded bg-slate-50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => router.push("/technician/jobs")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#12355B]"
        >
          <ArrowLeft size={16} />
          Back to jobs
        </button>
        <div className="rounded-lg border border-[#D7E4EE] bg-white px-5 py-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#E7F8FC]">
            <Wrench size={26} className="text-[#0E7892]" />
          </div>
          <h1 className="font-semibold text-[#12355B]">
            {error || "Job not found"}
          </h1>
          <button
            onClick={load}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#D7E4EE] px-4 py-2.5 text-sm font-semibold text-[#12355B] hover:bg-[#F4F8FB]"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const canStart = job.status === "CONFIRMED";
  const canComplete = job.status === "IN_PROGRESS";
  const noMoreActions = job.status === "COMPLETED" || job.status === "CANCELLED";

  const detailRows = [
    {
      icon: CalendarDays,
      label: "Scheduled Date",
      value: formatDate(job.scheduledDate || job.preferredDate),
    },
    {
      icon: MapPin,
      label: "Service Address",
      value: job.serviceAddress,
    },
    {
      icon: FileText,
      label: "Issue Description",
      value: job.issueDescription,
    },
    {
      icon: Clock,
      label: "Created",
      value: formatDateTime(job.createdAt),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      <button
        onClick={() => router.push("/technician/jobs")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#12355B]"
      >
        <ArrowLeft size={16} />
        Back to jobs
      </button>

      <section className="rounded-lg bg-[#0F2F57] p-5 text-white shadow-xl shadow-[#0F2F57]/10 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <Wrench size={14} />
              Job detail
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">{job.serviceType}</h1>
            <p className="mt-2 text-sm text-white/70">{job.bookingReference}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge status={job.status} />
            <Badge status={job.paymentStatus} />
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
          <div className="border-b border-[#E7EEF5] p-4 sm:p-5">
            <h2 className="font-semibold text-[#12355B]">Service Details</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Review the location and issue before updating the job status.
            </p>
          </div>

          <div className="divide-y divide-[#EEF3F7]">
            {detailRows.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="grid gap-2 p-4 sm:grid-cols-[180px_1fr] sm:gap-4 sm:p-5"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Icon size={16} className="text-[#0E7892]" />
                  {label}
                </div>
                <p className="break-words text-sm leading-6 text-[#12355B]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E7F8FC]">
              <UserRound size={20} className="text-[#0E7892]" />
            </div>
            <h2 className="mt-4 font-semibold text-[#12355B]">Customer</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <UserRound size={15} className="text-[#0E7892]" />
                {job.customer?.fullName ?? "-"}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#0E7892]" />
                {job.customer?.phone ? (
                  <a
                    href={`tel:${job.customer.phone}`}
                    className="font-semibold text-[#0E7892]"
                  >
                    {job.customer.phone}
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-[#0E7892]" />
                <span className="break-all">{job.customer?.email ?? "-"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-[#12355B]">Job Action</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Update status only after the real field work stage changes.
            </p>

            {actionError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {actionError}
              </div>
            )}

            <div className="mt-5 space-y-3">
              {canStart && (
                <Button
                  onClick={() => updateStatus("IN_PROGRESS")}
                  loading={actionLoading}
                  className="w-full"
                >
                  <Wrench size={16} />
                  Start Work
                </Button>
              )}
              {canComplete && (
                <Button
                  onClick={() => updateStatus("COMPLETED")}
                  loading={actionLoading}
                  className="w-full"
                >
                  <CheckCircle2 size={16} />
                  Mark Completed
                </Button>
              )}
              {noMoreActions && (
                <div className="rounded-lg bg-[#F8FBFD] p-3 text-sm text-slate-600">
                  No further actions available for this job.
                </div>
              )}
              {!canStart && !canComplete && !noMoreActions && (
                <div className="rounded-lg bg-[#F8FBFD] p-3 text-sm text-slate-600">
                  Waiting for the next available status action.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
