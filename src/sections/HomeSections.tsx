import { useRef, useState } from "react";
import cinematic from "../data/cinematic.generated.json";
import { developments, type Development } from "../data/developments";
import { destinations } from "../data/destinations";
import { media } from "../data/media";
import { contact, formatPhone, office, officeMapEmbed, officeMapLink, site } from "../data/site";
import { paths, useI18n } from "../i18n";
import { asset } from "../lib/base";
import { getGsap, motionLevel, useIsoLayoutEffect } from "../lib/motion";
import { Picture } from "../components/Picture";
import { TransitionLink } from "../components/TransitionLink";
import { ContactForm } from "../components/ContactForm";

/* ------------------------------------------------------------------ */
/* Brand introduction                                                  */
/* ------------------------------------------------------------------ */

export function BrandIntro() {
  const { t } = useI18n();
  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="container intro__grid">
        <img className="intro__symbol" src={site.logo.symbolInk} alt="" width="800" height="767" loading="lazy" />
        <h2 id="intro-title" className="intro__title">
          {t.intro.title}
        </h2>
        <div className="intro__body">
          {t.intro.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured developments — editorial sequence, not a card grid         */
/* ------------------------------------------------------------------ */

type Variant = "feature" | "portrait" | "wide" | "pair-a" | "pair-b";
const LAYOUT: { slug: string; variant: Variant; sizes: string }[] = [
  { slug: "green-sea-oceanique", variant: "feature", sizes: "100vw" },
  { slug: "caminho-das-ondas", variant: "portrait", sizes: "(min-width: 900px) 46vw, 100vw" },
  { slug: "more-nature-spa", variant: "wide", sizes: "(min-width: 900px) 64vw, 100vw" },
  { slug: "maria-farinha-flats-residence", variant: "pair-a", sizes: "(min-width: 900px) 52vw, 100vw" },
  { slug: "green-sea-essence", variant: "pair-b", sizes: "(min-width: 900px) 36vw, 100vw" },
];

function Feature({ d, variant, sizes }: { d: Development; variant: Variant; sizes: string }) {
  const { locale, t } = useI18n();
  const href = paths.development(locale, d.slug);
  const img = d.card;
  return (
    <article className={`feat feat--${variant}`}>
      <TransitionLink to={href} className="feat__media" tabIndex={-1} aria-hidden="true">
        <span className="feat__frame">
          <Picture id={img.id} alt="" sizes={sizes} focus={img.focus} fill />
        </span>
      </TransitionLink>
      <div className="feat__body">
        <p className="feat__meta">
          <span>{d.place[locale]}</span>
          <span className="feat__code">
            {t.developments.ref} {d.code}
          </span>
        </p>
        <h3 className="feat__name">
          <TransitionLink to={href}>{d.name}</TransitionLink>
        </h3>
        <p className="feat__tagline">{d.tagline[locale]}</p>
        <dl className="feat__facts">
          <div>
            <dt>{t.developments.stage}</dt>
            <dd>{t.stages[d.stage]}</dd>
          </div>
          {d.delivery && d.slug !== "more-nature-spa" && (
            <div>
              <dt>{t.developments.delivery}</dt>
              <dd>{d.delivery[locale]}</dd>
            </div>
          )}
        </dl>
        <TransitionLink to={href} className="link-more">
          {t.developments.view}
          <span className="sr-only">: {d.name}</span>
        </TransitionLink>
      </div>
    </article>
  );
}

export function FeaturedDevelopments() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const level = motionLevel();
    if (!root.current || level === "static") return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".feat__frame").forEach((frame) => {
        const img = frame.querySelector("img");
        // Reduce-motion ("gentle"): a plain fade-in, no wipe and no parallax.
        if (level === "gentle") {
          gsap.fromTo(frame, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: "power2.out", scrollTrigger: { trigger: frame, start: "top 92%", once: true } });
          return;
        }
        gsap.fromTo(
          frame,
          { clipPath: "inset(14% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: frame, start: "top 88%", once: true } },
        );
        if (img)
          gsap.fromTo(
            img,
            { yPercent: -5, scale: 1.12 },
            { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
          );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id={t.anchors.developments} className="devs" aria-labelledby="devs-title">
      <header className="container devs__head">
        <h2 id="devs-title" className="section-title">
          {t.developments.title}
        </h2>
        <p className="devs__lead">{t.developments.lead}</p>
      </header>
      <div className="devs__list">
        {LAYOUT.map(({ slug, variant, sizes }) => {
          const d = developments.find((x) => x.slug === slug)!;
          return <Feature key={slug} d={d} variant={variant} sizes={sizes} />;
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Destinations                                                        */
/* ------------------------------------------------------------------ */

export function DestinationsSection() {
  const { locale, t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useIsoLayoutEffect(() => {
    if (!root.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".dest__item").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id={t.anchors.destinations} className="dest" aria-labelledby="dest-title">
      <div className="container">
        <header className="dest__head">
          <h2 id="dest-title" className="section-title">
            {t.destinations.title}
          </h2>
          <p className="dest__lead">{t.destinations.lead}</p>
        </header>
        <div className="dest__layout">
          <div className="dest__visual" aria-hidden="true">
            {destinations.map((d, i) => (
              <figure key={d.slug} className={`dest__shot${i === active ? " is-active" : ""}`}>
                <Picture id={d.image} alt="" sizes="(min-width: 900px) 55vw, 100vw" fill />
              </figure>
            ))}
          </div>
          <ol className="dest__list">
            {destinations.map((d, i) => {
              const m = media(d.image);
              const here = developments.filter((x) => x.destination === d.slug);
              return (
                <li key={d.slug} className={`dest__item${i === active ? " is-active" : ""}`}>
                  <figure className="dest__mobile-shot">
                    <Picture id={d.image} alt={`${d.name[locale]}, ${t.destinations.states[d.state]}`} sizes="100vw" />
                  </figure>
                  <p className="label dest__region">{d.region[locale]}</p>
                  <h3 className="dest__name">{d.name[locale]}</h3>
                  <ul className="dest__facts">
                    {d.facts.map((f) => (
                      <li key={f.text.es}>{f.text[locale]}</li>
                    ))}
                  </ul>
                  {here.length > 0 && (
                    <p className="dest__here">
                      <span>{t.destinations.developmentsHere}:</span>{" "}
                      {here.map((x, k) => (
                        <span key={x.slug}>
                          {k > 0 && ", "}
                          <TransitionLink to={paths.development(locale, x.slug)}>{x.name}</TransitionLink>
                        </span>
                      ))}
                    </p>
                  )}
                  <p className="credit">
                    {t.destinations.credit}: {m.author},{" "}
                    <a href={m.licenseUrl ?? m.sourceUrl ?? "#"} target="_blank" rel="noopener noreferrer license">
                      {m.license}
                    </a>{" "}
                    (
                    <a href={m.sourceUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                      Wikimedia Commons
                    </a>
                    )
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Investment & lifestyle                                              */
/* ------------------------------------------------------------------ */

export function InvestSection() {
  const { t } = useI18n();
  const still = cinematic.stills[2];
  return (
    <section id={t.anchors.invest} className="invest" aria-labelledby="invest-title">
      <div className="container invest__grid">
        <div className="invest__aside">
          <h2 id="invest-title" className="section-title">
            {t.invest.title}
          </h2>
          <p className="invest__lead">{t.invest.lead}</p>
          <figure className="invest__still">
            <img src={asset(still.path)} alt="" width="1920" height="1080" loading="lazy" decoding="async" />
          </figure>
        </div>
        <div className="invest__body">
          <dl className="invest__list">
            {t.invest.items.map((it) => (
              <div key={it.title} className="invest__item">
                <dt>{it.title}</dt>
                <dd>{it.text}</dd>
              </div>
            ))}
          </dl>
          <p className="invest__disclaimer">{t.invest.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

function OfficeMap() {
  const { locale, t } = useI18n();
  return (
    <div className="office">
      <h3 className="label">{t.contact.office}</h3>
      <address className="office__address">
        {office.street}, {office.district}
        <br />
        {office.city} – {office.state}, {office.postalCode}
      </address>
      <div className="office__map">
        <iframe
          title={t.contact.officeMap}
          src={officeMapEmbed(locale === "pt" ? "pt-BR" : "es")}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a className="link-more" href={officeMapLink} target="_blank" rel="noopener noreferrer">
        {t.contact.openMaps}
      </a>
    </div>
  );
}

export function ContactSection({ preset, compact }: { preset?: string; compact?: boolean }) {
  const { t } = useI18n();
  const still = cinematic.stills[5];
  return (
    <section id={t.anchors.contact} className={`contact${compact ? " contact--compact" : ""}`} aria-labelledby="contact-title">
      <img className="contact__bg" src={asset(still.path)} alt="" width="1920" height="1080" loading="lazy" decoding="async" />
      <div className="container contact__grid">
        <div className="contact__intro">
          <h2 id="contact-title" className="contact__title">
            {t.contact.title}
          </h2>
          <p className="contact__lead">{t.contact.lead}</p>
          {contact.whatsapp ? (
            <p className="contact__channels">
              {t.contact.channel}:{" "}
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                {formatPhone(contact.whatsapp)}
              </a>
            </p>
          ) : (
            <p className="contact__channels">{t.contact.channelsPending}</p>
          )}
          <OfficeMap />
        </div>
        <div className="contact__panel">
          <ContactForm preset={preset} />
        </div>
      </div>
    </section>
  );
}
