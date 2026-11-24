import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate, useParams } from "react-router";
import { DEFAULT_LOCALE, I18nProvider, LOCALE_STORAGE_KEY, getDictionary, isLocale, paths, useI18n, type Locale } from "../i18n";
import { useHead } from "../lib/head";
import { site } from "../data/site";
import { withBase } from "../lib/base";
import { PageTransitionProvider } from "../components/PageTransition";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import HomePage from "../pages/HomePage";
import DevelopmentPage from "../pages/DevelopmentPage";
import CreditsPage from "../pages/CreditsPage";
import NotFoundPage from "../pages/NotFoundPage";

function Shell({ locale }: { locale: Locale }) {
  return (
    <I18nProvider locale={locale}>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </I18nProvider>
  );
}

function LocaleLayout() {
  const { lang } = useParams();
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  useEffect(() => {
    if (!isLocale(lang)) return;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);
  return <Shell locale={locale} />;
}

/** /es/empreendimentos/x or /pt/emprendimientos/x → canonical segment for the locale. */
function DevelopmentRoute({ segment }: { segment: string }) {
  const { lang, slug } = useParams();
  if (!isLocale(lang)) return <NotFoundPage />;
  if (getDictionary(lang).paths.developments !== segment) return <Navigate replace to={paths.development(lang, slug ?? "")} />;
  return <DevelopmentPage />;
}

function LocaleIndex() {
  const { lang } = useParams();
  return isLocale(lang) ? <HomePage /> : <NotFoundPage />;
}

function LocaleCredits() {
  const { lang } = useParams();
  return isLocale(lang) ? <CreditsPage /> : <NotFoundPage />;
}

/** "/" — choose the saved language, else the browser's, else Spanish. */
function RootRedirect() {
  const navigate = useNavigate();
  const { t } = useI18n();
  useHead({ title: t.meta.homeTitle, description: t.meta.homeDescription, locale: "es", path: paths.home("es"), noindex: true });
  useEffect(() => {
    let l: Locale = DEFAULT_LOCALE;
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY) ?? undefined;
      if (isLocale(saved)) l = saved;
      else if (navigator.languages?.some((x) => x.toLowerCase().startsWith("pt"))) l = "pt";
    } catch {
      /* ignore */
    }
    navigate(paths.home(l), { replace: true });
  }, [navigate]);
  return (
    <div className="root-select">
      <img src={site.logo.wordmarkWhite} alt={site.name} width="800" height="282" />
      <nav aria-label="Idioma / Idioma">
        <a href={withBase(paths.home("es"))} hrefLang="es" lang="es">
          Español
        </a>
        <a href={withBase(paths.home("pt"))} hrefLang="pt-BR" lang="pt-BR">
          Português
        </a>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <PageTransitionProvider>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path=":lang" element={<LocaleLayout />}>
          <Route index element={<LocaleIndex />} />
          <Route path="emprendimientos/:slug" element={<DevelopmentRoute segment="emprendimientos" />} />
          <Route path="empreendimentos/:slug" element={<DevelopmentRoute segment="empreendimentos" />} />
          <Route path="creditos" element={<LocaleCredits />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </PageTransitionProvider>
  );
}
