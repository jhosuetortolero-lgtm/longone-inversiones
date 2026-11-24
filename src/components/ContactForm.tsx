import { useId, useState, type FormEvent } from "react";
import { useI18n } from "../i18n";
import { developments } from "../data/developments";
import { contact } from "../data/site";
import { countriesFor, countryByIso } from "../data/countries";

type Status = "idle" | "sending" | "success" | "error" | "offline" | "whatsapp";
type FieldName = "name" | "country" | "countryOther" | "language" | "email" | "ddi" | "whatsapp" | "consent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LOCAL_PHONE_RE = /^[\d\s()-]{6,20}$/;
const INTL_PHONE_RE = /^\+[\d\s()-]{8,22}$/;
const digitCount = (s: string) => s.replace(/\D/g, "").length;
const OTHER = "__other";

/**
 * Inquiry form.
 * - With a WhatsApp number configured (src/data/site.ts), submitting opens WhatsApp
 *   with every field written into the message, ready for the visitor to send.
 * - If a CRM endpoint is also configured, the same data is posted to it in parallel.
 * - With neither, the form says plainly that nothing was sent.
 */
export function ContactForm({ preset }: { preset?: string }) {
  const { locale, t } = useI18n();
  const c = t.contact;
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const countries = countriesFor(locale);
  const defaultDdi = locale === "pt" ? "BR" : "";
  const [country, setCountry] = useState("");
  const [ddi, setDdi] = useState(defaultDdi);
  const [ddiTouched, setDdiTouched] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const id = (n: string) => `${uid}-${n}`;

  function validate(data: Record<string, string>) {
    const e: Partial<Record<FieldName, string>> = {};
    if (!data.name?.trim()) e.name = c.errors.required;
    if (!data.country) e.country = c.errors.required;
    else if (data.country === OTHER && !data.countryOther?.trim()) e.countryOther = c.errors.required;
    if (!data.language) e.language = c.errors.required;
    if (!data.email?.trim()) e.email = c.errors.required;
    else if (!EMAIL_RE.test(data.email.trim())) e.email = c.errors.email;
    const phone = data.whatsapp?.trim();
    if (phone) {
      if (!data.ddi) e.ddi = c.errors.ddi;
      else if (data.ddi === OTHER) {
        if (!INTL_PHONE_RE.test(phone) || digitCount(phone) < 8) e.whatsapp = c.errors.intl;
      } else if (!LOCAL_PHONE_RE.test(phone) || digitCount(phone) < 6 || digitCount(phone) > 15) e.whatsapp = c.errors.whatsapp;
    }
    if (data.consent !== "yes") e.consent = c.errors.consent;
    return e;
  }

  function fullPhone(d: Record<string, string>) {
    const phone = d.whatsapp?.trim();
    if (!phone) return null;
    if (d.ddi === OTHER) return phone;
    return `+${countryByIso(d.ddi)?.dial ?? ""} ${phone}`;
  }

  function resetForm(form: HTMLFormElement) {
    form.reset();
    setCountry("");
    setDdi(defaultDdi);
    setDdiTouched(false);
  }

  function whatsappMessage(d: Record<string, string>, countryName: string) {
    const dev = developments.find((x) => x.slug === d.development);
    const lang = c.languages[d.language as keyof typeof c.languages] ?? d.language;
    const f = c.fields;
    const lines = [
      c.wa.greeting,
      "",
      `*${f.name}:* ${d.name.trim()}`,
      `*${f.country}:* ${countryName}`,
      `*${f.language}:* ${lang}`,
      `*${f.email}:* ${d.email.trim()}`,
      d.whatsapp?.trim() ? `*${f.whatsapp}:* ${fullPhone(d)}` : null,
      `*${f.development}:* ${dev ? `${dev.name} (${dev.code})` : c.anyDevelopment}`,
      d.message?.trim() ? `*${f.message}:* ${d.message.trim()}` : null,
      "",
      `${c.wa.footer}: ${window.location.href}`,
    ];
    return lines.filter((l) => l !== null).join("\n");
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const e = validate(data);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    const countryName = data.country === OTHER ? data.countryOther.trim() : (countryByIso(data.country)?.[locale] ?? data.country);
    const payload = {
      name: data.name.trim(),
      country: countryName,
      preferredLanguage: data.language,
      email: data.email.trim(),
      whatsapp: fullPhone(data),
      development: data.development || null,
      message: data.message?.trim() || null,
      consent: true,
      siteLocale: locale,
      page: window.location.href,
      submittedAt: new Date().toISOString(),
    };

    if (contact.whatsapp) {
      const url = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(whatsappMessage(data, countryName))}`;
      // Must run synchronously inside the submit gesture so the browser allows the new tab.
      const win = window.open(url, "_blank");
      if (win) win.opener = null;
      else window.location.href = url;
      if (contact.endpoint) {
        fetch(contact.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, channel: "whatsapp" }),
          keepalive: true,
        }).catch(() => {});
      }
      setWaUrl(url);
      setStatus("whatsapp");
      resetForm(form);
      return;
    }

    if (!contact.endpoint) {
      setStatus("offline");
      return;
    }
    setStatus("sending");
    const timeout = new AbortController();
    const timer = window.setTimeout(() => timeout.abort(), 15000);
    try {
      const res = await fetch(contact.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: timeout.signal,
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) resetForm(form);
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timer);
    }
  }

  const describe = (n: FieldName, hint?: string) =>
    [errors[n] ? id(`${n}-err`) : null, hint ? id(`${n}-hint`) : null].filter(Boolean).join(" ") || undefined;
  const err = (n: FieldName) =>
    errors[n] ? (
      <p className="field__error" id={id(`${n}-err`)}>
        {errors[n]}
      </p>
    ) : null;

  if (status === "success" || status === "whatsapp") {
    const wa = status === "whatsapp";
    return (
      <div className="form-state form-state--ok" role="status">
        <h3>{wa ? c.opened.title : c.success.title}</h3>
        <p>{wa ? c.opened.text : c.success.text}</p>
        <div className="form-state__actions">
          {wa && (
            <a className="btn btn--solid" href={waUrl} target="_blank" rel="noopener noreferrer">
              {c.opened.open}
            </a>
          )}
          <button type="button" className="btn btn--line" onClick={() => setStatus("idle")}>
            {wa ? c.opened.again : c.success.again}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form" noValidate onSubmit={onSubmit} aria-busy={status === "sending"}>
      {Object.keys(errors).length > 0 && (
        <p className="form__summary" role="alert">
          {c.errors.summary}
        </p>
      )}
      <div className="form__grid">
        <div className="field field--full">
          <label htmlFor={id("name")}>{c.fields.name}</label>
          <input id={id("name")} name="name" type="text" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={describe("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor={id("country")}>{c.fields.country}</label>
          <select
            id={id("country")}
            name="country"
            value={country}
            onChange={(e) => {
              const v = e.target.value;
              setCountry(v);
              // the dialing code follows the country of residence until the visitor picks one
              if (!ddiTouched && v !== OTHER) setDdi(v);
            }}
            required
            aria-invalid={!!errors.country}
            aria-describedby={describe("country")}
          >
            <option value="" disabled>
              {c.countryPlaceholder}
            </option>
            {countries.map((k) => (
              <option key={k.iso} value={k.iso}>
                {k[locale]}
              </option>
            ))}
            <option value={OTHER}>{c.otherCountry}</option>
          </select>
          {err("country")}
        </div>
        <div className="field">
          <label htmlFor={id("language")}>{c.fields.language}</label>
          <select id={id("language")} name="language" defaultValue={locale} required aria-invalid={!!errors.language} aria-describedby={describe("language")}>
            <option value="es">{c.languages.es}</option>
            <option value="pt">{c.languages.pt}</option>
            <option value="en">{c.languages.en}</option>
          </select>
          {err("language")}
        </div>
        {country === OTHER && (
          <div className="field field--full">
            <label htmlFor={id("countryOther")}>{c.otherCountryLabel}</label>
            <input
              id={id("countryOther")}
              name="countryOther"
              type="text"
              autoComplete="country-name"
              required
              autoFocus
              aria-invalid={!!errors.countryOther}
              aria-describedby={describe("countryOther")}
            />
            {err("countryOther")}
          </div>
        )}
        <div className="field field--full">
          <label htmlFor={id("email")}>{c.fields.email}</label>
          <input id={id("email")} name="email" type="email" autoComplete="email" inputMode="email" required aria-invalid={!!errors.email} aria-describedby={describe("email")} />
          {err("email")}
        </div>
        <div className="field field--full">
          <label htmlFor={id("whatsapp")}>
            {c.fields.whatsapp} <span className="field__opt">({c.hints.optional})</span>
          </label>
          <div className="phone">
            <select
              name="ddi"
              aria-label={c.ddi}
              value={ddi}
              onChange={(e) => {
                setDdi(e.target.value);
                setDdiTouched(true);
              }}
              aria-invalid={!!errors.ddi}
              aria-describedby={describe("ddi")}
            >
              <option value="">{c.ddiPlaceholder}</option>
              {countries.map((k) => (
                <option key={k.iso} value={k.iso}>
                  {k[locale]} (+{k.dial})
                </option>
              ))}
              <option value={OTHER}>{c.otherDdi}</option>
            </select>
            <input
              id={id("whatsapp")}
              name="whatsapp"
              type="tel"
              autoComplete={ddi === OTHER ? "tel" : "tel-national"}
              inputMode="tel"
              placeholder={ddi === OTHER ? "+81 90 1234 5678" : c.phonePlaceholder}
              aria-invalid={!!errors.whatsapp}
              aria-describedby={describe("whatsapp", c.hints.whatsapp)}
            />
          </div>
          <p className="field__hint" id={id("whatsapp-hint")}>
            {c.hints.whatsapp}
          </p>
          {err("ddi")}
          {err("whatsapp")}
        </div>
        <div className="field field--full">
          <label htmlFor={id("development")}>{c.fields.development}</label>
          <select id={id("development")} name="development" defaultValue={preset ?? ""}>
            <option value="">{c.anyDevelopment}</option>
            {developments.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field field--full">
          <label htmlFor={id("message")}>
            {c.fields.message} <span className="field__opt">({c.hints.optional})</span>
          </label>
          <textarea id={id("message")} name="message" rows={4} />
        </div>
        <div className="field field--full field--check">
          <input id={id("consent")} name="consent" type="checkbox" value="yes" required aria-invalid={!!errors.consent} aria-describedby={describe("consent")} />
          <label htmlFor={id("consent")}>{c.fields.consent}</label>
          {err("consent")}
        </div>
      </div>

      <div className="form__foot">
        <button type="submit" className="btn btn--solid" disabled={status === "sending"}>
          {status === "sending" ? c.sending : c.submit}
        </button>
        <p className="form__privacy">{contact.whatsapp ? c.whatsappNote : c.privacy}</p>
      </div>

      <div aria-live="polite">
        {status === "error" && (
          <div className="form-state form-state--error" role="alert">
            <h3>{c.error.title}</h3>
            <p>{c.error.text}</p>
          </div>
        )}
        {status === "offline" && (
          <div className="form-state form-state--offline" role="status">
            <h3>{c.notConnected.title}</h3>
            <p>{c.notConnected.text}</p>
          </div>
        )}
      </div>
    </form>
  );
}
