"use client";

import { useEffect, useState, useCallback } from "react";
import { api, type Booking } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Th, Td } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AxiosError } from "axios";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 10;

  // Modal state
  const [assignOpen, setAssignOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // Assign form
  const [techId, setTechId] = useState("");
  const [schedDate, setSchedDate] = useState("");

  // Payment form
  const [amount, setAmount] = useState("");
  const [payMode, setPayMode] = useState("CASH");
  const [upiRef, setUpiRef] = useState("");
  const [payDate, setPayDate] = useState("");

  // Status form
  const [newStatus, setNewStatus] = useState("");

  const load = useCallback(async () => {
    const params: Record<string, unknown> = { page, limit };
    if (statusFilter) params.status = statusFilter;
    const res = await api.get("/admin/bookings", { params });
    setBookings(res.data.data);
    setTotal(res.data.meta.total);
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const resetModals = () => {
    setAssignOpen(false);
    setPaymentOpen(false);
    setStatusOpen(false);
    setSelected(null);
    setModalError("");
    setModalLoading(false);
    setTechId("");
    setSchedDate("");
    setAmount("");
    setPayMode("CASH");
    setUpiRef("");
    setPayDate("");
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
      if (err instanceof AxiosError)
        setModalError(err.response?.data?.message || "Failed");
      else setModalError("Something went wrong");
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
        amount: parseFloat(amount),
        paymentMode: payMode,
        ...(payMode === "UPI" ? { upiReference: upiRef } : {}),
        paymentDate: payDate,
      });
      resetModals();
      load();
    } catch (err) {
      if (err instanceof AxiosError)
        setModalError(err.response?.data?.message || "Failed");
      else setModalError("Something went wrong");
    } finally {
      setModalLoading(false);
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
      if (err instanceof AxiosError)
        setModalError(err.response?.data?.message || "Failed");
      else setModalError("Something went wrong");
    } finally {
      setModalLoading(false);
    }
  };

  // Determine available actions
  const getActions = (b: Booking) => {
    const actions: { label: string; onClick: () => void; variant: "primary" | "secondary" | "danger" }[] = [];

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
    if (b.status === "COMPLETED" && b.paymentStatus === "UNPAID") {
      actions.push({
        label: "Record Payment",
        variant: "primary",
        onClick: () => {
          setSelected(b);
          setPayDate(new Date().toISOString().split("T")[0]);
          setPaymentOpen(true);
        },
      });
    }
    return actions;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

      {/* Filter */}
      <div className="mb-4 flex gap-3 items-end">
        <div className="w-48">
          <Select
            label="Filter by Status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <Table>
        <Thead>
          <tr>
            <Th>Ref</Th>
            <Th>Service</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th>Payment</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </Thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-gray-50">
              <Td className="font-medium">{b.bookingReference}</Td>
              <Td>{b.serviceType}</Td>
              <Td>{b.preferredDate}</Td>
              <Td>
                <Badge status={b.status} />
              </Td>
              <Td>
                <Badge status={b.paymentStatus} />
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1 flex-wrap">
                  {getActions(b).map((a) => (
                    <Button
                      key={a.label}
                      variant={a.variant}
                      size="sm"
                      onClick={a.onClick}
                    >
                      {a.label}
                    </Button>
                  ))}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination page={page} limit={limit} total={total} onChange={setPage} />

      {/* Assign Technician Modal */}
      <Modal
        open={assignOpen}
        onClose={resetModals}
        title="Assign Technician"
      >
        {modalError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {modalError}
          </div>
        )}
        <div className="space-y-4">
          <Input
            label="Technician ID (UUID)"
            placeholder="Paste technician UUID"
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
            className="w-full"
          >
            Assign & Confirm
          </Button>
        </div>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        open={paymentOpen}
        onClose={resetModals}
        title="Record Payment"
      >
        {modalError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {modalError}
          </div>
        )}
        <div className="space-y-4">
          <Input
            label="Amount (₹)"
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

      {/* Status Change Modal */}
      <Modal
        open={statusOpen}
        onClose={resetModals}
        title="Confirm Status Change"
      >
        {modalError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {modalError}
          </div>
        )}
        <p className="text-sm text-gray-600 mb-4">
          Change <strong>{selected?.bookingReference}</strong> from{" "}
          <Badge status={selected?.status || ""} /> to{" "}
          <Badge status={newStatus} />?
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={resetModals}
            className="flex-1"
          >
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