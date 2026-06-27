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


def evaluate(fg: str, bg: str) -> dict:
    ratio = contrast_ratio(fg, bg)
    return {
        "fg": fg,
        "bg": bg,
        "ratio": ratio,
        "body_aa": ratio >= BODY_AA,        # 4.5:1
        "large_ui_aa": ratio >= LARGE_UI_AA,  # 3:1
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
        print(f"{'FG':<9} {'BG':<9} {'ratio':>6}  {'body 4.5':<9} {'large/UI 3.0':<12}")
        for r in results:
            body = "PASS" if r["body_aa"] else "FAIL"
            large = "PASS" if r["large_ui_aa"] else "FAIL"
            print(f"{r['fg']:<9} {r['bg']:<9} {r['ratio']:>6}  {body:<9} {large:<12}")
        if any_body_fail:
            print("\nAt least one pair FAILS body 4.5:1 — use only where the 3:1 large/UI "
                  "target applies, or pick a darker/lighter token.")

    # Non-zero exit when a body-text pair fails, so a build/inventory step can gate on it.
    return 1 if any_body_fail else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
