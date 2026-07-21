#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: CREATE-DIFF REGRESSION SUITE (SK-DOC)
# ───────────────────────────────────────────────────────────────

"""Regression suite for the create-diff engine, renderer, and safety validator.

Stdlib-only and offline. Locks the fidelity, safety, and accessibility fixes made
after two independent adversarial reviews, plus the invariants that must never
regress (zero-JS, exact CSP, escaped-content inertness, byte-reproducibility,
side-by-side pairing, collapsed-context accounting).

The safety gate is an ALLOWLIST for the renderer's exact HTML dialect, so the
validator tests are one-hazard-per-case: each asserts that a single disallowed
construct is rejected while the clean baseline passes, and a conformance test
asserts every generated report shape passes.

Run: python3 test_create_diff.py
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import create_diff as cd            # noqa: E402
import validate_report as vr        # noqa: E402

CREATE_DIFF = Path(__file__).resolve().parent / "create_diff.py"
_CANON_CSP = ("default-src 'none'; style-src 'unsafe-inline'; img-src data:; "
              "base-uri 'none'; form-action 'none'")


# ───────────────────────────────────────────────────────────────
# 1. TEST HELPERS
# ───────────────────────────────────────────────────────────────

def _write(tmp: Path, name: str, data: str | bytes, *, binary: bool = False) -> Path:
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


def _bundle(*files: tuple[str, str]) -> str:
    """Build the canonical pre-composed aggregate format used by create-diff."""
    lines = []
    for path, body in files:
        lines.extend((f"===== BEGIN FILE: {path} =====", body,
                      f"===== END FILE: {path} ====="))
    return "\n".join(lines) + "\n"


def _validate_html(html: str) -> list:
    """Validate an in-memory HTML string, returning the list of safety problems."""
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False,
                                     encoding="utf-8") as f:
        f.write(html)
        path = Path(f.name)
    try:
        return vr.validate(path)
    finally:
        path.unlink()


def _doc(*, head: str = "", body: str = "<p>ok</p>", csp: str = _CANON_CSP,
         lang: str = ' lang="en"') -> str:
    """Build a minimal report skeleton with an injectable head/body/CSP."""
    meta = (f'<meta http-equiv="Content-Security-Policy" content="{csp}">'
            if csp is not None else "")
    return (f'<!doctype html><html{lang}><head>{meta}{head}<title>t</title>'
            f'</head><body>{body}</body></html>')


def _run_cli(*args: str) -> tuple:
    proc = subprocess.run([sys.executable, str(CREATE_DIFF), *args],
                          capture_output=True, text=True)
    return proc.returncode, proc.stdout + proc.stderr


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

    def test_cli_refuses_invalid_byte_pair_with_exit3(self):
        # The whole CLI path (not just extract()) must exit 3 on undecodable input.
        with tempfile.TemporaryDirectory() as d:
            a = _write(Path(d), "a.txt", b"h\n\xff\n", binary=True)
            b = _write(Path(d), "b.txt", b"h\n\xfe\n", binary=True)
            rc, out = _run_cli("compare-pair", "--before", str(a), "--after", str(b),
                               "--report", str(Path(d) / "o.html"))
        self.assertEqual(rc, cd.EXIT_UNSUPPORTED)
        self.assertIn("decode", out.lower())

    def test_cli_valid_pair_exit0_and_report_is_safe(self):
        with tempfile.TemporaryDirectory() as d:
            a = _write(Path(d), "a.txt", "one\ntwo\n")
            b = _write(Path(d), "b.txt", "one\nTWO\n")
            rep = Path(d) / "o.html"
            rc, _ = _run_cli("compare-pair", "--before", str(a), "--after", str(b),
                             "--report", str(rep))
            self.assertEqual(rc, cd.EXIT_OK)
            self.assertEqual(vr.validate(rep), [])


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


class SafetyValidatorAllowlist(unittest.TestCase):
    """One hazard per case: the clean baseline passes; each disallowed construct is
    rejected. The gate is an allowlist for the renderer's exact dialect."""

    def test_clean_baseline_passes(self):
        self.assertEqual(_validate_html(_doc()), [])

    def _assert_flags(self, html: str, needle: str):
        problems = _validate_html(html)
        joined = " | ".join(problems).lower()
        self.assertIn(needle.lower(), joined, f"expected {needle!r} in {problems!r}")

    def test_meta_refresh_rejected(self):
        self._assert_flags(_doc(head='<meta http-equiv="refresh" content="0;url=x">'),
                           "http-equiv 'refresh'")

    def test_unknown_http_equiv_rejected(self):
        self._assert_flags(_doc(head='<meta http-equiv="x-ua-compatible" content="IE=edge">'),
                           "http-equiv 'x-ua-compatible'")

    def test_duplicate_attribute_rejected(self):
        html = ('<!doctype html><html lang="en"><head>'
                f'<meta http-equiv="Content-Security-Policy" content="{_CANON_CSP}" '
                'content="default-src *"><title>t</title></head><body></body></html>')
        self._assert_flags(html, "duplicate attribute 'content'")

    def test_non_ascii_csp_whitespace_rejected(self):
        # A U+00A0 no-break space smuggled into the CSP tokenizes as one directive
        # for a naive ASCII split but differently in the browser; reject it outright.
        smuggled = _CANON_CSP.replace("img-src data:", "img-src\u00a0data:")
        self._assert_flags(_doc(csp=smuggled), "non-ascii or control")

    def test_csp_after_body_rejected(self):
        html = ('<!doctype html><html lang="en"><head><title>t</title></head><body>'
                f'<meta http-equiv="Content-Security-Policy" content="{_CANON_CSP}">'
                '<p>x</p></body></html>')
        self._assert_flags(html, "before <body>")

    def test_missing_csp_rejected(self):
        self._assert_flags(_doc(csp=None), "missing content-security-policy")

    def test_multiple_csp_rejected(self):
        self._assert_flags(_doc(head=f'<meta http-equiv="Content-Security-Policy" content="{_CANON_CSP}">'),
                           "multiple content-security-policy")

    def test_weakened_csp_rejected(self):
        weak = _CANON_CSP.replace("default-src 'none'", "default-src *")
        self._assert_flags(_doc(csp=weak), "does not match the required policy")

    def test_disallowed_element_script(self):
        self._assert_flags(_doc(body="<script>alert(1)</script>"), "disallowed element <script>")

    def test_disallowed_element_iframe(self):
        self._assert_flags(_doc(body='<iframe srcdoc="&lt;b&gt;"></iframe>'),
                           "disallowed element <iframe>")

    def test_disallowed_attr_event_handler(self):
        self._assert_flags(_doc(body='<p onclick="x()">x</p>'), "disallowed attribute 'onclick'")

    def test_disallowed_attr_style(self):
        self._assert_flags(_doc(body='<p style="color:red">x</p>'), "disallowed attribute 'style'")

    def test_disallowed_attr_srcdoc(self):
        # srcdoc is rejected as a disallowed attribute even before the tag check,
        # so a separately-parsed inline document can never enter.
        self._assert_flags(_doc(body='<div srcdoc="x">y</div>'), "disallowed attribute 'srcdoc'")

    def test_external_href_rejected(self):
        self._assert_flags(_doc(body='<a href="https://evil.example">x</a>'), "external reference")

    def test_data_uri_href_rejected(self):
        self._assert_flags(_doc(body='<a href="data:text/html,x">x</a>'), "external reference")

    def test_javascript_href_rejected(self):
        self._assert_flags(_doc(body='<a href="javascript:alert(1)">x</a>'), "external reference")

    def test_css_import_rejected(self):
        self._assert_flags(_doc(head='<style>@import url(x)</style>'), "@import")

    def test_css_url_rejected(self):
        self._assert_flags(_doc(head='<style>.a{background:url(x)}</style>'), "url()")

    def test_escaped_hostile_text_is_inert(self):
        with tempfile.TemporaryDirectory() as d:
            html = _report(Path(d), "a\n<img src=x onerror=alert(9)>",
                           "b\n<script>alert(1)</script>", view="unified")
            p = _write(Path(d), "r.html", html)
            self.assertEqual(vr.validate(p), [])           # no live hazard
            self.assertNotIn("<script>alert", html)         # source stayed escaped
            self.assertIn("&lt;script&gt;", html)


class ReportConformance(unittest.TestCase):
    def test_four_canonical_reports_pass_allowlist(self):
        fixtures = [("one\ntwo\nthree", "one\nTWO\nthree"),
                    ("alpha\nbeta", "alpha\nbeta\ngamma")]
        with tempfile.TemporaryDirectory() as d:
            count = 0
            for a, b in fixtures:
                for view in ("unified", "side-by-side"):
                    html = _report(Path(d), a, b, view=view)
                    p = _write(Path(d), f"r{count}.html", html)
                    self.assertEqual(vr.validate(p), [],
                                     f"canonical report {count} (view={view}) must pass")
                    count += 1
            self.assertEqual(count, 4)

    def test_default_report_name_is_derived_as_kebab_case(self):
        with tempfile.TemporaryDirectory() as d:
            base = Path(d)
            before = _write(base, "before.md", "old\n")
            after = _write(base, "Release_Notes.md", "new\n")
            previous = Path.cwd()
            os.chdir(base)
            try:
                rc, _ = _run_cli("compare-pair", "--before", str(before), "--after", str(after))
            finally:
                os.chdir(previous)
            report = base / "release-notes.diff.html"
            self.assertEqual(rc, cd.EXIT_OK)
            self.assertTrue(report.exists())
            self.assertEqual(vr.validate(report), [])

    def test_explicit_report_name_rejects_underscore(self):
        with tempfile.TemporaryDirectory() as d:
            base = Path(d)
            before = _write(base, "before.md", "old\n")
            after = _write(base, "after.md", "new\n")
            rc, output = _run_cli(
                "compare-pair", "--before", str(before), "--after", str(after),
                "--report", str(base / "review_report.html"),
            )
        self.assertEqual(rc, cd.EXIT_UNSUPPORTED)
        self.assertIn("lowercase kebab-case", output)

    def test_explicit_report_name_rejects_non_suffix_dot(self):
        with tempfile.TemporaryDirectory() as d:
            base = Path(d)
            before = _write(base, "before.md", "old\n")
            after = _write(base, "after.md", "new\n")
            rc, output = _run_cli(
                "compare-pair", "--before", str(before), "--after", str(after),
                "--report", str(base / "review.report.html"),
            )
        self.assertEqual(rc, cd.EXIT_UNSUPPORTED)
        self.assertIn("lowercase kebab-case", output)

    def test_existing_report_is_not_overwritten(self):
        with tempfile.TemporaryDirectory() as d:
            base = Path(d)
            before = _write(base, "before.md", "old\n")
            after = _write(base, "after.md", "new\n")
            report = _write(base, "review.html", "keep\n")
            rc, output = _run_cli(
                "compare-pair", "--before", str(before), "--after", str(after),
                "--report", str(report),
            )
            self.assertEqual(report.read_text(encoding="utf-8"), "keep\n")
        self.assertEqual(rc, cd.EXIT_UNSUPPORTED)
        self.assertIn("Refusing to overwrite", output)


class ReportInvariants(unittest.TestCase):
    def test_zero_js_and_exact_csp(self):
        with tempfile.TemporaryDirectory() as d:
            html = _report(Path(d), "a", "b")
        self.assertNotIn("<script", html)
        self.assertIn(_CANON_CSP, html)

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

    def test_fluid_type_layer_is_container_keyed(self):
        # Type and section rhythm flex to the content column (not the viewport), so
        # the report stays readable across the range of IDE preview-pane widths.
        with tempfile.TemporaryDirectory() as d:
            html = _report(Path(d), "a", "b")
        self.assertIn("container-type:inline-size", html)
        self.assertIn("container-name:report", html)
        self.assertIn("@container report (max-width:34rem)", html)
        self.assertIn("@container report (min-width:80rem)", html)
        self.assertIn("cqi", html)

    def test_fluid_tokens_degrade_to_fixed_sizes_without_cqi(self):
        # A var() consumer whose cqi value fails at computed-value time inherits
        # instead of using its clamp bounds, so the base tokens must be static
        # (the shipped fixed sizes) and fluid values may only apply inside a
        # feature query that engines without container-query units skip.
        with tempfile.TemporaryDirectory() as d:
            html = _report(Path(d), "a", "b")
        root = re.search(r":root\{([^}]*)\}", html).group(1)
        self.assertIn("--fs-0:1rem", root)
        self.assertIn("--fs-code:13px", root)
        self.assertNotIn("cqi", root)
        self.assertIn("@supports (font-size:1cqi)", html)

    def test_page_gutter_has_two_rem_minimum(self):
        # The report content must never sit flush against the pane edge; a >=2rem
        # page gutter keeps the diff readable in a narrow docked IDE preview.
        with tempfile.TemporaryDirectory() as d:
            html = _report(Path(d), "a", "b")
        self.assertRegex(html, r"main\{[^}]*padding:2rem\}")

    def test_markdown_headings_divide_sections(self):
        # Markdown diffs are navigable by document structure: headings hidden in
        # collapsed runs surface as visible section bands, and hunk headers name
        # the section they fall in — line numbers alone can't say WHERE you are.
        body = "\n".join(f"filler {i}" for i in range(12))
        a = f"# Title\nintro\n\n## Alpha\n{body}\n\n## Beta\nold line\n"
        b = f"# Title\nintro\n\n## Alpha\n{body}\n\n## Beta\nnew line\n"
        with tempfile.TemporaryDirectory() as d:
            fa = _write(Path(d), "a.md", a)
            fb = _write(Path(d), "b.md", b)
            rep = Path(d) / "o.html"
            rc, _ = _run_cli("compare-pair", "--before", str(fa), "--after", str(fb),
                             "--report", str(rep))
            self.assertEqual(rc, cd.EXIT_OK)
            html_out = rep.read_text(encoding="utf-8")
            self.assertEqual(vr.validate(rep), [])
        self.assertIn('class="context sec"', html_out)
        self.assertIn("· § ", html_out)

    def test_plain_text_gets_no_section_rows(self):
        # Sectioning keys off markdown structure; a plain-text diff must not
        # misread "# comment"-style lines as document headings.
        body = "\n".join(f"# note {i}" for i in range(12))
        with tempfile.TemporaryDirectory() as d:
            fa = _write(Path(d), "a.txt", f"{body}\nold\n")
            fb = _write(Path(d), "b.txt", f"{body}\nnew\n")
            rep = Path(d) / "o.html"
            rc, _ = _run_cli("compare-pair", "--before", str(fa), "--after", str(fb),
                             "--report", str(rep))
            self.assertEqual(rc, cd.EXIT_OK)
            html_out = rep.read_text(encoding="utf-8")
        self.assertNotIn('class="context sec"', html_out)
        self.assertNotIn("· § ", html_out)

    def test_collapsed_context_accounting(self):
        middle = "\n".join(f"line{i}" for i in range(20))
        d = _diff(f"HEAD\n{middle}\nTAIL", f"head\n{middle}\ntail")
        collapses = [r for r in d.rows if r.kind == "collapse"]
        self.assertEqual(len(collapses), 1)
        hidden = int(re.search(r"(\d+)", collapses[0].note).group(1))
        # 20 equal lines, minus CONTEXT_LINES kept on each side.
        self.assertEqual(hidden, 20 - 2 * cd.CONTEXT_LINES)


class MultiFileBoundaries(unittest.TestCase):
    """Aggregate file transitions stay explicit without affecting normal documents."""

    def _render_bundle(self, base: Path, before: str, after: str,
                       view: str = "unified") -> tuple[int, Path, str]:
        a = _write(base, "aggregate-before.md", before)
        b = _write(base, "aggregate-after.md", after)
        report = base / f"aggregate-{view}.html"
        rc, _ = _run_cli(
            "compare-pair", "--before", str(a), "--after", str(b),
            "--report", str(report), "--view", view,
        )
        html_out = report.read_text(encoding="utf-8") if report.exists() else ""
        return rc, report, html_out

    def test_boundaries_survive_collapsed_context_in_both_views(self):
        filler = "\n".join(f"unchanged {i}" for i in range(18))
        before = _bundle(
            ("docs/one.md", f"# One\n{filler}\nold one"),
            ("docs/two.md", f"# Two\n{filler}\nold two"),
        )
        after = _bundle(
            ("docs/one.md", f"# One\n{filler}\nnew one"),
            ("docs/two.md", f"# Two\n{filler}\nnew two"),
        )
        with tempfile.TemporaryDirectory() as d:
            base = Path(d)
            for view, colspan in (("unified", 4), ("side-by-side", 6)):
                with self.subTest(view=view):
                    rc, report, html_out = self._render_bundle(base, before, after, view)
                    self.assertEqual(rc, cd.EXIT_OK)
                    self.assertEqual(vr.validate(report), [])
                    self.assertEqual(html_out.count('class="file-boundary file-start"'), 2)
                    self.assertEqual(html_out.count('class="file-boundary file-end"'), 2)
                    self.assertEqual(
                        len(re.findall(
                            rf'class="file-boundary file-(?:start|end)"><tr><th '
                            rf'scope="rowgroup" colspan="{colspan}"', html_out)),
                        4,
                    )
                    self.assertIn("START FILE", html_out)
                    self.assertIn("END FILE", html_out)
                    self.assertNotIn("===== BEGIN FILE", html_out)
                    self.assertIn('class="collapse"', html_out)
                    self.assertIn("unchanged lines", html_out)
                    self.assertEqual(html_out.count('class="file-gap"'), 1)
                    first_start = html_out.find('class="file-boundary file-start"')
                    file_gap = html_out.find('class="file-gap"')
                    second_start = html_out.find(
                        'class="file-boundary file-start"', first_start + 1)
                    self.assertLess(first_start, file_gap)
                    self.assertLess(file_gap, second_start)
                    self.assertIn(f'<td colspan="{colspan}"></td>', html_out)
                    self.assertIn(
                        'tbody.file-gap td::before,tbody.file-gap td::after', html_out)
                    self.assertIn('width:2px;background:var(--canvas)', html_out)

    def test_identical_aggregate_keeps_boundaries_and_no_change_status(self):
        body = "\n".join(f"unchanged {i}" for i in range(100))
        bundle = _bundle(("one.md", body), ("two.md", body))
        with tempfile.TemporaryDirectory() as d:
            base = Path(d)
            for view in ("unified", "side-by-side"):
                with self.subTest(view=view):
                    rc, report, html_out = self._render_bundle(base, bundle, bundle, view)
                    self.assertEqual(rc, cd.EXIT_OK)
                    self.assertEqual(vr.validate(report), [])
                    self.assertIn("No textual differences detected", html_out)
                    self.assertEqual(html_out.count('class="file-boundary file-start"'), 2)
                    self.assertEqual(html_out.count('class="file-boundary file-end"'), 2)
                    self.assertIn('class="collapse"', html_out)
                    self.assertNotIn("unchanged 50", html_out)

    def test_envelope_validation_rejects_partial_or_ambiguous_inputs(self):
        valid = _bundle(("one.md", "one"), ("two.md", "two"))
        invalid = {
            "one file": _bundle(("one.md", "one")),
            "missing end": "===== BEGIN FILE: one.md =====\none\n",
            "mismatched end": "===== BEGIN FILE: one.md =====\none\n"
                              "===== END FILE: two.md =====\n",
            "nested start": "===== BEGIN FILE: one.md =====\n"
                            "===== BEGIN FILE: two.md =====\n"
                            "===== END FILE: two.md =====\n"
                            "===== END FILE: one.md =====\n",
            "duplicate path": _bundle(("one.md", "one"), ("one.md", "again")),
            "outside content": f"not enveloped\n{valid}",
        }
        self.assertEqual(cd._aggregate_file_sequence(valid), ["one.md", "two.md"])
        for name, content in invalid.items():
            with self.subTest(case=name):
                self.assertIsNone(cd._aggregate_file_sequence(content))

    def test_invalid_envelope_remains_ordinary_document_text(self):
        before = _bundle(("only.md", "old"))
        after = _bundle(("only.md", "new"))
        with tempfile.TemporaryDirectory() as d:
            rc, report, html_out = self._render_bundle(Path(d), before, after)
            self.assertEqual(rc, cd.EXIT_OK)
            self.assertEqual(vr.validate(report), [])
        self.assertNotIn('class="file-boundary', html_out)
        self.assertIn("===== BEGIN FILE: only.md =====", html_out)

    def test_pair_mismatch_disables_boundary_mode_for_the_whole_report(self):
        before = _bundle(("one.md", "old"), ("two.md", "same"))
        mismatched = {
            "different path": _bundle(("one.md", "new"), ("three.md", "same")),
            "different order": _bundle(("two.md", "same"), ("one.md", "new")),
            "one invalid side": _bundle(("one.md", "new")),
        }
        for name, after in mismatched.items():
            with self.subTest(case=name), tempfile.TemporaryDirectory() as d:
                base = Path(d)
                rc, report, html_out = self._render_bundle(base, before, after)
                self.assertEqual(rc, cd.EXIT_OK)
                self.assertEqual(vr.validate(report), [])
                self.assertNotIn('class="file-boundary', html_out)

    def test_markdown_section_context_resets_at_next_file(self):
        before = _bundle(
            ("one.md", "# Alpha\nold alpha"),
            ("two.md", "plain intro\nold beta"),
        )
        after = _bundle(
            ("one.md", "# Alpha\nnew alpha"),
            ("two.md", "plain intro\nnew beta"),
        )
        with tempfile.TemporaryDirectory() as d:
            rc, _, html_out = self._render_bundle(Path(d), before, after)
            self.assertEqual(rc, cd.EXIT_OK)
        second_file = html_out.split('file-boundary-path">two.md', 1)[1]
        self.assertNotIn("§ Alpha", second_file)

    def test_hostile_file_path_is_escaped_and_report_stays_safe(self):
        hostile = "docs/<script>alert(1)</script>.md"
        before = _bundle((hostile, "old"), ("safe.md", "same"))
        after = _bundle((hostile, "new"), ("safe.md", "same"))
        with tempfile.TemporaryDirectory() as d:
            rc, report, html_out = self._render_bundle(Path(d), before, after)
            self.assertEqual(rc, cd.EXIT_OK)
            self.assertEqual(vr.validate(report), [])
        self.assertNotIn("<script>alert", html_out)
        self.assertIn("&lt;script&gt;alert(1)&lt;/script&gt;", html_out)


class SnapshotCleanupContainment(unittest.TestCase):
    """Cleanup must never read or delete through a hostile manifest.

    The snapshot store is on-disk state; a corrupt or crafted manifest.json
    must not turn cleanup's unlink into an arbitrary-file delete.
    """

    def _forge_store(self, base: Path, blob_value: str) -> Path:
        victim = base / "victim.txt"
        victim.write_text("keep me\n", encoding="utf-8")
        sub = base / "state" / "snapshots" / "0123456789abcdef"
        sub.mkdir(parents=True)
        (sub / "manifest.json").write_text(json.dumps({
            "source_path": str(base / "some-source.md"),
            "snapshots": [{"blob": blob_value,
                           "captured_at": "2026-01-01T00:00:00+00:00",
                           "sha256": "0" * 64, "size": 8}],
        }), encoding="utf-8")
        return victim

    def _run_cleanup(self, base: Path) -> int:
        rc, _ = _run_cli("cleanup", "--state-dir", str(base / "state"))
        return rc

    def test_traversal_blob_is_refused(self):
        with tempfile.TemporaryDirectory() as d:
            victim = self._forge_store(Path(d), "../../../victim.txt")
            rc = self._run_cleanup(Path(d))
            self.assertEqual(rc, cd.EXIT_OK)
            self.assertTrue(victim.exists(),
                            "cleanup must never delete outside its store")

    def test_absolute_blob_is_refused(self):
        with tempfile.TemporaryDirectory() as d:
            base = Path(d)
            victim = self._forge_store(base, str((base / "victim.txt").resolve()))
            rc = self._run_cleanup(base)
            self.assertEqual(rc, cd.EXIT_OK)
            self.assertTrue(victim.exists())

    def test_symlink_blob_escape_is_refused(self):
        with tempfile.TemporaryDirectory() as d:
            base = Path(d)
            victim = self._forge_store(base, "link.bin")
            sub = base / "state" / "snapshots" / "0123456789abcdef"
            (sub / "link.bin").symlink_to(victim)
            self._run_cleanup(base)
            self.assertTrue(victim.exists(),
                            "a symlinked blob must not be trusted")

    def test_legitimate_blob_still_cleaned(self):
        with tempfile.TemporaryDirectory() as d:
            base = Path(d)
            self._forge_store(base, "good.bin")
            sub = base / "state" / "snapshots" / "0123456789abcdef"
            blob = sub / "good.bin"
            blob.write_text("snapshot bytes", encoding="utf-8")
            rc = self._run_cleanup(base)
            self.assertEqual(rc, cd.EXIT_OK)
            self.assertFalse(blob.exists(), "real snapshots must still be removed")


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

    def test_report_is_light_mode_only(self):
        # The report ships the Cursor parchment reference, a light-only design
        # language; a dark override would fork the palette away from the source.
        self.assertIn("color-scheme:light", cd._CSS)
        self.assertNotIn("prefers-color-scheme:dark", cd._CSS)

    def test_legend_uses_full_strength_text(self):
        self.assertIn(".legend mark.wd{color:var(--text)}", cd._CSS)

    def test_inline_marks_carry_a_non_colour_decoration(self):
        # Word-level changes must be distinguishable without colour (monochrome / colour-blind),
        # not only in forced-colours mode: additions underlined, removals struck through.
        css = cd._CSS
        self.assertIn("mark.wd.add{background:var(--add-inline);text-decoration:underline}", css)
        self.assertIn("mark.wd.del{background:var(--del-inline);text-decoration:line-through}", css)


if __name__ == "__main__":
    unittest.main(verbosity=2)
