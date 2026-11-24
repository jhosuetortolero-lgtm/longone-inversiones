import type { CSSProperties } from "react";
import { media, src, srcSet } from "../data/media";

interface Props {
  id: string;
  alt: string;
  sizes?: string;
  className?: string;
  focus?: string;
  priority?: boolean;
  /** keep the intrinsic aspect ratio box (default) or fill the parent (cover) */
  fill?: boolean;
  style?: CSSProperties;
}

export function Picture({ id, alt, sizes = "100vw", className, focus, priority, fill, style }: Props) {
  const m = media(id);
  return (
    <img
      className={className}
      src={src(m, 1600)}
      srcSet={srcSet(m)}
      sizes={sizes}
      alt={alt}
      width={m.width}
      height={m.height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      style={{
        backgroundColor: m.color,
        objectPosition: focus,
        ...(fill ? { width: "100%", height: "100%", objectFit: "cover" } : null),
        ...style,
      }}
    />
  );
}
