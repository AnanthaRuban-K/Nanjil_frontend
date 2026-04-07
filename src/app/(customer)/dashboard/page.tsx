


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
        return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-indigo-100 text-indigo-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's an overview of your bookings
          </p>
        </div>
        <Link href="/bookings/new">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            <PlusCircle size={16} />
            New Booking
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? "–" : total}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock size={18} className="text-amber-600" />
            </div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? "–" : activeCount}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? "–" : completedCount}
          </p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
          {total > 5 && (
            <Link
              href="/bookings"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="p-5 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">No bookings yet</p>
            <Link href="/bookings/new">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Create your first booking →
              </button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {bookings.map((b) => (
              <Link
                key={b.id}
                href={`/bookings/${b.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen size={18} className="text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {b.serviceType}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                    <span>{b.bookingReference}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays size={11} />
                      {formatDate(b.preferredDate)}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(b.status)}`}
                >
                  {b.status.replace("_", " ")}
                </span>

                <ChevronRight size={16} className="text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
