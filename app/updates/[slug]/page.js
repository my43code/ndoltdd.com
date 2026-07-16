import { notFound } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Image from "next/image";
import LiveRelativeTime from "@/components/LiveRelativeTime";
import AuthorProfile from "@/components/AuthorProfile";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    await connectMongoDB();
    const posts = await Post.find({}, { slug: 1, _id: 1 }).lean();
    return posts.map((post) => ({ slug: post.slug || String(post._id) }));
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") console.error("Failed to preload update routes:", error);
    return [];
  }
}

async function getPost(slug) {
  try {
    await connectMongoDB();

    let post = await Post.findOne({ slug }).lean();

    if (!post && mongoose.isValidObjectId(slug)) {
      post = await Post.findById(slug).lean();
    }

    return post;
  } catch (error) {
    if (process.env.npm_lifecycle_event !== "build") {
      console.error("Failed to load post:", error);
    }
    return null;
  }
}

export default async function PostDetailPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="brand-page">
      <div className="border-b border-slate-200 bg-white/80 px-4 py-4 sm:px-6 backdrop-blur">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/updates"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline"
          >
            Back to Updates
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
            Company update
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            {post.title || "Update"}
          </h1>
          <div className="mt-6 flex flex-col gap-4 border-y border-slate-200 py-4 sm:flex-row sm:items-center sm:justify-between">
            <AuthorProfile
              name={post.author || "Nexus DevOps"}
              role={post.authorRole || "Editorial team"}
              image={post.authorImage || "/images/logo.jpg"}
              bio={post.authorBio || "Sharing practical insights and updates from Nexus DevOps Limited."}
            />
            <p className="text-sm text-slate-600 sm:text-right">
              Posted <LiveRelativeTime value={post.createdAt} />
            </p>
          </div>
        </div>

        {post.image ? (
          <div className="group relative mb-8 h-[220px] overflow-hidden rounded-[1.5rem] border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-transform duration-700 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:mb-12 sm:h-[260px] sm:rounded-[2rem] md:h-[480px] image-shadow">
            <Image
              src={post.image}
              alt={post.title || "Post image"}
              fill
              className="dynamic-image object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
          </div>
        ) : null}

        {post.summary ? (
          <div className="mb-12 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-6 py-5">
            <p className="text-lg italic leading-relaxed text-slate-700 md:text-xl">
              {post.summary}
            </p>
          </div>
        ) : null}

        <div className="prose prose-slate max-w-none">
          {post.content ? (
            <div className="whitespace-pre-wrap break-words text-lg leading-8 text-slate-800">
              {post.content}
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}
