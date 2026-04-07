"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, type Booking } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { AxiosError } from "axios";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    api
      .get("/technician/jobs", { params: { page: 1, limit: 100 } })
      .then((res) => {
        const found = (res.data.data as Booking[]).find(
          (b) => b.id === params.id
        );
        if (found) setJob(found);
        else setError("Job not found");
      })
      .catch(() => setError("Failed to load"));
  }, [params.id]);

  const updateStatus = async (status: string) => {
    setActionError("");
    setLoading(true);
    try {
      const res = await api.patch(
        `/technician/jobs/${params.id}/status`,
        { status }
      );
      setJob(res.data.data);
    } catch (err) {
      if (err instanceof AxiosError)
        setActionError(err.response?.data?.message || "Failed");
      else setActionError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (error)
    return (
      <div className="text-center py-20 text-gray-500">{error}</div>
    );
  if (!job)
    return (
      <div className="text-center py-20 text-gray-500">Loading...</div>
    );

  const rows = [
    ["Reference", job.bookingReference],
    ["Service Type", job.serviceType],
    ["Scheduled Date", job.scheduledDate || job.preferredDate],
    ["Address", job.serviceAddress],
    ["Issue", job.issueDescription],
    ["Created", new Date(job.createdAt).toLocaleString()],
  ];

  return (
    <div className="max-w-2xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/technician/jobs")}
        className="mb-4"
      >
        <ArrowLeft size={16} /> Back
      </Button>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Job Details</h1>
          <Badge status={job.status} />
        </div>

        <dl className="space-y-3 mb-6">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100"
            >
              <dt className="text-sm text-gray-500">{label}</dt>
              <dd className="text-sm col-span-2">{value}</dd>
            </div>
          ))}
        </dl>

        {actionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {actionError}
          </div>
        )}

        {/* Action buttons based on current status */}
        <div className="flex gap-3">
          {job.status === "CONFIRMED" && (
            <Button
              onClick={() => updateStatus("IN_PROGRESS")}
              loading={loading}
            >
              Start Work
            </Button>
          )}
          {job.status === "IN_PROGRESS" && (
            <Button
              onClick={() => updateStatus("COMPLETED")}
              loading={loading}
            >
              Mark Completed
            </Button>
          )}
          {(job.status === "COMPLETED" ||
            job.status === "CANCELLED") && (
            <p className="text-sm text-gray-500 italic">
              No further actions available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}