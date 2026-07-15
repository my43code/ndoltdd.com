"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const DEFAULT_IMAGE = "/images/logo.jpg";

export default function AuthorProfile({
  name = "Nexus DevOps",
  role = "Editorial team",
  image = DEFAULT_IMAGE,
  bio = "Sharing practical insights, stories, and updates from Nexus DevOps Limited.",
  theme = "light",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const imageSrc = image || DEFAULT_IMAGE;
  const isDataUrl = imageSrc.startsWith("data:");
  const isDark = theme === "dark";

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group/author inline-flex items-center gap-3 rounded-2xl p-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
          isDark ? "hover:bg-white/10" : "hover:bg-emerald-50"
        }`}
        aria-label={`View ${name}'s profile`}
      >
        <span className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 ${isDark ? "border-emerald-300/50" : "border-emerald-200"}`}>
          <Image
            src={imageSrc}
            alt={`${name} profile`}
            fill
            unoptimized={isDataUrl}
            sizes="48px"
            className="object-cover transition-transform duration-300 group-hover/author:scale-105"
          />
        </span>
        <span className="min-w-0">
          <span className={`block text-sm font-bold ${isDark ? "text-white" : "text-slate-950"}`}>{name}</span>
          <span className={`mt-0.5 block text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{role}</span>
          <span className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
            View profile
          </span>
        </span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-[0_30px_90px_rgba(2,6,23,0.4)]"
          >
            <div className="brand-hero h-28" />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/35 text-white backdrop-blur transition hover:bg-slate-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close author profile"
            >
              <X size={19} />
            </button>

            <div className="px-6 pb-7 sm:px-8 sm:pb-8">
              <div className="relative -mt-12 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
                <Image
                  src={imageSrc}
                  alt={`${name} profile`}
                  fill
                  unoptimized={isDataUrl}
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">Author profile</p>
              <h2 id={titleId} className="mt-2 text-2xl font-black tracking-tight text-slate-950">{name}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">{role}</p>
              <p id={descriptionId} className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">{bio}</p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
