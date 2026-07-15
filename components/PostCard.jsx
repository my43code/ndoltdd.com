import Image from "next/image";
import Link from "next/link";
import LiveRelativeTime from "@/components/LiveRelativeTime";

export default function PostCard({ post, variant = "grid" }) {
  const readingTime = Math.max(
    1,
    Math.ceil(((post?.content || post?.summary || "").length || 240) / 900)
  );
  const href = post.href || `/updates/${post.slug || post._id}`;

  if (variant === "list") {
    return (
      <Link
        href={href}
        className="group block rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        aria-label={`Read full story: ${post.title}`}
      >
        <article className="flex min-w-0 gap-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_14px_35px_-24px_rgba(15,23,42,0.45)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-emerald-300 group-hover:shadow-[0_20px_45px_-24px_rgba(5,150,105,0.35)] sm:gap-5 sm:p-4">
          <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[1.1rem] bg-slate-900 sm:h-32 sm:w-32">
            <Image
              src={post.image || "/images/project1.webp"}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              placeholder="blur"
              blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect fill='%231e293b' width='128' height='128'/%3E%3C/svg%3E"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col py-1">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 sm:text-[11px]">
              <LiveRelativeTime value={post.createdAt} />
              <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
              <span>{readingTime} min read</span>
            </div>
            <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-emerald-700 sm:text-lg">
              {post.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
              {post.summary || "A fresh update from our team."}
            </p>
            <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-700">
              Read story
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group block h-full cursor-pointer"
      aria-label={`Read full story: ${post.title}`}
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_22px_60px_rgba(15,23,42,0.14)] card-hover animate-fade-in-up hover:border-emerald-300/50">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-900 transition-transform duration-700 will-change-transform group-hover:scale-[1.01] image-shadow">
          <Image
            src={post.image || "/images/project1.webp"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="dynamic-image object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
            priority={false}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3C/svg%3E"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent group-hover:from-slate-950/95 transition duration-500" />

          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 animate-fade-in-up">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur animate-bounce-in">
              Update
            </span>

            <div className="text-right text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 animate-slide-in-right">
              <p><LiveRelativeTime value={post.createdAt} /></p>
              <p>{readingTime} min read</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-bold tracking-tight text-slate-950 md:text-2xl animate-fade-in-up">
            {post.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {post.summary}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <span className="text-sm font-semibold text-emerald-700 group-hover:translate-x-1 transition link-hover">
              Read story
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
              Editorial
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
