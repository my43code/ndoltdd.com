"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Grid2X2, List, MonitorSmartphone, Pause, Play, ShieldCheck, Sparkles, Wrench } from "lucide-react";

const fallbackSlides = [
  { id: "design", title: "Digital experiences that move business forward.", subtitle: "Modern websites, applications and systems designed for Papua New Guinea's ambitious organisations.", image: "/images/project1.webp", badge: "Design & development" },
  { id: "teams", title: "Technology built around real people.", subtitle: "Straightforward tools, thoughtful user journeys and reliable support—without the technical noise.", image: "/images/team.webp", badge: "People-first systems" },
  { id: "delivery", title: "From first idea to confident launch.", subtitle: "One local partner for strategy, design, development and ongoing improvement.", image: "/images/project1.JPG", badge: "End-to-end delivery" },
];

const fallbackServices = [
  { id: "web", title: "Web & App Development", description: "Fast, accessible digital products that look sharp and are easy to use on every screen.", image: "/images/project1.webp", icon: "monitor" },
  { id: "systems", title: "Business Systems", description: "Practical database-driven tools that replace slow manual processes and help teams stay aligned.", image: "/images/team.webp", icon: "sparkles" },
  { id: "support", title: "IT Support & Care", description: "Dependable technical help, security-minded maintenance and a team that stays after launch.", image: "/images/contact.jpg", icon: "shield" },
];

const icons = { monitor: MonitorSmartphone, sparkles: Sparkles, shield: ShieldCheck };

function getPublishedWebsite(link) {
  if (!link) return null;

  try {
    const url = new URL(link);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return {
      href: url.href,
      domain: url.hostname.replace(/^www\./, ""),
    };
  } catch {
    return null;
  }
}

export default function HomeExperience({ services = [], projects = [] }) {
  const slides = useMemo(() => {
    const live = [...projects, ...services].filter((item) => item.image).slice(0, 5).map((item, index) => ({
      id: item.id || `${index}`, title: item.title, subtitle: item.description, image: item.image, badge: index < projects.length ? "Featured project" : "Digital service",
    }));
    return live.length >= 2 ? live : fallbackSlides;
  }, [projects, services]);
  const cards = services.length ? services : fallbackServices;
  const work = projects.length ? projects : fallbackSlides.map((item, index) => ({ ...item, id: `work-${index}`, description: item.subtitle }));
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [view, setView] = useState("grid");

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [playing, slides.length]);

  const move = (direction) => setActive((value) => (value + direction + slides.length) % slides.length);

  return (
    <>
      <section className="home-hero" aria-label="Nexus DevOps introduction">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`hero-slide ${index === active ? "is-active" : ""}`} aria-hidden={index !== active}>
            <Image src={slide.image} alt="" fill priority={index === 0} sizes="100vw" className="object-cover" />
          </div>
        ))}
        <div className="hero-overlay" />
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-76px)] max-w-7xl items-end px-4 pb-36 pt-20 sm:px-6 md:items-center md:px-8 md:py-24">
          <div className="max-w-4xl">
            <p key={`badge-${active}`} className="hero-enter inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200 backdrop-blur-xl sm:px-4 sm:text-xs sm:tracking-[0.25em]">
              <Sparkles size={15} /> {slides[active].badge}
            </p>
            <h1 key={`title-${active}`} className="hero-enter hero-enter-delay mt-5 max-w-4xl text-4xl font-black leading-[1] tracking-[-0.045em] text-white min-[390px]:text-5xl sm:mt-6 sm:text-6xl lg:text-8xl">
              {slides[active].title}
            </h1>
            <p key={`copy-${active}`} className="hero-enter hero-enter-delay-2 mt-6 max-w-2xl text-base leading-7 text-slate-200 md:text-xl md:leading-8">{slides[active].subtitle}</p>
            <div className="hero-enter hero-enter-delay-2 mt-8 flex flex-col gap-3 min-[390px]:flex-row min-[390px]:flex-wrap">
              <Link href="/contact" className="home-button home-button-primary w-full min-[390px]:w-auto">Start a project <ArrowRight size={18} /></Link>
              <Link href="/services" className="home-button home-button-ghost w-full min-[390px]:w-auto">Explore services</Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 right-4 z-20 flex items-center gap-1.5 sm:right-6 md:bottom-10 md:right-10 md:gap-2">
          <button className="slider-control" onClick={() => move(-1)} aria-label="Previous slide"><ChevronLeft /></button>
          <button className="slider-control" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause slideshow" : "Play slideshow"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
          <button className="slider-control" onClick={() => move(1)} aria-label="Next slide"><ChevronRight /></button>
        </div>
        <div className="absolute bottom-7 left-4 z-20 flex gap-1.5 sm:left-6 md:bottom-11 md:left-1/2 md:-translate-x-1/2 md:gap-2">
          {slides.map((slide, index) => <button key={slide.id} className={`slide-dot ${index === active ? "is-active" : ""}`} onClick={() => setActive(index)} aria-label={`Show slide ${index + 1}`} />)}
        </div>
      </section>

      <section className="brand-page px-4 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-up grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <p className="section-kicker">What we do / 01</p>
            <div><h2 className="display-heading">Useful technology.<br /><span>Beautifully delivered.</span></h2><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">We turn complex ideas into clear, high-performing digital experiences your team and customers will actually enjoy using.</p></div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 border-b border-slate-300 pb-5 min-[420px]:flex-row min-[420px]:items-center sm:mt-12">
            <p className="text-sm font-semibold text-slate-500">Choose how you explore</p>
            <div className="view-switch" aria-label="Service view style">
              <button className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 size={17} /> Grid</button>
              <button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-label="List view"><List size={18} /> List</button>
            </div>
          </div>

          <div className={view === "grid" ? "service-grid" : "service-list"}>
            {cards.slice(0, 6).map((service, index) => {
              const Icon = icons[service.icon] || [MonitorSmartphone, Sparkles, Wrench][index % 3];
              return <article className="service-tile" key={service.id}>
                <div className="service-image"><Image src={service.image || fallbackServices[index % 3].image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div>
                <div className="service-content"><div className="service-number">0{index + 1}</div><Icon className="service-icon" /><h3>{service.title}</h3><p>{service.description}</p><Link href={service.link || "/services"}>Discover more <ArrowRight size={16} /></Link></div>
              </article>;
            })}
          </div>
        </div>
      </section>

      <section className="brand-dark-surface overflow-hidden px-4 py-16 text-white sm:px-6 sm:py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="section-kicker text-emerald-300">Selected work / 02</p><h2 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.045em] sm:text-5xl md:text-7xl">Ideas made tangible.</h2></div><Link href="/contact" className="home-button home-button-outline self-start">Build yours <ArrowRight size={18} /></Link></div>
          <div className="horizontal-gallery mt-14">
            {work.slice(0, 6).map((project, index) => {
              const website = getPublishedWebsite(project.link);

              return (
                <article className="work-card" key={project.id}>
                  <div className="relative h-[360px] overflow-hidden md:h-[470px]">
                    <Image src={project.image || fallbackSlides[index % 3].image} alt={project.title} fill sizes="(max-width: 768px) 86vw, 52vw" className="object-cover" />
                    <div className="work-overlay" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[.24em] text-emerald-300">Project 0{index + 1}</p>
                    <h3 className="mt-3 text-2xl font-bold">{project.title}</h3>
                    <p className="mt-3 max-w-xl leading-7 text-slate-400">{project.description}</p>
                    {website ? (
                      <a
                        href={website.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
                        aria-label={`Visit ${project.title} website at ${website.domain} (opens in a new tab)`}
                      >
                        <span className="truncate">Visit {website.domain}</span>
                        <ExternalLink className="shrink-0" size={16} aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-emerald-400 px-6 py-24 md:px-8 md:py-32"><div className="cta-word" aria-hidden="true">NEXUS</div><div className="relative z-10 mx-auto max-w-7xl"><p className="section-kicker text-emerald-950">Your next move / 03</p><div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_.6fr] lg:items-end"><h2 className="text-5xl font-black leading-[.95] tracking-[-.055em] text-slate-950 md:text-8xl">Let’s make something that matters.</h2><div><p className="text-lg leading-8 text-emerald-950">Tell us where you want to go. We’ll help make the path clear—and build the technology to get you there.</p><Link href="/contact" className="mt-8 inline-flex items-center gap-3 border-b-2 border-slate-950 pb-2 text-lg font-bold text-slate-950">Talk to our team <ArrowRight /></Link></div></div></div></section>
    </>
  );
}
