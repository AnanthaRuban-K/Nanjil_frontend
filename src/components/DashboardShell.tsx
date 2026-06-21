"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Menu, X, LogOut } from "lucide-react";

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
    <div className="min-h-screen bg-[#F4F8FB]">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between border-b border-[#D7E4EE] bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/Nanjil.png"
            alt="Nanjil MEP Service"
            width={122}
            height={54}
            priority
            className="h-10 w-auto object-contain"
          />
          <span className="hidden text-sm font-semibold text-[#12355B] sm:inline">
            {title}
          </span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-[#D7E4EE] p-2 text-[#12355B]"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0F2F57] text-white shadow-2xl shadow-[#0F2F57]/20
            transform transition-transform duration-200 lg:translate-x-0 lg:static
            ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center justify-between gap-3">
              <Image
                src="/Nanjil.png"
                alt="Nanjil MEP Service"
                width={158}
                height={70}
                priority
                className="h-12 w-auto rounded-md bg-white object-contain px-2 py-1"
              />
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-4 truncate text-sm font-semibold text-white">
              {user?.fullName}
            </p>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-[#37B8D8]">
              {user?.role}
            </p>
          </div>

          <nav className="mt-4 space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${
                    pathname === item.href
                      ? "bg-[#F7941D] text-white shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
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
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm
                text-white/75 transition-colors hover:bg-white/10 hover:text-white"
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
        <main className="min-h-screen flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
