"use client";

import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { LayoutDashboard, BookOpen, BarChart3 } from "lucide-react";

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Bookings", href: "/admin/bookings", icon: <BookOpen size={18} /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 size={18} /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell navItems={NAV} title="Admin Panel">
      {children}
    </DashboardShell>
  );
}