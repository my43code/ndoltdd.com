"use client";

import Link from "next/link";
import { Search, MessageCircle } from "lucide-react";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <Link
        href="/search"
        className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-xl transition hover:border-slate-300 hover:bg-slate-100 hover:shadow-2xl sm:px-4 animate-fade-in-left"
      >
        <Search size={18} className="group-hover:animate-slow-rotate" />
        <span className="hidden md:inline font-medium">Search</span>
      </Link>

      <Link
        href="/yutok"
        className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-3 py-3 text-white shadow-xl transition hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-500/50 sm:px-4 animate-fade-in-right glow-pulse"
      >
        <MessageCircle size={18} className="group-hover:animate-bounce" />
        <span className="hidden md:inline font-medium">YuTok</span>
      </Link>
    </div>
  );
}
