export default function SectionTitle({
  title,
  subtitle,
  eyebrow,
  align = "center",
}) {
  const isLeftAligned = align === "left";

  return (
    <div
      className={`mb-8 max-w-4xl sm:mb-12 ${isLeftAligned ? "text-left" : "mx-auto text-center"} animate-fade-in-up`}
    >
      {eyebrow ? (
        <p className="eyebrow-pill animate-bounce-in transition-transform hover:scale-105">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl md:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        {title}
      </h2>

      {subtitle ? (
        <p className={`mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg animate-fade-in-up ${isLeftAligned ? "" : "mx-auto"}`} style={{ animationDelay: "0.2s" }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
