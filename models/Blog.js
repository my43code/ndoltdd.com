import mongoose, { Schema } from "mongoose";

const storySectionSchema = new Schema(
  {
    heading: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    caption: { type: String, default: "", trim: true },
    highlight: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Current event", "Community happening", "Personal story", "Life event", "Fiction"],
      default: "Current event",
    },
    author: { type: String, default: "NDOLTD Stories", trim: true },
    location: { type: String, default: "", trim: true },
    eventDate: { type: Date, default: null },
    newsStatus: {
      type: String,
      enum: ["Standard", "Developing", "Breaking"],
      default: "Standard",
    },
    slug: { type: String, required: true, unique: true, index: true },
    sections: {
      type: [storySectionSchema],
      validate: {
        validator: (sections) => sections.length >= 1,
        message: "A blog story must contain at least one section.",
      },
    },
  },
  { timestamps: true }
);

// Next.js development hot reload keeps Mongoose models in memory. Overwrite the
// cached development model so schema validation changes apply without a restart.
const Blog =
  process.env.NODE_ENV === "development"
    ? mongoose.model("Blog", blogSchema, undefined, { overwriteModels: true })
    : mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
