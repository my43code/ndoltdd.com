"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Grid2X2, List, Search } from "lucide-react";
import BlogImage from "@/components/BlogImage";
import LiveRelativeTime from "@/components/LiveRelativeTime";

function StoryStatus({ status }) {
  if (!status || status === "Standard") return null;
  const classes = status === "Breaking" ? "bg-red-600 text-white" : "bg-amber-300 text-slate-950";
  return <span className={`rounded-full px-2.5 py-1 text-[.65rem] font-black uppercase tracking-[.16em] ${classes}`}>{status}</span>;
}

export default function BlogExplorer({ stories = [] }) {
  const categories = ["All", ...new Set(stories.map((story) => story.category).filter(Boolean))];
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");

  const visibleStories = useMemo(() => {
    const term = query.trim().toLowerCase();
    return stories.filter((story) => {
      const matchesCategory = category === "All" || story.category === category;
      const matchesQuery = !term || `${story.title} ${story.excerpt} ${story.author} ${story.location}`.toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });
  }, [stories, category, query]);

  return (
    <section aria-labelledby="latest-stories-title">
      <div className="flex flex-col gap-5 border-b-4 border-slate-950 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[.24em] text-emerald-700">Story desk</p>
          <h2 id="latest-stories-title" className="mt-1 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Find your next story</h2>
        </div>
        <div className="flex w-full max-w-xl items-center gap-3">
          <label className="flex min-h-11 flex-1 items-center gap-3 rounded-full border border-slate-300 bg-white px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
            <Search size={17} className="text-slate-400" aria-hidden="true" />
            <span className="sr-only">Search stories</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
          <div className="flex rounded-full border border-slate-300 bg-white p-1">
            <button type="button" onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"} className={`grid h-9 w-9 place-items-center rounded-full ${view === "grid" ? "bg-slate-950 text-white" : "text-slate-500"}`}><Grid2X2 size={16} /></button>
            <button type="button" onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} className={`grid h-9 w-9 place-items-center rounded-full ${view === "list" ? "bg-slate-950 text-white" : "text-slate-500"}`}><List size={17} /></button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Filter stories by category">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${category === item ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"}`}>
            {item}
          </button>
        ))}
      </div>

      {visibleStories.length ? (
        <div className={`mt-6 ${view === "grid" ? "grid gap-5 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}`} aria-live="polite">
          {visibleStories.map((story) => (
            <Link key={story.id} href={`/blog/${story.slug}`} className={`group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_45px_-30px_rgba(15,23,42,.4)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_24px_55px_-28px_rgba(5,150,105,.35)] ${view === "list" ? "grid sm:grid-cols-[15rem_1fr]" : "flex flex-col"}`}>
              <div className={`relative overflow-hidden bg-slate-200 ${view === "list" ? "min-h-52" : "h-52"}`}>
                <BlogImage src={story.image} alt={story.title} className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <StoryStatus status={story.newsStatus} />
                  <span className="text-[.68rem] font-black uppercase tracking-[.18em] text-emerald-700">{story.category}</span>
                </div>
                <h3 className="mt-3 text-2xl font-black leading-tight tracking-tight text-slate-950 transition group-hover:text-emerald-700">{story.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{story.excerpt}</p>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-500">
                  <span><LiveRelativeTime value={story.createdAt} />{story.location ? ` · ${story.location}` : ""}</span>
                  <ArrowUpRight size={17} className="shrink-0 text-emerald-700 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="font-bold text-slate-950">No stories found.</p>
          <button type="button" onClick={() => { setCategory("All"); setQuery(""); }} className="mt-2 text-sm font-bold text-emerald-700 hover:underline">Reset filters</button>
        </div>
      )}
    </section>
  );
}
