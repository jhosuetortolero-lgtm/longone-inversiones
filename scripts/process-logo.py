"""
Longone logo isolation.

Source of truth: public/assets/brand/Longoneimg.jpg (never modified).
Produces transparent variants by *unmixing* the white artwork from the blue
gradient background — geometry, proportions and typography are untouched.

Method
  1. Fit a smooth polynomial model of the blue gradient background using only
     pixels far from the artwork (excludes the soft drop shadow).
  2. Estimate the local foreground colour from nearby fully-opaque artwork pixels.
  3. alpha = projection of (pixel - background) onto (foreground - background).
  4. Re-composite over the fitted background and report the reconstruction error.

Usage:  python -I scripts/process-logo.py <project-root>
Requires: numpy, Pillow
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
brand = root / "public" / "assets" / "brand"
src = brand / "Longoneimg.jpg"

P = np.asarray(Image.open(src).convert("RGB")).astype(np.float64) / 255.0
H, W, _ = P.shape
R = P[..., 0]


def dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    im = Image.fromarray((mask * 255).astype(np.uint8))
    # MaxFilter needs odd size; apply in steps to reach large radii cheaply
    steps, size = divmod(radius, 7)
    for _ in range(steps):
        im = im.filter(ImageFilter.MaxFilter(15))
    if size:
        im = im.filter(ImageFilter.MaxFilter(2 * size + 1))
    return np.asarray(im) > 127


def blur(a: np.ndarray, r: float) -> np.ndarray:
    """Separable Gaussian blur (sigma=r) on a float array, edge-padded."""
    k = int(np.ceil(3 * r))
    t = np.arange(-k, k + 1)
    w = np.exp(-(t ** 2) / (2 * r * r))
    w /= w.sum()
    out = a.astype(np.float64)
    for axis in (0, 1):
        pad_width = [(0, 0), (0, 0)]
        pad_width[axis] = (k, k)
        p = np.pad(out, pad_width, mode="edge")
        acc = np.zeros_like(out)
        n = out.shape[axis]
        for i, wi in enumerate(w):
            acc += wi * (p[i:i + n] if axis == 0 else p[:, i:i + n])
        out = acc
    return out


# ---- 1. background model -------------------------------------------------
art = R > (140 / 255)
keepout = dilate(art, 70)  # shadow + anti-aliasing excluded from the fit
bg_pixels = ~keepout
yy, xx = np.mgrid[0:H, 0:W]
xn, yn = xx / W - 0.5, yy / H - 0.5


def basis(x, y, deg=4):
    cols = []
    for i in range(deg + 1):
        for j in range(deg + 1 - i):
            cols.append((x ** i) * (y ** j))
    return np.stack(cols, axis=-1)


sel = np.where(bg_pixels.ravel())[0][::7]
A = basis(xn.ravel()[sel], yn.ravel()[sel])
Bfull = np.empty_like(P)
Afull = basis(xn, yn)
for c in range(3):
    coef, *_ = np.linalg.lstsq(A, P[..., c].ravel()[sel], rcond=None)
    Bfull[..., c] = Afull @ coef
fit_err = np.abs(Bfull - P)[bg_pixels].mean() * 255
print(f"background fit mean abs error: {fit_err:.2f}/255")

# ---- 2. local foreground colour -----------------------------------------
interior = R > (178 / 255)
wsum = blur(interior.astype(np.float64), 2.5)
F = np.empty_like(P)
for c in range(3):
    F[..., c] = blur(P[..., c] * interior, 2.5) / np.maximum(wsum, 1e-6)
near = wsum > 1e-3
F[~near] = 1.0
F[interior] = P[interior]

# ---- 3. alpha by projection ---------------------------------------------
d = F - Bfull
num = ((P - Bfull) * d).sum(-1)
den = np.maximum((d * d).sum(-1), 1e-6)
alpha = np.clip(num / den, 0, 1)
alpha[~near] = 0.0
alpha[interior] = 1.0
alpha[alpha < 0.035] = 0.0
alpha[alpha > 0.965] = 1.0

# ---- 4. verify reconstruction -------------------------------------------
recon = F * alpha[..., None] + Bfull * (1 - alpha[..., None])
mask_edge = (alpha > 0) & (alpha < 1)
err_all = np.abs(recon - P).mean() * 255
err_edge = np.abs(recon - P)[mask_edge].mean() * 255
print(f"reconstruction error: whole image {err_all:.2f}/255, edge pixels {err_edge:.2f}/255 "
      f"({mask_edge.sum()} edge px)")

# bounding box
ys, xs = np.where(alpha > 0)
pad = 24
x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, W)
y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, H)
print("artwork bbox", (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())))


def rgba(color_rgb: np.ndarray, a: np.ndarray) -> Image.Image:
    out = np.dstack([np.clip(color_rgb, 0, 1), a])
    return Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA")


A8 = alpha
variants = {
    # original artwork colours (white + subtle bevel + light-blue tagline)
    "longone-logo.png": rgba(F, A8),
    "longone-logo-white.png": rgba(np.ones_like(F), A8),
    "longone-logo-ink.png": rgba(np.broadcast_to(np.array([14, 17, 22]) / 255, F.shape), A8),
}

# row bands (detected from the artwork): symbol / wordmark / tagline
rows = (alpha > 0).sum(1)
bands, inside = [], False
for y, v in enumerate(rows):
    if v and not inside:
        start, inside = y, True
    elif not v and inside:
        bands.append((start, y))
        inside = False
bands = [b for b in bands if b[1] - b[0] > 20]
print("bands", bands)
symbol_band, word_band, tag_band = bands[0], bands[1], bands[-1]


def crop_band(img: Image.Image, y_from: int, y_to: int) -> Image.Image:
    sub = np.asarray(img)[y_from:y_to]
    a = sub[..., 3] > 0
    cx = np.where(a.any(0))[0]
    return Image.fromarray(sub[:, max(cx.min() - pad, 0): cx.max() + pad + 1])


out_dir = brand
for name, img in variants.items():
    img.crop((x0, y0, x1, y1)).save(out_dir / name, optimize=True)
    print("wrote", name)

for tone in ("white", "ink"):
    full = variants[f"longone-logo-{tone}.png"]
    crop_band(full, symbol_band[0] - pad, symbol_band[1] + pad).save(out_dir / f"longone-symbol-{tone}.png", optimize=True)
    crop_band(full, word_band[0] - pad, tag_band[1] + pad).save(out_dir / f"longone-wordmark-{tone}.png", optimize=True)
    crop_band(full, word_band[0] - pad, word_band[1] + pad).save(out_dir / f"longone-name-{tone}.png", optimize=True)

# web-sized WebP copies
for p in sorted(out_dir.glob("longone-*.png")):
    im = Image.open(p)
    max_w = 1200 if "logo" in p.name else 800
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(p.with_suffix(".webp"), "WEBP", quality=92, method=6)

# favicons: crop of the ORIGINAL artwork (white symbol on the original blue), square
sx = np.where((alpha[symbol_band[0]:symbol_band[1]] > 0).any(0))[0]
cx, cy = (sx.min() + sx.max()) // 2, (symbol_band[0] + symbol_band[1]) // 2
half = int(max(sx.max() - sx.min(), symbol_band[1] - symbol_band[0]) * 0.62)
orig = Image.open(src).convert("RGB")
sq = orig.crop((cx - half, cy - half, cx + half, cy + half))
public = root / "public"
for size, name in ((512, "icon-512.png"), (192, "icon-192.png"), (180, "apple-touch-icon.png"), (48, "favicon-48.png"), (32, "favicon-32.png")):
    sq.resize((size, size), Image.LANCZOS).save(public / name, optimize=True)
sq.resize((48, 48), Image.LANCZOS).save(public / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# verification sheets (scratch, not shipped)
if len(sys.argv) > 2:
    sheet_dir = Path(sys.argv[2])
    logo = variants["longone-logo.png"].crop((x0, y0, x1, y1))
    w, h = logo.size
    sheet = Image.new("RGB", (w * 3, h), (0, 0, 0))
    for i, bgc in enumerate([(11, 13, 16), (244, 239, 230), (46, 134, 217)]):
        tile = Image.new("RGBA", (w, h), bgc + (255,))
        src_logo = logo if i != 1 else variants["longone-logo-ink.png"].crop((x0, y0, x1, y1))
        tile.alpha_composite(src_logo)
        sheet.paste(tile.convert("RGB"), (i * w, 0))
    sheet.resize((w * 3 // 3, h // 3)).save(sheet_dir / "logo-check.jpg", quality=88)
    # zoomed edge check of the "G" loop
    zx, zy = int(W * 0.52), int(H * 0.70)
    z = Image.new("RGBA", (300, 200), (11, 13, 16, 255))
    z.alpha_composite(variants["longone-logo.png"].crop((zx, zy, zx + 300, zy + 200)))
    z.convert("RGB").resize((900, 600), Image.NEAREST).save(sheet_dir / "logo-edge-zoom.png")
    print("verification sheets written")
