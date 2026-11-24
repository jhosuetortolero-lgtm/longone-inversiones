import { useLocation } from "react-router";
import { LOCALES, paths, translatePath, useI18n } from "../i18n";
import { developments } from "../data/developments";
import { office, officeMapLink, site } from "../data/site";
import { TransitionLink } from "./TransitionLink";

export function Footer() {
  const { locale, t } = useI18n();
  const { pathname } = useLocation();
  const a = t.anchors;
  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <img src={site.logo.wordmarkWhite} alt={site.name} width="800" height="282" loading="lazy" />
          <p>{t.footer.tagline}</p>
          <address className="footer__address">
            <a href={officeMapLink} target="_blank" rel="noopener noreferrer">
              {office.street}, {office.district}
              <br />
              {office.city} – {office.state}, {office.postalCode}
            </a>
          </address>
          <p className="footer__signature" lang="en">
            {site.signature}
          </p>
        </div>
        <nav className="footer__col" aria-label={t.nav.developments}>
          <h2 className="label">{t.nav.developments}</h2>
          <ul>
            {developments.map((d) => (
              <li key={d.slug}>
                <TransitionLink to={paths.development(locale, d.slug)}>{d.name}</TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="footer__col" aria-label={t.footer.explore}>
          <h2 className="label">{t.footer.explore}</h2>
          <ul>
            <li>
              <TransitionLink to={paths.section(locale, a.destinations)}>{t.nav.destinations}</TransitionLink>
            </li>
            <li>
              <TransitionLink to={paths.section(locale, a.invest)}>{t.nav.invest}</TransitionLink>
            </li>
            <li>
              <TransitionLink to={paths.section(locale, a.contact)}>{t.nav.contact}</TransitionLink>
            </li>
            <li>
              <TransitionLink to={paths.credits(locale)}>{t.footer.credits}</TransitionLink>
            </li>
          </ul>
        </nav>
        <div className="footer__col">
          <h2 className="label">{t.footer.language}</h2>
          <ul>
            {LOCALES.map((l) => (
              <li key={l}>
                <TransitionLink
                  to={translatePath(pathname, l)}
                  hrefLang={l === "pt" ? "pt-BR" : "es"}
                  aria-current={l === locale ? "true" : undefined}
                >
                  {l === "es" ? "Español" : "Português"}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer__legal container">
        <p>
          © {new Date().getUTCFullYear()} {t.footer.rights}
        </p>
        <p>{t.footer.proposal}</p>
        <p>{t.footer.images}</p>
      </div>
    </footer>
  );
}
