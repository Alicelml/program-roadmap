"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "@/components/ui/Icons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/industry", label: "Industry" },
  { href: "/alumni", label: "Alumni" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* Brand accent bar */}
      <div className="h-0.5 bg-brand" />

      <nav className="container-page h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <Image
            src="/au-logo-dark-blue-horizontal.svg"
            alt="Adelaide University"
            width={160}
            height={38}
            priority
            className="h-9 w-auto"
          />
          <span className="hidden sm:block text-navy font-semibold text-sm border-l border-gray-200 pl-3">
            Program Roadmap
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-1.5 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-brand"
                  : "text-gray-600 hover:text-navy"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-brand bg-brand-50"
                  : "text-gray-700 hover:text-navy hover:bg-gray-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
