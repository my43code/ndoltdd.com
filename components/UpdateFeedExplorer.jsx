"use client";

import { useMemo, useState } from "react";
import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";
import PostCard from "@/components/PostCard";

export default function UpdateFeedExplorer({ posts = [] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("list");

  const visiblePosts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...posts]
      .filter((post) => !term || `${post.title} ${post.summary} ${post.content}`.toLowerCase().includes(term))
      .sort((a, b) => {
        const difference = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return sort === "newest" ? difference : -difference;
      });
  }, [posts, query, sort]);

  return (
    <section aria-labelledby="update-feed-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">Live feed</p>
          <h2 id="update-feed-title" className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Explore updates
          </h2>
        </div>
        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
          {visiblePosts.length} {visiblePosts.length === 1 ? "story" : "stories"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search updates</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search updates..."
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
          <SlidersHorizontal size={16} aria-hidden="true" />
          <span className="sr-only">Sort updates</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent outline-none">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>

        <div className="flex rounded-xl border border-slate-200 bg-white p-1" aria-label="Update layout">
          <button type="button" onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} className={`grid min-h-9 min-w-9 place-items-center rounded-lg transition ${view === "list" ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
            <List size={17} />
          </button>
          <button type="button" onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"} className={`grid min-h-9 min-w-9 place-items-center rounded-lg transition ${view === "grid" ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
            <Grid2X2 size={16} />
          </button>
        </div>
      </div>

      {visiblePosts.length ? (
        <ul className={`mt-5 ${view === "grid" ? "grid gap-5 sm:grid-cols-2" : "space-y-4"}`} aria-live="polite">
          {visiblePosts.map((post) => (
            <li key={post.id}>
              <PostCard post={{ ...post, _id: post.id }} variant={view === "grid" ? "grid" : "list"} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="font-bold text-slate-900">No updates match that search.</p>
          <button type="button" onClick={() => setQuery("")} className="mt-2 text-sm font-semibold text-emerald-700 hover:underline">Clear search</button>
        </div>
      )}
    </section>
  );
}
