#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: CREATE-DIFF REGRESSION SUITE (SK-DOC)
# ───────────────────────────────────────────────────────────────

"""Regression suite for the create-diff engine, renderer, and safety validator.

Stdlib-only and offline. Locks the fidelity, safety, and accessibility fixes made
after an adversarial review, plus the invariants that must never regress (zero-JS,
exact CSP, escaped-content inertness, byte-reproducibility, side-by-side pairing,
collapsed-context accounting).

Run: python3 test_create_diff.py
"""

from __future__ import annotations

import os
import re
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import create_diff as cd            # noqa: E402
import validate_report as vr        # noqa: E402


# ───────────────────────────────────────────────────────────────
# 1. TEST HELPERS
# ───────────────────────────────────────────────────────────────

def _write(tmp: Path, name: str, data, *, binary: bool = False) -> Path:
    p = tmp / name
    if binary:
        p.write_bytes(data)
    else:
        p.write_text(data, encoding="utf-8")
    return p


def _diff(a: str, b: str) -> cd.DiffResult:
    return cd.diff_lines(cd.normalize(a), cd.normalize(b))


def _report(tmp: Path, a: str, b: str, *, view: str = "side-by-side") -> str:
    fa, fb = _write(tmp, "a.md", a), _write(tmp, "b.md", b)
    ea, eb = cd.extract(fa), cd.extract(fb)
    diff = cd.diff_lines(cd.normalize(ea.text), cd.normalize(eb.text))
    return cd.render_report(diff, label_before="a.md", label_after="b.md",
                            extraction_before=ea, extraction_after=eb, view=view)


# --- WCAG contrast helpers (self-contained; no external dependency) -------------

def _lin(c: float) -> float:
    c /= 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def _lum(hexcolor: str) -> float:
    h = hexcolor.lstrip("#")
    if len(h) == 3:
        h = "".join(ch * 2 for ch in h)
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return 0.2126 * _lin(r) + 0.7152 * _lin(g) + 0.0722 * _lin(b)


def _contrast(fg: str, bg: str) -> float:
    l1, l2 = _lum(fg), _lum(bg)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def _tokens(dark: bool) -> dict:
    css = cd._CSS
    if dark:
        block = re.search(r"prefers-color-scheme:dark\)\{:root\{([^}]*)", css).group(1)
    else:
        block = re.search(r":root\{([^}]*)", css).group(1)
    return dict(re.findall(r"(--[a-z-]+):\s*(#[0-9a-fA-F]{3,6})", block))


# ───────────────────────────────────────────────────────────────
# 2. TEST CASES
# ───────────────────────────────────────────────────────────────

class StrictDecode(unittest.TestCase):
    def test_invalid_bytes_are_refused_not_replaced(self):
        # Two files differing only in invalid UTF-8 bytes must not both become U+FFFD
        # and report identical. Extraction refuses undecodable input.
        with tempfile.TemporaryDirectory() as d:
            bad = _write(Path(d), "x.txt", b"line\n\xff\n", binary=True)
            with self.assertRaises(cd.CapabilityError):
                cd.extract(bad)

    def test_valid_utf8_still_diffs(self):
        d = _diff("alpha\nbeta", "alpha\ngamma")
        self.assertEqual(d.changed, 1)

    def test_unknown_extension_warns(self):
        with tempfile.TemporaryDirectory() as d:
            f = _write(Path(d), "notes.weirdext", "hello\n")
            ext = cd.extract(f)
            self.assertTrue(ext.warnings, "unknown extension should carry a fidelity warning")


class LineModel(unittest.TestCase):
    def test_empty_to_content_is_pure_addition(self):
        d = _diff("", "new")
        self.assertEqual((d.added, d.changed, d.unchanged), (1, 0, 0))

    def test_empty_to_empty_is_no_change(self):
        d = _diff("", "")
        self.assertEqual(d.total_changes, 0)
        self.assertEqual(d.rows, [])

    def test_trailing_newline_only_is_insignificant(self):
        self.assertEqual(_diff("x", "x\n").total_changes, 0)

    def test_interior_blank_line_preserved(self):
        d = _diff("a", "a\n\n")
        self.assertEqual(d.added, 1)


class SafetyValidator(unittest.TestCase):
    HOSTILE = (
        "<!doctype html><html lang=\"en\"><head>"
        "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src *\">"
        "<style>@import url(https://evil.example/x.css)</style></head><body>"
        "<img alt=\">\" onerror=alert(1)>"
        "<video src=\"https://evil.example/v.mp4\"></video>"
        "<a href=\"javascript:alert(2)\">x</a>"
        "</body></html>"
    )

    def test_hostile_payload_fails(self):
        with tempfile.TemporaryDirectory() as d:
            p = _write(Path(d), "evil.html", self.HOSTILE)
            problems = vr.validate(p)
        joined = " | ".join(problems).lower()
        self.assertIn("event handler", joined)
        self.assertIn("import", joined)
        self.assertTrue("external reference" in joined and "video" in joined)
        self.assertIn("content-security-policy", joined)

    def test_real_report_passes(self):
        with tempfile.TemporaryDirectory() as d:
            html = _report(Path(d), "one\ntwo\nthree", "one\nTWO\nthree", view="unified")
            p = _write(Path(d), "r.html", html)
            self.assertEqual(vr.validate(p), [])

    def test_escaped_hostile_text_is_inert(self):
        with tempfile.TemporaryDirectory() as d:
            html = _report(Path(d), "a\n<img src=x onerror=alert(9)>",
                           "b\n<script>alert(1)</script>", view="unified")
            p = _write(Path(d), "r.html", html)
            self.assertEqual(vr.validate(p), [])           # no live hazard
            self.assertNotIn("<script>alert", html)         # source stayed escaped
            self.assertIn("&lt;script&gt;", html)


class ReportInvariants(unittest.TestCase):
    def test_zero_js_and_exact_csp(self):
        with tempfile.TemporaryDirectory() as d:
            html = _report(Path(d), "a", "b")
        self.assertNotIn("<script", html)
        self.assertIn("default-src 'none'; style-src 'unsafe-inline'; img-src data:; "
                      "base-uri 'none'; form-action 'none'", html)

    def test_byte_reproducible(self):
        os.environ["SOURCE_DATE_EPOCH"] = "1700000000"
        try:
            with tempfile.TemporaryDirectory() as d:
                first = _report(Path(d), "a\nb\nc", "a\nB\nc")
                second = _report(Path(d), "a\nb\nc", "a\nB\nc")
            self.assertEqual(first, second)
        finally:
            os.environ.pop("SOURCE_DATE_EPOCH", None)

    def test_side_by_side_pairs_change_into_six_cells(self):
        with tempfile.TemporaryDirectory() as d:
            html = _report(Path(d), "keep\nold\nkeep", "keep\nnew\nkeep", view="side-by-side")
        rows = re.findall(r'<tr class="change">(.*?)</tr>', html)
        self.assertEqual(len(rows), 1)
        self.assertEqual(len(re.findall(r"<td", rows[0])), 6)

    def test_side_by_side_scroll_is_scoped_and_keyboard_operable(self):
        with tempfile.TemporaryDirectory() as d:
            html = _report(Path(d), "a", "b", view="side-by-side")
        self.assertIn('.sxs{min-width:', html)                       # actually overflows → scrolls
        self.assertIn('role="region"', html)
        self.assertIn('aria-label="Side-by-side differences"', html)
        self.assertIn('tabindex="0"', html)
        self.assertIn('.diff-scroll:focus-visible', html)

    def test_collapsed_context_accounting(self):
        middle = "\n".join(f"line{i}" for i in range(20))
        d = _diff(f"HEAD\n{middle}\nTAIL", f"head\n{middle}\ntail")
        collapses = [r for r in d.rows if r.kind == "collapse"]
        self.assertEqual(len(collapses), 1)
        hidden = int(re.search(r"(\d+)", collapses[0].note).group(1))
        # 20 equal lines, minus CONTEXT_LINES kept on each side.
        self.assertEqual(hidden, 20 - 2 * cd.CONTEXT_LINES)


class LegendContrast(unittest.TestCase):
    def _assert_pairs(self, dark: bool):
        t = _tokens(dark)
        for bg_key in ("--add-inline", "--del-inline"):
            ratio = _contrast(t["--text"], t[bg_key])
            self.assertGreaterEqual(
                ratio, 4.5,
                f"legend swatch text {t['--text']} on {bg_key} {t[bg_key]} "
                f"= {ratio:.2f}:1 ({'dark' if dark else 'light'})")

    def test_legend_swatch_contrast_light(self):
        self._assert_pairs(dark=False)

    def test_legend_swatch_contrast_dark(self):
        self._assert_pairs(dark=True)

    def test_legend_uses_full_strength_text(self):
        self.assertIn(".legend mark.wd{color:var(--text)}", cd._CSS)


if __name__ == "__main__":
    unittest.main(verbosity=2)
