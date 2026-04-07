"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AxiosError } from "axios";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

const schema = z.object({
  serviceType: z.string().min(2, "Service type is required").max(100),
  issueDescription: z
    .string()
    .min(10, "Please describe the issue (at least 10 characters)")
    .max(2000),
  serviceAddress: z
    .string()
    .min(10, "Please enter a full address (at least 10 characters)")
    .max(500),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid date"),
});

type FormData = z.infer<typeof schema>;

export default function NewBookingPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    setLoading(true);
    try {
      await api.post("/bookings", data);
      router.push("/bookings");
    } catch (err) {
      if (err instanceof AxiosError)
        setError(err.response?.data?.message || "Failed to create booking");
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

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

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book a Service</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to schedule a new service
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Service Type
            </label>
            <input
              type="text"
              placeholder="e.g. Electrical Wiring, Plumbing Repair"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
                errors.serviceType ? "border-red-400" : "border-gray-300"
              }`}
              {...register("serviceType")}
            />
            {errors.serviceType && (
              <p className="mt-1 text-xs text-red-600">
                {errors.serviceType.message}
              </p>
            )}
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Issue Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the problem in detail..."
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow ${
                errors.issueDescription ? "border-red-400" : "border-gray-300"
              }`}
              {...register("issueDescription")}
            />
            {errors.issueDescription && (
              <p className="mt-1 text-xs text-red-600">
                {errors.issueDescription.message}
              </p>
            )}
          </div>

          {/* Service Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Service Address
            </label>
            <textarea
              rows={2}
              placeholder="Full address including landmark..."
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow ${
                errors.serviceAddress ? "border-red-400" : "border-gray-300"
              }`}
              {...register("serviceAddress")}
            />
            {errors.serviceAddress && (
              <p className="mt-1 text-xs text-red-600">
                {errors.serviceAddress.message}
              </p>
            )}
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Preferred Date
            </label>
            <input
              type="date"
              min={today}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
                errors.preferredDate ? "border-red-400" : "border-gray-300"
              }`}
              {...register("preferredDate")}
            />
            {errors.preferredDate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.preferredDate.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <Link href="/bookings">
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {loading ? "Submitting..." : "Submit Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}