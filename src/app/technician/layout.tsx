"use client";

import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { RoleGuard } from "@/components/RoleGuard";
import { LayoutDashboard, Briefcase } from "lucide-react";

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/technician/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "My Jobs", href: "/technician/jobs", icon: <Briefcase size={18} /> },
];

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRole="TECHNICIAN">
      <DashboardShell navItems={NAV} title="Technician Panel">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
