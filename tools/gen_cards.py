#!/usr/bin/env python3
"""
Generatore di carte "Santini del Dharma" in formato immagine (PNG/JPEG).

Uso:
    python3 tools/gen_cards.py [--jpeg]

Richiede: Pillow (pip install pillow) e matplotlib (per i font DejaVu Serif).
Legge i dati delle carte da tools/cards_data.json e scrive in cards/
una immagine fronte + retro per ogni carta: cards/<id>-fronte.png / -retro.png.
"""

import json
import math
import os
import re
import sys

import matplotlib
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FONTS = os.path.join(os.path.dirname(matplotlib.__file__), "mpl-data", "fonts", "ttf")

W, H = 750, 1050
GOLD = (138, 90, 43)
INK = (74, 53, 32)
INK_LIGHT = (93, 69, 39)
TEXTURE = (178, 138, 61)
PARCH_TOP = (251, 243, 224)
PARCH_BOT = (235, 219, 181)

# ---------------------------------------------------------------- gradienti

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vertical_gradient(size, top, bottom):
    img = Image.new("RGB", size)
    d = ImageDraw.Draw(img)
    for y in range(size[1]):
        d.line([(0, y), (size[0], y)], fill=lerp(top, bottom, y / (size[1] - 1)))
    return img


def texture_overlay(size, color, alpha, step=9):
    ov = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    for x0 in range(-size[1], size[0] + size[1], step):
        d.line([(x0, 0), (x0 + size[1], size[1])], fill=color + (alpha,), width=1)
    return ov


def halo_overlay(size, cx, cy, r, color=(255, 236, 170), amax=175):
    ov = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    steps = 60
    for i in range(steps, 0, -1):
        rr = r * i / steps
        a = int(amax * (1 - rr / r) ** 1.7)
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=color + (a,))
    return ov

# ------------------------------------------------------------ path SVG-mini

TOK = re.compile(r"[MCLQAZ]|-?\d*\.?\d+(?:e-?\d+)?")


def tokenize(d):
    return TOK.findall(d.replace(",", " "))


def cubic_points(p0, p1, p2, p3, n=26):
    pts = []
    for i in range(1, n + 1):
        t = i / n
        mt = 1 - t
        x = mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0]
        y = mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def quad_points(p0, p1, p2, n=22):
    pts = []
    for i in range(1, n + 1):
        t = i / n
        mt = 1 - t
        x = mt**2 * p0[0] + 2 * mt * t * p1[0] + t**2 * p2[0]
        y = mt**2 * p0[1] + 2 * mt * t * p1[1] + t**2 * p2[1]
        pts.append((x, y))
    return pts


def arc_points(p0, rx, ry, phi_deg, large, sweep, p1, n=56):
    rx, ry = abs(rx), abs(ry)
    if rx == 0 or ry == 0 or p0 == p1:
        return [p1]
    phi = math.radians(phi_deg % 360)
    x1, y1 = p0
    x2, y2 = p1
    cp, sp = math.cos(phi), math.sin(phi)
    dx2, dy2 = (x1 - x2) / 2, (y1 - y2) / 2
    x1p = cp * dx2 + sp * dy2
    y1p = -sp * dx2 + cp * dy2
    lam = x1p**2 / rx**2 + y1p**2 / ry**2
    if lam > 1:
        s = math.sqrt(lam)
        rx *= s
        ry *= s
    num = rx**2 * ry**2 - rx**2 * y1p**2 - ry**2 * x1p**2
    den = rx**2 * y1p**2 + ry**2 * x1p**2
    c = math.sqrt(max(num, 0) / den) if den else 0.0
    if large == sweep:
        c = -c
    cxp, cyp = c * rx * y1p / ry, -c * ry * x1p / rx
    cx = cp * cxp - sp * cyp + (x1 + x2) / 2
    cy = sp * cxp + cp * cyp + (y1 + y2) / 2

    def angle(ux, uy, vx, vy):
        dot = ux * vx + uy * vy
        l = math.hypot(ux, uy) * math.hypot(vx, vy)
        a = math.acos(max(-1, min(1, dot / l))) if l else 0.0
        if ux * vy - uy * vx < 0:
            a = -a
        return a

    a1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
    da = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
    if not sweep and da > 0:
        da -= 2 * math.pi
    elif sweep and da < 0:
        da += 2 * math.pi
    pts = []
    for i in range(n + 1):
        t = a1 + da * i / n
        px = cx + rx * math.cos(t) * cp - ry * math.sin(t) * sp
        py = cy + rx * math.cos(t) * sp + ry * math.sin(t) * cp
        pts.append((px, py))
    return pts


def path_subpaths(d):
    """Divide un path SVG (comandi assoluti M/C/Q/L/A/Z) in sottopercorsi chiusi/aperti."""
    tk = tokenize(d)
    subs = []
    cur = []
    pos = None
    i = 0
    while i < len(tk):
        t = tk[i]
        if t == "M":
            if cur:
                subs.append(cur)
            pos = (float(tk[i + 1]), float(tk[i + 2]))
            cur = [pos]
            i += 3
        elif t == "L":
            pos = (float(tk[i + 1]), float(tk[i + 2]))
            cur.append(pos)
            i += 3
        elif t == "C":
            p0 = pos
            p1 = (float(tk[i + 1]), float(tk[i + 2]))
            p2 = (float(tk[i + 3]), float(tk[i + 4]))
            p3 = (float(tk[i + 5]), float(tk[i + 6]))
            cur.extend(cubic_points(p0, p1, p2, p3))
            pos = p3
            i += 7
        elif t == "Q":
            p0 = pos
            p1 = (float(tk[i + 1]), float(tk[i + 2]))
            p2 = (float(tk[i + 3]), float(tk[i + 4]))
            cur.extend(quad_points(p0, p1, p2))
            pos = p2
            i += 5
        elif t == "A":
            rx = float(tk[i + 1]); ry = float(tk[i + 2])
            rot = float(tk[i + 3]); large = int(float(tk[i + 4])); sweep = int(float(tk[i + 5]))
            p1 = (float(tk[i + 6]), float(tk[i + 7]))
            cur.extend(arc_points(pos, rx, ry, rot, large, sweep, p1))
            pos = p1
            i += 8
        elif t == "Z":
            if cur:
                cur.append(cur[0])
            i += 1
        else:
            i += 1  # comando non supportato: salta
    if cur:
        subs.append(cur)
    return subs


def scaled(points, ox, oy, s):
    return [(ox + x * s, oy + y * s) for (x, y) in points]

# ------------------------------------------------- elementi disegnabili (200x200)

OP = tuple  # op generica


def _parse_el(el):
    kind, rest = el[0], el[1:]
    return kind, rest


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def draw_element(d, el, ox, oy, s, base_alpha=255):
    kind, a = _parse_el(el)
    x = lambda v: ox + v * s
    if kind == "path":
        dd, fill, stroke, sw = a[0], a[1], a[2], a[3]
        subs = [scaled(p, ox, oy, s) for p in path_subpaths(dd)]
        if fill:
            for pts in subs:
                if len(pts) > 2:
                    d.polygon(pts, fill=hex_rgb(fill) + (base_alpha,))
        if stroke:
            col = hex_rgb(stroke) + (base_alpha,)
            for pts in subs:
                if len(pts) > 1:
                    d.line(pts, fill=col, width=max(1, round(sw * s)), joint="curve")
                    # tondi alle estremità
                    for pt in (pts[0], pts[-1]):
                        r = sw * s / 2
                        d.ellipse([pt[0] - r, pt[1] - r, pt[0] + r, pt[1] + r], fill=col)
    elif kind == "circle":
        cx, cy, r, fill, stroke, sw = x(a[0]), x(a[1]), a[2] * s, a[3], a[4] if len(a) > 4 else None, a[5] if len(a) > 5 else 0
        box = [cx - r, cy - r, cx + r, cy + r]
        d.ellipse(box, fill=hex_rgb(fill) + (base_alpha,) if fill else None,
                  outline=hex_rgb(stroke) + (base_alpha,) if stroke else None,
                  width=max(1, round(sw * s)) if stroke else 0)
    elif kind == "ellipse":
        cx, cy, rx, ry, fill, stroke, sw = x(a[0]), x(a[1]), a[2] * s, a[3] * s, a[4], a[5] if len(a) > 5 else None, a[6] if len(a) > 6 else 0
        box = [cx - rx, cy - ry, cx + rx, cy + ry]
        d.ellipse(box, fill=hex_rgb(fill) + (base_alpha,) if fill else None,
                  outline=hex_rgb(stroke) + (base_alpha,) if stroke else None,
                  width=max(1, round(sw * s)) if stroke else 0)
    elif kind == "line":
        x1, y1, x2, y2, stroke, sw = x(a[0]), x(a[1]), x(a[2]), x(a[3]), a[4], a[5]
        col = hex_rgb(stroke) + (base_alpha,)
        d.line([x1, y1, x2, y2], fill=col, width=max(1, round(sw * s)))
        for pt in ((x1, y1), (x2, y2)):
            r = sw * s / 2
            d.ellipse([pt[0] - r, pt[1] - r, pt[0] + r, pt[1] + r], fill=col)
    elif kind == "rect":
        rx0, ry0, rw, rh, fill, stroke, sw = x(a[0]), x(a[1]), a[2] * s, a[3] * s, a[4], a[5] if len(a) > 5 else None, a[6] if len(a) > 6 else 0
        d.rectangle([rx0, ry0, rx0 + rw, ry0 + rh],
                    fill=hex_rgb(fill) + (base_alpha,) if fill else None,
                    outline=hex_rgb(stroke) + (base_alpha,) if stroke else None,
                    width=max(1, round(sw * s)) if stroke else 0)


def locator(a):
    return a

# ------------------------------------------------------------- i 14 motivi

def _heart(x, y, s, rot, fill):
    return ("path",
            "M0 0 C 8 -8 20 -2 14 10 C 10 18 0 24 0 24 C 0 24 -10 18 -14 10 C -20 -2 -8 -8 0 0 Z",
            fill, "#8a5a2b", 2, ("tf", x, y, rot, s))


def _rays(n, cx=100, cy=100, r1=44, r2=64, color="#b5651d", w=5):
    els = []
    for i in range(n):
        a = 2 * math.pi * i / n
        els.append(("line", cx + r1 * math.cos(a), cy + r1 * math.sin(a),
                    cx + r2 * math.cos(a), cy + r2 * math.sin(a), color, w))
    return els


def _spokes(n, cx=100, cy=100, r1=9, r2=55, color="#8a5a2b", w=4):
    els = []
    for i in range(n):
        a = 2 * math.pi * i / n
        els.append(("line", cx + r1 * math.cos(a), cy + r1 * math.sin(a),
                    cx + r2 * math.cos(a), cy + r2 * math.sin(a), color, w))
    return els


MOTIFS = {
    "lotus": [
        ("path", "M100 152 C74 132 74 92 100 62 C126 92 126 132 100 152 Z", "#e3b23c", "#8a5a2b", 3, None),
        ("path", "M100 152 C64 144 44 116 52 84 C84 96 96 122 100 152 Z", "#d9a52e", "#8a5a2b", 3, None),
        ("path", "M100 152 C136 144 156 116 148 84 C116 96 104 122 100 152 Z", "#d9a52e", "#8a5a2b", 3, None),
        ("path", "M100 152 C56 158 30 138 26 112 C58 116 84 132 100 152 Z", "#c9942a", "#8a5a2b", 3, None),
        ("path", "M100 152 C144 158 170 138 174 112 C142 116 116 132 100 152 Z", "#c9942a", "#8a5a2b", 3, None),
        ("path", "M60 164 Q100 178 140 164", None, "#8a5a2b", 4, None),
        ("path", "M76 172 Q100 182 124 172", None, "#8a5a2b", 3, None),
    ],
    "moon": [
        ("path", "M128 34 A72 72 0 1 0 128 166 A58 58 0 1 1 128 34 Z", "#e8c766", "#8a5a2b", 3, None),
        ("circle", 152, 58, 3, "#8a5a2b", None, 0),
        ("circle", 162, 92, 2.5, "#8a5a2b", None, 0),
        ("circle", 148, 124, 2, "#8a5a2b", None, 0),
        ("circle", 140, 86, 1.8, "#8a5a2b", None, 0),
    ],
    "tree": [
        ("path", "M100 172 C96 142 94 118 100 94", None, "#7c4a1e", 7, None),
        ("path", "M100 132 C88 124 80 114 76 102", None, "#7c4a1e", 4, None),
        ("path", "M100 120 C112 112 120 102 124 90", None, "#7c4a1e", 4, None),
        _heart(100, 34, 1.5, 0, "#4a7a3a"),
        _heart(56, 66, 1.2, -30, "#3e6b3e"),
        _heart(144, 66, 1.2, 30, "#3e6b3e"),
        _heart(72, 30, 1, -15, "#5a8a4a"),
        _heart(128, 30, 1, 15, "#5a8a4a"),
        _heart(40, 104, 0.9, -55, "#4a7a3a"),
        _heart(160, 104, 0.9, 55, "#4a7a3a"),
        ("path", "M70 176 Q100 186 130 176", None, "#8a5a2b", 4, None),
    ],
    "wheel": [
        ("circle", 100, 100, 58, None, "#8a5a2b", 6),
        ("circle", 100, 100, 68, None, "#8a5a2b", 2),
        *_spokes(8),
        ("circle", 100, 100, 9, "#c9a227", "#8a5a2b", 3),
    ],
    "snake": [
        ("path", "M100 58 C74 66 68 104 78 134 C84 150 116 150 122 134 C132 104 126 66 100 58 Z", "#d9b23c", "#8a5a2b", 3, None),
        ("path", "M100 76 C86 84 84 110 90 130", None, "#8a5a2b", 2.5, None),
        ("path", "M100 76 C114 84 116 110 110 130", None, "#8a5a2b", 2.5, None),
        ("ellipse", 100, 56, 11, 8, "#8a5a2b", None, 0),
        ("circle", 95, 54, 1.8, "#f6ecd4", None, 0),
        ("circle", 105, 54, 1.8, "#f6ecd4", None, 0),
        ("path", "M100 152 C64 158 56 172 100 176 C144 172 136 158 100 152", None, "#8a5a2b", 5, None),
    ],
    "elephant": [
        ("ellipse", 92, 116, 50, 34, "#c9a886", "#8a5a2b", 3),
        ("circle", 142, 100, 27, "#c9a886", "#8a5a2b", 3),
        ("rect", 66, 140, 12, 28, "#c9a886", "#8a5a2b", 3),
        ("rect", 94, 142, 12, 26, "#c9a886", "#8a5a2b", 3),
        ("rect", 122, 140, 12, 28, "#c9a886", "#8a5a2b", 3),
        ("path", "M162 112 C176 128 172 150 156 160", None, "#b5651d", 11, None),
        ("ellipse", 130, 98, 13, 18, "#b5651d", None, 0),
        ("circle", 150, 94, 3, "#4a3520", None, 0),
        ("path", "M154 116 C160 122 160 128 154 132", None, "#f6ecd4", 4, None),
    ],
    "bowl": [
        ("circle", 100, 76, 6, "#e3b23c", "#8a5a2b", 2),
        ("circle", 86, 92, 4.5, "#e3b23c", "#8a5a2b", 2),
        ("circle", 114, 92, 4.5, "#e3b23c", "#8a5a2b", 2),
        ("path", "M50 112 C50 144 74 160 100 160 C126 160 150 144 150 112 Z", "#a8763e", "#8a5a2b", 3, None),
        ("ellipse", 100, 112, 50, 10, "#7c4a1e", "#8a5a2b", 3),
        ("path", "M84 160 L116 160 L110 172 L90 172 Z", "#a8763e", "#8a5a2b", 3, None),
    ],
    "lamp": [
        ("path", "M100 58 C114 84 118 104 100 122 C82 104 86 84 100 58 Z", "#e8b33c", "#b5651d", 2.5, None),
        ("path", "M100 88 C107 100 108 112 100 120 C92 112 93 100 100 88 Z", "#f6d76b", None, 0, None),
        *_rays(8, 100, 92, 34, 46),
        ("path", "M58 132 C58 154 78 164 100 164 C122 164 142 154 142 132 Z", "#a8763e", "#8a5a2b", 3, None),
        ("ellipse", 100, 132, 42, 8, "#7c4a1e", "#8a5a2b", 3),
    ],
    "book": [
        ("path", "M100 74 C80 62 56 60 38 66 L38 134 C56 128 80 130 100 142 C120 130 144 128 162 134 L162 66 C144 60 120 62 100 74 Z", "#f0e0b8", "#8a5a2b", 3, None),
        ("line", 100, 74, 100, 142, "#8a5a2b", 3),
        ("path", "M46 80 C60 76 76 76 92 82 M46 94 C60 90 76 90 92 96 M46 108 C60 104 76 104 92 110 M46 122 C60 118 76 118 92 124", None, "#8a5a2b", 2.5, None),
        ("path", "M154 80 C140 76 124 76 108 82 M154 94 C140 90 124 90 108 96 M154 108 C140 104 124 104 108 110 M154 122 C140 118 124 118 108 124", None, "#8a5a2b", 2.5, None),
        ("path", "M38 134 C56 128 80 130 100 142 C120 130 144 128 162 134 L162 144 C144 138 120 140 100 152 C80 140 56 138 38 144 Z", "#7a1f1f", "#8a5a2b", 3, None),
    ],
    "star": [
        ("path", "M100 36 L113 87 L164 100 L113 113 L100 164 L87 113 L36 100 L87 87 Z", "#e3b23c", "#8a5a2b", 3, None),
        ("circle", 100, 100, 11, "#f6ecd4", "#8a5a2b", 3),
        ("circle", 46, 52, 3, "#8a5a2b", None, 0),
        ("circle", 158, 52, 3, "#8a5a2b", None, 0),
        ("circle", 46, 150, 3, "#8a5a2b", None, 0),
        ("circle", 158, 150, 3, "#8a5a2b", None, 0),
    ],
    "enso": [
        ("path", "M100 34 A66 66 0 1 0 166 100", None, "#5a4632", 13, None),
        ("path", "M100 48 A52 52 0 1 0 152 100", None, "#93826e", 5, None),
    ],
    "mountain": [
        ("circle", 54, 50, 14, "#e8c766", "#8a5a2b", 2),
        ("path", "M28 162 L82 68 L112 122 L142 58 L176 162 Z", "#8d9aa5", "#5a4632", 3, None),
        ("path", "M82 68 L94 92 L82 100 L72 88 Z", "#f6ecd4", "#5a4632", 2, None),
        ("path", "M142 58 L154 84 L142 92 L132 78 Z", "#f6ecd4", "#5a4632", 2, None),
        ("path", "M24 168 Q100 178 180 168", None, "#8a5a2b", 4, None),
    ],
    "sun": [
        *_rays(12),
        ("circle", 100, 100, 36, "#e8b33c", "#b5651d", 3),
        ("circle", 100, 100, 26, "#f6d76b", None, 0),
    ],
    "wave": [
        ("path", "M32 138 C50 88 92 78 112 100 C128 118 120 142 102 144 C90 145 84 134 92 126", None, "#2e6f8e", 9, None),
        ("path", "M118 118 C132 108 146 114 146 126", None, "#2e6f8e", 6, None),
        ("circle", 126, 96, 4, "#2e6f8e", None, 0),
        ("circle", 142, 104, 3, "#2e6f8e", None, 0),
        ("circle", 112, 86, 3, "#2e6f8e", None, 0),
        ("path", "M24 154 C60 144 140 144 178 154", None, "#2e6f8e", 6, None),
        ("path", "M40 168 C70 160 130 160 162 168", None, "#7fa8ba", 4, None),
    ],
}

# ---------------------------------------------------------------- testo

def load_font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def wrap_text(draw, text, font, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_tracked_center(d, text, font, cy, fill, tracking=0.10, max_w=640):
    """Testo centrato spaziato (small-caps feel). tracking = frazione della larghezza media glifo."""
    text = text.upper()
    # corda totale con tracking
    widths = [d.textlength(c, font=font) for c in text]
    track = sum(widths) / len(widths) * tracking
    total = sum(widths) + track * (len(text) - 1)
    if total > max_w:
        f_small = ImageFont.truetype(font.path, int(font.size * max_w / total))
        return draw_tracked_center(d, " ".join(text.split()), f_small, cy, fill, tracking, max_w)
    x = (W - total) / 2
    ascent, descent = font.getmetrics()
    y = cy - (ascent + descent) / 2
    for c, w in zip(text, widths):
        d.text((x, y), c, font=font, fill=fill)
        x += w + track


def diamond(d, cx, cy, s, fill):
    d.polygon([(cx, cy - s), (cx + s, cy), (cx, cy + s), (cx - s, cy)], fill=fill)

# ------------------------------------------------------------ composizione

def card_base(accent):
    img = vertical_gradient((W, H), PARCH_TOP, PARCH_BOT).convert("RGBA")
    img = Image.alpha_composite(img, texture_overlay((W, H), TEXTURE, 9))
    d = ImageDraw.Draw(img)
    acc = hex_rgb(accent)
    d.rectangle([22, 22, W - 22, H - 22], outline=acc + (255,), width=7)
    d.rectangle([40, 40, W - 40, H - 40], outline=GOLD + (255,), width=2)
    return img, d


def render_front(card):
    accent = card["accent"]
    img, d = card_base(accent)
    img = Image.alpha_composite(img, halo_overlay((W, H), W / 2, 345, 265))
    d = ImageDraw.Draw(img)

    # motivo
    motif = MOTIFS.get(card["motif"], MOTIFS["lotus"])
    ox, oy, s = W / 2 - 150, 195, 1.5  # 200 -> 300 px
    for el in motif:
        tf = el[5]
        if tf and tf[0] == "tf":
            _, hx, hy, rot, hs = tf
            draw_heart(d, el, ox + hx * s, oy + hy * s, hs * s, rot)
        else:
            draw_element(d, el, ox, oy, s)

    # titolo (max 2 righe)
    f_title = load_font("DejaVuSerif-Bold.ttf", 44)
    lines = wrap_text(d, card["title"].upper(), f_title, 620)[:2]
    y = 560
    for ln in lines:
        draw_tracked_center(d, ln, f_title, y, hex_rgb(accent), 0.08)
        y += 60

    # didascalia
    text = card["text"]
    f_did = load_font("DejaVuSerif-Italic.ttf", 31)
    ln = wrap_text(d, text, f_did, 608)
    while len(ln) > 5:
        f_did = load_font("DejaVuSerif-Italic.ttf", f_did.size - 2)
        ln = wrap_text(d, text, f_did, 608)
    y += 26
    for l in ln:
        tw = d.textlength(l, font=f_did)
        d.text(((W - tw) / 2, y), l, font=f_did, fill=INK_LIGHT)
        y += int(f_did.size * 1.42)

    # ornamento finale
    diamond(d, W / 2, 975, 11, hex_rgb(accent))
    return img


def draw_heart(d, el, ox, oy, s, rot):
    _, dd, fill, stroke, sw, _ = el
    cosr, sinr = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    subs = []
    for pts in path_subpaths(dd):
        tp = []
        for (x, y) in pts:
            xs, ys = x * s, y * s
            tp.append((ox + xs * cosr - ys * sinr, oy + xs * sinr + ys * cosr))
        subs.append(tp)
    if fill:
        for pts in subs:
            if len(pts) > 2:
                d.polygon(pts, fill=hex_rgb(fill))
    col = hex_rgb(stroke)
    for pts in subs:
        if len(pts) > 1:
            d.line(pts, fill=col, width=max(1, round(sw * s)), joint="curve")


def render_back(card):
    accent = card["accent"]
    img, d = card_base(accent)
    diamond(d, W / 2, 160, 13, hex_rgb(accent))
    diamond(d, W / 2, 895, 13, hex_rgb(accent))

    f_quote = load_font("DejaVuSerif-Italic.ttf", 36)
    text = "\u00ab" + card["quote"] + "\u00bb"
    ln = wrap_text(d, text, f_quote, 596)
    while len(ln) > 8:
        f_quote = load_font("DejaVuSerif-Italic.ttf", f_quote.size - 2)
        ln = wrap_text(d, text, f_quote, 596)
    lh = int(f_quote.size * 1.5)
    total = len(ln) * lh
    y = H / 2 - total / 2 - 55
    for l in ln:
        tw = d.textlength(l, font=f_quote)
        d.text(((W - tw) / 2, y), l, font=f_quote, fill=INK)
        y += lh

    y += 34
    f_src = load_font("DejaVuSerif-Bold.ttf", 26)
    draw_tracked_center(d, card["source"], f_src, y, hex_rgb(accent), 0.08)
    return img

# ---------------------------------------------------------------------- main

def main():
    jpeg = "--jpeg" in sys.argv
    with open(os.path.join(HERE, "cards_data.json"), encoding="utf-8") as fh:
        cards = json.load(fh)
    out = os.path.join(ROOT, "cards")
    os.makedirs(out, exist_ok=True)
    ext = "jpg" if jpeg else "png"
    for card in cards:
        for which, fn in (("fronte", render_front), ("retro", render_back)):
            img = fn(card).convert("RGB")
            path = os.path.join(out, f"{card['id']}-{which}.{ext}")
            if jpeg:
                img.save(path, quality=88, optimize=True)
            else:
                img.save(path, optimize=True)
            print(os.path.basename(path), f"{os.path.getsize(path)//1024} KB")
    print(f"\n{len(cards)} carte x 2 lati salvate in cards/")


if __name__ == "__main__":
    main()
