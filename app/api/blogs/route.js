import { NextResponse } from "next/server";
import slugify from "slugify";
import { connectMongoDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidateSite } from "@/lib/revalidateSite";
import Blog from "@/models/Blog";

function normalizeSections(sections) {
  if (!Array.isArray(sections)) return [];

  return sections.map((section) => ({
    heading: section?.heading?.trim() || "",
    text: section?.text?.trim() || "",
    image: section?.image?.trim() || "",
    caption: section?.caption?.trim() || "",
    highlight: section?.highlight?.trim() || "",
  }));
}

function validateBlog({ title, excerpt, sections }) {
  if (!title?.trim() || !excerpt?.trim()) return "Title and introduction are required.";
  if (sections.length < 1) return "Add at least one story section.";
  if (sections.some((section) => !section.heading || !section.text || !section.image)) {
    return "Every story section needs a heading, story text, and image.";
  }
  return null;
}

function getCreateErrorMessage(error) {
  if (error?.name === "ValidationError") {
    return Object.values(error.errors || {})
      .map((validationError) => validationError.message)
      .filter(Boolean)
      .join(" ") || "Please check the Blog fields and try again.";
  }

  if (error?.code === 11000) return "A Blog story with this title already exists.";
  if (/document.*(too large|16mb)|bson.*large/i.test(error?.message || "")) {
    return "This story contains too much image data. Use smaller images or image URLs, then try again.";
  }

  return "Failed to create Blog story. Please try again.";
}

export async function GET() {
  try {
    await connectMongoDB();
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ message: "Failed to fetch blog stories", blogs: [] }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const sections = normalizeSections(body.sections);
    const validationError = validateBlog({ ...body, sections });

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    await connectMongoDB();
    const baseSlug = slugify(body.title, { lower: true, strict: true }) || "story";
    let slug = baseSlug;
    let count = 1;

    while (await Blog.exists({ slug })) {
      slug = `${baseSlug}-${count}`;
      count += 1;
    }

    const blog = await Blog.create({
      title: body.title.trim(),
      excerpt: body.excerpt.trim(),
      category: body.category,
      author: body.author?.trim() || "Nexus DevOps",
      authorRole: body.authorRole?.trim() || "Story contributor",
      authorImage: body.authorImage?.trim() || "/images/logo.jpg",
      authorBio: body.authorBio?.trim() || "Sharing stories and experiences with the Nexus DevOps community.",
      location: body.location?.trim() || "",
      eventDate: body.eventDate || null,
      newsStatus: body.newsStatus || "Standard",
      sections,
      slug,
    });

    revalidateSite(["/blog", `/blog/${slug}`]);
    return NextResponse.json({ message: "Blog story created.", blog }, { status: 201 });
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json(
      { message: getCreateErrorMessage(error) },
      { status: 500 }
    );
  }
}
