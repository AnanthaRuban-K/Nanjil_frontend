"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, type Booking, type Payment } from "@/lib/api";
import { CONTACT_CONFIG } from "@/config/contact";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  FileText,
  Clock,
  CreditCard,
  Hash,
  Wrench,
} from "lucide-react";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [upiReference, setUpiReference] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/bookings/my/${params.id}`)
      .then((res) => setBooking(res.data.data))
      .catch(() => setError("Booking not found"))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (booking?.paymentStatus !== "PAID") return;

    api
      .get(`/bookings/my/${booking.id}/receipt`)
      .then((res) => setReceipt(res.data.data.payment))
      .catch(() => setReceipt(null));
  }, [booking?.id, booking?.paymentStatus]);

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
      case "PAID":
        return "bg-green-100 text-green-700";
      case "UNPAID":
        return "bg-yellow-100 text-yellow-700";
      case "PAYMENT_SUBMITTED":
        return "bg-blue-100 text-blue-700";
      case "PAYMENT_REJECTED":
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

  const formatDateTime = (dateStr: string) => {
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
  };

  const submitPaymentReference = async () => {
    if (!booking) return;
    setPaymentError("");
    setPaymentLoading(true);

    try {
      const res = await api.post(
        `/bookings/my/${booking.id}/payment-submission`,
        { upiReference }
      );
      setBooking(res.data.data);
      setUpiReference("");
    } catch {
      setPaymentError("Unable to submit payment reference");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (error)
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-0">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Bookings
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-gray-500">{error}</p>
          <Link href="/bookings">
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Go back
            </button>
          </Link>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-0">
        <div className="h-5 w-32 bg-gray-100 rounded mb-6 animate-pulse" />
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-1.5">
              <div className="h-3 w-24 bg-gray-50 rounded" />
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );

  if (!booking) return null;

  const details = [
    {
      icon: <Hash size={15} />,
      label: "Reference",
      value: booking.bookingReference,
    },
    {
      icon: <Wrench size={15} />,
      label: "Service Type",
      value: booking.serviceType,
    },
    {
      icon: <CalendarDays size={15} />,
      label: "Preferred Date",
      value: formatDate(booking.preferredDate),
    },
    {
      icon: <CalendarDays size={15} />,
      label: "Scheduled Date",
      value: booking.scheduledDate ? formatDate(booking.scheduledDate) : "-",
    },
    {
      icon: <MapPin size={15} />,
      label: "Service Address",
      value: booking.serviceAddress,
    },
    {
      icon: <FileText size={15} />,
      label: "Issue Description",
      value: booking.issueDescription,
    },
    {
      icon: <Clock size={15} />,
      label: "Created",
      value: formatDateTime(booking.createdAt),
    },
    {
      icon: <CreditCard size={15} />,
      label: "Service Amount",
      value: booking.serviceAmount ? `Rs. ${booking.serviceAmount}` : "-",
    },
  ];

  const canSubmitUpiPayment =
    booking.status === "COMPLETED" &&
    ["UNPAID", "PAYMENT_REJECTED"].includes(booking.paymentStatus);
  const upiUrl = `upi://pay?pa=${encodeURIComponent(
    CONTACT_CONFIG.upiId
  )}&pn=${encodeURIComponent(CONTACT_CONFIG.upiName)}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    upiUrl
  )}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      {/* Back Link */}
      <Link
        href="/bookings"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Bookings
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-5 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Booking Details</h1>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(booking.status)}`}
            >
              <Clock size={12} />
              {booking.status.replace("_", " ")}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(booking.paymentStatus)}`}
            >
              <CreditCard size={12} />
              {booking.paymentStatus}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 sm:px-6 py-5 space-y-4">
          {details.map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-2 sm:w-40 shrink-0">
                <span className="text-gray-400">{icon}</span>
                <span className="text-sm text-gray-500">{label}</span>
              </div>
              <p className="text-sm text-gray-900 sm:pl-0 pl-7">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {canSubmitUpiPayment && (
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="shrink-0">
              <img
                src={qrUrl}
                alt="UPI QR code"
                className="h-[180px] w-[180px] rounded-lg border border-gray-200"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Scan & Pay
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  UPI ID: {CONTACT_CONFIG.upiId}
                </p>
              </div>
              {booking.paymentStatus === "PAYMENT_REJECTED" &&
                booking.paymentRejectedReason && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {booking.paymentRejectedReason}
                  </div>
                )}
              <input
                value={upiReference}
                onChange={(e) => setUpiReference(e.target.value)}
                placeholder="Enter UPI transaction reference"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {paymentError && (
                <p className="text-sm text-red-600">{paymentError}</p>
              )}
              <button
                onClick={submitPaymentReference}
                disabled={!upiReference.trim() || paymentLoading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
              >
                {paymentLoading ? "Submitting..." : "I Have Paid"}
              </button>
            </div>
          </div>
        </div>
      )}

      {booking.paymentStatus === "PAYMENT_SUBMITTED" && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Payment submitted for admin verification
          {booking.submittedUpiReference
            ? `: ${booking.submittedUpiReference}`
            : "."}
        </div>
      )}

      {receipt && (
        <div className="mt-4 bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">Receipt</h2>
          </div>
          <div className="px-5 py-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Invoice Number</span>
              <span className="font-medium text-gray-900">
                {receipt.invoiceNumber}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium text-gray-900">
                Rs. {receipt.amount}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Payment Mode</span>
              <span className="font-medium text-gray-900">
                {receipt.paymentMode}
              </span>
            </div>
            {receipt.upiReference && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">UPI Reference</span>
                <span className="font-medium text-gray-900">
                  {receipt.upiReference}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Paid Date</span>
              <span className="font-medium text-gray-900">
                {formatDate(receipt.paymentDate)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
