import cinematic from "../data/cinematic.generated.json";
import { site } from "../data/site";
import { asset } from "../lib/base";
import { paths, useI18n } from "../i18n";
import { organizationLd, useHead } from "../lib/head";
import { CinematicHero } from "../sections/CinematicHero";
import { BrandIntro, ContactSection, DestinationsSection, FeaturedDevelopments, InvestSection } from "../sections/HomeSections";

export default function HomePage() {
  const { locale, t } = useI18n();
  useHead({
    title: t.meta.homeTitle,
    description: t.meta.homeDescription,
    locale,
    path: paths.home(locale),
    preloadImage: {
      href: asset(cinematic.poster.md),
      srcset: `${asset(cinematic.poster.md)} ${cinematic.sets.md.width}w, ${asset(cinematic.poster.hd)} ${cinematic.sets.hd.width}w`,
      sizes: "100vw",
    },
    jsonLd: [
      organizationLd(),
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: site.name,
        url: `${site.url}${paths.home(locale)}`,
        inLanguage: t.htmlLang,
      },
    ],
  });
  return (
    <>
      <CinematicHero />
      <BrandIntro />
      <FeaturedDevelopments />
      <DestinationsSection />
      <InvestSection />
      <ContactSection />
    </>
  );
}
