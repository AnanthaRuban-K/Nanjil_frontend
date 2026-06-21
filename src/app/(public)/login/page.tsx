"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, getRoleRedirect } from "@/lib/auth";
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap,
  Droplets,
  Wrench,
  Star,
  BadgeCheck,
} from "lucide-react";
import { AxiosError } from "axios";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    setLoading(true);
    try {
      const role = await login(data.email, data.password);
      router.push(getRoleRedirect(role));
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0F2F57] via-[#12355B] to-[#071D35]">
        {/* Glow blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between h-full p-10 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white px-3 py-2 shadow-lg shadow-black/10">
              <Image
                src="/Nanjil.png"
                alt="Nanjil MEP Service"
                width={156}
                height={70}
                priority
                className="h-11 w-auto object-contain"
              />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center space-y-8 max-w-md">
            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight">
                Expert Electrical &{" "}
                <span className="text-[#37B8D8]">Plumbing</span> Services
              </h1>
              <p className="text-white/65 text-sm leading-relaxed">
                Book verified professionals for repairs, installation & maintenance. Transparent pricing. Zero hidden charges.
              </p>
            </div>

            {/* Service icons */}
            <div className="flex gap-4">
              {[
                { icon: Zap, label: "Electrical", color: "bg-[#F7941D]" },
                { icon: Droplets, label: "Plumbing", color: "bg-[#37B8D8]" },
                { icon: Wrench, label: "Maintenance", color: "bg-emerald-500" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center shadow-lg`}>
                    <s.icon size={22} className="text-white" />
                  </div>
                  <span className="text-xs text-blue-200/70">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Trust + Rating */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-bold">4.9</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-blue-200/60">
                <BadgeCheck size={14} className="text-emerald-400" />
                <span>10,000+ customers</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { value: "10K+", label: "Bookings" },
              { value: "500+", label: "Professionals" },
              { value: "50+", label: "Locations" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[11px] text-blue-300/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50/50 px-6 py-12">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Image
              src="/Nanjil.png"
              alt="Nanjil MEP Service"
              width={156}
              height={70}
              priority
              className="mx-auto h-14 w-auto object-contain"
            />
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to book services & manage your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full h-12 pl-11 pr-4 rounded-xl border bg-white text-sm placeholder:text-gray-400 outline-none transition-all
                    focus:ring-2 focus:ring-[#37B8D8]/20 focus:border-[#37B8D8]
                    ${errors.email ? "border-red-300" : "border-gray-200 hover:border-gray-300"}`}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#0E7892] hover:text-[#12355B]">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full h-12 pl-11 pr-12 rounded-xl border bg-white text-sm placeholder:text-gray-400 outline-none transition-all
                    focus:ring-2 focus:ring-[#37B8D8]/20 focus:border-[#37B8D8]
                    ${errors.password ? "border-red-300" : "border-gray-200 hover:border-gray-300"}`}
                  {...register("password")}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#F7941D] hover:bg-[#e8820f] text-white font-semibold text-sm rounded-xl
                transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20
                flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            New here?{" "}
            <Link href="/register" className="text-[#0E7892] hover:text-[#12355B] font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
