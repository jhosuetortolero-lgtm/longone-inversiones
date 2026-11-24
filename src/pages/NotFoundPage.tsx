import { useLocation } from "react-router";
import { developments } from "../data/developments";
import { paths, useI18n } from "../i18n";
import { useHead } from "../lib/head";
import { TransitionLink } from "../components/TransitionLink";

export default function NotFoundPage() {
  const { locale, t } = useI18n();
  const { pathname } = useLocation();
  useHead({ title: t.meta.notFoundTitle, description: t.notFound.text, locale, path: pathname, noindex: true, noAlternates: true });
  return (
    <div className="page container notfound">
      <h1 className="page__title">{t.notFound.title}</h1>
      <p className="page__lead">{t.notFound.text}</p>
      <TransitionLink className="btn btn--solid" to={paths.home(locale)}>
        {t.notFound.home}
      </TransitionLink>
      <ul className="notfound__list">
        {developments.map((d) => (
          <li key={d.slug}>
            <TransitionLink to={paths.development(locale, d.slug)}>{d.name}</TransitionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
