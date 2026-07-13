import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200/90 bg-white/90 px-2.5 py-2 shadow-[0_12px_30px_rgba(2,6,23,0.06)] transition hover:shadow-[0_14px_32px_rgba(16,185,129,0.16)] sm:gap-3 sm:px-3"
    >
      <Image
        src="/images/logo.jpg"
        alt="Nexus DevOps Logo"
        width={40}
        height={40}
        className="h-9 w-9 shrink-0 rounded-xl border border-emerald-500/20 object-contain sm:h-10 sm:w-10"
      />

      <div className="min-w-0 leading-tight">
        <h1 className="truncate text-sm font-bold tracking-wide text-slate-950 min-[360px]:text-base md:text-xl">
          Nexus DevOps
        </h1>
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-700 sm:text-xs sm:tracking-[0.24em]">
          Limited
        </p>
      </div>
    </Link>
  );
}
