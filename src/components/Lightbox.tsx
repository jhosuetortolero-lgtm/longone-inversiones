import { useEffect, useRef } from "react";
import { media, srcSet, src } from "../data/media";
import { useI18n } from "../i18n";
import { lockScroll } from "../lib/smoothScroll";

export interface LightboxItem {
  id: string;
  alt: string;
}

interface Props {
  items: LightboxItem[];
  index: number | null;
  onChange: (index: number | null) => void;
}

export function Lightbox({ items, index, onChange }: Props) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    lockScroll(open);
  }, [open]);

  if (!items.length) return null;
  const i = index ?? 0;
  const item = items[i];
  const m = media(item.id);
  const step = (delta: number) => onChange((i + delta + items.length) % items.length);

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={t.lightbox.label}
      onClose={() => onChange(null)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onChange(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
    >
      {open && (
        <figure className="lightbox__figure">
          <img
            key={item.id}
            src={src(m, 2400)}
            srcSet={srcSet(m)}
            sizes="(min-width: 900px) 86vw, 100vw"
            alt={item.alt}
            width={m.width}
            height={m.height}
            style={{ backgroundColor: m.color }}
          />
          <figcaption>
            <span>{item.alt}</span>
            <span aria-hidden="true">
              {i + 1} / {items.length}
            </span>
          </figcaption>
        </figure>
      )}
      <div className="lightbox__controls">
        <button type="button" onClick={() => step(-1)} aria-label={t.lightbox.prev}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button type="button" onClick={() => step(1)} aria-label={t.lightbox.next}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button type="button" className="lightbox__close" onClick={() => onChange(null)} aria-label={t.lightbox.close}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </dialog>
  );
}
