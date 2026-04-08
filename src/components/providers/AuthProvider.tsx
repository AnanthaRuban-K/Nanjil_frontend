"use client";

import {
createContext,
useContext,
useState,
useEffect,
type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// ── Types ───────────────────────────────────────
export interface StoredUser {
id: string;
email: string;
role: string;
fullName: string;
}

// ── Local helpers (instead of "@/lib/auth") ─────
function getStoredUser(): StoredUser | null {
try {
const user = localStorage.getItem("user");
return user ? JSON.parse(user) : null;
} catch {
return null;
}
}

function clearAuth() {
localStorage.removeItem("user");
localStorage.removeItem("token");
}

// ── Context Shape ───────────────────────────────
interface AuthCtx {
user: StoredUser | null;
loading: boolean;
logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
user: null,
loading: true,
logout: () => {},
});

// ── Provider ────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
const [user, setUser] = useState<StoredUser | null>(null);
const [loading, setLoading] = useState(true);
const router = useRouter();

useEffect(() => {
const user = getStoredUser();
setUser(user);
setLoading(false);
}, []);

const logout = () => {
clearAuth();
setUser(null);
router.push("/login");
};

return (
<AuthContext.Provider value={{ user, loading, logout }}>
{children}
</AuthContext.Provider>
);
}

// ── Hook ───────────────────────────────────────
export const useAuth = () => useContext(AuthContext);
