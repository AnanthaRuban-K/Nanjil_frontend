import { NextRequest, NextResponse } from "next/server";

// Decode JWT payload (no verification — routing only)
function getRoleFromToken(token: string): string | null {
  try {
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));
    if (payload.exp * 1000 < Date.now()) return null;
    return payload.role;
  } catch {
    return null;
  }
}

function roleRedirect(role: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "TECHNICIAN":
      return "/technician/dashboard";
    default:
      return "/dashboard";
  }
}

const PUBLIC_PATHS = ["/", "/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = token ? getRoleFromToken(token) : null;

  // ── Public routes ────────────────────────────────
  if (PUBLIC_PATHS.includes(pathname)) {
    // Already logged in → send to dashboard
    if (role) {
      return NextResponse.redirect(
        new URL(roleRedirect(role), request.url)
      );
    }
    return NextResponse.next();
  }

  // ── No token → login ────────────────────────────
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Role-path checks ────────────────────────────
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(
      new URL(roleRedirect(role), request.url)
    );
  }

  if (pathname.startsWith("/technician") && role !== "TECHNICIAN") {
    return NextResponse.redirect(
      new URL(roleRedirect(role), request.url)
    );
  }

  // Customer paths (/dashboard, /bookings)
  if (
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/bookings")) &&
    role !== "CUSTOMER"
  ) {
    return NextResponse.redirect(
      new URL(roleRedirect(role), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/bookings/:path*",
    "/admin/:path*",
    "/technician/:path*",
  ],
};