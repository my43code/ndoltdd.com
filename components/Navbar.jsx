"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Updates", href: "/updates" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
  { name: "Login", href: "/login" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-[0_10px_35px_rgba(2,6,23,0.06)] animate-fade-in-down">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-400/0 via-emerald-500 to-emerald-400/0" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="animate-fade-in">
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/90 px-2 py-2 font-semibold lg:flex">
          {navLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              className={`group relative rounded-full px-4 py-2 text-sm transition duration-300 hover:bg-white hover:text-slate-950 animate-fade-in-down ${isActive(link.href) ? "brand-dark-surface text-white shadow-lg" : "text-slate-600"}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {link.name}
              <span className={`absolute inset-x-3 bottom-2 h-[2px] w-[calc(100%-1.5rem)] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-transform duration-300 group-hover:scale-x-100 ${isActive(link.href) ? "scale-x-100" : "scale-x-0"}`}></span>
            </Link>
          ))}
        </nav>

        <button
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={20} className="animate-rotate-in" /> : <Menu size={20} className="animate-fade-in" />}
        </button>
      </div>

      {isOpen ? (
        <div className="max-h-[calc(100dvh-4.75rem)] overflow-y-auto border-t border-slate-200 bg-white/95 lg:hidden animate-slide-in-down">
          <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                className={`rounded-2xl px-4 py-3 text-base font-medium transition hover:bg-emerald-50 hover:text-emerald-700 animate-slide-in-left ${isActive(link.href) ? "brand-dark-surface text-white" : "text-slate-700"}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
