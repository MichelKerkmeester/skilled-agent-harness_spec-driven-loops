#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: CREATE-DIFF ENGINE (SK-DOC)
# ───────────────────────────────────────────────────────────────

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
# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION & EXIT CODES
# ───────────────────────────────────────────────────────────────

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
TIER_FULL = "full"          # text compared after Unicode NFC + EOL + trailing-ws normalization
TIER_TEXT = "text"          # visible/structural text only; styling not compared
TIER_CONDITIONAL = "text*"  # works only when an optional extractor is available
TIER_UNSUPPORTED = "unsupported"

TIER_LABEL = {
    TIER_FULL: "Full fidelity — text compared after Unicode and whitespace normalization.",
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


# ───────────────────────────────────────────────────────────────
# 2. FORMAT DETECTION
# ───────────────────────────────────────────────────────────────

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
    """Map a file extension to a known format name.

    Args:
        path: File whose suffix selects the format.

    Returns:
        A supported format name ("text", "markdown", "html", "docx", "pdf");
        unknown extensions fall back to "text".
    """
    fmt = EXTENSION_FORMAT.get(path.suffix.lower())
    if fmt:
        return fmt
    # Unknown extensions are treated as plain text rather than refused; the report
    # states the assumption so the user can correct it.
    return "text"


# --------------------------------------------------------------------------- #
# Extraction
# --------------------------------------------------------------------------- #

# ───────────────────────────────────────────────────────────────
# 3. TEXT EXTRACTION
# ───────────────────────────────────────────────────────────────

@dataclass
class Extraction:
    """Extracted text plus its format, fidelity tier, warnings, and headings."""

    text: str
    fmt: str
    tier: str
    warnings: List[str] = field(default_factory=list)
    sections: List[str] = field(default_factory=list)   # e.g. Markdown/HTML headings
    extractor: str = "builtin"


def normalize(text: str, *, strip_trailing_ws: bool = True) -> str:
    """Canonicalize so incidental encoding differences are not reported as edits.

    Applies Unicode NFC, normalizes CRLF/CR line endings to LF, and optionally
    strips trailing whitespace from each line.

    Args:
        text: Raw extracted text.
        strip_trailing_ws: When True, remove trailing whitespace per line.

    Returns:
        The canonicalized text.
    """
    text = unicodedata.normalize("NFC", text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    if strip_trailing_ws:
        text = "\n".join(line.rstrip() for line in text.split("\n"))
    return text


def _read_text_file(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        # Refuse rather than decode with errors="replace": mapping undecodable bytes to
        # U+FFFD lets two files that differ only in invalid bytes collapse to the same
        # text and be reported identical, silently erasing a real difference. Honest
        # failure over a fabricated "no changes".
        raise CapabilityError(
            f"Cannot decode {path.name} as UTF-8 (byte offset {exc.start}): create-diff "
            f"compares text and will not silently replace undecodable bytes, which would "
            f"hide real differences between two files. Convert it to UTF-8 first."
        ) from exc


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

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
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

    def paragraph_text(p_el: ET.Element) -> str:
        buf: List[str] = []
        for node in p_el.iter():
            if node.tag == f"{_W_NS}t":
                buf.append(node.text or "")
            elif node.tag == f"{_W_NS}tab":
                buf.append("\t")
            elif node.tag == f"{_W_NS}br":
                buf.append("\n")
        return "".join(buf)

    def para_style(p_el: ET.Element) -> str:
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
    """Extract comparable text from a file at the best available fidelity.

    Args:
        path: File to read.
        fmt: Force a format name; when None the format is detected from the path.

    Returns:
        An Extraction carrying the text, format, fidelity tier, and any warnings.

    Raises:
        CapabilityError: When the file is missing, its format is unsupported, or
            its content cannot be decoded/extracted at usable fidelity.
    """
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
        warnings: List[str] = []
        if suffix not in EXTENSION_FORMAT:
            if _looks_binary(path):
                raise CapabilityError(
                    f"Refusing to diff {path.name}: unknown extension "
                    f"'{path.suffix or '(none)'}' with binary content and no text extractor. "
                    f"Convert it to a supported text format, or rename it to a supported "
                    f"extension.")
            # Text-like unknown extension: comparable, but say so rather than imply the
            # tier means the format was understood.
            warnings.append(
                f"Unknown extension '{path.suffix or '(none)'}' compared as plain UTF-8 "
                f"text; document structure and formatting are not interpreted.")
        text = _read_text_file(path)
        return Extraction(text=text, fmt="text", tier=TIER_FULL, warnings=warnings)
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

# ───────────────────────────────────────────────────────────────
# 4. DIFF ENGINE
# ───────────────────────────────────────────────────────────────

@dataclass
class Row:
    """One rendered diff row: its kind, line numbers, and escaped HTML cells."""

    kind: str                 # 'context' | 'add' | 'remove' | 'collapse'
    old_no: Optional[int]
    new_no: Optional[int]
    old_html: str = ""        # escaped, may contain inline <mark> spans
    new_html: str = ""
    note: str = ""            # for 'collapse'


@dataclass
class DiffResult:
    """A completed line diff: the rows plus aggregate change and line counts."""

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


def _logical_lines(text: str) -> List[str]:
    """Split normalized text into logical lines.

    Empty text is zero lines, not one phantom blank line, and a single trailing newline
    does not add a blank line. So an empty-vs-content diff reads as a pure addition,
    empty-vs-empty is "no differences", and a trailing-newline-only change is not
    reported as a spurious added blank line. Interior blank lines are preserved. This is
    consistent with the trailing-whitespace normalization already applied by `normalize`.
    """
    if text == "":
        return []
    lines = text.split("\n")
    if lines and lines[-1] == "":
        lines.pop()
    return lines


def diff_lines(a_text: str, b_text: str) -> DiffResult:
    """Compute a line-level diff with inline word highlighting and move detection.

    Args:
        a_text: Normalized "before" text.
        b_text: Normalized "after" text.

    Returns:
        A DiffResult with rendered rows and aggregate add/remove/change counts.
    """
    a_lines = _logical_lines(a_text)
    b_lines = _logical_lines(b_text)
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

# ───────────────────────────────────────────────────────────────
# 5. HTML REPORT RENDERER
# ───────────────────────────────────────────────────────────────

_CSS = """
:root{color-scheme:light dark;
--canvas:#fff;--surface:#f6f8fa;--surface-raised:#fff;
--text:#1f2328;--text-muted:#59636e;--border:#d0d7de;--border-strong:#afb8c1;
--gutter-bg:#f6f8fa;--gutter-text:#57606a;--empty-bg:#f6f8fa;
--hunk-bg:#ddf4ff;--hunk-text:#0550ae;--hunk-border:#b6e3ff;
--add-bg:#dafbe1;--add-inline:#aceebb;--add-marker:#116329;
--del-bg:#ffebe9;--del-inline:#ffcecb;--del-marker:#a40e26;
--warn-bg:#fff8c5;--warn-border:#d4a72c;--warn-text:#4d2d00;--focus:#0969da;
--sp-1:4px;--sp-2:8px;--sp-3:12px;--sp-4:16px;--sp-6:24px;--sp-8:32px;
--text-caption:.8125rem;
--font-ui:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
--font-code:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace}
@media(prefers-color-scheme:dark){:root{
--canvas:#0d1117;--surface:#161b22;--surface-raised:#1c2128;
--text:#e6edf3;--text-muted:#9da7b3;--border:#30363d;--border-strong:#484f58;
--gutter-bg:#161b22;--gutter-text:#9da7b3;--empty-bg:#161b22;
--hunk-bg:#13233a;--hunk-text:#a5d6ff;--hunk-border:#1f6feb;
--add-bg:#12261e;--add-inline:#1f6f43;--add-marker:#7ee787;
--del-bg:#2d1718;--del-inline:#7d252c;--del-marker:#ff7b72;
--warn-bg:#2b2111;--warn-border:#9e6a03;--warn-text:#f0c36a;--focus:#58a6ff}}
*{box-sizing:border-box}
body{margin:0;background:var(--canvas);color:var(--text);font:1rem/1.5 var(--font-ui)}
main{max-width:100rem;margin:0 auto;padding:var(--sp-6) var(--sp-4) var(--sp-8)}
.report-header,.summary-sec,.warn,footer{max-width:72rem}
h1{font-size:1.5rem;line-height:1.25;font-weight:600;letter-spacing:-.01em;margin:0 0 var(--sp-1)}
h2{font-size:1.0625rem;line-height:1.3;font-weight:650;margin:var(--sp-6) 0 var(--sp-3)}
.skip{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0}
a.skip:focus{position:static;width:auto;height:auto;margin:0;clip:auto;
display:inline-block;background:var(--surface);padding:var(--sp-2);
border:2px solid var(--focus);border-radius:6px}
.meta{color:var(--text-muted);font-size:var(--text-caption);margin:0}
.warn{border:1px solid var(--warn-border);background:var(--warn-bg);color:var(--warn-text);
padding:var(--sp-3) var(--sp-4);border-radius:6px;margin:var(--sp-4) 0}
.warn h2{margin:0 0 var(--sp-1);font-size:1rem;color:var(--warn-text)}
.warn ul{margin:0;padding-left:1.2rem}
.stat-strip{display:flex;flex-wrap:wrap;gap:var(--sp-2);margin:var(--sp-3) 0;padding:0}
.stat{font:600 var(--text-caption)/1.4 var(--font-code);font-variant-numeric:tabular-nums;
padding:var(--sp-1) var(--sp-2);border-radius:2rem;border:1px solid var(--border)}
.stat-add{color:var(--add-marker);background:var(--add-bg);border-color:var(--add-inline)}
.stat-del{color:var(--del-marker);background:var(--del-bg);border-color:var(--del-inline)}
.stat-chg,.stat-move,.stat-eq{color:var(--text-muted);background:var(--surface)}
.summary{border-collapse:separate;border-spacing:0;border:1px solid var(--border);
border-radius:6px;overflow:hidden;font-size:.875rem;margin:var(--sp-3) 0}
.summary th,.summary td{padding:var(--sp-2) var(--sp-3);text-align:left;
border-bottom:1px solid var(--border)}
.summary tr:last-child th,.summary tr:last-child td{border-bottom:0}
.summary th{background:var(--surface);color:var(--text-muted);font-weight:500;width:9rem}
.legend{display:flex;flex-wrap:wrap;gap:var(--sp-2) var(--sp-4);list-style:none;padding:0;
margin:var(--sp-3) 0;font-size:var(--text-caption);color:var(--text-muted)}
.legend li{display:flex;align-items:center;gap:var(--sp-2)}
.key{font:700 .8125rem/1.4 var(--font-code);min-width:1.4rem;text-align:center;border-radius:3px}
.key-add{color:var(--add-marker);background:var(--add-bg)}
.key-del{color:var(--del-marker);background:var(--del-bg)}
.diff-frame{border:1px solid var(--border);border-radius:6px;background:var(--surface-raised)}
.diff-scroll{overflow-x:auto}
.diff-scroll:focus-visible{outline:2px solid var(--focus);outline-offset:-2px}
table.diff{border-collapse:collapse;width:100%;font:.8125rem/1.5 var(--font-code);
table-layout:fixed;font-variant-ligatures:none;tab-size:4}
.diff .col-no{width:calc(5ch + 1rem)}.diff .col-mark{width:1.6rem}
.diff thead th{background:var(--surface);color:var(--text-muted);text-align:left;
padding:var(--sp-2);border-bottom:1px solid var(--border-strong);
font-family:var(--font-ui);font-size:var(--text-caption);font-weight:600}
.diff td,.diff th{vertical-align:top}
td.no{text-align:right;color:var(--gutter-text);background:var(--gutter-bg);user-select:none;
padding:1px var(--sp-2);white-space:nowrap;font-variant-numeric:tabular-nums;
border-right:1px solid var(--border)}
td.mark{text-align:center;user-select:none;font-weight:700;padding:1px 0}
td.txt{padding:1px var(--sp-2);white-space:pre-wrap;overflow-wrap:anywhere}
td.is-add{background:var(--add-bg)}td.mark.is-add{color:var(--add-marker)}
td.no.is-add{background:var(--add-bg);color:var(--add-marker)}
td.is-remove{background:var(--del-bg)}td.mark.is-remove{color:var(--del-marker)}
td.no.is-remove{background:var(--del-bg);color:var(--del-marker)}
td.is-empty{background:var(--empty-bg)}
.sxs{min-width:60rem}
.sxs td:nth-child(4),.sxs th:nth-child(4){border-left:2px solid var(--border-strong)}
tr.hunk-head th{background:var(--hunk-bg);color:var(--hunk-text);text-align:left;
font-family:var(--font-code);font-weight:600;padding:var(--sp-1) var(--sp-2);
border-block:1px solid var(--hunk-border)}
tr.collapse td{text-align:center;color:var(--text-muted);background:var(--surface);
padding:var(--sp-1) var(--sp-2);border-block:1px solid var(--border)}
mark.wd{padding:0 1px;border-radius:2px;color:inherit}
mark.wd.add{background:var(--add-inline);text-decoration:underline}
mark.wd.del{background:var(--del-inline);text-decoration:line-through}
.legend mark.wd{color:var(--text)}
footer{display:flex;flex-wrap:wrap;gap:var(--sp-2) var(--sp-4);justify-content:space-between;
margin-top:var(--sp-8);color:var(--text-muted);font-size:var(--text-caption);
border-top:1px solid var(--border);padding-top:var(--sp-4)}
footer p{margin:0}
@media(forced-colors:active){mark.wd{outline:1px solid CanvasText}
td.mark{color:CanvasText}}
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
    """Render a diff as a self-contained, zero-JavaScript, accessible HTML report.

    Args:
        diff: The computed line diff to render.
        label_before: Human label for the "before" version.
        label_after: Human label for the "after" version.
        extraction_before: Extraction for the "before" version (source of warnings).
        extraction_after: Extraction for the "after" version (source of format/tier).
        view: "unified" or "side-by-side" layout.
        title: Report title and document title.

    Returns:
        The complete HTML document as a string.
    """
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

    stat_strip = (
        '<p class="stat-strip">'
        f'<span class="stat stat-add">+{diff.added} added</span>'
        f'<span class="stat stat-del">−{diff.removed} removed</span>'
        f'<span class="stat stat-chg">±{diff.changed} changed</span>'
        f'<span class="stat stat-move">↔{diff.moves} moved</span>'
        f'<span class="stat stat-eq">={diff.unchanged} unchanged</span>'
        '</p>'
    )
    summary = (
        '<table class="summary"><caption class="skip">Change summary</caption><tbody>'
        f'<tr><th scope="row">Before</th><td>{_esc(label_before)} '
        f'({diff.a_lines} lines)</td></tr>'
        f'<tr><th scope="row">After</th><td>{_esc(label_after)} '
        f'({diff.b_lines} lines)</td></tr>'
        f'<tr><th scope="row">Format</th><td>{_esc(fmt)} — {_esc(TIER_LABEL.get(tier, tier))}</td></tr>'
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
<header class="report-header">
<h1>{_esc(title)}</h1>
<p class="meta">Generated {_esc(_now_iso())} by {_esc(GENERATOR)} · {_esc(fmt)} · local only, no network.</p>
</header>
{warn_html}
<section class="summary-sec" aria-labelledby="stitle">
<h2 id="stitle">Summary</h2>
{stat_strip}
{summary}
<ul class="legend" aria-label="Diff legend">
<li><span class="key key-add" aria-hidden="true">+</span> Added line</li>
<li><span class="key key-del" aria-hidden="true">−</span> Removed line</li>
<li><mark class="wd add">text</mark> Inline addition</li>
<li><mark class="wd del">text</mark> Inline removal</li>
</ul>
</section>
<section aria-labelledby="dtitle" id="diff">
<h2 id="dtitle">Differences ({_esc('unified' if view != 'side-by-side' else 'side by side')} view)</h2>
<div class="diff-frame">{table}</div>
</section>
<footer>
<p>All processing happened on this machine.</p>
<p>Self-contained HTML · zero JavaScript · no external requests.</p>
</footer>
</main>
</body>
</html>
"""


def _num(n: Optional[int]) -> str:
    return "" if n is None else str(n)


def _hunks(rows: List[Row]) -> List[Tuple[str, object]]:
    """Split diff rows into contiguous change hunks separated by collapsed-context gaps.

    Returns a list of ('hunk', [rows]) and ('gap', note) segments, so each hunk can carry
    its own @@ header and the omitted-context markers read as real section breaks rather
    than a run of generic status rows.
    """
    segments = []
    current: List[Row] = []
    for r in rows:
        if r.kind == "collapse":
            if current:
                segments.append(("hunk", current))
                current = []
            segments.append(("gap", r.note))
        else:
            current.append(r)
    if current:
        segments.append(("hunk", current))
    return segments


def _hunk_header(hunk: List[Row]) -> str:
    # A human-facing @@ range derived from the visible line numbers — a scan anchor, not a
    # machine-applicable patch header.
    olds = [r.old_no for r in hunk if r.old_no is not None]
    news = [r.new_no for r in hunk if r.new_no is not None]
    o_start = olds[0] if olds else 0
    n_start = news[0] if news else 0
    return f"@@ -{o_start},{len(olds)} +{n_start},{len(news)} @@"


def _render_unified(diff: DiffResult) -> str:
    out = ['<table class="diff">',
           '<colgroup><col class="col-no"><col class="col-no">'
           '<col class="col-mark"><col></colgroup>',
           '<caption class="skip">Unified differences</caption>',
           '<thead><tr>',
           '<th scope="col" class="no">Old</th>',
           '<th scope="col" class="no">New</th>',
           '<th scope="col" class="mark"><span class="skip">Change</span></th>',
           '<th scope="col">Content</th></tr></thead>']
    for kind, payload in _hunks(diff.rows):
        if kind == "gap":
            out.append('<tbody class="gap"><tr class="collapse">'
                       f'<td colspan="4">⋯ {_esc(payload)} ⋯</td></tr></tbody>')
            continue
        out.append('<tbody class="hunk">'
                   '<tr class="hunk-head"><th scope="rowgroup" colspan="4">'
                   f'{_esc(_hunk_header(payload))}</th></tr>')
        for r in payload:
            old, new = _num(r.old_no), _num(r.new_no)
            if r.kind == "add":
                out.append('<tr class="add"><td class="no is-add"></td>'
                           f'<td class="no is-add">{new}</td>'
                           '<td class="mark is-add" aria-label="added">+</td>'
                           f'<td class="txt is-add">{r.new_html}</td></tr>')
            elif r.kind == "remove":
                out.append(f'<tr class="remove"><td class="no is-remove">{old}</td>'
                           '<td class="no is-remove"></td>'
                           '<td class="mark is-remove" aria-label="removed">−</td>'
                           f'<td class="txt is-remove">{r.old_html}</td></tr>')
            else:
                out.append(f'<tr class="context"><td class="no">{old}</td>'
                           f'<td class="no">{new}</td><td class="mark"></td>'
                           f'<td class="txt">{r.old_html}</td></tr>')
        out.append("</tbody>")
    out.append("</table>")
    return "".join(out)


def _sxs_change(rm: Row, ad: Row) -> str:
    return ('<tr class="change">'
            f'<td class="no is-remove">{_num(rm.old_no)}</td>'
            '<td class="mark is-remove" aria-label="removed">−</td>'
            f'<td class="txt is-remove">{rm.old_html}</td>'
            f'<td class="no is-add">{_num(ad.new_no)}</td>'
            '<td class="mark is-add" aria-label="added">+</td>'
            f'<td class="txt is-add">{ad.new_html}</td></tr>')


def _sxs_single(r: Row) -> str:
    if r.kind == "remove":
        return ('<tr class="remove">'
                f'<td class="no is-remove">{_num(r.old_no)}</td>'
                '<td class="mark is-remove" aria-label="removed">−</td>'
                f'<td class="txt is-remove">{r.old_html}</td>'
                '<td class="no is-empty"></td><td class="mark is-empty"></td>'
                '<td class="txt is-empty"><span class="skip">'
                'No corresponding line in the after version.</span></td></tr>')
    if r.kind == "add":
        return ('<tr class="add">'
                '<td class="no is-empty"></td><td class="mark is-empty"></td>'
                '<td class="txt is-empty"><span class="skip">'
                'No corresponding line in the before version.</span></td>'
                f'<td class="no is-add">{_num(r.new_no)}</td>'
                '<td class="mark is-add" aria-label="added">+</td>'
                f'<td class="txt is-add">{r.new_html}</td></tr>')
    return ('<tr class="context">'
            f'<td class="no">{_num(r.old_no)}</td><td class="mark"></td>'
            f'<td class="txt">{r.old_html}</td>'
            f'<td class="no">{_num(r.new_no)}</td><td class="mark"></td>'
            f'<td class="txt">{r.new_html}</td></tr>')


def _render_side_by_side(diff: DiffResult, label_before: str, label_after: str) -> str:
    out = ['<div class="diff-scroll" role="region" aria-label="Side-by-side differences" '
           'tabindex="0"><table class="diff sxs">',
           '<colgroup><col class="col-no"><col class="col-mark"><col>'
           '<col class="col-no"><col class="col-mark"><col></colgroup>',
           '<caption class="skip">Side-by-side differences</caption>',
           '<thead><tr>',
           '<th scope="col" class="no">#</th>',
           '<th scope="col" class="mark"><span class="skip">Change (before)</span></th>',
           f'<th scope="col">{_esc(label_before)}</th>',
           '<th scope="col" class="no">#</th>',
           '<th scope="col" class="mark"><span class="skip">Change (after)</span></th>',
           f'<th scope="col">{_esc(label_after)}</th></tr></thead>']
    for kind, payload in _hunks(diff.rows):
        if kind == "gap":
            out.append('<tbody class="gap"><tr class="collapse">'
                       f'<td colspan="6">⋯ {_esc(payload)} ⋯</td></tr></tbody>')
            continue
        out.append('<tbody class="hunk">'
                   '<tr class="hunk-head"><th scope="rowgroup" colspan="6">'
                   f'{_esc(_hunk_header(payload))}</th></tr>')
        i = 0
        while i < len(payload):
            r = payload[i]
            nxt = payload[i + 1] if i + 1 < len(payload) else None
            # difflib emits a replace opcode's paired old/new lines adjacently (remove then
            # add); pairing them here is what makes a changed line one aligned row.
            if r.kind == "remove" and nxt is not None and nxt.kind == "add":
                out.append(_sxs_change(r, nxt))
                i += 2
            else:
                out.append(_sxs_single(r))
                i += 1
        out.append("</tbody>")
    out.append("</table></div>")
    return "".join(out)


# --------------------------------------------------------------------------- #
# Snapshot store
# --------------------------------------------------------------------------- #

# ───────────────────────────────────────────────────────────────
# 6. SNAPSHOT & STATE
# ───────────────────────────────────────────────────────────────

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
    """Copy a file into the snapshot store as a new baseline and record its manifest.

    Args:
        path: Source file to snapshot; never mutated.
        state: State directory root under which snapshots are stored.

    Returns:
        The manifest entry describing the captured snapshot.

    Raises:
        CapabilityError: When the source file does not exist.
    """
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
    """Return the most recent snapshot manifest entry for a file, if any.

    Args:
        path: File whose baseline history is queried.
        state: State directory root holding the snapshot store.

    Returns:
        The newest manifest entry, or None when no snapshot exists.
    """
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


# ───────────────────────────────────────────────────────────────
# 7. COMMAND-LINE INTERFACE
# ───────────────────────────────────────────────────────────────

def cmd_capabilities(args: argparse.Namespace) -> int:
    """Print the supported-format matrix and fidelity tiers.

    Args:
        args: Parsed CLI arguments (honors --json).

    Returns:
        Process exit code.
    """
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


def cmd_snapshot(args: argparse.Namespace) -> int:
    """Capture a baseline snapshot of a file before it is edited.

    Args:
        args: Parsed CLI arguments (file, --state-dir).

    Returns:
        Process exit code.
    """
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


def cmd_compare(args: argparse.Namespace) -> int:
    """Compare a file against its most recent stored baseline snapshot.

    Args:
        args: Parsed CLI arguments (file, --report, --view, --state-dir, --json).

    Returns:
        Process exit code.
    """
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


def cmd_compare_pair(args: argparse.Namespace) -> int:
    """Compare two explicit files with no stored state.

    Args:
        args: Parsed CLI arguments (--before, --after, --report, --view,
            --label-before, --label-after, --json).

    Returns:
        Process exit code.
    """
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


def cmd_status(args: argparse.Namespace) -> int:
    """List stored snapshots, optionally filtered to one source file.

    Args:
        args: Parsed CLI arguments (file, --state-dir, --json).

    Returns:
        Process exit code.
    """
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


def cmd_cleanup(args: argparse.Namespace) -> int:
    """Remove stored snapshots, optionally by file or age, with a dry-run mode.

    Args:
        args: Parsed CLI arguments (--file, --older-than, --state-dir, --dry-run).

    Returns:
        Process exit code.
    """
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
    """Build the argparse parser with every subcommand and its options.

    Returns:
        The configured ArgumentParser (each subcommand sets its handler via
        set_defaults(func=...)).
    """
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
    """CLI entrypoint: parse arguments, dispatch the subcommand, map errors to codes.

    Args:
        argv: Argument list to parse; defaults to sys.argv when None.

    Returns:
        Process exit code (0 success; 3 for a CapabilityError raised during dispatch).
    """
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
