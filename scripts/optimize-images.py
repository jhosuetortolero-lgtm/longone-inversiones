"""
Optimise researched images into responsive WebP sets + a typed manifest.

Inputs  : research/<slug>.json            (source audit written during research)
          research/raw/<slug>/<file>       (downloaded originals — untouched)
          research/destinations.json + research/raw/destinations/
Outputs : public/assets/developments/<slug>/<stem>-<w>.webp
          public/assets/destinations/<stem>-<w>.webp
          src/data/media.generated.json    (consumed by the app)
          docs/IMAGE-MANIFEST.md           (human-readable rights/source manifest)

Run from the project root:  python -P -E scripts/optimize-images.py .
(-P / -E: don't put the script dir or cwd on sys.path, ignore PYTHON* env vars —
the raw folders contain downloaded, untrusted files.)
Requires Pillow.
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = 60_000_000

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
research = root / "research"
raw = research / "raw"
out_dev = root / "public" / "assets" / "developments"
out_dst = root / "public" / "assets" / "destinations"

DEV_FILES = {
    "green-sea-oceanique": "green-sea-oceanique.json",
    "caminho-das-ondas": "caminho-das-ondas.json",
    "more-nature-spa": "more-nature-spa.json",
    "maria-farinha-flats-residence": "maria-farinha.json",
    "green-sea-essence": "green-sea-essence.json",
}
RAW_DIRS = {
    "green-sea-oceanique": "green-sea-oceanique",
    "caminho-das-ondas": "caminho-das-ondas",
    "more-nature-spa": "more-nature-spa",
    "maria-farinha-flats-residence": "maria-farinha",
    "green-sea-essence": "green-sea-essence",
}
WIDTHS = [640, 1024, 1600, 2400]
PORTRAIT_MAX_W = 1600
QUALITY = 78


def dominant(img: Image.Image) -> str:
    small = img.convert("RGB").resize((1, 1), Image.LANCZOS)
    r, g, b = small.getpixel((0, 0))
    return f"#{r:02x}{g:02x}{b:02x}"


def process(src: Path, dest_dir: Path, stem: str) -> dict:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        if im.mode == "RGBA":
            bg = Image.new("RGB", im.size, (14, 17, 22))
            bg.paste(im, mask=im.split()[3])
            im = bg
        w, h = im.size
        cap = PORTRAIT_MAX_W if h > w else max(WIDTHS)
        widths = [x for x in WIDTHS if x <= min(w, cap)]
        if not widths or widths[-1] < min(w, cap) * 0.85:
            widths.append(min(w, cap))  # keep the native size as the top rung
        dest_dir.mkdir(parents=True, exist_ok=True)
        variants = []
        for tw in widths:
            th = round(h * tw / w)
            out = dest_dir / f"{stem}-{tw}.webp"
            if not out.exists() or out.stat().st_mtime < src.stat().st_mtime:
                im.resize((tw, th), Image.LANCZOS).save(out, "WEBP", quality=QUALITY, method=6)
            variants.append({"w": tw, "h": th, "bytes": out.stat().st_size})
        return {"width": w, "height": h, "color": dominant(im), "variants": variants}


def clean_author(img: dict) -> str:
    """Credit line without the licence / 'via Wikimedia Commons' suffix (shown separately)."""
    a = img.get("attribution") or img.get("author") or ""
    return re.sub(r",\s*(CC[^,]*|Public Domain[^,]*)?,?\s*via Wikimedia Commons\s*$", "", a).strip()


def short_license(lic: str | None) -> str | None:
    return re.sub(r"\s*\(.*\)\s*$", "", lic) if lic else lic


manifest = {"developments": {}, "destinations": {}}
md_rows = []

for slug, jf in DEV_FILES.items():
    p = research / jf
    if not p.exists():
        print(f"skip {slug}: {jf} not found")
        continue
    data = json.loads(p.read_text(encoding="utf-8"))
    items = []
    for img in data.get("images", []):
        src = raw / RAW_DIRS[slug] / img["file"]
        if not src.exists():
            print(f"  missing {src}")
            continue
        stem = Path(img["file"]).stem
        info = process(src, out_dev / slug, stem)
        items.append({
            "id": stem,
            "base": f"/assets/developments/{slug}/{stem}",
            "category": img.get("category"),
            "watermark": bool(img.get("watermark")),
            "width": info["width"],
            "height": info["height"],
            "color": info["color"],
            "widths": [v["w"] for v in info["variants"]],
        })
        md_rows.append((slug, f"{stem}-*.webp", img.get("sourceUrl"), img.get("description"),
                        f"{info['width']}x{info['height']}", "Third-party project image (developer/realtor) — authorization required",
                        "yes" if img.get("watermark") else "no"))
    manifest["developments"][slug] = items
    print(f"{slug}: {len(items)} images")

dp = research / "destinations.json"
if dp.exists():
    data = json.loads(dp.read_text(encoding="utf-8"))
    for d in data["destinations"]:
        items = []
        for img in d.get("images", []):
            src = raw / "destinations" / img["file"]
            if not src.exists():
                print(f"  missing {src}")
                continue
            stem = Path(img["file"]).stem
            info = process(src, out_dst, stem)
            items.append({
                "id": stem,
                "base": f"/assets/destinations/{stem}",
                "author": clean_author(img),
                "license": short_license(img.get("license")),
                "licenseUrl": img.get("licenseUrl"),
                "sourceUrl": img.get("commonsPage"),
                "width": info["width"],
                "height": info["height"],
                "color": info["color"],
                "widths": [v["w"] for v in info["variants"]],
            })
            md_rows.append((d["slug"], f"{stem}-*.webp", img.get("commonsPage"), img.get("description"),
                            f"{info['width']}x{info['height']}", f"{img.get('license')} — {img.get('attribution') or img.get('author')}", "no"))
        manifest["destinations"][d["slug"]] = items
        print(f"destination {d['slug']}: {len(items)} images")

gen = root / "src" / "data" / "media.generated.json"
gen.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("wrote", gen)

docs = root / "docs"
docs.mkdir(exist_ok=True)
lines = [
    "# Image manifest",
    "",
    "Generated by `scripts/optimize-images.py`. Every development image below is a **third-party asset** "
    "(developer / construtora / realtor publication) downloaded for a private redesign demonstration. "
    "None is owned by Longone. **Authorization from the rights holder, or replacement with assets supplied "
    "directly by Longone or the developer, is required before public launch.** Destination images are "
    "Wikimedia Commons files under the free licence shown (attribution is rendered on the Credits page).",
    "",
    "| Set | Files | Source | Description (PT) | Original | Rights | Watermark |",
    "|---|---|---|---|---|---|---|",
]
for r in md_rows:
    lines.append("| " + " | ".join(str(c or "").replace("|", "/").replace("\n", " ") for c in r) + " |")
(docs / "IMAGE-MANIFEST.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("wrote docs/IMAGE-MANIFEST.md")
