"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function SiteMotion() {
  const glow = useRef(null);
  const pathname = usePathname();
  const [navigationFrom, setNavigationFrom] = useState(null);
  const isNavigating = navigationFrom === pathname;

  useEffect(() => {
    const startNavigation = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

      setNavigationFrom(pathname);
    };

    document.addEventListener("click", startNavigation);
    return () => document.removeEventListener("click", startNavigation);
  }, [pathname]);

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

  return (
    <>
      <div ref={glow} className="site-cursor-glow" aria-hidden="true" />
      {isNavigating ? (
        <div className="route-progress" role="status" aria-label="Opening page">
          <span />
        </div>
      ) : null}
    </>
  );
}
