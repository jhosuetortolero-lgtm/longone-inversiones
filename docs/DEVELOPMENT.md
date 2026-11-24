# Longone Inversiones Inmobiliárias — cinematic redesign proposal

This is a bilingual website: Spanish is the default and Brazilian Portuguese is the second language. It presents Longone's five coastal developments in the Brazilian Northeast. It is a **private commercial proposal**, not the official website. See `FINAL-REPORT.md` for the delivery report and `SOURCE-VERIFICATION.md` for the data audit. The main project README (Portuguese) is at the repository root.

## Quick start

```bash
npm install
npm run build      # typecheck → client build → SSR build → static prerender (dist/)
npm run preview    # http://localhost:4173/es/
npm run check:routes   # SEO / route / asset checks on dist/
npm run lint
npm run dev        # development server (client-rendered)
```

Requirements:

- Node 20 or newer (tested on 24).
- For the asset pipelines only: ffmpeg and ffprobe 6 or newer, and Python 3.11 or newer with Pillow and numpy.

## Stack

- React 19, TypeScript, Vite 6.
- React Router 7 in library mode, with locale routes `/es/…` and `/pt/…`.
- GSAP 3 with ScrollTrigger for the scroll film, image reveals and the page curtain.
- Plain CSS with design tokens in `src/styles/tokens.css`.
- Self-hosted variable fonts: Newsreader for display and Jost for text.
- **Static prerender.** Every route is rendered to real HTML with its own `lang`, title, description, canonical, hreflang, Open Graph and JSON-LD (`scripts/prerender.mjs`). The client hydrates only when the HTML was prerendered for that exact URL.

## Routes

| ES | PT |
|---|---|
| `/es/` | `/pt/` |
| `/es/emprendimientos/<slug>` | `/pt/empreendimentos/<slug>` |
| `/es/creditos` | `/pt/creditos` |

The slugs are:

- `green-sea-oceanique`
- `caminho-das-ondas`
- `more-nature-spa`
- `maria-farinha-flats-residence`
- `green-sea-essence`

`/` sends the visitor to the saved language, else the browser's language, else Spanish. A wrong segment (for example `/pt/emprendimientos/x`) redirects to the right one.

How the routes are written to disk:

- Slash-less routes are written as `<route>.html`, for example `dist/es/emprendimientos/more-nature-spa.html`.
- They are served at the clean URL by Vercel (`cleanUrls: true`), Netlify, Cloudflare Pages and `vite preview`.
- Unknown URLs should be served `dist/404.html`.

## Where things live

```
src/
  data/developments.ts     property database (verified fields only, ES/PT)
  data/destinations.ts     destination facts (Wikipedia-sourced) + photo ids
  data/site.ts             brand settings + contact configuration (env)
  data/media.generated.json        image manifest (generated)
  data/cinematic.generated.json    frame-sequence manifest (generated)
  i18n/es.ts, i18n/pt.ts   every UI string, ES and PT
  lib/frameSequence.ts     canvas frame engine (progressive loading, decode cache)
  lib/head.tsx             SEO head (SSR + client), JSON-LD helpers
  lib/motion.ts            GSAP registration + animation settings
  sections/CinematicHero.tsx       scroll film
  sections/HomeSections.tsx        intro, developments, destinations, invest, contact
  pages/                   Home, Development, Credits, 404
scripts/
  process-logo.py          isolates the original logo from its blue background
  extract-frames.mjs       video → WebP frame sets + manifests
  optimize-images.py       research images → responsive WebP + manifests
  prerender.mjs            static HTML, sitemap.xml, robots.txt, 404.html
  check-routes.mjs         post-build verification
research/                  source audit (JSON) + raw downloads (git-ignored)
docs/                      verification report, image manifest, final report
```

## Configuration

Copy `.env.example` to `.env` and fill it in. The WhatsApp number that receives inquiries defaults to **+55 81 99684-6263** (`src/data/site.ts`, supplied by the project owner). E-mail and CRM endpoint stay empty until Longone confirms them.

| Variable | Effect |
|---|---|
| `VITE_SITE_URL` | Origin used for canonical, hreflang, sitemap and Open Graph. Defaults to `https://longoneinversiones.com.br`. |
| `VITE_CONTACT_WHATSAPP` | Overrides the WhatsApp number. On submit, the form opens WhatsApp (`wa.me`) with every field written into the message; the visitor taps send in WhatsApp. |
| `VITE_CONTACT_ENDPOINT` | Optional HTTPS URL that also receives the inquiry as JSON (in parallel when WhatsApp is set). With neither WhatsApp nor endpoint, the form says plainly that nothing was sent. |
| `VITE_CONTACT_EMAIL` | Official address. Enables a `mailto:` fallback. |

The form sends this JSON:

```
{ name, country, preferredLanguage, email, whatsapp, development, message, consent, siteLocale, page, submittedAt }
```

Success is shown only when the endpoint answers with HTTP 2xx.

## Asset pipelines

The original supplied files are never modified. Copies live in `public/assets/brand/Longoneimg.jpg` and `public/assets/cinematic/source/longone_video.mp4`.

```bash
npm run logo     # python scripts/process-logo.py .
npm run frames   # node scripts/extract-frames.mjs [video] [--quality 68]
npm run images   # python scripts/optimize-images.py .
```

**Logo** (`process-logo.py`):

1. Fits the blue gradient background with a polynomial.
2. Estimates the local foreground colour.
3. Computes alpha by projection, which un-mixes the white artwork from the blue.
4. Writes transparent variants:
   - colour, white and ink versions of the full lockup;
   - symbol, wordmark and name crops;
   - favicons cut from the original artwork.

The geometry is untouched.

**Frames** (`extract-frames.mjs`) produces:

- `hd`: 1920 px wide, all 190 frames, about 10.7 MB.
- `md`: 1280 px wide, all 190 frames, about 6.6 MB. Phones load every second `md` frame (95 frames, about 3.4 MB).
- Two posters and six stills taken from the film.

## The cinematic sequence

- **Sticky stage, not a JS pin.** The section is `100svh + 300vh` tall (210vh on phones), and the stage is `position: sticky`. Scrolling stays native, with no scroll-jacking and no smooth-scroll library.
- **Smooth wheel scrolling.** Lenis (`src/lib/smoothScroll.ts`) adds inertia to mouse-wheel scrolling and runs on the GSAP ticker, so the film follows the smoothed position 1:1. Touch devices keep native momentum; reduced motion disables it.
- **Scrubbing.** A GSAP timeline is scrubbed (1:1 with Lenis, 0.35 s catch-up without it). It drives:
  - the frame position;
  - five chapter captions, timed to the footage: interior, threshold, balcony, architecture, horizon;
  - a progress rail;
  - the closing "Beyond real estate." line.
- **`FrameSequence`.** Frames are fetched coarse-to-fine: every 16th frame, then 8th, 4th, 2nd and 1st. Only a window of frames around the playhead is decoded into ImageBitmaps. The window comes from a memory budget: 64 MB on phones, 140–260 MB on desktop. Frames farthest from the playhead are freed first.
- **Drawing.** Neighbouring frames are crossfaded for slow scrolls. If a frame is not decoded yet, the nearest decoded one is drawn, so the canvas never goes blank. On portrait screens the crop follows the subject through a per-frame focal point.
- **Static fallback.** The page falls back to the static poster, with no pin and no frame downloads, in these cases:
  - `prefers-reduced-motion`;
  - Save-Data;
  - no canvas support;
  - the first frame or more than 25 % of frames fail to load.

## Deploying

The output is fully static: deploy `dist/`.

- **Vercel:** add `"cleanUrls": true` to `vercel.json`.
- **Nginx:** use `try_files $uri $uri.html $uri/ /404.html;`.

Before going public:

- replace or authorize the third-party project images (`docs/IMAGE-MANIFEST.md`);
- connect the contact endpoint.
