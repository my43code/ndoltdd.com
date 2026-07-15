export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import PostCard from "@/components/PostCard";
import SlidingShow from "@/components/SlidingShow";
import AuthorProfile from "@/components/AuthorProfile";
import FreshMediaSlider from "@/components/FreshMediaSlider";
import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Blog from "@/models/Blog";

const fallbackPosts = [
  { _id: "building-better-digital-foundations", href: "/contact", title: "Building better digital foundations", summary: "Why thoughtful structure, strong performance, and clear user journeys matter for growing organisations.", content: "Digital foundations help teams move confidently.", image: "/images/project1.webp", createdAt: new Date("2026-06-18") },
  { _id: "technology-around-people", href: "/contact", title: "Designing technology around people", summary: "A practical look at making complex systems feel simple, useful, and welcoming for real users.", content: "People-first design creates better outcomes.", image: "/images/team.webp", createdAt: new Date("2026-05-24") },
  { _id: "launch-with-confidence", href: "/contact", title: "From idea to launch with confidence", summary: "The decisions that turn an early concept into a reliable product ready for customers and teams.", content: "Confident launches begin with a clear process.", image: "/images/contact.jpg", createdAt: new Date("2026-04-12") },
];

async function getPosts() {
  try {
    await connectMongoDB();
    const posts = await Post.find(
      {},
      { title: 1, summary: 1, image: 1, video: 1, slug: 1, content: 1, createdAt: 1, author: 1, authorRole: 1, authorImage: 1, authorBio: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    return { posts };
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") {
      console.error("Failed to load posts:", error);
    }
    return { posts: [] };
  }
}

async function getFreshBlogs() {
  try {
    await connectMongoDB();
    return await Blog.find(
      {},
      { title: 1, excerpt: 1, slug: 1, sections: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") {
      console.error("Failed to load fresh Blog media:", error);
    }
    return [];
  }
}

export default async function UpdatesPage() {
  const [data, freshBlogs] = await Promise.all([getPosts(), getFreshBlogs()]);
  const livePosts = data?.posts || [];
  const posts = livePosts.length ? livePosts : fallbackPosts;
  const featuredPost = posts[0] || null;
  const feedPosts = posts.slice(1);
  const freshMedia = [
    ...livePosts
      .filter((post) => post.video || post.image)
      .map((post) => ({
        id: `post-${post._id}`,
        title: post.title,
        subtitle: post.summary,
        image: post.image,
        video: post.video,
        href: `/updates/${post.slug || post._id}`,
        source: "Update",
        createdAt: post.createdAt,
      })),
    ...freshBlogs
      .map((story) => {
        const leadMedia = story.sections?.find((section) => section.image);
        if (!leadMedia) return null;
        return {
          id: `blog-${story._id}`,
          title: story.title,
          subtitle: story.excerpt,
          image: leadMedia.image,
          href: `/blog/${story.slug}`,
          source: "Blog",
          createdAt: story.createdAt,
        };
      })
      .filter(Boolean),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
    .map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      image: item.image,
      video: item.video || "",
      href: item.href,
      source: item.source,
    }));

  const readingTime = (post) =>
    Math.max(1, Math.ceil(((post?.content || post?.summary || "").length || 240) / 900));

  return (
    <main className="brand-page">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-6">
        <section className="brand-hero mb-10 overflow-hidden rounded-[1.5rem] border border-emerald-900/30 p-5 text-white shadow-[0_30px_70px_-35px_rgba(15,23,42,0.5)] sm:rounded-[2.25rem] sm:p-6 md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">
                Updates & stories
              </p>
              <h1 className="mt-4 text-3xl font-black leading-[1.04] tracking-[-.04em] text-white min-[380px]:text-4xl sm:text-6xl">
                Fresh stories, polished presentation, and a clearer view of what we are building.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Browse the latest updates and let the visuals do the storytelling with a modern, cinematic flow that matches the rest of the site.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                  Recent highlights
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                  Editorial presentation
                </span>
              </div>
            </div>

            <SlidingShow
              items={posts.slice(0, 2).map((post, index) => ({
                id: String(post._id || index + 1),
                title: post.title,
                subtitle: post.summary || post.content?.slice(0, 140),
                image: post.image || "/images/project1.webp",
                badge: index === 0 ? "Featured" : "Latest",
              }))}
            />
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <article className="brand-dark-surface group relative overflow-hidden rounded-[2rem] border border-slate-200/80 text-white shadow-[0_35px_70px_-35px_rgba(15,23,42,0.4)] transition-all duration-500 hover:-translate-y-0.5">
            {featuredPost ? (
              <>
                <div className="relative min-h-[300px] sm:min-h-[420px] overflow-hidden rounded-[2rem] transition-transform duration-700 group-hover:scale-[1.01]">
                  <Image
                    src={featuredPost.image || "/images/project1.webp"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 560'%3E%3Crect fill='%2310232f' width='800' height='560'/%3E%3C/svg%3E"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent" />
                </div>

                <div className="relative p-8 md:p-12">
                  <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">
                    Featured
                  </span>
                  <h1 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-6xl">
                    {featuredPost.title}
                  </h1>
                  <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                    {featuredPost.summary || "A standout story from our update feed, highlighting the latest news and insights from our team."}
                  </p>

                  <div className="mt-10 flex flex-col gap-5 border-t border-slate-800/80 pt-8 md:flex-row md:items-center md:justify-between">
                    <div>
                      <AuthorProfile
                        name={featuredPost.author || "Nexus DevOps"}
                        role={featuredPost.authorRole || "Editorial team"}
                        image={featuredPost.authorImage || "/images/logo.jpg"}
                        bio={featuredPost.authorBio || "Sharing practical insights and updates from Nexus DevOps Limited."}
                        theme="dark"
                      />
                      <p className="mt-2 pl-2 text-sm text-slate-400">{`${readingTime(featuredPost)} min read`}</p>
                    </div>

                    <Link
                      href={featuredPost.href || `/updates/${featuredPost.slug || featuredPost._id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                    >
                      Read post
                      <span className="text-lg">→</span>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid min-h-[320px] place-items-center rounded-[1.5rem] bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-center sm:min-h-[420px] sm:rounded-[2rem] sm:p-12">
                <div className="max-w-2xl">
                  <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">
                    Featured
                  </span>
                  <h1 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                    Updates are coming soon
                  </h1>
                  <p className="mt-6 text-base leading-8 text-slate-300 md:text-lg">
                    We’re preparing the first story for this section. Check back later for editorial updates, insights, and highlights from our team.
                  </p>
                </div>
              </div>
            )}
          </article>

          <div>
            <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.18)] backdrop-blur sm:p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
                    Fresh
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                    The Latest Feed
                  </h2>
                </div>
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  New
                </span>
              </div>

              <ul className="mt-8 space-y-4" aria-label="Latest updates">
                {feedPosts.length > 0 ? (
                  feedPosts.map((post) => (
                    <li key={post._id}>
                      <PostCard post={post} variant="list" />
                    </li>
                  ))
                ) : (
                  <li className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                    No recent feed items to display.
                  </li>
                )}
              </ul>
            </section>
          </div>
        </div>

        {freshMedia.length ? (
          <section className="mt-14 border-t border-slate-300 pt-10 sm:mt-20 sm:pt-14">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">Fresh media</p>
                <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Latest videos and images from our posts and stories.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-slate-600">
                Automatically refreshed from the newest Updates and Blog publications.
              </p>
            </div>
            <FreshMediaSlider items={freshMedia} />
          </section>
        ) : null}
      </section>
    </main>
  );
}
