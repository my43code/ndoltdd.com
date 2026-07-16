export default function BlogStoryLoading() {
  return (
    <main className="brand-page min-h-screen" aria-busy="true" aria-label="Loading full story">
      <div className="border-b border-slate-200 bg-white/90 px-4 py-4 sm:px-6">
        <div className="mx-auto h-5 max-w-6xl rounded-full bg-slate-200 animate-pulse" />
      </div>
      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="h-1.5 w-20 rounded-full bg-emerald-300 animate-pulse" />
        <div className="mt-6 h-4 w-36 rounded-full bg-emerald-100 animate-pulse" />
        <div className="mt-5 h-12 max-w-4xl rounded-2xl bg-slate-200 animate-pulse sm:h-16" />
        <div className="mt-4 h-12 max-w-3xl rounded-2xl bg-slate-200 animate-pulse" />
        <div className="mt-8 h-20 rounded-2xl bg-white shadow-sm animate-pulse" />
        <div className="mt-10 aspect-[16/9] rounded-[2rem] bg-slate-200 animate-pulse" />
        <p className="mt-6 text-sm font-bold text-emerald-700">Opening full story…</p>
      </article>
    </main>
  );
}
