import axios from "axios";

// Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: { page: number; limit: number; total: number };
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerContact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  customerId: string;
  technicianId: string | null;
  serviceType: string;
  issueDescription: string;
  serviceAddress: string;
  preferredDate: string;
  scheduledDate: string | null;
  status: string;
  paymentStatus: string;
  serviceAmount: string | null;
  submittedUpiReference: string | null;
  paymentSubmittedAt: string | null;
  paymentRejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: CustomerContact | null;
}

export type Technician = AuthUser;

export interface Payment {
  id: string;
  bookingId: string;
  invoiceNumber: string;
  amount: string;
  paymentMode: string;
  upiReference: string | null;
  recordedBy: string;
  paymentDate: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalBookings: number;
  pending: number;
  confirmed: number;
  inProgress: number;
  completedToday: number;
  unpaidCompleted: number;
  totalRevenueCollected: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  cashTotal: number;
  upiTotal: number;
  totalPaidBookings: number;
}

export interface BookingAnalytics {
  byStatus: Record<string, number>;
  byTechnician: Array<{
    technicianName: string;
    completedJobs: number;
  }>;
}

// Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const encodedName = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split("; ")
    .find((part) => part.startsWith(encodedName));

  return cookie ? decodeURIComponent(cookie.slice(encodedName.length)) : null;
}

api.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase();
  if (method && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken = getCookie("csrf_token");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !error.config?.url?.includes("/auth/me")
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
