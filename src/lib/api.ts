import axios from "axios";

// ── Types ──────────────────────────────────────────
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
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
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

// ── Axios instance ─────────────────────────────────
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);