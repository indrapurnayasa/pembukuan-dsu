"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  Home,
  Menu,
  X,
  Truck,
  Wallet,
  Banknote,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/dashboard", label: "Grafik", icon: BarChart3 },
  { href: "/kas", label: "Kas", icon: Wallet },
  { href: "/penjualan", label: "Penjualan", icon: Truck },
  { href: "/pencairan", label: "Pencairan", icon: Banknote },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="size-4 text-primary-foreground" />
          </div>
          Pembukuan DSU
        </Link>

        {/* desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* mobile toggle */}
        <button
          className="sm:hidden inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="sm:hidden border-t bg-card">
          <div className="container mx-auto max-w-6xl px-4 py-2 flex flex-col gap-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}