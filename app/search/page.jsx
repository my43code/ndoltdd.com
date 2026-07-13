"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search } from "lucide-react";
import LoadingState from "@/components/LoadingState";

function resultHref(item, fallback) {
  const link = item?.link?.trim();
  return link || fallback;
}

function SearchResultLink({ href, children, className = "" }) {
  const external = /^https?:\/\//i.test(href);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function ResultAction({ label = "Open result" }) {
  return (
    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
      {label}
      <ArrowUpRight size={16} aria-hidden="true" />
    </span>
  );
}

function matchesQuery(item, query) {
  const lowerQuery = (query || "").toString().toLowerCase().trim();
  if (!lowerQuery) return false;

  const values = [];
  Object.values(item).forEach((value) => {
    if (typeof value === "string") {
      values.push(value.toLowerCase());
    } else if (Array.isArray(value)) {
      values.push(value.join(" ").toLowerCase());
    } else if (typeof value === "object" && value !== null) {
      values.push(JSON.stringify(value).toLowerCase());
    }
  });

  const haystack = values.join(" ");
  if (haystack.includes(lowerQuery)) {
    return true;
  }

  const tokens = lowerQuery.split(/\s+/).filter(Boolean);
  return tokens.some((token) => haystack.includes(token));
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, projectsRes, postsRes, aboutRes] = await Promise.all([
          fetch("/api/services", { cache: "no-store" }),
          fetch("/api/projects", { cache: "no-store" }),
          fetch("/api/posts", { cache: "no-store" }),
          fetch("/api/about", { cache: "no-store" }),
        ]);

        const servicesData = servicesRes.ok ? await servicesRes.json() : [];
        const projectsData = projectsRes.ok ? await projectsRes.json() : [];
        const postsData = postsRes.ok ? await postsRes.json() : { posts: [] };
        const aboutData = aboutRes.ok ? await aboutRes.json() : null;

        setServices(servicesData);
        setProjects(projectsData);
        setPosts(postsData.posts || []);
        setAbout(aboutData);
      } catch (error) {
        console.error("Search data loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSearch = () => {
    setSearchTerm(query.trim());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((item) =>
      matchesQuery({
        title: item.title,
        description: item.description,
        shortDescription: item.shortDescription,
        link: item.link,
        video: item.video,
      }, searchTerm)
    );
  }, [services, searchTerm]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) =>
      matchesQuery({
        title: item.title,
        description: item.description,
        shortDescription: item.shortDescription,
        link: item.link,
        video: item.video,
      }, searchTerm)
    );
  }, [projects, searchTerm]);

  const filteredPosts = useMemo(() => {
    return posts.filter((item) =>
      matchesQuery({
        title: item.title,
        summary: item.summary,
        content: item.content,
      }, searchTerm)
    );
  }, [posts, searchTerm]);

  const aboutMatches = useMemo(() => {
    if (!about) return false;
    return matchesQuery(
      {
        history: about.history?.text,
        mission: about.mission,
        vision: about.vision,
        values: about.values,
        team: about.team?.map((member) => `${member.name} ${member.role}`),
        projects: about.projects?.map((project) => `${project.title} ${project.description}`),
      },
      searchTerm
    );
  }, [about, searchTerm]);

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Search</h1>
            <p className="text-slate-600 mt-2">
              Search across services, projects, posts, and about content.
            </p>
          </div>

          <Link
            href="/"
            className="text-emerald-600 font-medium hover:underline"
          >
            Back to Home
          </Link>
        </div>

        <div className="mb-8 flex flex-col items-stretch gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:mb-10 sm:flex-row sm:items-center sm:p-4">
          <div className="flex items-center gap-3 flex-1 w-full">
            <Search className="text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search for any word or phrase..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full outline-none text-slate-800"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="min-h-11 w-full rounded-lg bg-emerald-600 px-5 py-2 text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            Search
          </button>
        </div>
        {!loading ? (
          searchTerm && filteredServices.length === 0 && filteredProjects.length === 0 && filteredPosts.length === 0 && !aboutMatches ? (
            <p className="text-slate-500 mb-6">No matches found for &quot;{searchTerm}&quot;.</p>
          ) : searchTerm ? (
            <p className="text-slate-500 mb-6">Search results for &quot;{searchTerm}&quot;</p>
          ) : (
            <p className="text-slate-500 mb-6">Enter a word or phrase and click Search.</p>
          )
        ) : null}

        {loading ? (
          <LoadingState
            eyebrow="Search"
            title="Loading search data"
            subtitle="We are pulling services, projects, posts, and about content from MongoDB."
          />
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">Services</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <SearchResultLink
                      key={service._id}
                      href={resultHref(service, "/services")}
                      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <h3 className="text-lg font-semibold group-hover:text-emerald-700">{service.title}</h3>
                      <p className="text-slate-600 mt-2 text-sm">
                        {service.description || service.shortDescription}
                      </p>
                      <ResultAction label={service.link ? "Visit service" : "View services"} />
                    </SearchResultLink>
                  ))
                ) : (
                  <p className="text-slate-500">No matching services found.</p>
                )}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">Projects</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <SearchResultLink
                      key={project._id}
                      href={resultHref(project, "/about#projects")}
                      className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <Image
                        src={project.image || "/images/project1.webp"}
                        width={400}
                        height={250}
                        alt={project.title || "Project"}
                        className="aspect-[16/10] h-auto w-full rounded-xl object-cover"
                      />
                      <h3 className="mt-4 text-lg font-semibold group-hover:text-emerald-700">{project.title}</h3>
                      <p className="text-slate-600 mt-2 text-sm">
                        {project.description || project.shortDescription}
                      </p>
                      <ResultAction label={project.link ? "Visit project" : "View project"} />
                    </SearchResultLink>
                  ))
                ) : (
                  <p className="text-slate-500">No matching projects found.</p>
                )}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">Posts</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <SearchResultLink
                      key={post._id}
                      href={`/updates/${post.slug || post._id}`}
                      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <h3 className="text-lg font-semibold group-hover:text-emerald-700">{post.title}</h3>
                      <p className="text-slate-600 mt-2 text-sm">
                        {post.summary}
                      </p>
                      <ResultAction label="Read update" />
                    </SearchResultLink>
                  ))
                ) : (
                  <p className="text-slate-500">No matching posts found.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">About</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                {aboutMatches ? (
                  <SearchResultLink
                    href="/about"
                    className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <p className="text-slate-600">
                      Your search matches content from the About page.
                    </p>
                    <p className="text-slate-500 mt-2">
                      Try searching company mission, team names, project titles, or values.
                    </p>
                    <ResultAction label="Open About page" />
                  </SearchResultLink>
                ) : (
                  <p className="text-slate-500">No matching About content found.</p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  );
}
