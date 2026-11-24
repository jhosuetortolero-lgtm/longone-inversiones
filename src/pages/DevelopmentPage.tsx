import { useRef, useState } from "react";
import { useParams } from "react-router";
import { SOURCES_CONSULTED, developmentBySlug, developments, mapUrl, type Development } from "../data/developments";
import { destinationBySlug } from "../data/destinations";
import { media, src, srcSet } from "../data/media";
import { formatDate, paths, useI18n } from "../i18n";
import { absoluteAssetUrl, absoluteUrl, breadcrumbLd, organizationLd, useHead } from "../lib/head";
import { getGsap, prefersReducedMotion, useIsoLayoutEffect } from "../lib/motion";
import { Picture } from "../components/Picture";
import { Lightbox } from "../components/Lightbox";
import { TransitionLink } from "../components/TransitionLink";
import { ContactSection } from "../sections/HomeSections";
import NotFoundPage from "./NotFoundPage";

function useDevHead(d: Development) {
  const { locale, t } = useI18n();
  const path = paths.development(locale, d.slug);
  const hero = media(d.hero.id);
  const [city, state] = d.place[locale].split(",").map((s) => s.trim()).slice(-2);
  useHead({
    title: `${d.name} — ${d.place[locale]} | Longone`,
    description: t.meta.developmentDescription(d.name, d.place[locale]),
    locale,
    path,
    image: src(hero, 1600),
    type: "article",
    preloadImage: { href: src(hero, 1600), srcset: srcSet(hero), sizes: d.hero.layout === "split" ? "(min-width: 900px) 50vw, 100vw" : "100vw" },
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ApartmentComplex",
        name: d.name,
        description: d.tagline[locale],
        url: absoluteUrl(path),
        image: [absoluteAssetUrl(src(hero, 1600))],
        address: {
          "@type": "PostalAddress",
          addressLocality: city,
          addressRegion: state,
          addressCountry: "BR",
        },
        ...(d.map.lat !== undefined ? { geo: { "@type": "GeoCoordinates", latitude: d.map.lat, longitude: d.map.lng } } : null),
        ...(d.facts.find((f) => f.key === "units") && /^\d+$/.test(d.facts.find((f) => f.key === "units")!.value.es)
          ? { numberOfAccommodationUnits: { "@type": "QuantitativeValue", value: Number(d.facts.find((f) => f.key === "units")!.value.es) } }
          : null),
      },
      breadcrumbLd([
        { name: "Longone", path: paths.home(locale) },
        { name: t.developments.title, path: paths.section(locale, t.anchors.developments) },
        { name: d.name, path },
      ]),
      organizationLd(),
    ],
  });
}

function DevHero({ d }: { d: Development }) {
  const { locale, t } = useI18n();
  const split = d.hero.layout === "split";
  return (
    <section className={`dhero dhero--${d.hero.layout}`} aria-labelledby="dev-title" data-header-overlay="">
      <div className="dhero__media">
        <Picture id={d.hero.id} alt="" sizes={split ? "(min-width: 900px) 50vw, 100vw" : "100vw"} focus={d.hero.focus} priority fill />
      </div>
      <TransitionLink className="dhero__back" to={paths.section(locale, t.anchors.developments)}>
        {t.dev.back}
      </TransitionLink>
      <div className="dhero__content">
        <p className="dhero__meta">
          <span>{d.place[locale]}</span>
          <span>
            {t.developments.ref} {d.code}
          </span>
        </p>
        <h1 id="dev-title" className="dhero__title">
          {d.name}
        </h1>
        <p className="dhero__tagline">{d.tagline[locale]}</p>
      </div>
    </section>
  );
}

function Overview({ d }: { d: Development }) {
  const { locale, t } = useI18n();
  const rows: { k: string; v: string }[] = [
    { k: t.dev.facts.location, v: d.place[locale] },
    { k: t.dev.facts.category, v: d.category[locale] },
    { k: t.dev.facts.stage, v: t.stages[d.stage] },
    ...(d.delivery ? [{ k: t.dev.facts.delivery, v: d.delivery[locale] }] : []),
    ...d.facts.map((f) => ({ k: t.dev.facts[f.key], v: f.value[locale] })),
    { k: t.dev.facts.code, v: d.code },
  ];
  return (
    <section className="dov container" aria-labelledby="dov-title">
      <h2 id="dov-title" className="sr-only">
        {t.dev.overview}
      </h2>
      <div className="dov__text">
        {d.description[locale].map((p, i) => (
          <p key={i} className={i === 0 ? "dov__lead" : undefined}>
            {p}
          </p>
        ))}
      </div>
      <aside className="dov__facts">
        <dl>
          {rows.map((r) => (
            <div key={r.k}>
              <dt>{r.k}</dt>
              <dd>{r.v}</dd>
            </div>
          ))}
        </dl>
        <p className="note">{t.dev.deliveryNote}</p>
      </aside>
    </section>
  );
}

function Typologies({ d }: { d: Development }) {
  const { locale, t } = useI18n();
  return (
    <section className="dtyp container" aria-labelledby="dtyp-title">
      <h2 id="dtyp-title" className="block-title">
        {t.dev.typologies}
      </h2>
      <table className="dtyp__table">
        <thead>
          <tr>
            <th scope="col">{t.dev.typologies}</th>
            <th scope="col">{t.dev.area}</th>
          </tr>
        </thead>
        <tbody>
          {d.typologies.map((ty) => (
            <tr key={ty.label.es}>
              <th scope="row">{ty.label[locale]}</th>
              <td>{ty.area ? ty.area[locale] : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {d.typologyNote && <p className="note">{d.typologyNote[locale]}</p>}
    </section>
  );
}

function Amenities({ d }: { d: Development }) {
  const { locale, t } = useI18n();
  return (
    <section className="dam" aria-labelledby="dam-title">
      <div className="container">
        <h2 id="dam-title" className="block-title">
          {t.dev.amenities}
        </h2>
        <div className={`dam__groups dam__groups--${d.amenities.length}`}>
          {d.amenities.map((g, i) => (
            <div key={i} className="dam__group">
              {g.group && <h3 className="label">{g.group[locale]}</h3>}
              <ul>
                {g.items[locale].map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Progress({ d }: { d: Development }) {
  const { locale, t } = useI18n();
  if (!d.progress) return null;
  const p = d.progress;
  const fmt = new Intl.NumberFormat(locale === "es" ? "es" : "pt-BR", { maximumFractionDigits: 2 });
  return (
    <section className="dprog container" aria-labelledby="dprog-title">
      <h2 id="dprog-title" className="block-title">
        {t.dev.progress}
      </h2>
      <div className="dprog__stages">
        {p.stages.map((s) => (
          <div key={s.label.es} className="dprog__stage">
            <h3 className="label">{s.label[locale]}</h3>
            <ul>
              {s.items.map((it) => (
                <li key={it.label.es}>
                  <span className="dprog__name">{it.label[locale]}</span>
                  <span className="dprog__value">{fmt.format(it.value)}%</span>
                  <span className="dprog__bar" aria-hidden="true">
                    <i style={{ transform: `scaleX(${it.value / 100})` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="note">{t.dev.progressSource(p.source, formatDate(p.date, locale))}</p>
    </section>
  );
}

function Gallery({ d }: { d: Development }) {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const [openPlan, setOpenPlan] = useState<number | null>(null);
  const items = d.gallery.map((g) => ({ id: g.id, alt: g.alt[locale] }));
  const plans = (d.floorplans ?? []).map((g) => ({ id: g.id, alt: g.alt[locale] }));
  return (
    <section className="dgal" aria-labelledby="dgal-title">
      <div className="container">
        <h2 id="dgal-title" className="block-title">
          {t.dev.gallery}
        </h2>
        <ul className="dgal__grid">
          {items.map((it, i) => {
            const m = media(it.id);
            const shape = m.width / m.height < 0.9 ? "tall" : m.width / m.height > 1.9 ? "pano" : "std";
            return (
              <li key={it.id} className={`dgal__item dgal__item--${shape}`}>
                <button type="button" onClick={() => setOpen(i)} aria-label={t.dev.openImage(i + 1, items.length)}>
                  <Picture id={it.id} alt={it.alt} sizes="(min-width: 1100px) 33vw, (min-width: 640px) 50vw, 100vw" fill />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="note">
          {t.dev.imageNotice} {d.watermarked ? t.dev.watermarkNotice : ""}
        </p>
      </div>
      <Lightbox items={items} index={open} onChange={setOpen} />
      {plans.length > 0 && (
        <div className="container dgal__plans">
          <h2 className="block-title">{t.dev.floorplans}</h2>
          <ul className="dgal__plan-grid">
            {plans.map((it, i) => (
              <li key={it.id}>
                <button type="button" onClick={() => setOpenPlan(i)} aria-label={`${it.alt}. ${t.dev.openImage(i + 1, plans.length)}`}>
                  <Picture id={it.id} alt={it.alt} sizes="(min-width: 900px) 33vw, 100vw" />
                </button>
                <p>{it.alt}</p>
              </li>
            ))}
          </ul>
          <Lightbox items={plans} index={openPlan} onChange={setOpenPlan} />
        </div>
      )}
    </section>
  );
}

function Location({ d }: { d: Development }) {
  const { locale, t } = useI18n();
  const dest = destinationBySlug(d.destination);
  const shot = d.locationShot ? { id: d.locationShot.id, alt: d.locationShot.alt[locale] } : { id: dest.image, alt: `${dest.name[locale]}` };
  const m = media(shot.id);
  return (
    <section className="dloc" aria-labelledby="dloc-title">
      <div className="container dloc__grid">
        <figure className="dloc__media">
          <Picture id={shot.id} alt={shot.alt} sizes="(min-width: 900px) 55vw, 100vw" />
          {m.license && (
            <figcaption className="credit">
              {t.destinations.credit}: {m.author},{" "}
              <a href={m.licenseUrl ?? "#"} target="_blank" rel="noopener noreferrer license">
                {m.license}
              </a>
            </figcaption>
          )}
        </figure>
        <div className="dloc__text">
          <h2 id="dloc-title" className="block-title">
            {t.dev.location}
          </h2>
          <p className="dloc__place">{d.place[locale]}</p>
          <h3 className="label">{dest.name[locale]}</h3>
          <ul className="dloc__facts">
            {dest.facts.map((f) => (
              <li key={f.text.es}>{f.text[locale]}</li>
            ))}
          </ul>
          <a className="link-more" href={mapUrl(d)} target="_blank" rel="noopener noreferrer">
            {t.dev.openMap}
          </a>
        </div>
      </div>
    </section>
  );
}

function Sources({ d }: { d: Development }) {
  const { locale, t } = useI18n();
  return (
    <section className="dsrc container" aria-labelledby="dsrc-title">
      <h2 id="dsrc-title" className="label">
        {t.dev.sources}
      </h2>
      <ul>
        {d.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
            <span>{s.kind[locale]}</span>
          </li>
        ))}
      </ul>
      <p className="note">
        {t.dev.consulted} {formatDate(SOURCES_CONSULTED, locale)}.
      </p>
    </section>
  );
}

function Related({ d }: { d: Development }) {
  const { locale, t } = useI18n();
  const others = developments.filter((x) => x.slug !== d.slug);
  return (
    <section className="drel" aria-labelledby="drel-title">
      <div className="container">
        <h2 id="drel-title" className="block-title">
          {t.dev.related}
        </h2>
        <ul className="drel__list">
          {others.map((x) => (
            <li key={x.slug}>
              <TransitionLink to={paths.development(locale, x.slug)} className="drel__link">
                <span className="drel__media">
                  <Picture id={x.card.id} alt="" sizes="(min-width: 900px) 25vw, 50vw" focus={x.card.focus} fill />
                </span>
                <span className="drel__place">{x.place[locale]}</span>
                <span className="drel__name">{x.name}</span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DevelopmentView({ d }: { d: Development }) {
  const { t } = useI18n();
  useDevHead(d);
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    if (!root.current || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(".dhero__media img", { scale: 1.08 }, { scale: 1, duration: 2.4, ease: "expo.out" });
      gsap.fromTo(".dhero__media", { yPercent: 0 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".dhero", start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [d.slug]);

  return (
    <div ref={root} key={d.slug}>
      <DevHero d={d} />
      <Overview d={d} />
      <Typologies d={d} />
      <Amenities d={d} />
      <Progress d={d} />
      <Gallery d={d} />
      <Location d={d} />
      <section className="dcta container" aria-labelledby="dcta-title">
        <h2 id="dcta-title" className="dcta__title">
          {t.dev.ctaTitle}
        </h2>
        <p>{t.dev.ctaText}</p>
      </section>
      <ContactSection preset={d.slug} compact />
      <Sources d={d} />
      <Related d={d} />
    </div>
  );
}

export default function DevelopmentPage() {
  const { slug } = useParams();
  const d = developmentBySlug(slug);
  if (!d) return <NotFoundPage />;
  return <DevelopmentView d={d} />;
}
