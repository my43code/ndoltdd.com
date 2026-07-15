import Image from "next/image";

export default function BlogImage({ src, alt, priority = false, className = "" }) {
  const imageSrc = src || "/images/project1.webp";
  const isDataUrl = imageSrc.startsWith("data:");

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      unoptimized={isDataUrl}
      sizes="(max-width: 768px) 100vw, 900px"
      className={className}
    />
  );
}
