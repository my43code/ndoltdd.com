import Link from "next/link";
import { notFound } from "next/navigation";
import BlogImage from "@/components/BlogImage";
import { connectMongoDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import styles from "./story.module.css";
import AuthorProfile from "@/components/AuthorProfile";

export const dynamic = "force-dynamic";

const NEWS_CATEGORIES = new Set(["Current event", "Community happening"]);

async function getBlog(slug) {
  try {
    await connectMongoDB();
    return await Blog.findOne({ slug }).lean();
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") console.error("Failed to load blog story:", error);
    return null;
  }
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Pacific/Port_Moresby",
    timeZoneName: "short",
  });
}

function sectionLabel(story, index) {
  const isNews = NEWS_CATEGORIES.has(story.category);
  if (isNews) {
    if (index === 0) return "What happened";
    if (index === story.sections.length - 1) return "What we know";
    return "Latest details";
  }
  if (index === 0) return "The beginning";
  if (index === story.sections.length - 1) return "The reflection";
  return "The journey";
}

function statusClasses(status) {
  if (status === "Breaking") return "bg-red-600 text-white";
  if (status === "Developing") return "bg-amber-400 text-slate-950";
  return "bg-slate-900 text-white";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = await getBlog(slug);
  if (!story) return { title: "Story not found | Blog" };

  const image = story.sections?.[0]?.image;
  const shareableImage = image && !image.startsWith("data:") ? image : null;

  return {
    title: story.title,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: "article",
      publishedTime: new Date(story.createdAt).toISOString(),
      modifiedTime: new Date(story.updatedAt).toISOString(),
      images: shareableImage ? [{ url: shareableImage, alt: story.sections?.[0]?.caption || story.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.excerpt,
      images: shareableImage ? [shareableImage] : undefined,
    },
  };
}

export default async function BlogStoryPage({ params }) {
  const { slug } = await params;
  const story = await getBlog(slug);
  if (!story) notFound();

  const isNews = NEWS_CATEGORIES.has(story.category);
  const leadSection = story.sections[0];
  const wasUpdated = new Date(story.updatedAt).getTime() - new Date(story.createdAt).getTime() > 60000;

  return (
    <main className="brand-page min-h-screen">
      <div className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/blog" className="text-sm font-black text-slate-950 transition hover:text-emerald-700">← Inspiring stories, fiction and experiences</Link>
          <span className="text-xs font-bold uppercase tracking-[.2em] text-slate-500">Nexus Stories</span>
        </div>
      </div>

      <article>
        <header className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 md:pb-10 md:pt-14">
          <div className="brand-accent-bar h-1.5 w-20" />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {story.newsStatus && story.newsStatus !== "Standard" ? (
              <span className={`px-3 py-1 text-xs font-black uppercase tracking-[.2em] ${statusClasses(story.newsStatus)}`}>{story.newsStatus}</span>
            ) : null}
            <p className="text-xs font-black uppercase tracking-[.25em] text-emerald-700">{story.category}</p>
          </div>
          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[1.03] tracking-[-.045em] text-slate-950 sm:text-6xl md:text-7xl">{story.title}</h1>
          <p className="mt-6 max-w-4xl text-lg font-semibold leading-8 text-slate-700 md:text-2xl md:leading-10">{story.excerpt}</p>

          <div className="mt-7 flex flex-col gap-4 border-y border-slate-200 py-4 sm:flex-row sm:items-center sm:justify-between">
            <AuthorProfile
              name={story.author || "Nexus DevOps"}
              role={story.authorRole || "Story contributor"}
              image={story.authorImage || "/images/logo.jpg"}
              bio={story.authorBio || "Sharing stories and experiences with the Nexus DevOps community."}
            />
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500 sm:max-w-md sm:justify-end sm:text-right">
              <time>Published {formatDateTime(story.createdAt)}</time>
              {wasUpdated ? <time>Updated {formatDateTime(story.updatedAt)}</time> : null}
            </div>
          </div>

          {story.location || story.eventDate ? (
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              {story.location ? <span><strong className="text-slate-950">Location:</strong> {story.location}</span> : null}
              {story.eventDate ? <span><strong className="text-slate-950">Event time:</strong> {formatDateTime(story.eventDate)}</span> : null}
            </div>
          ) : null}
        </header>

        {isNews && leadSection?.image ? (
          <figure className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative min-h-[300px] overflow-hidden bg-slate-200 sm:min-h-[470px] lg:min-h-[620px]">
              <BlogImage src={leadSection.image} alt={leadSection.caption || story.title} priority className="object-cover" />
            </div>
            {leadSection.caption ? <figcaption className="border-b border-slate-300 py-3 text-sm text-slate-500">{leadSection.caption}</figcaption> : null}
          </figure>
        ) : null}

        <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 md:pt-14">
          <div className="space-y-14 md:space-y-20">
            {story.sections.map((section, index) => (
              <section key={`${section.heading}-${index}`} className="mx-auto max-w-4xl border-t border-slate-300 pt-8 md:pt-10">
                <p className="text-xs font-black uppercase tracking-[.28em] text-emerald-700">{sectionLabel(story, index)}</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-.035em] text-slate-950 sm:text-4xl">{section.heading}</h2>
                <div className={`mt-7 ${styles.editorialFlow}`}>
                  {!isNews || index > 0 ? (
                    <figure className={`group ${styles.editorialFigure} ${index % 2 ? styles.floatRight : styles.floatLeft}`}>
                      <div className="relative min-h-[280px] overflow-hidden bg-slate-200 shadow-[0_20px_55px_-35px_rgba(15,23,42,.45)] sm:min-h-[380px] md:min-h-[330px]">
                        <BlogImage src={section.image} alt={section.caption || section.heading} priority={!isNews && index === 0} className="object-cover transition duration-700 group-hover:scale-[1.025]" />
                      </div>
                      {section.caption ? <figcaption className="mt-3 border-b border-slate-300 pb-2 text-sm text-slate-500">{section.caption}</figcaption> : null}
                    </figure>
                  ) : null}

                  <div className={`${styles.storyText} text-base leading-8 text-slate-800 md:text-lg`}>
                    {section.text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph.trim()}</p>
                    ))}
                  </div>

                  {section.highlight ? (
                    <div className="clear-both pt-2">
                      <aside className="mt-7 border-l-4 border-emerald-600 bg-emerald-50 p-5 text-slate-800">
                        <p className="text-xs font-black uppercase tracking-[.24em] text-emerald-700">{isNews ? "At a glance" : "Worth knowing"}</p>
                        <p className="mt-2 leading-7">{section.highlight}</p>
                      </aside>
                    </div>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <footer className="mx-auto mt-16 max-w-4xl border-t-4 border-emerald-600 bg-emerald-50 p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.25em] text-emerald-700">Continue reading</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">More inspiring stories, fiction, and shared experiences.</h2>
            <Link href="/blog" className="mt-6 inline-flex bg-emerald-700 px-5 py-3 font-black text-white transition hover:bg-emerald-800">View latest stories →</Link>
          </footer>
        </div>
      </article>
    </main>
  );
}
