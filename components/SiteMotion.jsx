"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function SiteMotion() {
  const glow = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll("main section, main article, main .section-card");
    targets.forEach((target, index) => {
      target.classList.add("scroll-reveal");
      target.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
    });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.08, rootMargin: "0px 0px -35px" });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const move = (event) => {
      if (!glow.current) return;
      glow.current.style.transform = `translate3d(${event.clientX - 180}px,${event.clientY - 180}px,0)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return <div ref={glow} className="site-cursor-glow" aria-hidden="true" />;
}
