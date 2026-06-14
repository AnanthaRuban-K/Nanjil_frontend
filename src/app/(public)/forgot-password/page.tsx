"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { ArrowLeft, Mail, Send, ShieldCheck, Wrench } from "lucide-react";
import { api } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

type ForgotPasswordResponse = {
  data?: {
    resetUrl?: string;
  };
};

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    setSent(false);
    setResetUrl("");
    setLoading(true);

    try {
      const res = await api.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        data
      );
      setResetUrl(res.data.data?.resetUrl || "");
      setSent(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Unable to send reset link");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Wrench size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Forgot password
              </h1>
              <p className="text-sm text-gray-500">
                Enter your email to get a reset link.
              </p>
            </div>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <ShieldCheck size={16} />
                  Reset link sent
                </div>
                If an account exists for that email, we sent password reset
                instructions.
              </div>

              {resetUrl && (
                <Link
                  href={resetUrl}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Open reset link
                </Link>
              )}

              <button
                type="button"
                onClick={() => setSent(false)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Send another link
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`h-12 w-full rounded-lg border bg-white pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Send size={16} />
                )}
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
