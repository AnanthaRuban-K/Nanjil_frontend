"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoleRedirect, useAuth } from "@/lib/auth";

export function RoleGuard({
  allowedRole,
  children,
}: {
  allowedRole: string;
  children: ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== allowedRole) {
      router.replace(getRoleRedirect(user.role));
    }
  }, [allowedRole, isLoading, router, user]);

  if (isLoading || !user || user.role !== allowedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
