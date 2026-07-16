import HomeExperience from "@/components/HomeExperience";
import { connectMongoDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import Project from "@/models/Project";

export const revalidate = 300;

async function loadModel(Model) {
  try {
    await connectMongoDB();
    const items = await Model.find({}, { title: 1, shortDescription: 1, description: 1, image: 1, link: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(6).lean();
    return items.map((item) => ({ id: String(item._id), title: item.title || "Digital solution", description: item.shortDescription || item.description || "Designed and delivered by Nexus DevOps.", image: item.image || "", link: item.link || "" }));
  } catch { return []; }
}

export default async function HomePage() {
  const [services, projects] = await Promise.all([loadModel(Service), loadModel(Project)]);
  return <main><HomeExperience services={services} projects={projects} /></main>;
}
