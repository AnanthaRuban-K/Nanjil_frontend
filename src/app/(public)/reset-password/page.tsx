"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError("Reset token is missing. Please request a new link.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      setSuccess(true);
      window.setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Unable to reset password");
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
              <Lock size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Reset password
              </h1>
              <p className="text-sm text-gray-500">
                Create a new password for your account.
              </p>
            </div>
          </div>

          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <ShieldCheck size={16} />
                Password updated
              </div>
              You can now sign in with your new password.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!token && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                  Reset token is missing. Request a new reset link.
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  New password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    className={`h-12 w-full rounded-lg border bg-white pl-11 pr-12 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                      errors.password ? "border-red-300" : "border-gray-200"
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className={`h-12 w-full rounded-lg border bg-white px-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
