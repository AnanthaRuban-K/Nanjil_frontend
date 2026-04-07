"use client";

import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { LayoutDashboard, BookOpen, PlusCircle } from "lucide-react";

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "My Bookings", href: "/bookings", icon: <BookOpen size={18} /> },
  { label: "New Booking", href: "/bookings/new", icon: <PlusCircle size={18} /> },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell navItems={NAV} title="Customer Panel">
      {children}
    </DashboardShell>
  );
}