import Link from "next/link";
import BlogImage from "@/components/BlogImage";
import BlogExplorer from "@/components/BlogExplorer";
import LiveRelativeTime from "@/components/LiveRelativeTime";
import { connectMongoDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const revalidate = 300;

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

function StoryStatus({ status }) {
  if (!status || status === "Standard") return null;
  const classes = status === "Breaking" ? "bg-red-600 text-white" : "bg-amber-300 text-slate-950";
  return <span className={`rounded-full px-3 py-1 text-[.68rem] font-black uppercase tracking-[.18em] ${classes}`}>{status}</span>;
}

export default async function BlogPage() {
  const blogs = await getBlogs();
  const featured = blogs[0];
  const remaining = blogs.slice(1);
  const explorerStories = remaining.map((story) => ({
    id: String(story._id),
    slug: story.slug,
    title: story.title,
    excerpt: story.excerpt,
    category: story.category,
    author: story.author || "Nexus DevOps",
    location: story.location || "",
    newsStatus: story.newsStatus || "Standard",
    image: story.sections?.[0]?.image || "/images/project1.webp",
    createdAt: new Date(story.createdAt).toISOString(),
  }));

  return (
    <main className="brand-page min-h-screen">
      <section className="relative overflow-hidden border-b border-emerald-950 bg-slate-950 text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-96 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
          <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300" />
          <p className="mt-6 text-xs font-black uppercase tracking-[.3em] text-emerald-300">Inspiring stories, fiction and experiences</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black leading-none tracking-[-.045em] text-white sm:text-6xl md:text-7xl">
            Stories with a pulse.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
            Timely reports, community happenings, fiction, and human experiences—presented with the context and images that matter.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm font-bold text-slate-300">
            {["Inspiring stories", "Fiction", "Experiences", "Features", "Personal stories"].map((label) => (
              <span key={label} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{label}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        {featured ? (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-black uppercase tracking-[.22em] text-slate-950">Top story</p>
              <span className="text-xs font-bold uppercase tracking-[.18em] text-slate-500">Editor&apos;s pick</span>
            </div>
            <article className="group grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_70px_-35px_rgba(15,23,42,.45)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_rgba(5,150,105,.3)] lg:grid-cols-[1.18fr_.82fr]">
              <div className="relative min-h-[300px] overflow-hidden sm:min-h-[440px]">
                <BlogImage src={featured.sections?.[0]?.image} alt={featured.sections?.[0]?.caption || featured.title} priority className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/10" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
                <div className="flex flex-wrap items-center gap-3">
                  <StoryStatus status={featured.newsStatus} />
                  <span className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">{featured.category}</span>
                  <span className="text-xs font-semibold text-slate-500"><LiveRelativeTime value={featured.createdAt} /></span>
                </div>
                <h2 className="mt-5 text-3xl font-black leading-[1.06] tracking-[-.035em] text-slate-950 sm:text-5xl">{featured.title}</h2>
                <p className="mt-5 text-base leading-8 text-slate-600">{featured.excerpt}</p>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5 text-sm">
                  <span className="text-slate-500">{featured.location || featured.author}</span>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full bg-emerald-600 px-5 py-2.5 font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    aria-label={`Read full story: ${featured.title}`}
                  >
                    Read full story →
                  </Link>
                </div>
              </div>
            </article>

            <div className="mt-16">
              <BlogExplorer stories={explorerStories} />
            </div>
          </>
        ) : (
          <div className="rounded-[2rem] border border-slate-200 border-t-[6px] border-t-emerald-500 bg-white px-6 py-20 text-center shadow-sm">
            <p className="text-xs font-black uppercase tracking-[.3em] text-emerald-700">Story desk</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">Inspiring stories, fiction, and experiences will appear here.</h2>
            <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-600">Publish a story from the admin dashboard and it will flow into this editorial experience automatically.</p>
          </div>
        )}
      </section>
    </main>
  );
}
