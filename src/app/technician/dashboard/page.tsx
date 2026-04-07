"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Booking } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Briefcase, Clock, CheckCircle2 } from "lucide-react";

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api
      .get("/technician/jobs", { params: { page: 1, limit: 100 } })
      .then((res) => {
        setJobs(res.data.data);
        setTotal(res.data.meta.total);
      })
      .catch(() => {});
  }, []);

  const active = jobs.filter(
    (j) => j.status === "CONFIRMED" || j.status === "IN_PROGRESS"
  );
  const completed = jobs.filter((j) => j.status === "COMPLETED");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.fullName}
      </h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Assigned"
          value={total}
          icon={<Briefcase size={24} />}
        />
        <StatCard
          label="Active"
          value={active.length}
          icon={<Clock size={24} />}
          color="text-blue-500"
        />
        <StatCard
          label="Completed"
          value={completed.length}
          icon={<CheckCircle2 size={24} />}
          color="text-green-500"
        />
      </div>

      <h2 className="text-lg font-semibold mb-3">Active Jobs</h2>
      {active.length === 0 ? (
        <p className="text-gray-500 text-sm">No active jobs.</p>
      ) : (
        <div className="space-y-3">
          {active.map((j) => (
            <Link
              key={j.id}
              href={`/technician/jobs/${j.id}`}
              className="block bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{j.serviceType}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {j.bookingReference} ·{" "}
                    {j.scheduledDate || j.preferredDate}
                  </p>
                </div>
                <Badge status={j.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}