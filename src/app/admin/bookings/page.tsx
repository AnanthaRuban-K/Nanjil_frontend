"use client";

import { useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { api, type Booking, type Technician } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Phone,
  Search,
  SlidersHorizontal,
  UserRound,
  Wrench,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All Payments" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "PAYMENT_SUBMITTED", label: "Submitted" },
  { value: "PAID", label: "Paid" },
  { value: "PAYMENT_REJECTED", label: "Rejected" },
];

const limit = 10;

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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [assignOpen, setAssignOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [amountOpen, setAmountOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const [techId, setTechId] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [amount, setAmount] = useState("");
  const [payMode, setPayMode] = useState("CASH");
  const [upiRef, setUpiRef] = useState("");
  const [payDate, setPayDate] = useState("");
  const [serviceAmount, setServiceAmount] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const load = useCallback(async () => {
    const params: Record<string, unknown> = { page, limit };
    if (statusFilter) params.status = statusFilter;
    if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter;
    if (search.trim()) params.search = search.trim();

    setLoading(true);
    setPageError("");

    try {
      const res = await api.get("/admin/bookings", { params });
      setBookings(res.data.data);
      setTotal(res.data.meta.total);
    } catch {
      setPageError("Unable to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, paymentStatusFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    api
      .get("/admin/technicians")
      .then((res) => setTechnicians(res.data.data))
      .catch(() => setTechnicians([]));
  }, []);

  const resetModals = () => {
    setAssignOpen(false);
    setPaymentOpen(false);
    setAmountOpen(false);
    setStatusOpen(false);
    setDetailsOpen(false);
    setSelected(null);
    setModalError("");
    setModalLoading(false);
    setTechId("");
    setSchedDate("");
    setAmount("");
    setPayMode("CASH");
    setUpiRef("");
    setPayDate("");
    setServiceAmount("");
    setNewStatus("");
  };

  const handleAssign = async () => {
    if (!selected) return;
    setModalError("");
    setModalLoading(true);
    try {
      await api.patch(`/admin/bookings/${selected.id}/assign`, {
        technicianId: techId,
        ...(schedDate ? { scheduledDate: schedDate } : {}),
      });
      resetModals();
      load();
    } catch (err) {
      if (err instanceof AxiosError) {
        setModalError(err.response?.data?.message || "Failed");
      } else {
        setModalError("Something went wrong");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selected) return;
    setModalError("");
    setModalLoading(true);
    try {
      await api.post(`/admin/bookings/${selected.id}/payment`, {
        ...(amount ? { amount: parseFloat(amount) } : {}),
        paymentMode: payMode,
        ...(payMode === "UPI" ? { upiReference: upiRef } : {}),
        paymentDate: payDate,
      });
      resetModals();
      load();
    } catch (err) {
      if (err instanceof AxiosError) {
        setModalError(err.response?.data?.message || "Failed");
      } else {
        setModalError("Something went wrong");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleServiceAmount = async () => {
    if (!selected) return;
    setModalError("");
    setModalLoading(true);
    try {
      await api.patch(`/admin/bookings/${selected.id}/service-amount`, {
        serviceAmount: parseFloat(serviceAmount),
      });
      resetModals();
      load();
    } catch (err) {
      if (err instanceof AxiosError) {
        setModalError(err.response?.data?.message || "Failed");
      } else {
        setModalError("Something went wrong");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleRejectPayment = async (booking: Booking) => {
    if (!window.confirm("Reject this payment submission?")) return;
    setModalError("");
    try {
      await api.patch(`/admin/bookings/${booking.id}/payment/reject`, {
        reason:
          "Unable to verify UPI payment. Please resubmit the correct reference.",
      });
      load();
    } catch (err) {
      if (err instanceof AxiosError) {
        window.alert(err.response?.data?.message || "Failed");
      } else {
        window.alert("Something went wrong");
      }
    }
  };

  const handleStatusChange = async () => {
    if (!selected) return;
    setModalError("");
    setModalLoading(true);
    try {
      await api.patch(`/admin/bookings/${selected.id}/status`, {
        status: newStatus,
      });
      resetModals();
      load();
    } catch (err) {
      if (err instanceof AxiosError) {
        setModalError(err.response?.data?.message || "Failed");
      } else {
        setModalError("Something went wrong");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const getActions = (b: Booking) => {
    const actions: {
      label: string;
      onClick: () => void;
      variant: "primary" | "secondary" | "danger";
    }[] = [];

    actions.push({
      label: "View",
      variant: "secondary",
      onClick: () => {
        setSelected(b);
        setDetailsOpen(true);
      },
    });

    if (b.status === "PENDING") {
      actions.push({
        label: "Assign",
        variant: "primary",
        onClick: () => {
          setSelected(b);
          setAssignOpen(true);
        },
      });
      actions.push({
        label: "Cancel",
        variant: "danger",
        onClick: () => {
          setSelected(b);
          setNewStatus("CANCELLED");
          setStatusOpen(true);
        },
      });
    }

    if (b.status === "CONFIRMED") {
      actions.push({
        label: "Start",
        variant: "primary",
        onClick: () => {
          setSelected(b);
          setNewStatus("IN_PROGRESS");
          setStatusOpen(true);
        },
      });
    }

    if (b.status === "IN_PROGRESS") {
      actions.push({
        label: "Complete",
        variant: "primary",
        onClick: () => {
          setSelected(b);
          setNewStatus("COMPLETED");
          setStatusOpen(true);
        },
      });
    }

    if (
      b.status === "COMPLETED" &&
      ["UNPAID", "PAYMENT_SUBMITTED", "PAYMENT_REJECTED"].includes(
        b.paymentStatus
      )
    ) {
      actions.push({
        label: b.serviceAmount ? "Edit Amount" : "Set Amount",
        variant: "secondary",
        onClick: () => {
          setSelected(b);
          setServiceAmount(b.serviceAmount ?? "");
          setAmountOpen(true);
        },
      });
      actions.push({
        label:
          b.paymentStatus === "PAYMENT_SUBMITTED"
            ? "Verify Payment"
            : "Record Payment",
        variant: "primary",
        onClick: () => {
          setSelected(b);
          setPayMode(b.submittedUpiReference ? "UPI" : "CASH");
          setUpiRef(b.submittedUpiReference ?? "");
          setAmount(b.serviceAmount ?? "");
          setPayDate(new Date().toISOString().split("T")[0]);
          setPaymentOpen(true);
        },
      });
    }

    if (b.paymentStatus === "PAYMENT_SUBMITTED") {
      actions.push({
        label: "Reject",
        variant: "danger",
        onClick: () => handleRejectPayment(b),
      });
    }

    return actions;
  };

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const paymentReviewCount = bookings.filter(
    (b) => b.paymentStatus === "PAYMENT_SUBMITTED"
  ).length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <section className="rounded-lg bg-[#0F2F57] p-5 text-white shadow-xl shadow-[#0F2F57]/10 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <SlidersHorizontal size={14} />
              Admin booking operations
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">Manage Bookings</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Assign technicians, update service progress, verify payments, and
              review customer booking details from one workspace.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total",
            value: total,
            icon: BookOpen,
            color: "bg-[#E7F8FC] text-[#0E7892]",
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: Clock,
            color: "bg-[#FFF4E2] text-[#F7941D]",
          },
          {
            label: "Payment Review",
            value: paymentReviewCount,
            icon: CreditCard,
            color: "bg-[#E7F8FC] text-[#0E7892]",
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

      <section className="rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
        <div className="border-b border-[#E7EEF5] p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[180px_180px_1fr] lg:items-end">
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            />
            <Select
              label="Payment"
              options={PAYMENT_STATUS_OPTIONS}
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setPage(1);
              }}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Name, phone, email, ref, address"
                  className="h-10 w-full rounded-lg border border-[#D7E4EE] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {pageError ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600">{pageError}</p>
            <button
              onClick={load}
              className="mt-4 rounded-lg border border-[#D7E4EE] px-4 py-2 text-sm font-semibold text-[#12355B] hover:bg-[#F4F8FB]"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3 p-4 sm:p-5">
            {[...Array(5)].map((_, index) => (
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
        ) : bookings.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#E7F8FC]">
              <BookOpen size={26} className="text-[#0E7892]" />
            </div>
            <h3 className="font-semibold text-[#12355B]">No bookings found</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Try adjusting the filters or search text.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="min-w-full divide-y divide-[#E7EEF5]">
                <thead className="bg-[#F8FBFD]">
                  <tr>
                    {[
                      "Ref",
                      "Customer",
                      "Phone",
                      "Service",
                      "Date",
                      "Status",
                      "Payment",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF3F7]">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-[#F8FBFD]"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#12355B]">
                        {booking.bookingReference}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {booking.customer?.fullName ?? "-"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm">
                        {booking.customer?.phone ? (
                          <a
                            href={`tel:${booking.customer.phone}`}
                            className="font-medium text-[#0E7892] hover:text-[#12355B]"
                          >
                            {booking.customer.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="max-w-[220px] truncate px-5 py-4 text-sm text-slate-700">
                        {booking.serviceType}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDate(booking.preferredDate)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Badge status={booking.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Badge status={booking.paymentStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {getActions(booking).map((action) => (
                            <Button
                              key={action.label}
                              variant={action.variant}
                              size="sm"
                              onClick={action.onClick}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#EEF3F7] xl:hidden">
              {bookings.map((booking) => (
                <article key={booking.id} className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#12355B]">
                        {booking.bookingReference}
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {booking.serviceType}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge status={booking.status} />
                      <Badge status={booking.paymentStatus} />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <UserRound size={15} className="text-[#0E7892]" />
                      {booking.customer?.fullName ?? "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={15} className="text-[#0E7892]" />
                      {booking.customer?.phone ? (
                        <a
                          href={`tel:${booking.customer.phone}`}
                          className="font-medium text-[#0E7892]"
                        >
                          {booking.customer.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={15} className="text-[#F7941D]" />
                      {formatDate(booking.preferredDate)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench size={15} className="text-[#0E7892]" />
                      {booking.serviceAmount
                        ? `Rs. ${booking.serviceAmount}`
                        : "Amount not set"}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {getActions(booking).map((action) => (
                      <Button
                        key={action.label}
                        variant={action.variant}
                        size="sm"
                        onClick={action.onClick}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {!loading && bookings.length > 0 && (
        <Pagination page={page} limit={limit} total={total} onChange={setPage} />
      )}

      <Modal open={detailsOpen} onClose={resetModals} title="Booking Details">
        {selected && (
          <dl className="space-y-3">
            {[
              ["Reference", selected.bookingReference],
              ["Customer", selected.customer?.fullName ?? "-"],
              ["Phone", selected.customer?.phone ?? "-"],
              ["Email", selected.customer?.email ?? "-"],
              ["Service", selected.serviceType],
              ["Preferred Date", formatDate(selected.preferredDate)],
              ["Scheduled Date", formatDate(selected.scheduledDate)],
              ["Address", selected.serviceAddress],
              ["Issue", selected.issueDescription],
              [
                "Amount",
                selected.serviceAmount ? `Rs. ${selected.serviceAmount}` : "-",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 border-b border-gray-100 py-2 sm:grid-cols-3 sm:gap-4"
              >
                <dt className="text-sm text-gray-500">{label}</dt>
                <dd className="break-words text-sm sm:col-span-2">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal open={assignOpen} onClose={resetModals} title="Assign Technician">
        {modalError && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {modalError}
          </div>
        )}
        <div className="space-y-4">
          <Select
            label="Technician"
            options={[
              {
                value: "",
                label:
                  technicians.length > 0
                    ? "Select technician"
                    : "No active technicians",
              },
              ...technicians.map((tech) => ({
                value: tech.id,
                label: `${tech.fullName} - ${tech.phone}`,
              })),
            ]}
            value={techId}
            onChange={(e) => setTechId(e.target.value)}
          />
          <Input
            label="Scheduled Date (optional)"
            type="date"
            value={schedDate}
            onChange={(e) => setSchedDate(e.target.value)}
          />
          <Button
            onClick={handleAssign}
            loading={modalLoading}
            disabled={!techId}
            className="w-full"
          >
            Assign & Confirm
          </Button>
        </div>
      </Modal>

      <Modal open={amountOpen} onClose={resetModals} title="Service Amount">
        {modalError && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {modalError}
          </div>
        )}
        <div className="space-y-4">
          <Input
            label="Service Amount (Rs.)"
            type="number"
            step="0.01"
            value={serviceAmount}
            onChange={(e) => setServiceAmount(e.target.value)}
          />
          <Button
            onClick={handleServiceAmount}
            loading={modalLoading}
            disabled={!serviceAmount}
            className="w-full"
          >
            Save Amount
          </Button>
        </div>
      </Modal>

      <Modal open={paymentOpen} onClose={resetModals} title="Record Payment">
        {modalError && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {modalError}
          </div>
        )}
        <div className="space-y-4">
          <Input
            label="Amount (Rs.)"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Select
            label="Payment Mode"
            options={[
              { value: "CASH", label: "Cash" },
              { value: "UPI", label: "UPI" },
            ]}
            value={payMode}
            onChange={(e) => setPayMode(e.target.value)}
          />
          {payMode === "UPI" && (
            <Input
              label="UPI Reference"
              placeholder="UPI-TXN-..."
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
            />
          )}
          <Input
            label="Payment Date"
            type="date"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
          />
          <Button
            onClick={handlePayment}
            loading={modalLoading}
            className="w-full"
          >
            Record Payment
          </Button>
        </div>
      </Modal>

      <Modal open={statusOpen} onClose={resetModals} title="Confirm Status Change">
        {modalError && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {modalError}
          </div>
        )}
        <p className="mb-4 text-sm text-gray-600">
          Change <strong>{selected?.bookingReference}</strong> from{" "}
          <Badge status={selected?.status || ""} /> to <Badge status={newStatus} />?
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={resetModals} className="flex-1">
            Cancel
          </Button>
          <Button
            variant={newStatus === "CANCELLED" ? "danger" : "primary"}
            onClick={handleStatusChange}
            loading={modalLoading}
            className="flex-1"
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}
