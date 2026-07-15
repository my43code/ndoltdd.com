"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

export default function FreshMediaSlider({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const activeItem = items[activeIndex];

  useEffect(() => {
    if (items.length < 2 || videoIsPlaying || activeItem?.video) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [activeItem?.video, items.length, videoIsPlaying]);

  if (!items.length) return null;

  const showPrevious = () => {
    setVideoIsPlaying(false);
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };
  const showNext = () => {
    setVideoIsPlaying(false);
    setActiveIndex((current) => (current + 1) % items.length);
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-3 shadow-[0_30px_80px_-35px_rgba(2,6,23,0.65)] sm:p-4">
      <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] bg-slate-900 sm:min-h-[480px] lg:min-h-[560px]">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={item.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition duration-700 ${isActive ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
            >
              {item.video ? (
                <video
                  key={`${item.id}-${isActive}`}
                  controls
                  playsInline
                  preload="metadata"
                  poster={item.image || undefined}
                  className="h-full w-full object-cover"
                  onPlay={() => setVideoIsPlaying(true)}
                  onPause={() => setVideoIsPlaying(false)}
                  onEnded={() => {
                    setVideoIsPlaying(false);
                    if (items.length > 1) showNext();
                  }}
                  aria-label={`${item.title} video`}
                >
                  <source src={item.video} />
                  Your browser does not support the video element.
                </video>
              ) : (
                <Image
                  src={item.image || "/images/project1.webp"}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  unoptimized={item.image?.startsWith("data:")}
                  className="object-cover"
                />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-200 backdrop-blur">
                    {item.source}
                  </span>
                  {item.video ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      <Play size={12} fill="currentColor" /> Video
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 max-w-3xl text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">{item.title}</h3>
                {item.subtitle ? <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">{item.subtitle}</p> : null}
                <Link
                  href={item.href}
                  tabIndex={isActive ? 0 : -1}
                  className="pointer-events-auto mt-5 inline-flex items-center gap-2 border-b border-emerald-300 pb-1 text-sm font-bold text-emerald-200 transition hover:text-white"
                >
                  Open {item.source.toLowerCase()} <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 px-1 pb-1 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={showPrevious} disabled={items.length < 2} aria-label="Show previous media" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-white transition hover:border-emerald-400 hover:bg-emerald-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">
            <ArrowLeft size={17} />
          </button>
          <button type="button" onClick={showNext} disabled={items.length < 2} aria-label="Show next media" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-white transition hover:border-emerald-400 hover:bg-emerald-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Choose media slide">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setVideoIsPlaying(false);
                setActiveIndex(index);
              }}
              aria-label={`Show ${item.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-9 bg-emerald-400" : "w-2.5 bg-slate-600 hover:bg-slate-400"}`}
            />
          ))}
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {activeIndex + 1} / {items.length}
        </p>
      </div>
    </div>
  );
}
