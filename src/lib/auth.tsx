"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, type AuthUser } from "./api";

// ── Token helpers ──────────────────────────────────
interface TokenPayload {
  sub: string;
  role: string;
  email: string;
  is_active: boolean;
  exp: number;
}

function decodeToken(token: string): TokenPayload | null {
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function setTokenCookie(token: string) {
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
}

function clearTokenCookie() {
  document.cookie =
    "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// ── Context shape ──────────────────────────────────
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getRoleRedirect(role: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "TECHNICIAN":
      return "/technician/dashboard";
    default:
      return "/dashboard";
  }
}

// ── Provider ───────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const decoded = decodeToken(storedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        clearTokenCookie();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<string> => {
      const res = await api.post("/auth/login", { email, password });
      const { token: t, user: u } = res.data.data;

      setToken(t);
      setUser(u);
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
      setTokenCookie(t);

      return u.role;
    },
    []
  );

  const register = useCallback(
    async (data: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    }) => {
      const res = await api.post("/auth/register", data);
      const { token: t, user: u } = res.data.data;

      setToken(t);
      setUser(u);
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
      setTokenCookie(t);
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearTokenCookie();
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}