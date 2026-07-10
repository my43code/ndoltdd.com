export default function Loading() {
  return (
    <div className="site-shell flex min-h-[70vh] items-center justify-center px-2 py-16 sm:px-0">
      <div className="section-card w-full max-w-5xl overflow-hidden p-6 sm:p-8 md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex-1 space-y-4">
            <div className="h-3 w-24 rounded-full bg-slate-200 loading-skeleton" />
            <div className="h-8 w-3/4 rounded-full bg-slate-200 loading-skeleton" />
            <div className="h-4 w-full rounded-full bg-slate-100 loading-skeleton" />
            <div className="h-4 w-5/6 rounded-full bg-slate-100 loading-skeleton" />
            <div className="h-4 w-2/3 rounded-full bg-slate-100 loading-skeleton" />
            <div className="mt-6 flex gap-3">
              <div className="h-11 w-32 rounded-full bg-emerald-100 loading-skeleton" />
              <div className="h-11 w-32 rounded-full border border-slate-200 bg-white loading-skeleton" />
            </div>
          </div>

          <div className="flex-1 space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <div className="h-5 w-32 rounded-full bg-slate-200 loading-skeleton" />
            <div className="h-24 rounded-[1.25rem] bg-slate-200 loading-skeleton" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-20 rounded-[1.15rem] bg-white loading-skeleton" />
              <div className="h-20 rounded-[1.15rem] bg-white loading-skeleton" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
