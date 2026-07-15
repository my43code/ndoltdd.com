import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "/images/project1.webp" },
    video: { type: String, default: "" },
    author: { type: String, default: "Nexus DevOps", trim: true },
    authorRole: { type: String, default: "Editorial team", trim: true },
    authorImage: { type: String, default: "/images/logo.jpg" },
    authorBio: {
      type: String,
      default: "Sharing practical insights and updates from Nexus DevOps Limited.",
      trim: true,
    },

    
 // ✅ ADD THIS BLOCK
    slug: { 
      type: String, 
      required: true, 
      unique: true 
    },

    
  },
  
  {
    timestamps: true,
  }
);

const Post =
  process.env.NODE_ENV === "development"
    ? mongoose.model("Post", postSchema, undefined, { overwriteModels: true })
    : mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
