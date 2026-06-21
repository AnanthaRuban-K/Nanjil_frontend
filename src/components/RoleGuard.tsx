"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandedLoading } from "@/components/BrandedLoading";
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
    return <BrandedLoading message="Checking your session" />;
  }

  return <>{children}</>;
}
