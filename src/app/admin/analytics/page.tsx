"use client";

import { useEffect, useState } from "react";
import { api, type RevenueAnalytics, type BookingAnalytics } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Th, Td } from "@/components/ui/Table";
import { StatCard } from "@/components/ui/StatCard";
import { IndianRupee, CreditCard, Smartphone } from "lucide-react";
export const dynamic = "force-dynamic";
export default function AnalyticsPage() {
  // Revenue
  const [dateFrom, setDateFrom] = useState(
    `${new Date().getFullYear()}-01-01`
  );
  const [dateTo, setDateTo] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [revLoading, setRevLoading] = useState(false);

  // Booking analytics
  const [bookingAnalytics, setBookingAnalytics] =
    useState<BookingAnalytics | null>(null);

  useEffect(() => {
    api
      .get("/admin/analytics/bookings")
      .then((res) => setBookingAnalytics(res.data.data))
      .catch(() => {});
  }, []);

  const loadRevenue = async () => {
    setRevLoading(true);
    try {
      const res = await api.get("/admin/analytics/revenue", {
        params: { date_from: dateFrom, date_to: dateTo },
      });
      setRevenue(res.data.data);
    } catch {
      /* ignore */
    } finally {
      setRevLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* ── Revenue Section ─────────────────── */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Revenue</h2>
        <div className="flex flex-wrap gap-3 items-end mb-4">
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
            Apply
          </Button>
        </div>

        {revenue && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Revenue"
              value={`₹${revenue.totalRevenue.toLocaleString()}`}
              icon={<IndianRupee size={24} />}
              color="text-green-600"
            />
            <StatCard
              label="Cash"
              value={`₹${revenue.cashTotal.toLocaleString()}`}
              icon={<CreditCard size={24} />}
              color="text-teal-500"
            />
            <StatCard
              label="UPI"
              value={`₹${revenue.upiTotal.toLocaleString()}`}
              icon={<Smartphone size={24} />}
              color="text-indigo-500"
            />
            <StatCard
              label="Paid Bookings"
              value={revenue.totalPaidBookings}
            />
          </div>
        )}
      </section>

      {/* ── Booking Breakdown ───────────────── */}
      {bookingAnalytics && (
        <>
          <section>
            <h2 className="text-lg font-semibold mb-3">
              Bookings by Status
            </h2>
            <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(bookingAnalytics.byStatus).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="bg-white rounded-lg border p-4 text-center"
                  >
                    <Badge status={status} />
                    <p className="text-2xl font-bold mt-2">
                      {count as number}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              Completed Jobs by Technician
            </h2>
            <Table>
              <Thead>
                <tr>
                  <Th>Technician</Th>
                  <Th className="text-right">Completed Jobs</Th>
                </tr>
              </Thead>
              <tbody className="divide-y divide-gray-200">
                {bookingAnalytics.byTechnician.map((t) => (
                  <tr key={t.technicianName}>
                    <Td>{t.technicianName}</Td>
                    <Td className="text-right font-medium">
                      {t.completedJobs}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>
        </>
      )}
    </div>
  );
}