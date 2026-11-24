import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useLocation } from "react-router";
import { LOCALES, LOCALE_STORAGE_KEY, paths, translatePath, useI18n, type Locale } from "../i18n";
import { site } from "../data/site";
import { TransitionLink } from "./TransitionLink";
import { usePageTransition } from "./PageTransition";
import { lockScroll } from "../lib/smoothScroll";
import { withBase } from "../lib/base";

function LangSwitch({ onSwitch }: { onSwitch?: () => void }) {
  const { locale, t } = useI18n();
  const { pathname } = useLocation();
  const { go } = usePageTransition();
  const choose = (l: Locale) => (e: MouseEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* storage unavailable: selection still applies through the URL */
    }
    onSwitch?.();
    if (l !== locale) go(translatePath(pathname, l));
  };
  return (
    <div className="lang" role="group" aria-label={t.nav.language}>
      {LOCALES.map((l) => (
        <a
          key={l}
          href={withBase(translatePath(pathname, l))}
          hrefLang={l === "pt" ? "pt-BR" : "es"}
          lang={l === "pt" ? "pt-BR" : "es"}
          aria-current={l === locale ? "true" : undefined}
          title={l === locale ? undefined : t.nav.switchTo}
          onClick={choose(l)}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}

export function Header() {
  const { locale, t } = useI18n();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const a = t.anchors;
  const darkHero =
    pathname === paths.home(locale) || pathname === `/${locale}` || pathname.startsWith(`/${locale}/${t.paths.developments}/`);

  // Transparent while a dark hero (film or development hero) sits under the bar, solid afterwards.
  useEffect(() => {
    const onScroll = () => {
      const overlay = document.querySelector<HTMLElement>("[data-header-overlay]");
      setScrolled(overlay ? overlay.getBoundingClientRect().bottom <= 84 : window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { to: paths.section(locale, a.developments), label: t.nav.developments },
    { to: paths.section(locale, a.destinations), label: t.nav.destinations },
    { to: paths.section(locale, a.invest), label: t.nav.invest },
    { to: paths.section(locale, a.contact), label: t.nav.contact },
  ];
  // Unlock scrolling synchronously: a menu link scrolls right after this runs,
  // before React's effect for `open` would release the lock.
  const close = () => {
    document.documentElement.classList.remove("menu-open");
    lockScroll(false);
    setOpen(false);
  };

  return (
    <header className={`header${scrolled || !darkHero ? " header--solid" : ""}${open ? " header--open" : ""}`}>
      <a className="skip" href="#main">
        {t.nav.skip}
      </a>
      <div className="header__bar">
        <TransitionLink to={paths.home(locale)} className="header__logo" aria-label={t.nav.home}>
          <img src={site.logo.nameWhite} alt="Longone" width="800" height="195" />
        </TransitionLink>
        <nav className="header__nav" aria-label={t.nav.main}>
          <ul>
            {links.map((l) => (
              <li key={l.to}>
                <TransitionLink to={l.to}>{l.label}</TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header__actions">
          <LangSwitch />
          <TransitionLink className="btn btn--line header__cta" to={paths.section(locale, a.contact)}>
            {t.nav.advisor}
          </TransitionLink>
          <button
            ref={toggleRef}
            type="button"
            className="header__toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div id="site-menu" className="menu" hidden={!open}>
        <nav aria-label={t.nav.main}>
          <ul>
            {links.map((l) => (
              <li key={l.to}>
                <TransitionLink to={l.to} onClick={close}>
                  {l.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu__foot">
          <LangSwitch onSwitch={close} />
          <TransitionLink className="btn btn--solid" to={paths.section(locale, a.contact)} onClick={close}>
            {t.nav.advisor}
          </TransitionLink>
        </div>
      </div>
    </header>
  );
}
