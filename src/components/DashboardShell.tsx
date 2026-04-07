"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Menu, X, LogOut, Zap } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface Props {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
}

export function DashboardShell({ children, navItems, title }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-blue-400" />
          <span className="font-bold">{title}</span>
        </div>
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white
            transform transition-transform duration-200 lg:translate-x-0 lg:static
            ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-5 border-b border-gray-700 hidden lg:block">
            <div className="flex items-center gap-2">
              <Zap size={22} className="text-blue-400" />
              <span className="text-lg font-bold">Nanjil MEP</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>

          <nav className="mt-4 space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-0 right-0 px-3">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                text-gray-300 hover:bg-gray-800 w-full transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main */}
        <main className="flex-1 min-h-screen p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}