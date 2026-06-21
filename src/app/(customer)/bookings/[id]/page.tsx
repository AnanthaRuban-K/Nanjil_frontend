"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api, type Booking, type Payment } from "@/lib/api";
import { CONTACT_CONFIG } from "@/config/contact";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Hash,
  IndianRupee,
  Loader2,
  MapPin,
  QrCode,
  ReceiptText,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export default function BookingDetailPage() {
  const params = useParams();
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
      case "UNPAID":
        return "bg-[#FFF4E2] text-[#B96000]";
      case "CONFIRMED":
      case "PAYMENT_SUBMITTED":
        return "bg-[#E7F8FC] text-[#0E7892]";
      case "IN_PROGRESS":
        return "bg-[#EAF0F8] text-[#12355B]";
      case "COMPLETED":
      case "PAID":
        return "bg-emerald-50 text-emerald-700";
      case "CANCELLED":
      case "PAYMENT_REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
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

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link
          href="/bookings"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#12355B]"
        >
          <ArrowLeft size={16} />
          Back to bookings
        </Link>
        <div className="rounded-lg border border-[#D7E4EE] bg-white px-5 py-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#E7F8FC]">
            <Wrench size={26} className="text-[#0E7892]" />
          </div>
          <h1 className="font-semibold text-[#12355B]">{error}</h1>
          <Link href="/bookings">
            <button className="mt-5 rounded-lg border border-[#D7E4EE] px-4 py-2.5 text-sm font-semibold text-[#12355B] hover:bg-[#F4F8FB]">
              Go back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-100" />
        <div className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm">
          <div className="h-7 w-44 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded bg-slate-50" />
              ))}
            </div>
            <div className="h-52 animate-pulse rounded bg-slate-50" />
          </div>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const details = [
    {
      icon: Hash,
      label: "Reference",
      value: booking.bookingReference,
    },
    {
      icon: Wrench,
      label: "Service Type",
      value: booking.serviceType,
    },
    {
      icon: CalendarDays,
      label: "Preferred Date",
      value: formatDate(booking.preferredDate),
    },
    {
      icon: CalendarDays,
      label: "Scheduled Date",
      value: booking.scheduledDate ? formatDate(booking.scheduledDate) : "-",
    },
    {
      icon: MapPin,
      label: "Service Address",
      value: booking.serviceAddress,
    },
    {
      icon: FileText,
      label: "Issue Description",
      value: booking.issueDescription,
    },
    {
      icon: Clock,
      label: "Created",
      value: formatDateTime(booking.createdAt),
    },
    {
      icon: IndianRupee,
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
    <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      <Link
        href="/bookings"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#12355B]"
      >
        <ArrowLeft size={16} />
        Back to bookings
      </Link>

      <section className="rounded-lg bg-[#0F2F57] p-5 text-white shadow-xl shadow-[#0F2F57]/10 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <ShieldCheck size={14} />
              Booking detail
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {booking.serviceType}
            </h1>
            <p className="mt-2 text-sm text-white/70">
              {booking.bookingReference}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(booking.status)}`}
            >
              <Clock size={12} />
              {booking.status.replace("_", " ")}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(booking.paymentStatus)}`}
            >
              <CreditCard size={12} />
              {booking.paymentStatus.replace("_", " ")}
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
          <div className="border-b border-[#E7EEF5] p-4 sm:p-5">
            <h2 className="font-semibold text-[#12355B]">Service Details</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Track your service request and scheduled visit details.
            </p>
          </div>

          <div className="divide-y divide-[#EEF3F7]">
            {details.map(({ icon: Icon, label, value }) => (
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
              <CreditCard size={20} className="text-[#0E7892]" />
            </div>
            <h2 className="mt-4 font-semibold text-[#12355B]">Payment Status</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {booking.paymentStatus === "PAID"
                ? "Your payment has been verified."
                : booking.paymentStatus === "PAYMENT_SUBMITTED"
                  ? "Your payment is waiting for admin verification."
                  : booking.status === "COMPLETED"
                    ? "Payment can be submitted after service completion."
                    : "Payment details will appear after service completion."}
            </p>
            <div className="mt-4 rounded-lg bg-[#F8FBFD] p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold text-[#12355B]">
                  {booking.serviceAmount ? `Rs. ${booking.serviceAmount}` : "-"}
                </span>
              </div>
            </div>
          </div>

          {booking.paymentStatus === "PAYMENT_SUBMITTED" && (
            <div className="rounded-lg border border-[#BFEAF3] bg-[#E7F8FC] p-4 text-sm text-[#0E7892]">
              Payment submitted for admin verification
              {booking.submittedUpiReference
                ? `: ${booking.submittedUpiReference}`
                : "."}
            </div>
          )}
        </aside>
      </div>

      {canSubmitUpiPayment && (
        <section className="rounded-lg border border-[#D7E4EE] bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 md:grid-cols-[220px_1fr]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFF4E2] px-3 py-1 text-xs font-semibold text-[#B96000]">
                <QrCode size={14} />
                UPI Payment
              </div>
              <Image
                src={qrUrl}
                alt="UPI QR code"
                width={180}
                height={180}
                className="h-[180px] w-[180px] rounded-lg border border-[#D7E4EE]"
                unoptimized
              />
            </div>
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-[#12355B]">
                  Scan & Pay
                </h2>
                <p className="mt-1 text-sm text-slate-500">
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
                className="h-11 w-full rounded-lg border border-[#D7E4EE] px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
              />
              {paymentError && (
                <p className="text-sm text-red-600">{paymentError}</p>
              )}
              <button
                onClick={submitPaymentReference}
                disabled={!upiReference.trim() || paymentLoading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#F7941D] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#e8820f] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
              >
                {paymentLoading && <Loader2 size={16} className="animate-spin" />}
                {paymentLoading ? "Submitting..." : "I Have Paid"}
              </button>
            </div>
          </div>
        </section>
      )}

      {receipt && (
        <section className="overflow-hidden rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
          <div className="border-b border-[#E7EEF5] p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <ReceiptText size={18} className="text-[#0E7892]" />
              <h2 className="font-semibold text-[#12355B]">Receipt</h2>
            </div>
          </div>
          <div className="grid gap-3 p-4 text-sm sm:grid-cols-2 sm:p-5">
            {[
              ["Invoice Number", receipt.invoiceNumber],
              ["Amount", `Rs. ${receipt.amount}`],
              ["Payment Mode", receipt.paymentMode],
              ["UPI Reference", receipt.upiReference || "-"],
              ["Paid Date", formatDate(receipt.paymentDate)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-[#F8FBFD] p-3">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-1 break-words font-semibold text-[#12355B]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {booking.paymentStatus === "PAID" && !receipt && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={16} className="mr-2 inline" />
          Payment verified. Receipt is being prepared.
        </div>
      )}
    </div>
  );
}
