import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
const AUTH_REDIRECT_PATHS = ["/login", "/register", "/forgot-password"];

function getRoleRedirect(role: string | null): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "TECHNICIAN":
      return "/technician/dashboard";
    default:
      return "/dashboard";
  }
}

function getRoleFromToken(token?: string): string | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized)) as { role?: unknown };
    return typeof decoded.role === "string" ? decoded.role : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const hasSession = Boolean(token);

  if (PUBLIC_PATHS.includes(pathname)) {
    if (hasSession && AUTH_REDIRECT_PATHS.includes(pathname)) {
      return NextResponse.redirect(
        new URL(getRoleRedirect(getRoleFromToken(token)), request.url)
      );
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/dashboard/:path*",
    "/bookings/:path*",
    "/admin/:path*",
    "/technician/:path*",
  ],
};
