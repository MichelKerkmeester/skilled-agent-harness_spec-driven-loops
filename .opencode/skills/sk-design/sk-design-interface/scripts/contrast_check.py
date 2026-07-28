#!/usr/bin/env python3
"""Deterministic WCAG contrast checker for foreground/background pairs.

Exists because eyeballing or hand-computing contrast ratios is the soft spot in
design context-loading: a model can run the contrast-pair inventory and still
mislabel a failing pair as a pass. This gives the inventory a calculator to call
instead of trusting arithmetic.

Usage:
  contrast_check.py "#787878" "#ffffff"
  contrast_check.py "#787878" "#ffffff" "#06458c" "#ffffff"   # repeat FG BG pairs
  contrast_check.py --json "#787878" "#ffffff"

Targets (WCAG 2.x): body text needs 4.5:1; large text (>=24px, or >=18.66px bold)
and UI/graphical components need 3:1. Exit code is non-zero if any pair fails the
body target, so it can gate a build step.
"""
import json
import sys

BODY_AA = 4.5
LARGE_UI_AA = 3.0


def _channel(c: int) -> float:
    s = c / 255.0
    return s / 12.92 if s <= 0.03928 else ((s + 0.055) / 1.055) ** 2.4


def _parse_hex(value: str):
    h = value.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(ch * 2 for ch in h)
    if len(h) != 6:
        raise ValueError(f"not a 3- or 6-digit hex color: {value!r}")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def relative_luminance(hex_color: str) -> float:
    r, g, b = _parse_hex(hex_color)
    return 0.2126 * _channel(r) + 0.7152 * _channel(g) + 0.0722 * _channel(b)


def contrast_ratio(fg: str, bg: str) -> float:
    a = relative_luminance(fg) + 0.05
    b = relative_luminance(bg) + 0.05
    return round(max(a, b) / min(a, b), 2)


# --- APCA (APCA-W3 0.1.9) ---------------------------------------------------
# WCAG ratio is the contract's stated target; APCA Lc is reported alongside it
# because it tracks perceived lightness contrast more faithfully for modern UI.
# Lc guidance (abs): >=75 body text, >=60 large text, >=45 large headings,
# >=30 non-text/UI. Polarity-aware: sign indicates dark-on-light (+) vs light-
# on-dark (-); magnitude is what matters.
_APCA_BLK_THRS = 0.022
_APCA_BLK_CLMP = 1.414


def _apca_y(hex_color: str) -> float:
    r, g, b = _parse_hex(hex_color)
    # APCA uses a simple 2.4 power curve (not the WCAG piecewise linearization).
    y = 0.2126 * (r / 255.0) ** 2.4 + 0.7152 * (g / 255.0) ** 2.4 + 0.0722 * (b / 255.0) ** 2.4
    return y + (_APCA_BLK_THRS - y) ** _APCA_BLK_CLMP if y < _APCA_BLK_THRS else y


def apca_lc(text: str, bg: str) -> float:
    yt, yb = _apca_y(text), _apca_y(bg)
    if abs(yb - yt) < 0.0005:
        return 0.0
    if yb > yt:  # normal polarity: dark text on light background
        sapc = (yb ** 0.56 - yt ** 0.57) * 1.14
        lc = 0.0 if sapc < 0.1 else (sapc - 0.027) * 100.0
    else:        # reverse polarity: light text on dark background
        sapc = (yb ** 0.65 - yt ** 0.62) * 1.14
        lc = 0.0 if sapc > -0.1 else (sapc + 0.027) * 100.0
    return round(lc, 1)


def evaluate(fg: str, bg: str) -> dict:
    ratio = contrast_ratio(fg, bg)
    lc = apca_lc(fg, bg)
    return {
        "fg": fg,
        "bg": bg,
        "ratio": ratio,
        "body_aa": ratio >= BODY_AA,        # 4.5:1
        "large_ui_aa": ratio >= LARGE_UI_AA,  # 3:1
        "apca_lc": lc,                       # APCA-W3 Lc (abs >=75 body, >=60 large)
        "apca_body": abs(lc) >= 75.0,
    }


def main(argv) -> int:
    as_json = "--json" in argv
    pairs = [a for a in argv if a != "--json"]
    if len(pairs) < 2 or len(pairs) % 2 != 0:
        sys.stderr.write(
            "usage: contrast_check.py [--json] FG BG [FG BG ...]\n"
            '  e.g. contrast_check.py "#787878" "#ffffff"\n'
        )
        return 2

    results = [evaluate(pairs[i], pairs[i + 1]) for i in range(0, len(pairs), 2)]
    any_body_fail = any(not r["body_aa"] for r in results)

    if as_json:
        print(json.dumps({"results": results, "any_body_fail": any_body_fail}, indent=2))
    else:
        print(f"{'FG':<9} {'BG':<9} {'ratio':>6}  {'body 4.5':<9} {'large 3.0':<10} {'APCA Lc':>8} {'Lc>=75':<7}")
        for r in results:
            body = "PASS" if r["body_aa"] else "FAIL"
            large = "PASS" if r["large_ui_aa"] else "FAIL"
            apca = "PASS" if r["apca_body"] else "FAIL"
            print(f"{r['fg']:<9} {r['bg']:<9} {r['ratio']:>6}  {body:<9} {large:<10} {r['apca_lc']:>8} {apca:<7}")
        if any_body_fail:
            print("\nAt least one pair FAILS body 4.5:1 — use only where the 3:1 large/UI "
                  "target applies, or pick a darker/lighter token.")

    # Non-zero exit when a body-text pair fails, so a build/inventory step can gate on it.
    return 1 if any_body_fail else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
