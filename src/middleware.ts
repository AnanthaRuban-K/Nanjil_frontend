import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
const AUTH_REDIRECT_PATHS = ["/login", "/register", "/forgot-password"];

function getApiOrigin(): string | null {
  try {
    return process.env.NEXT_PUBLIC_API_URL
      ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
      : null;
  } catch {
    return null;
  }
}

function createCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== "production";
  const apiOrigin = getApiOrigin();
  const connectSources = isDev
    ? "'self' http: https: ws: wss:"
    : ["'self'", apiOrigin].filter(Boolean).join(" ");

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src ${connectSources}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

function applyCsp(response: NextResponse, csp: string): NextResponse {
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

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
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = createCsp(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  if (PUBLIC_PATHS.includes(pathname)) {
    if (hasSession && AUTH_REDIRECT_PATHS.includes(pathname)) {
      return applyCsp(
        NextResponse.redirect(
          new URL(getRoleRedirect(getRoleFromToken(token)), request.url)
        ),
        csp
      );
    }
    return applyCsp(
      NextResponse.next({ request: { headers: requestHeaders } }),
      csp
    );
  }

  if (!hasSession) {
    return applyCsp(
      NextResponse.redirect(new URL("/login", request.url)),
      csp
    );
  }

  return applyCsp(
    NextResponse.next({ request: { headers: requestHeaders } }),
    csp
  );
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
