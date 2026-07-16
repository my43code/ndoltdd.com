import Link from "next/link";
import BlogImage from "@/components/BlogImage";
import { connectMongoDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inspiring Stories, Fiction and Experiences",
  description: "Inspiring stories, fiction, and lived experiences from Papua New Guinea and beyond.",
};

async function getBlogs() {
  try {
    await connectMongoDB();
    return await Blog.find().sort({ createdAt: -1 }).lean();
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") console.error("Failed to load blog stories:", error);
    return [];
  }
}

function formatRelativeTime(value) {
  const date = new Date(value);
  const elapsed = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusClasses(status) {
  if (status === "Breaking") return "bg-red-600 text-white";
  if (status === "Developing") return "bg-amber-400 text-slate-950";
  return "bg-slate-900 text-white";
}

function StoryStatus({ story }) {
  if (!story.newsStatus || story.newsStatus === "Standard") return null;
  return (
    <span className={`inline-flex px-2.5 py-1 text-[.68rem] font-black uppercase tracking-[.18em] ${statusClasses(story.newsStatus)}`}>
      {story.newsStatus}
    </span>
  );
}

export default async function BlogPage() {
  const blogs = await getBlogs();
  const featured = blogs[0];
  const remaining = blogs.slice(1);

  return (
    <main className="brand-page min-h-screen">
      <section className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <div className="brand-accent-bar h-1.5 w-24" />
          <p className="brand-kicker mt-6 text-xs font-black uppercase tracking-[.3em]">Inspiring stories, fiction and experiences</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-black leading-none tracking-[-.045em] text-slate-950 sm:text-6xl md:text-7xl">
            Stories shaping today.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
            Timely reports, community happenings, analysis, and human stories—clearly presented with the context and images that matter.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 pt-5 text-sm font-bold text-slate-700">
            {['Inspiring stories', 'Fiction', 'Experiences', 'Features', 'Personal stories'].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        {featured ? (
          <>
            <p className="mb-4 text-sm font-black uppercase tracking-[.22em] text-slate-950">Top story</p>
            <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden border-t-[6px] border-emerald-500 bg-white shadow-[0_18px_50px_-35px_rgba(15,23,42,.45)] lg:grid-cols-[1.18fr_.82fr]">
              <div className="relative min-h-[300px] overflow-hidden sm:min-h-[440px]">
                <BlogImage
                  src={featured.sections?.[0]?.image}
                  alt={featured.sections?.[0]?.caption || featured.title}
                  priority
                  className="object-cover transition duration-700 group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
                <div className="flex flex-wrap items-center gap-3">
                  <StoryStatus story={featured} />
                  <span className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">{featured.category}</span>
                  <span className="text-xs font-semibold text-slate-500">{formatRelativeTime(featured.createdAt)}</span>
                </div>
                <h2 className="mt-5 text-3xl font-black leading-[1.06] tracking-[-.035em] text-slate-950 sm:text-5xl">{featured.title}</h2>
                <p className="mt-5 text-base leading-8 text-slate-600">{featured.excerpt}</p>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5 text-sm">
                  <span className="text-slate-500">{featured.location || featured.author}</span>
                  <span className="font-black text-emerald-700">Read full story →</span>
                </div>
              </div>
            </Link>

            <div className="mt-14 flex items-end justify-between gap-4 border-b-4 border-slate-950 pb-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-emerald-700">Story desk</p>
                <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Latest</h2>
              </div>
              <span className="text-sm font-semibold text-slate-500">Most recent first</span>
            </div>

            {remaining.length ? (
              <div className="grid gap-px bg-slate-300 md:grid-cols-2 lg:grid-cols-3">
                {remaining.map((story) => (
                  <Link key={story._id.toString()} href={`/blog/${story.slug}`} className="group bg-white p-5 transition hover:bg-slate-50">
                    <div className="relative h-52 overflow-hidden bg-slate-200">
                      <BlogImage src={story.sections?.[0]?.image} alt={story.title} className="object-cover transition duration-700 group-hover:scale-[1.025]" />
                    </div>
                    <div className="pt-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <StoryStatus story={story} />
                        <p className="text-xs font-black uppercase tracking-[.18em] text-emerald-700">{story.category}</p>
                      </div>
                      <h3 className="mt-3 text-2xl font-black leading-tight tracking-tight text-slate-950">{story.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{story.excerpt}</p>
                      <div className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500">
                        <span>{formatRelativeTime(story.createdAt)}</span>
                        {story.location ? <><span>•</span><span>{story.location}</span></> : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border-b border-slate-300 bg-white p-8 text-slate-600">More reports will appear here as they are published.</div>
            )}
          </>
        ) : (
          <div className="border-t-[6px] border-emerald-500 bg-white px-6 py-20 text-center shadow-sm">
            <p className="text-xs font-black uppercase tracking-[.3em] text-emerald-700">Story desk</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Inspiring stories, fiction, and experiences will appear here.</h2>
            <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-600">Publish a report from the admin dashboard with a headline, lead summary, location, event time, and supporting photographs.</p>
          </div>
        )}
      </section>
    </main>
  );
}
