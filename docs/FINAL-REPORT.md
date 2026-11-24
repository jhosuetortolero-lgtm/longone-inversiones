# Final report: Longone cinematic redesign proposal

Date: 24 November 2026. Status: **built and verified locally.** Not deployed, not approved by Longone.

## 1. What was delivered

**Bilingual static site.** Spanish is the default and Brazilian Portuguese the second language. There are 16 prerendered pages:

- home ×2
- development pages ×10
- credits ×2
- the root language page
- the 404 page

**Cinematic homepage.** Built from the supplied video:

- 190 real frames are drawn to a canvas inside a sticky stage and scrubbed by GSAP ScrollTrigger.
- Five narrative chapters are timed to the footage, with a progress rail and a closing signature.
- Frames load progressively, coarse-to-fine, and only a window of frames is kept decoded within a memory budget.
- Phones get a smaller frame set with a crop that follows the subject.
- Reduced motion, Save-Data and errors all fall back to a static poster.

**Home sections:**

- Brand introduction.
- An editorial sequence for the developments: one full-bleed feature, then portrait, wide and an offset pair. It is not a card grid.
- Destinations, with a sticky crossfading image and Commons credits.
- Investment and lifestyle, with a "no returns promised" disclaimer.
- A contact form with real states.

**Development pages:**

- A cinematic hero: full-bleed, or split when the only good image is portrait.
- Presentation text and a facts table.
- Typologies table and amenities in groups.
- Dated construction progress (María Farinha only).
- Gallery with an accessible lightbox (`<dialog>`, keyboard, focus trap).
- Floor plans where they exist.
- Location with a map link.
- Contact preset to the development.
- Sources with the consultation date, and related developments.

**Localization:** every string in ES and PT, localized URLs, the ES/PT switch in the navigation (saved in `localStorage`), a curtain transition between pages, and `<html lang>` updated on navigation.

**SEO:** per-page title and description, canonical, hreflang (`es`, `pt-BR`, `x-default`), Open Graph and Twitter tags, `sitemap.xml` with alternates, `robots.txt`, and JSON-LD (`RealEstateAgent`, `WebSite`, `ApartmentComplex`, `BreadcrumbList`). The JSON-LD holds no prices or offers.

**Contact:** submitting the form opens WhatsApp to **+55 81 99684-6263** (number supplied by the project owner) with every field written into the message: name, country, language, e-mail, WhatsApp, development (with Longone code), message and the page URL. The visitor confirms by tapping send in WhatsApp; the site says exactly that and never claims the message was delivered. Country is a `<select>` with an "Outro país / Otro país" option that reveals a text field. The optional WhatsApp field has a dialing-code selector ("Chile (+56)", "Espanha (+34)"…, 28 countries in `src/data/countries.ts`, plus "other code"); it follows the country of residence until the visitor picks a code, and the message carries the full international number. An optional CRM endpoint can receive the same data as JSON.

**Office:** Rua Dom Expedito Lopes, 19, Monte, Olinda – PE, 53240-200 (supplied by the project owner). Shown in the contact section with a small Google Maps embed (keyless, lazy-loaded, dark-tinted, pin placed by Google from the address) and an "Abrir no Google Maps" link, in the footer, and in the `RealEstateAgent` JSON-LD (with the WhatsApp number as `telephone`). Confirm the pin position on the live map.

**Scroll:** Lenis inertial wheel scrolling on the GSAP ticker, so the film tracks the smoothed scroll position 1:1 (native momentum on touch, off with reduced motion).

**Hero headline:** the line-reveal mask was enlarged so accents and descenders are never clipped, and a legibility scrim (fading out with the intro) sits behind the headline.

## 2. Files

| Area | Created |
|---|---|
| App | `src/main.tsx`, `src/entry-server.tsx`, `src/app/App.tsx`, `src/pages/*`, `src/sections/*`, `src/components/*` |
| Data | `src/data/developments.ts`, `destinations.ts`, `site.ts`, `media.ts`, `*.generated.json` |
| i18n | `src/i18n/es.ts`, `pt.ts`, `index.tsx` |
| Engine / SEO / motion | `src/lib/frameSequence.ts`, `head.tsx`, `motion.ts` |
| Styles | `src/styles/tokens.css`, `base.css`, `layout.css`, `home.css`, `pages.css` |
| Scripts | `scripts/process-logo.py`, `extract-frames.mjs`, `optimize-images.py`, `prerender.mjs`, `check-routes.mjs` |
| Config | `package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `index.html`, `.env.example`, `.gitignore`, `public/site.webmanifest` |
| Docs | `README.md`, `docs/SOURCE-VERIFICATION.md`, `docs/IMAGE-MANIFEST.md`, this report |
| Research | `research/*.json` (6 audits + Longone listings), `research/raw/**` (originals, git-ignored) |

The project folder was empty at the start, so no existing files were modified. The two supplied files were **copied**, not moved. Their SHA-256 hashes match the originals on the Desktop:

- `Longoneimg.jpg`: 28c8dbe1…
- `longone_video.mp4`: c85f6994…

## 3. Logo processing

- **Source:** `Longoneimg.jpg`, 1984×2164, a white logo on a blue gradient.
- **Method:**
  1. A degree-4 polynomial model of the background, fitted only on pixels far from the artwork. Mean error 1.46/255.
  2. A per-pixel foreground colour taken from nearby solid artwork.
  3. Alpha computed by projection, which removes the blue fringe and the soft drop shadow.
- **Visual check:** the result was composited on obsidian, ivory and the original blue, plus a 3× zoom on the edges. There is no halo and the geometry is unchanged.
- **Outputs:**
  - `longone-logo.png`: original colours, keeping the bevel shading and the light-blue tagline.
  - `-white` and `-ink` versions.
  - Crops of the symbol, the wordmark with tagline, and the name. These are subsets of the original, not new lockups.
  - WebP copies.
  - Favicons and app icons, cut straight from the original artwork.
- Nothing was redrawn or generated.

## 4. Video processing

| Property | Value |
|---|---|
| Source | `longone_video.mp4` |
| Codec | H.264 High, yuv420p, BT.601 matrix |
| Resolution | 1920×1080 (16:9) |
| Frame rate / length | 24 fps, 7.93 s, 190 frames |
| Size | 5.2 MB (with AAC audio) |
| Extracted | **380 WebP frames**: 190 `hd` at 1920 px (10.7 MB) + 190 `md` at 1280 px (6.6 MB), quality 68 |
| Also extracted | 2 posters + 6 editorial stills |
| Phones | load 95 `md` frames (about 3.4 MB) |

The footage runs:

1. bedroom
2. curtains and glass doors
3. balcony with sea view
4. a crossfade to the facade (in the source)
5. the aerial tower and coastline

Chapters are pinned at frames 1, 44, 92, 121 and 150. On the site the sequence is labelled as illustrative, because it does not show any of the five developments.

## 5. Property research

There were 6 research passes (5 developments + destinations), plus a direct audit of longoneinversiones.com.br. Every page could be reached: none was blocked, and nothing was bypassed.

| Development | Sources used | Images kept / rejected | Image quality |
|---|---|---|---|
| Green Sea Oceanique | Júlio Veras pre-sales page, Longone | 30 / 12 | 1 clean 1920 px hero; the rest are ~1000 px presentation slides with captions and developer logos |
| Caminho das Ondas | Queiroz Almeida (construtora, official), Longone | 18 / 5 | originals up to 5504 px, no watermark |
| Morê Nature Spa | Morevie (developer, official), Thayane Moura, Longone | 35 / 16 | up to 8000 px, no watermark, 5 floor plans |
| María Farinha Flats Residence | Multtecnica (builder, official), expoimovel, Longone | 30 / 22 | builder renders ≥1920 px; portal renders 1024 px with a legal strip |
| Green Sea Essence | Balbino Júnior (realtor), Longone | 30 / 6 | ≤1920 px, **all watermarked "BALBINO JUNIOR"** |
| Destinations | Wikimedia Commons, pt.wikipedia | 11 kept | 1920–2560 px, under CC BY, CC BY-SA or Public Domain Mark |

The images were downloaded once into `research/raw/`. They are served only as local optimized copies: **143 development images** and **11 destination images**, each as responsive WebP. Nothing is hotlinked.

Image selection:

- Every kept image was checked by eye on contact sheets to make sure it belongs to the right development.
- Slides that make investment claims, PDF-viewer captures, stock photos and other buildings were rejected.
- No image is reused across developments.

## 6. Missing or unconfirmed information

Full detail is in `docs/SOURCE-VERIFICATION.md`.

- **Stage conflicts** between Longone's listings and the developers:
  - Caminho das Ondas: Pré-Lançamento vs Em Obra
  - Morê Nature Spa: Em Construção vs Lançamento
  - Green Sea Essence: Pré-Lançamento vs Lançamento

  The developer or builder value is shown where one exists.
- **Delivery dates that rest on Longone alone:**
  - Oceanique 11/2030
  - María Farinha 11/2027 (an outdated portal table says 01/2027)
  - Essence 09/2029 (the realtor gives only "2029")
- **Morê Nature Spa delivery:** Longone's 09/2029 is not published, because the developer states only "36 months from launch".
- **Not published because the sources conflict or a source is missing:**
  - Oceanique: developer, unit count and tower count.
  - Essence: developer, parking, floors and the 2-bedroom suite.
  - Morê Nature Spa: builder name and vila name.
- **Never published:** any price, payment plan, yield, appreciation, occupancy or "% vendido" claim.
- **Company facts:** Longone publishes no history and no CRECI number, so none are invented. The brand copy for the intro and the investment section is proposal copy and needs Longone's validation.

## 7. Permissions required before any public use

1. **Every development image is third-party material** from developers, construtoras, realtors or portals. Each needs written authorization or replacement with files supplied by Longone or the developer. The site says this in the footer, under each gallery and on the credits page. Priority replacements:
   - Green Sea Essence, which is watermarked;
   - Green Sea Oceanique, which has low-resolution slides.
2. **Destination photos** are free licences. Attribution is shown next to each photo and on `/creditos`. The CC BY-SA files keep their licence.
3. **Video and logo** were supplied for this proposal. Confirm the rights for public use.
4. **Approval:** the site says it is a conceptual proposal and not an official site. Longone must approve the content before launch.

## 8. Build and test results

| Check | Result |
|---|---|
| `tsc -b` (strict) | ✅ 0 errors |
| `eslint .` | ✅ 0 issues |
| `vite build` + SSR + prerender | ✅ 16 pages. JS gzip: React 83 KB, GSAP 46 KB, app 36 KB. CSS 8.7 KB gzip |
| `check-routes.mjs` | ✅ 14 routes. For each: `lang`, title, description, canonical, 3 hreflang, OG image, h1, hydration marker, every referenced asset present. Sitemap and robots OK, no dead internal links |
| Browser, desktop 1745×814 (Chrome) | ✅ frames scrub through all chapters; signature; header transparent over the film; intro, features, destinations crossfade, invest, contact |
| Hydration | ✅ no console errors after two fixes (React's inline image preloads moved to `<head>`; prerendered routes written as `.html` so hosts serve the right page) |
| Language switch | ✅ URL, `lang`, title, canonical and hreflang update; choice saved |
| Form | ✅ validation messages, focus on the first error, "not connected" state, **no network request made** |
| Lightbox | ✅ opens, arrow keys move between images, focus stays inside, closes |
| Mobile 390 px / tablet 820 px (iframe emulation) | ✅ layouts correct. Phones load the `md` set every 2nd frame (96 requests). A horizontal overflow from the 100vw feature was found and fixed |

Not tested:

- **Reduced-motion and Save-Data fallbacks:** verified in code only; the browser could not emulate them.
- **Safari / Firefox and real phones.**
- **Lighthouse audit.**

## 9. Pending integrations

- `VITE_CONTACT_ENDPOINT`: the CRM or webhook URL. The JSON fields are documented in the README.
- WhatsApp: configured (+55 81 99684-6263). Confirm with Longone that this is the number that should receive public inquiries.
- `VITE_CONTACT_EMAIL`: official e-mail, still unknown.
- `VITE_SITE_URL` if the site will not run on longoneinversiones.com.br.
- Hosting rules: `cleanUrls` / `try_files … $uri.html` and `404.html`.
- Optional: per-development JPG Open Graph images. Development pages use WebP today, and the home page uses a JPG.
- Optional: leave the 5 MB source video and the 1.9 MB original logo copies out of the deployed `public/` folder. The site does not use them at runtime.
