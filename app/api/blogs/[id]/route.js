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

function getUpdateErrorMessage(error) {
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

  return "Failed to update Blog story. Please try again.";
}

export async function PUT(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const sections = normalizeSections(body.sections);
    const validationError = validateBlog({ ...body, sections });

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    await connectMongoDB();
    const current = await Blog.findById(id);
    if (!current) return NextResponse.json({ message: "Blog story not found." }, { status: 404 });

    const baseSlug = slugify(body.title, { lower: true, strict: true }) || "story";
    let slug = baseSlug;
    let count = 1;
    while (await Blog.exists({ slug, _id: { $ne: id } })) {
      slug = `${baseSlug}-${count}`;
      count += 1;
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        title: body.title.trim(),
        excerpt: body.excerpt.trim(),
        category: body.category,
        author: body.author?.trim() || "NDOLTD Stories",
        location: body.location?.trim() || "",
        eventDate: body.eventDate || null,
        newsStatus: body.newsStatus || "Standard",
        sections,
        slug,
      },
      { new: true, runValidators: true }
    );

    revalidateSite(["/blog", `/blog/${current.slug}`, `/blog/${slug}`]);
    return NextResponse.json({ message: "Blog story updated.", blog }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/blogs/[id] error:", error);
    return NextResponse.json(
      { message: getUpdateErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    await connectMongoDB();
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return NextResponse.json({ message: "Blog story not found." }, { status: 404 });

    revalidateSite(["/blog", `/blog/${blog.slug}`]);
    return NextResponse.json({ message: "Blog story deleted." }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/blogs/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete blog story", error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
