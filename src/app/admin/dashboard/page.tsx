"use client";

import { useEffect, useState } from "react";
import { api, type DashboardSummary } from "@/lib/api";
import { StatCard } from "@/components/ui/StatCard";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api
      .get("/admin/dashboard/summary")
      .then((res) => setData(res.data.data))
      .catch(() => {});
  }, []);

  if (!data)
    return (
      <div className="text-center py-20 text-gray-500">Loading...</div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Bookings"
          value={data.totalBookings}
          icon={<BookOpen size={24} />}
        />
        <StatCard
          label="Pending"
          value={data.pending}
          icon={<Clock size={24} />}
          color="text-yellow-500"
        />
        <StatCard
          label="Confirmed"
          value={data.confirmed}
          icon={<CheckCircle2 size={24} />}
          color="text-blue-500"
        />
        <StatCard
          label="In Progress"
          value={data.inProgress}
          icon={<Clock size={24} />}
          color="text-purple-500"
        />
        <StatCard
          label="Completed Today"
          value={data.completedToday}
          icon={<CheckCircle2 size={24} />}
          color="text-green-500"
        />
        <StatCard
          label="Unpaid (Completed)"
          value={data.unpaidCompleted}
          icon={<AlertTriangle size={24} />}
          color="text-orange-500"
        />
        <StatCard
          label="Revenue Collected"
          value={`₹${data.totalRevenueCollected.toLocaleString()}`}
          icon={<IndianRupee size={24} />}
          color="text-green-600"
        />
      </div>
    </div>
  );
}