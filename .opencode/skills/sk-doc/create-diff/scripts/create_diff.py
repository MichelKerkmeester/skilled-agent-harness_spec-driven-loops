#!/usr/bin/env python3
"""Local, Git-free before/after document diff engine.

Compares two versions of a document and renders a single self-contained,
zero-JavaScript, accessible HTML report. Everything stays on the machine: no
network, no upload, no telemetry. The source files are never mutated.

Design intent (why this exists as one dependency-light file):
    A document review needs a *deterministic* diff and an *escaped* report to be
    trustworthy and safe. Both are mechanical, so they live in code rather than
    being eyeballed. The whole engine is Python-stdlib-first so the skill works
    with zero install; richer formats degrade honestly instead of guessing.

Supported inputs and fidelity tiers (see `capabilities`):
    text      full      exact text comparison
    markdown  full      exact text comparison + heading/section awareness
    html      text      visible-text comparison; visual/attribute changes not shown
    docx      text      paragraph/table text; formatting/tracked-changes not shown
    pdf       text*     text layer only, needs pdftotext or pypdf; scanned PDFs
                        (no text layer) are flagged, never silently emptied

CLI:
    capabilities [--json]
    snapshot   <file> [--state-dir DIR]
    compare    <file> [--report OUT] [--view unified|side-by-side] [--state-dir DIR] [--json]
    compare-pair --before A --after B [--report OUT] [--view ...] [--label-before L] [--label-after L] [--json]
    status     [<file>] [--state-dir DIR] [--json]
    cleanup    [--file F] [--older-than DAYS] [--state-dir DIR] [--dry-run]

Exit codes: 0 success; 2 usage error; 3 unsupported/limited capability with no
fallback; 4 missing baseline snapshot; 5 I/O or extraction failure.
"""

from __future__ import annotations

import argparse
import base64
import datetime as _dt
import hashlib
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unicodedata
import zipfile
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable, List, Optional, Tuple
from xml.etree import ElementTree as ET

# Exit codes as named constants so callers (the skill wrapper, tests) can map them.
EXIT_OK = 0
EXIT_USAGE = 2
EXIT_UNSUPPORTED = 3
EXIT_NO_BASELINE = 4
EXIT_IO = 5

GENERATOR = "sk-doc create-diff"
STATE_DIR_NAME = ".create-diff"
CONTEXT_LINES = 3           # lines of unchanged context kept around each change
COLLAPSE_THRESHOLD = 7      # runs of equal lines longer than this get collapsed


class CapabilityError(Exception):
    """Raised when a format cannot be extracted at usable fidelity right now."""


# --------------------------------------------------------------------------- #
# Fidelity model
# --------------------------------------------------------------------------- #

# Tier meanings, surfaced verbatim to the user so a comparison is never trusted
# beyond what the extractor can actually see.
TIER_FULL = "full"          # exact text; nothing is dropped
TIER_TEXT = "text"          # visible/structural text only; styling not compared
TIER_CONDITIONAL = "text*"  # works only when an optional extractor is available
TIER_UNSUPPORTED = "unsupported"

TIER_LABEL = {
    TIER_FULL: "Full fidelity — exact text comparison.",
    TIER_TEXT: "Text fidelity — visible/structural text only; formatting, styling, "
               "and non-text content are not compared.",
    TIER_CONDITIONAL: "Conditional — text layer only, requires an optional extractor.",
    TIER_UNSUPPORTED: "Unsupported — no reliable local extraction available.",
}

EXTENSION_FORMAT = {
    ".txt": "text", ".text": "text", ".log": "text", ".csv": "text",
    ".md": "markdown", ".markdown": "markdown", ".mdown": "markdown",
    ".html": "html", ".htm": "html", ".xhtml": "html",
    ".docx": "docx",
    ".pdf": "pdf",
}

# Formats create-diff cannot faithfully compare: binary office/media/archive types
# whose bytes are not text. Refused by extension (exit 3) so they are never raw-byte
# "text"-diffed into a meaningless report — honest failure over a fabricated diff.
UNSUPPORTED_EXTENSIONS = {
    ".xlsx", ".xls", ".xlsm", ".ods",                                    # spreadsheets
    ".pptx", ".ppt", ".odp",                                             # presentations
    ".doc", ".odt",                                                      # binary/legacy word processing
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".webp", ".ico",  # images
    ".zip", ".gz", ".tar", ".7z", ".rar",                               # archives
}


def _looks_binary(path: Path, sample_bytes: int = 8192) -> bool:
    """Heuristic binary sniff: a NUL byte in the leading bytes marks binary content.

    Mirrors git's is-binary rule. Used only on the unknown-extension fallback path so an
    unhandled binary format (e.g. .xlsx, .png) is refused rather than raw-byte "text"-diffed
    into a meaningless report; text-like unknowns still fall back to text.
    """
    try:
        with path.open("rb") as fh:
            return b"\x00" in fh.read(sample_bytes)
    except OSError:
        return False


def detect_format(path: Path) -> str:
    fmt = EXTENSION_FORMAT.get(path.suffix.lower())
    if fmt:
        return fmt
    # Unknown extensions are treated as plain text rather than refused; the report
    # states the assumption so the user can correct it.
    return "text"


# --------------------------------------------------------------------------- #
# Extraction
# --------------------------------------------------------------------------- #

@dataclass
class Extraction:
    text: str
    fmt: str
    tier: str
    warnings: List[str] = field(default_factory=list)
    sections: List[str] = field(default_factory=list)   # e.g. Markdown/HTML headings
    extractor: str = "builtin"


def normalize(text: str, *, strip_trailing_ws: bool = True) -> str:
    """Canonicalize so incidental encoding differences are not reported as edits."""
    text = unicodedata.normalize("NFC", text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    if strip_trailing_ws:
        text = "\n".join(line.rstrip() for line in text.split("\n"))
    return text


def _read_text_file(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        # Fall back to a permissive decode so a stray byte does not abort review.
        return path.read_bytes().decode("utf-8", errors="replace")


_HEADING_RE = re.compile(r"^(#{1,6})\s+(.*\S)\s*$")


def _markdown_sections(text: str) -> List[str]:
    out = []
    in_fence = False
    for line in text.split("\n"):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        m = _HEADING_RE.match(line)
        if m:
            out.append(("#" * len(m.group(1))) + " " + m.group(2))
    return out


class _TextExtractingParser(HTMLParser):
    """Collect visible text from HTML, dropping script/style, tracking headings."""

    _BLOCK = {"p", "div", "section", "article", "header", "footer", "li", "tr",
              "br", "h1", "h2", "h3", "h4", "h5", "h6", "table", "ul", "ol",
              "blockquote", "pre"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: List[str] = []
        self.headings: List[str] = []
        self._skip = 0
        self._heading_level: Optional[int] = None
        self._heading_buf: List[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in ("script", "style"):
            self._skip += 1
            return
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._heading_level = int(tag[1])
            self._heading_buf = []
        if tag in self._BLOCK:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in ("script", "style") and self._skip:
            self._skip -= 1
            return
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self._heading_level:
            title = " ".join("".join(self._heading_buf).split())
            if title:
                self.headings.append(("#" * self._heading_level) + " " + title)
            self._heading_level = None
            self._heading_buf = []
        if tag in self._BLOCK:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if self._skip:
            return
        self.parts.append(data)
        if self._heading_level is not None:
            self._heading_buf.append(data)

    def get_text(self) -> str:
        raw = "".join(self.parts)
        # Collapse intra-line whitespace but keep line boundaries meaningful.
        lines = [" ".join(seg.split()) for seg in raw.split("\n")]
        cleaned: List[str] = []
        for ln in lines:
            if ln or (cleaned and cleaned[-1]):
                cleaned.append(ln)
        return "\n".join(cleaned).strip("\n")


def _extract_html(path: Path) -> Extraction:
    parser = _TextExtractingParser()
    parser.feed(_read_text_file(path))
    parser.close()
    return Extraction(
        text=parser.get_text(),
        fmt="html", tier=TIER_TEXT,
        warnings=["Only visible text is compared; CSS, attributes, inline styles, "
                  "scripts, and layout changes are not shown."],
        sections=parser.headings,
    )


_W_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def _extract_docx(path: Path) -> Extraction:
    try:
        with zipfile.ZipFile(path) as zf:
            with zf.open("word/document.xml") as fh:
                tree = ET.parse(fh)
    except (KeyError, zipfile.BadZipFile) as exc:
        raise CapabilityError(f"Not a readable .docx (missing word/document.xml): {exc}")

    root = tree.getroot()
    lines: List[str] = []
    sections: List[str] = []
    body = root.find(f"{_W_NS}body")
    if body is None:
        body = root

    def paragraph_text(p_el) -> str:
        buf: List[str] = []
        for node in p_el.iter():
            if node.tag == f"{_W_NS}t":
                buf.append(node.text or "")
            elif node.tag == f"{_W_NS}tab":
                buf.append("\t")
            elif node.tag == f"{_W_NS}br":
                buf.append("\n")
        return "".join(buf)

    def para_style(p_el) -> str:
        ppr = p_el.find(f"{_W_NS}pPr")
        if ppr is None:
            return ""
        style = ppr.find(f"{_W_NS}pStyle")
        if style is None:
            return ""
        return style.get(f"{_W_NS}val", "")

    for el in body:
        tag = el.tag
        if tag == f"{_W_NS}p":
            txt = paragraph_text(el)
            lines.append(txt)
            style = para_style(el).lower()
            if txt.strip() and style.startswith("heading"):
                sections.append(txt.strip())
        elif tag == f"{_W_NS}tbl":
            for row in el.findall(f"{_W_NS}tr"):
                cells = [ " ".join(paragraph_text(p).split())
                          for cell in row.findall(f"{_W_NS}tc")
                          for p in cell.findall(f"{_W_NS}p") ]
                lines.append(" | ".join(c for c in cells if c))

    return Extraction(
        text="\n".join(lines).strip("\n"),
        fmt="docx", tier=TIER_TEXT,
        warnings=["Paragraph and table text only; formatting, styles, images, "
                  "comments, and tracked changes are not compared."],
        sections=sections,
    )


def _pdf_extractor() -> Tuple[Optional[str], Optional[str]]:
    """Return (kind, detail) for the first available PDF text extractor."""
    exe = shutil.which("pdftotext")
    if exe:
        return "pdftotext", exe
    try:
        import pypdf  # noqa: F401
        return "pypdf", "pypdf"
    except Exception:
        pass
    try:
        import pdfplumber  # noqa: F401
        return "pdfplumber", "pdfplumber"
    except Exception:
        pass
    return None, None


def _extract_pdf(path: Path) -> Extraction:
    kind, detail = _pdf_extractor()
    if kind is None:
        raise CapabilityError(
            "PDF text extraction needs poppler's `pdftotext` or the `pypdf` "
            "(or `pdfplumber`) package. Install one, or pre-extract the text and "
            "use `compare-pair --before <a.txt> --after <b.txt>`.")

    text = ""
    if kind == "pdftotext":
        proc = subprocess.run(
            [detail or "pdftotext", "-enc", "UTF-8", "-nopgbrk", str(path), "-"],
            capture_output=True, text=True)
        if proc.returncode != 0:
            raise CapabilityError(f"pdftotext failed: {proc.stderr.strip()}")
        text = proc.stdout
    elif kind == "pypdf":
        import pypdf
        reader = pypdf.PdfReader(str(path))
        text = "\n".join((page.extract_text() or "") for page in reader.pages)
    elif kind == "pdfplumber":
        import pdfplumber
        with pdfplumber.open(str(path)) as pdf:
            text = "\n".join((page.extract_text() or "") for page in pdf.pages)

    warnings = ["Text layer only; layout, images, and formatting are not compared."]
    if not text.strip():
        warnings.append("No extractable text found — this PDF appears to be scanned "
                        "or image-only. OCR is not included; the comparison would be "
                        "empty and is not trustworthy.")
    return Extraction(text=text, fmt="pdf", tier=TIER_CONDITIONAL,
                      warnings=warnings, extractor=kind)


def extract(path: Path, *, fmt: Optional[str] = None) -> Extraction:
    if not path.exists():
        raise CapabilityError(f"File not found: {path}")
    suffix = path.suffix.lower()
    if suffix in UNSUPPORTED_EXTENSIONS:
        raise CapabilityError(
            f"Unsupported format '{suffix}' for {path.name}: create-diff compares text, "
            f"Markdown, HTML, DOCX, and text-PDF only. Run 'capabilities' for the "
            f"supported matrix.")
    fmt = fmt or detect_format(path)
    if fmt == "text":
        if suffix not in EXTENSION_FORMAT and _looks_binary(path):
            raise CapabilityError(
                f"Refusing to diff {path.name}: unknown extension "
                f"'{path.suffix or '(none)'}' with binary content and no text extractor. "
                f"Convert it to a supported text format, or rename it to a supported "
                f"extension.")
        text = _read_text_file(path)
        return Extraction(text=text, fmt="text", tier=TIER_FULL)
    if fmt == "markdown":
        text = _read_text_file(path)
        return Extraction(text=text, fmt="markdown", tier=TIER_FULL,
                          sections=_markdown_sections(text))
    if fmt == "html":
        return _extract_html(path)
    if fmt == "docx":
        return _extract_docx(path)
    if fmt == "pdf":
        return _extract_pdf(path)
    raise CapabilityError(f"Unknown format: {fmt}")


# --------------------------------------------------------------------------- #
# Diffing
# --------------------------------------------------------------------------- #

@dataclass
class Row:
    kind: str                 # 'context' | 'add' | 'remove' | 'collapse'
    old_no: Optional[int]
    new_no: Optional[int]
    old_html: str = ""        # escaped, may contain inline <mark> spans
    new_html: str = ""
    note: str = ""            # for 'collapse'


@dataclass
class DiffResult:
    rows: List[Row]
    added: int
    removed: int
    changed: int
    unchanged: int
    moves: int
    a_lines: int
    b_lines: int

    @property
    def total_changes(self) -> int:
        return self.added + self.removed + self.changed


_TOKEN_RE = re.compile(r"\s+|\S+")


def _inline_diff(a: str, b: str) -> Tuple[str, str]:
    """Word-level highlight of an in-place line change; returns (old_html, new_html)."""
    a_tokens = _TOKEN_RE.findall(a)
    b_tokens = _TOKEN_RE.findall(b)
    sm = SequenceMatcher(a=a_tokens, b=b_tokens, autojunk=False)
    old_parts: List[str] = []
    new_parts: List[str] = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        old_seg = html.escape("".join(a_tokens[i1:i2]))
        new_seg = html.escape("".join(b_tokens[j1:j2]))
        if tag == "equal":
            old_parts.append(old_seg)
            new_parts.append(new_seg)
        else:
            if old_seg:
                old_parts.append(f'<mark class="wd del">{old_seg}</mark>')
            if new_seg:
                new_parts.append(f'<mark class="wd add">{new_seg}</mark>')
    return "".join(old_parts), "".join(new_parts)


def _detect_moves(a_lines: List[str], b_lines: List[str],
                  removed_idx: Iterable[int], added_idx: Iterable[int]) -> int:
    """Cheap move heuristic: a removed line whose exact text reappears as an added
    line is counted as a move rather than an unrelated delete+insert."""
    removed_pool: dict = {}
    for i in removed_idx:
        key = a_lines[i].strip()
        if key:
            removed_pool.setdefault(key, 0)
            removed_pool[key] += 1
    moves = 0
    for j in added_idx:
        key = b_lines[j].strip()
        if key and removed_pool.get(key, 0) > 0:
            removed_pool[key] -= 1
            moves += 1
    return moves


def diff_lines(a_text: str, b_text: str) -> DiffResult:
    a_lines = a_text.split("\n")
    b_lines = b_text.split("\n")
    sm = SequenceMatcher(a=a_lines, b=b_lines, autojunk=False)

    rows: List[Row] = []
    added = removed = changed = unchanged = 0
    removed_idx: List[int] = []
    added_idx: List[int] = []

    opcodes = sm.get_opcodes()
    for op_pos, (tag, i1, i2, j1, j2) in enumerate(opcodes):
        if tag == "equal":
            length = i2 - i1
            unchanged += length
            first = op_pos == 0
            last = op_pos == len(opcodes) - 1
            if length > COLLAPSE_THRESHOLD and not (first and last):
                head = 0 if first else CONTEXT_LINES
                tail = 0 if last else CONTEXT_LINES
                for k in range(head):
                    rows.append(Row("context", i1 + k + 1, j1 + k + 1,
                                    html.escape(a_lines[i1 + k]),
                                    html.escape(b_lines[j1 + k])))
                hidden = length - head - tail
                if hidden > 0:
                    rows.append(Row("collapse", None, None,
                                    note=f"{hidden} unchanged line{'s' if hidden != 1 else ''}"))
                for k in range(length - tail, length):
                    rows.append(Row("context", i1 + k + 1, j1 + k + 1,
                                    html.escape(a_lines[i1 + k]),
                                    html.escape(b_lines[j1 + k])))
            else:
                for k in range(length):
                    rows.append(Row("context", i1 + k + 1, j1 + k + 1,
                                    html.escape(a_lines[i1 + k]),
                                    html.escape(b_lines[j1 + k])))
        elif tag == "delete":
            for k in range(i1, i2):
                removed += 1
                removed_idx.append(k)
                rows.append(Row("remove", k + 1, None, html.escape(a_lines[k]), ""))
        elif tag == "insert":
            for k in range(j1, j2):
                added += 1
                added_idx.append(k)
                rows.append(Row("add", None, k + 1, "", html.escape(b_lines[k])))
        elif tag == "replace":
            la, lb = i2 - i1, j2 - j1
            pairs = min(la, lb)
            for k in range(pairs):
                changed += 1
                old_html, new_html = _inline_diff(a_lines[i1 + k], b_lines[j1 + k])
                rows.append(Row("remove", i1 + k + 1, None, old_html, ""))
                rows.append(Row("add", None, j1 + k + 1, "", new_html))
            for k in range(pairs, la):
                removed += 1
                removed_idx.append(i1 + k)
                rows.append(Row("remove", i1 + k + 1, None,
                                html.escape(a_lines[i1 + k]), ""))
            for k in range(pairs, lb):
                added += 1
                added_idx.append(j1 + k)
                rows.append(Row("add", None, j1 + k + 1, "",
                                html.escape(b_lines[j1 + k])))

    moves = _detect_moves(a_lines, b_lines, removed_idx, added_idx)
    return DiffResult(rows=rows, added=added, removed=removed, changed=changed,
                      unchanged=unchanged, moves=moves,
                      a_lines=len(a_lines), b_lines=len(b_lines))


# --------------------------------------------------------------------------- #
# Report rendering (self-contained, zero-JS, accessible)
# --------------------------------------------------------------------------- #

_CSS = """
:root{color-scheme:light dark;--bg:#fff;--fg:#1a1a1a;--muted:#5a5a5a;
--line:#d0d0d0;--add-bg:#e6ffed;--add-fg:#046a1e;--del-bg:#ffeef0;--del-fg:#b31d28;
--wd-add:#a6f3bf;--wd-del:#ffc0cb;--head:#f4f4f4;--focus:#0b62d6}
@media(prefers-color-scheme:dark){:root{--bg:#0f1115;--fg:#e6e6e6;--muted:#a0a0a0;
--line:#333;--add-bg:#0f2e18;--add-fg:#6fd08a;--del-bg:#3a1416;--del-fg:#f2969c;
--wd-add:#1c5a30;--wd-del:#6e2329;--head:#1a1d24;--focus:#5aa2ff}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);
font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
main{max-width:1100px;margin:0 auto;padding:1.5rem 1rem 4rem}
h1{font-size:1.5rem;margin:0 0 .25rem}
.skip{position:absolute;left:-999px}.skip:focus{left:1rem;top:.5rem;
background:var(--bg);padding:.5rem;border:2px solid var(--focus);z-index:2}
.meta{color:var(--muted);font-size:.9rem;margin:0 0 1rem}
.warn{border:1px solid var(--del-fg);background:var(--del-bg);color:var(--fg);
padding:.75rem 1rem;border-radius:6px;margin:1rem 0}
.warn h2{margin:.1rem 0 .4rem;font-size:1rem}
.summary{border-collapse:collapse;margin:1rem 0;font-size:.95rem}
.summary th,.summary td{border:1px solid var(--line);padding:.35rem .7rem;text-align:left}
.summary th{background:var(--head)}
.legend{font-size:.85rem;color:var(--muted);margin:.5rem 0 1rem}
table.diff{border-collapse:collapse;width:100%;font:13px/1.55 ui-monospace,
SFMono-Regular,Menlo,Consolas,monospace;table-layout:fixed}
table.diff th{background:var(--head);text-align:left;padding:.3rem .5rem;
border-bottom:2px solid var(--line);position:sticky;top:0}
td.no{width:3.2rem;text-align:right;color:var(--muted);
user-select:none;padding:.1rem .5rem;border-right:1px solid var(--line);white-space:nowrap}
td.mark{width:1.4rem;text-align:center;user-select:none;font-weight:700}
td.txt{padding:.1rem .5rem;white-space:pre-wrap;overflow-wrap:anywhere}
tr.add td.txt{background:var(--add-bg)}tr.add td.mark{color:var(--add-fg)}
tr.remove td.txt{background:var(--del-bg)}tr.remove td.mark{color:var(--del-fg)}
tr.collapse td{text-align:center;color:var(--muted);background:var(--head);
padding:.3rem;font-style:italic}
mark.wd{padding:0 1px;border-radius:2px}
mark.wd.add{background:var(--wd-add);color:inherit}
mark.wd.del{background:var(--wd-del);color:inherit}
.sxs td.txt{width:calc(50% - 2.3rem)}
footer{margin-top:2rem;color:var(--muted);font-size:.82rem;
border-top:1px solid var(--line);padding-top:1rem}
"""


def _esc(s: str) -> str:
    return html.escape(s, quote=True)


def _now_iso() -> str:
    # Honour SOURCE_DATE_EPOCH so a report can be byte-reproducible in tests and
    # audits; otherwise stamp the real capture time.
    epoch = os.environ.get("SOURCE_DATE_EPOCH")
    if epoch and epoch.isdigit():
        moment = _dt.datetime.fromtimestamp(int(epoch), _dt.timezone.utc)
    else:
        moment = _dt.datetime.now(_dt.timezone.utc)
    return moment.replace(microsecond=0).isoformat()


def render_report(diff: DiffResult, *, label_before: str, label_after: str,
                  extraction_before: Extraction, extraction_after: Extraction,
                  view: str = "unified", title: str = "Document Diff") -> str:
    warnings: List[str] = []
    for e in (extraction_before, extraction_after):
        for w in e.warnings:
            if w not in warnings:
                warnings.append(w)

    fmt = extraction_after.fmt
    tier = extraction_after.tier

    warn_html = ""
    if warnings:
        items = "".join(f"<li>{_esc(w)}</li>" for w in warnings)
        warn_html = (f'<section class="warn" aria-labelledby="wtitle">'
                     f'<h2 id="wtitle">Fidelity notes</h2><ul>{items}</ul></section>')

    summary = (
        '<table class="summary"><caption class="skip">Change summary</caption>'
        '<tbody>'
        f'<tr><th scope="row">Before</th><td>{_esc(label_before)} '
        f'({diff.a_lines} lines)</td></tr>'
        f'<tr><th scope="row">After</th><td>{_esc(label_after)} '
        f'({diff.b_lines} lines)</td></tr>'
        f'<tr><th scope="row">Format</th><td>{_esc(fmt)} — {_esc(TIER_LABEL.get(tier, tier))}</td></tr>'
        f'<tr><th scope="row">Lines added</th><td>{diff.added}</td></tr>'
        f'<tr><th scope="row">Lines removed</th><td>{diff.removed}</td></tr>'
        f'<tr><th scope="row">Lines changed</th><td>{diff.changed}</td></tr>'
        f'<tr><th scope="row">Possible moves</th><td>{diff.moves}</td></tr>'
        f'<tr><th scope="row">Unchanged</th><td>{diff.unchanged}</td></tr>'
        '</tbody></table>'
    )

    if view == "side-by-side":
        table = _render_side_by_side(diff, label_before, label_after)
    else:
        table = _render_unified(diff)

    no_change = diff.total_changes == 0
    if no_change:
        table = ('<p role="status"><strong>No textual differences detected.</strong> '
                 'The two versions are identical after normalization.</p>')

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'">
<title>{_esc(title)}</title>
<style>{_CSS}</style>
</head>
<body>
<a class="skip" href="#diff">Skip to differences</a>
<main>
<header>
<h1>{_esc(title)}</h1>
<p class="meta">Generated {_esc(_now_iso())} by {_esc(GENERATOR)} · local only, no network.</p>
</header>
{warn_html}
<section aria-labelledby="stitle">
<h2 id="stitle">Summary</h2>
{summary}
<p class="legend"><strong>+</strong> added · <strong>−</strong> removed ·
changed lines show both, with word-level <mark class="wd add">additions</mark> and
<mark class="wd del">removals</mark> highlighted. Markers are shown as text as well as
colour.</p>
</section>
<section aria-labelledby="dtitle" id="diff">
<h2 id="dtitle">Differences ({_esc('unified' if view != 'side-by-side' else 'side by side')} view)</h2>
{table}
</section>
<footer>
<p>All processing happened on this machine. This report is a single self-contained
file with no scripts and no external requests.</p>
</footer>
</main>
</body>
</html>
"""


def _render_unified(diff: DiffResult) -> str:
    out = ['<table class="diff"><thead><tr>',
           '<th scope="col" class="no">Old</th>',
           '<th scope="col" class="no">New</th>',
           '<th scope="col" class="mark"><span class="skip">Change</span></th>',
           '<th scope="col">Content</th></tr></thead><tbody>']
    for r in diff.rows:
        if r.kind == "collapse":
            out.append(f'<tr class="collapse"><td colspan="4">⋯ {_esc(r.note)} ⋯</td></tr>')
            continue
        old = "" if r.old_no is None else str(r.old_no)
        new = "" if r.new_no is None else str(r.new_no)
        if r.kind == "add":
            out.append(f'<tr class="add"><td class="no"></td><td class="no">{new}</td>'
                       f'<td class="mark" aria-label="added">+</td>'
                       f'<td class="txt">{r.new_html}</td></tr>')
        elif r.kind == "remove":
            out.append(f'<tr class="remove"><td class="no">{old}</td><td class="no"></td>'
                       f'<td class="mark" aria-label="removed">−</td>'
                       f'<td class="txt">{r.old_html}</td></tr>')
        else:
            out.append(f'<tr class="context"><td class="no">{old}</td><td class="no">{new}</td>'
                       f'<td class="mark"></td><td class="txt">{r.old_html}</td></tr>')
    out.append("</tbody></table>")
    return "".join(out)


def _render_side_by_side(diff: DiffResult, label_before: str, label_after: str) -> str:
    out = ['<table class="diff sxs"><thead><tr>',
           '<th scope="col" class="no">#</th>',
           f'<th scope="col">{_esc(label_before)}</th>',
           '<th scope="col" class="no">#</th>',
           f'<th scope="col">{_esc(label_after)}</th></tr></thead><tbody>']
    for r in diff.rows:
        if r.kind == "collapse":
            out.append(f'<tr class="collapse"><td colspan="4">⋯ {_esc(r.note)} ⋯</td></tr>')
            continue
        old = "" if r.old_no is None else str(r.old_no)
        new = "" if r.new_no is None else str(r.new_no)
        cls = "" if r.kind == "context" else r.kind
        left = r.old_html if r.kind != "add" else ""
        right = r.new_html if r.kind != "remove" else ""
        out.append(
            f'<tr class="{cls}"><td class="no">{old}</td><td class="txt">{left}</td>'
            f'<td class="no">{new}</td><td class="txt">{right}</td></tr>')
    out.append("</tbody></table>")
    return "".join(out)


# --------------------------------------------------------------------------- #
# Snapshot store
# --------------------------------------------------------------------------- #

def _state_dir(explicit: Optional[str]) -> Path:
    return Path(explicit) if explicit else Path.cwd() / STATE_DIR_NAME


def _path_key(path: Path) -> str:
    return hashlib.sha256(str(path.resolve()).encode("utf-8")).hexdigest()[:16]


def _snap_dir(state: Path, path: Path) -> Path:
    return state / "snapshots" / _path_key(path)


def _sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def _atomic_copy(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(dst.parent))
    os.close(fd)
    try:
        shutil.copyfile(src, tmp)   # copyfile never touches the source
        os.replace(tmp, dst)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def capture_snapshot(path: Path, state: Path) -> dict:
    if not path.exists():
        raise CapabilityError(f"Cannot snapshot missing file: {path}")
    digest = _sha256_file(path)
    ts = _dt.datetime.now(_dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    snap_dir = _snap_dir(state, path)
    blob = snap_dir / f"{ts}-{digest[:12]}{path.suffix}"
    _atomic_copy(path, blob)
    entry = {
        "captured_at": _now_iso(),
        "source_path": str(path.resolve()),
        "source_name": path.name,
        "sha256": digest,
        "size": path.stat().st_size,
        "blob": blob.name,
    }
    manifest = snap_dir / "manifest.json"
    data = _load_manifest(manifest)
    data["source_path"] = str(path.resolve())
    data.setdefault("snapshots", []).append(entry)
    _write_json(manifest, data)
    return entry


def _load_manifest(manifest: Path) -> dict:
    if manifest.exists():
        try:
            return json.loads(manifest.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
    return {}


def _write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(path.parent))
    with os.fdopen(fd, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, sort_keys=True)
        fh.write("\n")
    os.replace(tmp, path)


def latest_snapshot(path: Path, state: Path) -> Optional[dict]:
    manifest = _snap_dir(state, path) / "manifest.json"
    data = _load_manifest(manifest)
    snaps = data.get("snapshots") or []
    return snaps[-1] if snaps else None


# --------------------------------------------------------------------------- #
# Commands
# --------------------------------------------------------------------------- #

def _write_report(html_str: str, out: Optional[str], default_stem: str) -> Path:
    target = Path(out) if out else Path.cwd() / f"{default_stem}.diff.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html_str, encoding="utf-8")
    return target


def _summary_dict(diff: DiffResult, report: Optional[Path], fmt: str, tier: str) -> dict:
    return {
        "format": fmt, "fidelity_tier": tier,
        "added": diff.added, "removed": diff.removed, "changed": diff.changed,
        "unchanged": diff.unchanged, "possible_moves": diff.moves,
        "total_changes": diff.total_changes,
        "identical": diff.total_changes == 0,
        "report": str(report) if report else None,
    }


def cmd_capabilities(args) -> int:
    pdf_kind, _ = _pdf_extractor()
    rows = [
        ("text", TIER_FULL, True, "Plain text, logs, CSV."),
        ("markdown", TIER_FULL, True, "Exact text + heading/section awareness."),
        ("html", TIER_TEXT, True, "Visible text; styling/attributes not compared."),
        ("docx", TIER_TEXT, True, "Paragraph/table text; formatting/tracked-changes not compared."),
        ("pdf", TIER_CONDITIONAL, pdf_kind is not None,
         f"Text layer only; extractor: {pdf_kind or 'NONE — install pdftotext or pypdf'}."),
    ]
    if getattr(args, "json", False):
        payload = [{"format": f, "tier": t, "available": bool(a), "notes": n}
                   for f, t, a, n in rows]
        print(json.dumps({"formats": payload, "pdf_extractor": pdf_kind}, indent=2))
        return EXIT_OK
    print(f"{GENERATOR} — format capabilities\n")
    print(f"{'FORMAT':10} {'TIER':12} {'AVAILABLE':10} NOTES")
    for f, t, a, n in rows:
        print(f"{f:10} {t:12} {'yes' if a else 'NO':10} {n}")
    print("\nTiers: " + "; ".join(f"{k}={v}" for k, v in TIER_LABEL.items()))
    return EXIT_OK


def cmd_snapshot(args) -> int:
    path = Path(args.file)
    state = _state_dir(args.state_dir)
    try:
        entry = capture_snapshot(path, state)
    except CapabilityError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return EXIT_IO
    print(f"Captured baseline for {path.name}")
    print(f"  sha256 {entry['sha256'][:16]}…  size {entry['size']}  at {entry['captured_at']}")
    print(f"  stored under {_snap_dir(state, path)}")
    return EXIT_OK


def _compare_and_report(ext_a: Extraction, ext_b: Extraction, *, label_before: str,
                        label_after: str, view: str, out: Optional[str],
                        default_stem: str, as_json: bool, title: str) -> int:
    a_norm = normalize(ext_a.text)
    b_norm = normalize(ext_b.text)
    diff = diff_lines(a_norm, b_norm)
    report_html = render_report(diff, label_before=label_before, label_after=label_after,
                                extraction_before=ext_a, extraction_after=ext_b,
                                view=view, title=title)
    report_path = _write_report(report_html, out, default_stem)
    summary = _summary_dict(diff, report_path, ext_b.fmt, ext_b.tier)
    if as_json:
        print(json.dumps(summary, indent=2))
        return EXIT_OK
    print(f"Compared {label_before} → {label_after} ({ext_b.fmt}, tier {ext_b.tier})")
    print(f"  +{diff.added}  −{diff.removed}  ~{diff.changed}  "
          f"moves≈{diff.moves}  unchanged {diff.unchanged}")
    for w in dict.fromkeys(ext_a.warnings + ext_b.warnings):
        print(f"  fidelity: {w}")
    if diff.total_changes == 0:
        print("  identical after normalization.")
    print(f"  report: {report_path}")
    return EXIT_OK


def cmd_compare(args) -> int:
    path = Path(args.file)
    state = _state_dir(args.state_dir)
    snap = latest_snapshot(path, state)
    if not snap:
        print(f"error: no baseline snapshot for {path.name}. Run "
              f"`snapshot {path}` before the edit, or use `compare-pair`.",
              file=sys.stderr)
        return EXIT_NO_BASELINE
    blob = _snap_dir(state, path) / snap["blob"]
    try:
        ext_before = extract(blob, fmt=detect_format(path))
        ext_after = extract(path)
    except CapabilityError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return EXIT_UNSUPPORTED
    return _compare_and_report(
        ext_before, ext_after,
        label_before=f"baseline @ {snap['captured_at']}", label_after=path.name,
        view=args.view, out=args.report, default_stem=path.stem,
        as_json=args.json, title=f"Diff — {path.name}")


def cmd_compare_pair(args) -> int:
    a = Path(args.before)
    b = Path(args.after)
    try:
        ext_a = extract(a)
        ext_b = extract(b)
    except CapabilityError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return EXIT_UNSUPPORTED
    label_before = args.label_before or a.name
    label_after = args.label_after or b.name
    return _compare_and_report(
        ext_a, ext_b, label_before=label_before, label_after=label_after,
        view=args.view, out=args.report, default_stem=b.stem,
        as_json=args.json, title=f"Diff — {label_before} → {label_after}")


def cmd_status(args) -> int:
    state = _state_dir(args.state_dir)
    root = state / "snapshots"
    if not root.exists():
        print("No snapshots stored.")
        return EXIT_OK
    entries = []
    for sub in sorted(root.iterdir()):
        manifest = sub / "manifest.json"
        data = _load_manifest(manifest)
        snaps = data.get("snapshots") or []
        if args.file and data.get("source_path") != str(Path(args.file).resolve()):
            continue
        entries.append((data.get("source_path", str(sub)), snaps))
    if args.json:
        print(json.dumps([{"source_path": p, "count": len(s),
                           "latest": s[-1]["captured_at"] if s else None}
                          for p, s in entries], indent=2))
        return EXIT_OK
    if not entries:
        print("No matching snapshots.")
        return EXIT_OK
    for src, snaps in entries:
        print(f"{src}  —  {len(snaps)} snapshot(s)")
        for s in snaps[-5:]:
            print(f"    {s['captured_at']}  {s['sha256'][:12]}  {s['size']} bytes")
    return EXIT_OK


def cmd_cleanup(args) -> int:
    state = _state_dir(args.state_dir)
    root = state / "snapshots"
    if not root.exists():
        print("Nothing to clean.")
        return EXIT_OK
    cutoff = None
    if args.older_than is not None:
        cutoff = _dt.datetime.now(_dt.timezone.utc) - _dt.timedelta(days=args.older_than)
    removed = 0
    for sub in sorted(root.iterdir()):
        manifest = sub / "manifest.json"
        data = _load_manifest(manifest)
        if args.file and data.get("source_path") != str(Path(args.file).resolve()):
            continue
        kept = []
        for s in data.get("snapshots") or []:
            drop = True
            if cutoff is not None:
                captured = _dt.datetime.fromisoformat(s["captured_at"])
                drop = captured < cutoff
            if drop:
                removed += 1
                blob = sub / s["blob"]
                print(f"{'[dry-run] would remove' if args.dry_run else 'removed'} "
                      f"{blob}")
                if not args.dry_run and blob.exists():
                    blob.unlink()
            else:
                kept.append(s)
        if not args.dry_run:
            data["snapshots"] = kept
            _write_json(manifest, data)
    print(f"{'Would remove' if args.dry_run else 'Removed'} {removed} snapshot(s).")
    return EXIT_OK


# --------------------------------------------------------------------------- #
# Argument parsing
# --------------------------------------------------------------------------- #

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="create_diff.py", description=__doc__.splitlines()[0])
    sub = p.add_subparsers(dest="command", required=True)

    sp = sub.add_parser("capabilities", help="list supported formats and fidelity tiers")
    sp.add_argument("--json", action="store_true")
    sp.set_defaults(func=cmd_capabilities)

    sp = sub.add_parser("snapshot", help="capture a baseline before an edit")
    sp.add_argument("file")
    sp.add_argument("--state-dir")
    sp.set_defaults(func=cmd_snapshot)

    sp = sub.add_parser("compare", help="compare a file against its latest baseline")
    sp.add_argument("file")
    sp.add_argument("--report")
    sp.add_argument("--view", choices=["unified", "side-by-side"], default="unified")
    sp.add_argument("--state-dir")
    sp.add_argument("--json", action="store_true")
    sp.set_defaults(func=cmd_compare)

    sp = sub.add_parser("compare-pair", help="compare two explicit files (no stored state)")
    sp.add_argument("--before", required=True)
    sp.add_argument("--after", required=True)
    sp.add_argument("--report")
    sp.add_argument("--view", choices=["unified", "side-by-side"], default="unified")
    sp.add_argument("--label-before")
    sp.add_argument("--label-after")
    sp.add_argument("--json", action="store_true")
    sp.set_defaults(func=cmd_compare_pair)

    sp = sub.add_parser("status", help="list stored snapshots")
    sp.add_argument("file", nargs="?")
    sp.add_argument("--state-dir")
    sp.add_argument("--json", action="store_true")
    sp.set_defaults(func=cmd_status)

    sp = sub.add_parser("cleanup", help="remove stored snapshots")
    sp.add_argument("--file")
    sp.add_argument("--older-than", type=int, help="remove snapshots older than N days")
    sp.add_argument("--state-dir")
    sp.add_argument("--dry-run", action="store_true")
    sp.set_defaults(func=cmd_cleanup)
    return p


def main(argv: Optional[List[str]] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return args.func(args)
    except CapabilityError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return EXIT_UNSUPPORTED
    except BrokenPipeError:
        return EXIT_OK


if __name__ == "__main__":
    sys.exit(main())
