#!/usr/bin/env python3
"""Strip spec-kit template scaffolding from markdown documents.

The finetune pipeline uses this module before generating positives and
negatives so the reranker learns content relevance instead of repeated packet
templates.
"""

from __future__ import annotations

import argparse
import re
import sys
from collections.abc import Iterable
from pathlib import Path

_FRONTMATTER_BOUNDARY = re.compile(r"^---\s*$")
_HTML_COMMENT = re.compile(r"<!--.*?-->", re.DOTALL)
_ANCHOR_COMMENT = re.compile(r"^\s*<!--\s*/?ANCHOR:[^>]*-->\s*$", re.IGNORECASE)
_SPECKIT_COMMENT = re.compile(r"^\s*<!--\s*SPECKIT_[^>]*-->\s*$", re.IGNORECASE)
_SECTION_HEADER = re.compile(r"^\s*##\s+\d+\.\s+[A-Z0-9][A-Z0-9\s&/()'’:+,._-]*\s*$")
_FENCE_OPEN = re.compile(r"^\s*```(?P<tag>[A-Za-z0-9_+.#-][^\s`]*)\s*$")
_FENCE_ANY = re.compile(r"^\s*```\s*$")


def _strip_frontmatter(doc: str) -> str:
    lines = doc.splitlines(keepends=True)
    if not lines or not _FRONTMATTER_BOUNDARY.match(lines[0].rstrip("\r\n")):
        return doc

    for index in range(1, len(lines)):
        if _FRONTMATTER_BOUNDARY.match(lines[index].rstrip("\r\n")):
            return "".join(lines[index + 1 :])
    return doc


def _split_preserving_fences(doc: str) -> list[tuple[bool, bool, str]]:
    """Return chunks as (is_fence_content, is_tagged_fence, text)."""

    chunks: list[tuple[bool, bool, str]] = []
    pending: list[str] = []

    def flush_pending() -> None:
        if pending:
            chunks.append((False, False, "".join(pending)))
            pending.clear()

    lines = doc.splitlines(keepends=True)
    index = 0
    while index < len(lines):
        line = lines[index]
        tagged_match = _FENCE_OPEN.match(line.rstrip("\r\n"))
        if tagged_match:
            flush_pending()
            content: list[str] = ["```\n"]
            index += 1
            closed = False
            while index < len(lines):
                if _FENCE_ANY.match(lines[index].rstrip("\r\n")):
                    content.append("```\n")
                    index += 1
                    closed = True
                    break
                content.append(lines[index])
                index += 1
            if not closed and (not content[-1].endswith("\n")):
                content[-1] = f"{content[-1]}\n"
            chunks.append((True, True, "".join(content)))
            continue

        if _FENCE_ANY.match(line.rstrip("\r\n")):
            flush_pending()
            content = [line]
            index += 1
            while index < len(lines):
                content.append(lines[index])
                if _FENCE_ANY.match(lines[index].rstrip("\r\n")):
                    index += 1
                    break
                index += 1
            chunks.append((True, False, "".join(content)))
            continue

        pending.append(line)
        index += 1

    flush_pending()
    return chunks


def _remove_template_comments(text: str) -> str:
    def replace(match: re.Match[str]) -> str:
        comment = match.group(0)
        if _ANCHOR_COMMENT.match(comment) or _SPECKIT_COMMENT.match(comment):
            return ""
        return comment

    return _HTML_COMMENT.sub(replace, text)


def _remove_section_headers(text: str) -> str:
    kept_lines = []
    for line in text.splitlines(keepends=True):
        if _SECTION_HEADER.match(line.rstrip("\r\n")):
            continue
        kept_lines.append(line)
    return "".join(kept_lines)


def strip_templates(doc: str) -> str:
    """Remove spec-kit template scaffolding from a markdown document.

    Removes YAML frontmatter, ANCHOR comments, SPECKIT_* comments, repeated
    numbered all-caps section headers, and language-tagged code-fence
    delimiters. Content inside code fences is preserved without comment
    stripping; untagged fences and inline backticks are kept.
    """

    without_frontmatter = _strip_frontmatter(doc)
    chunks = _split_preserving_fences(without_frontmatter)
    stripped: list[str] = []

    for is_fence_content, _is_tagged_fence, chunk in chunks:
        if is_fence_content:
            stripped.append(chunk)
            continue
        without_comments = _remove_template_comments(chunk)
        stripped.append(_remove_section_headers(without_comments))

    return "".join(stripped).strip()


def _iter_inputs(paths: Iterable[str]) -> Iterable[str]:
    for raw_path in paths:
        yield Path(raw_path).read_text(encoding="utf-8")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", help="Markdown files to strip; stdin is used when omitted.")
    args = parser.parse_args(argv)

    docs = _iter_inputs(args.paths) if args.paths else [sys.stdin.read()]
    for index, doc in enumerate(docs):
        if index:
            print()
        print(strip_templates(doc))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
