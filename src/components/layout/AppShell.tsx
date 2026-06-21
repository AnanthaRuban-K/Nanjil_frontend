"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth";


export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function Sidebar({
  items,
  open,
  onClose,
}: {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0F2F57] text-white shadow-2xl shadow-[#0F2F57]/20
          transform transition-transform duration-200
          lg:relative lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <Image
            src="/Nanjil.png"
            alt="Nanjil MEP Service"
            width={158}
            height={70}
            priority
            className="h-12 w-auto rounded-md bg-white object-contain px-2 py-1"
          />
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
                  ${
                    active
                      ? "bg-[#F7941D] text-white shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#D7E4EE] bg-white px-4 shadow-sm lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg border border-[#D7E4EE] p-2 text-[#12355B] hover:bg-[#F4F8FB] lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Image
        src="/Nanjil.png"
        alt="Nanjil MEP Service"
        width={120}
        height={54}
        className="h-9 w-auto object-contain lg:hidden"
      />

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">
            <span className="hidden sm:inline">{user.fullName}</span>
            <span className="ml-1 text-xs text-[#37B8D8]">({user.role})</span>
          </span>
        )}
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5
            text-sm font-medium text-[#12355B] hover:bg-[#F4F8FB]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}

export default function AppShell({
  children,
  navItems,
}: {
  children: React.ReactNode;
  navItems: NavItem[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    
      <div className="flex h-screen overflow-hidden bg-[#F4F8FB]">
        <Sidebar
          items={navItems}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
  
  );
}
