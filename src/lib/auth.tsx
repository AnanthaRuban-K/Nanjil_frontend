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

// Token helpers
interface TokenPayload {
  sub: string;
  role: string;
  email: string;
  is_active: boolean;
  exp: number;
}

// Context shape
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
  logout: () => Promise<void>;
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

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<string> => {
      const res = await api.post("/auth/login", { email, password });
      const { user: u } = res.data.data;

      setToken(null);
      setUser(u);

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
      const { user: u } = res.data.data;

      setToken(null);
      setUser(u);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", undefined, { timeout: 2500 });
    } catch {
      // Local logout should still work if the API is offline or the request is interrupted.
    }

    setToken(null);
    setUser(null);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
