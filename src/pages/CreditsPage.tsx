import { developments, SOURCES_CONSULTED } from "../data/developments";
import { destinations } from "../data/destinations";
import { destinationMedia, developmentMedia } from "../data/media";
import { formatDate, paths, useI18n } from "../i18n";
import { useHead } from "../lib/head";
import { TransitionLink } from "../components/TransitionLink";

export default function CreditsPage() {
  const { locale, t } = useI18n();
  const c = t.credits;
  useHead({ title: t.meta.creditsTitle, description: t.meta.creditsDescription, locale, path: paths.credits(locale) });
  return (
    <div className="page container">
      <header className="page__head">
        <h1 className="page__title">{c.title}</h1>
        <p className="page__lead">{c.lead}</p>
      </header>

      <section className="credits" aria-labelledby="cr-dev">
        <h2 id="cr-dev" className="block-title">
          {c.developments}
        </h2>
        <p className="note">{t.dev.imageNotice}</p>
        <ul className="credits__list">
          {developments.map((d) => (
            <li key={d.slug}>
              <h3>
                <TransitionLink to={paths.development(locale, d.slug)}>{d.name}</TransitionLink>
              </h3>
              <p>
                {developmentMedia(d.slug).length} {c.images}
              </p>
              <ul>
                {d.sources.map((s) => (
                  <li key={s.url}>
                    {s.kind[locale]}:{" "}
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="note">
          {t.dev.consulted} {formatDate(SOURCES_CONSULTED, locale)}.
        </p>
      </section>

      <section className="credits" aria-labelledby="cr-dest">
        <h2 id="cr-dest" className="block-title">
          {c.destinations}
        </h2>
        <ul className="credits__list">
          {destinations.map((d) => (
            <li key={d.slug}>
              <h3>{d.name[locale]}</h3>
              <ul>
                {destinationMedia(d.slug).map((m) => (
                  <li key={m.id}>
                    {c.author}: {m.author}. {c.license}:{" "}
                    <a href={m.licenseUrl ?? "#"} target="_blank" rel="noopener noreferrer license">
                      {m.license}
                    </a>
                    .{" "}
                    <a href={m.sourceUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                      {c.source}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="credits__facts">
                {[...new Set(d.facts.map((f) => f.source))].map((u) => (
                  <li key={u}>
                    <a href={u} target="_blank" rel="noopener noreferrer">
                      {decodeURIComponent(u.replace("https://", ""))}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="credits" aria-labelledby="cr-film">
        <h2 id="cr-film" className="block-title">
          {c.film}
        </h2>
        <p>{c.filmText}</p>
        <h2 className="block-title">{c.brand}</h2>
        <p>{c.brandText}</p>
      </section>
    </div>
  );
}
