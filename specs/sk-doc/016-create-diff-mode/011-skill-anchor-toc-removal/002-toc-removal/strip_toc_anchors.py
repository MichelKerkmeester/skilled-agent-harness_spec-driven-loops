#!/usr/bin/env python3
"""Remove TABLE OF CONTENTS blocks and/or <!-- ANCHOR --> comment lines from markdown.

Shared transform for spec packet 117-skill-anchor-toc-removal.
  Phase 002 runs with --toc
  Phase 003 runs with --anchors

Design / safety:
- TOC removal is FENCE-AWARE: a `## TABLE OF CONTENTS` heading inside a fenced code
  block (``` or ~~~) is treated as an illustrative example and left untouched. Real
  document TOCs are never inside fences.
- A TOC block = the heading line, an optionally-preceding `<!-- ANCHOR:table-of-contents -->`
  wrapper, and the subsequent run of blank / list-item / anchor-comment lines (the link
  list). Removal stops at the first line that is none of those (next heading, `---`, prose).
- Anchor-comment removal deletes any whole-line `<!-- ANCHOR:... -->` / `<!-- /ANCHOR:... -->`.
- After edits, runs of 2+ blank lines are collapsed to one (outside fences), and the file
  ends with exactly one trailing newline. Files are only rewritten if content changed.
- Idempotent: re-running yields no further changes.

Usage:
  strip_toc_anchors.py --toc [--anchors] [--dry-run] <file-list-from-stdin | paths...>
  rg --files PATH -g '*.md' | strip_toc_anchors.py --toc --anchors
"""
import argparse
import re
import sys

FENCE_RE = re.compile(r'^\s*(```|~~~)')
# TOC heading: H1-H6, optional leading emoji/symbol token, "TABLE OF CONTENTS" | "CONTENTS" | "TOC"
TOC_HEADING_RE = re.compile(
    r'^#{1,6}\s+(?:[^\w\s]+\s+)?(?:TABLE OF CONTENTS|CONTENTS|TOC)\s*$',
    re.IGNORECASE,
)
TOC_WRAP_OPEN_RE = re.compile(r'^\s*<!--\s*ANCHOR:table-of-contents\s*-->\s*$', re.IGNORECASE)
ANCHOR_LINE_RE = re.compile(r'^\s*<!--\s*/?ANCHOR:[^>]*-->\s*$', re.IGNORECASE)
LIST_ITEM_RE = re.compile(r'^\s*[-*+]\s')
BLANK_RE = re.compile(r'^\s*$')


def is_toc_body_line(line: str) -> bool:
    """Lines that legitimately belong to a TOC block's link list."""
    return bool(BLANK_RE.match(line) or LIST_ITEM_RE.match(line) or ANCHOR_LINE_RE.match(line))


def strip_toc(lines):
    """Remove TOC blocks (fence-aware). Returns new line list."""
    out = []
    in_fence = False
    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        if FENCE_RE.match(line):
            in_fence = not in_fence
            out.append(line)
            i += 1
            continue
        if not in_fence and TOC_HEADING_RE.match(line):
            # Drop an immediately-preceding wrapper anchor already emitted.
            if out and TOC_WRAP_OPEN_RE.match(out[-1]):
                out.pop()
            # Also drop a trailing blank we just emitted before the heading,
            # to avoid a blank gap where the block used to be.
            # (Blank collapse later normalizes anyway.)
            i += 1  # skip the heading line
            # Consume the TOC body: blank / list / anchor-comment lines.
            while i < n and is_toc_body_line(lines[i]):
                i += 1
            continue
        out.append(line)
        i += 1
    return out


def strip_anchors(lines):
    """Remove all whole-line <!-- ANCHOR --> comment lines (fence-agnostic)."""
    return [ln for ln in lines if not ANCHOR_LINE_RE.match(ln)]


# A numbered TOC link line: "N. [TEXT](#anchor)" (in-page anchor), optional indent.
NUM_TOC_LINK_RE = re.compile(r'^\s*\d+\.\s+\[[^\]]+\]\(#[^)]*\)\s*$')


def strip_orphan_numbered_toc(lines, min_run=3):
    """Remove contiguous runs (>= min_run) of numbered in-page-anchor links that the
    bullet-only TOC matcher left orphaned when it removed the heading. Fence-aware.
    A numbered list where every item links to an in-page #anchor is, by definition,
    a TOC; requiring >= min_run consecutive avoids touching incidental numbered links."""
    out = []
    in_fence = False
    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        if FENCE_RE.match(line):
            in_fence = not in_fence
            out.append(line)
            i += 1
            continue
        if not in_fence and NUM_TOC_LINK_RE.match(line):
            j = i
            while j < n and NUM_TOC_LINK_RE.match(lines[j]):
                j += 1
            if (j - i) >= min_run:
                i = j  # drop the whole run
                continue
        out.append(line)
        i += 1
    return out


RULE_RE = re.compile(r'^---\s*$')


def _frontmatter_end(lines):
    """Index just past a leading YAML frontmatter block, else 0."""
    if lines and lines[0].strip() == '---':
        for k in range(1, len(lines)):
            if lines[k].strip() == '---':
                return k + 1
    return 0


def collapse_rules(lines):
    """Collapse a run of horizontal rules (`---` separated only by blank lines)
    into a single rule. Skips the leading frontmatter block and fenced code.
    A TOC removed from between two `---` rules leaves exactly this artifact."""
    start = _frontmatter_end(lines)
    head, body = lines[:start], lines[start:]
    out = []
    in_fence = False
    i = 0
    n = len(body)
    while i < n:
        line = body[i]
        if FENCE_RE.match(line):
            in_fence = not in_fence
            out.append(line)
            i += 1
            continue
        if not in_fence and RULE_RE.match(line):
            # Look ahead past blanks for a consecutive rule.
            j = i + 1
            while j < n and BLANK_RE.match(body[j]):
                j += 1
            if j < n and RULE_RE.match(body[j]) and not FENCE_RE.match(body[j]):
                # Drop this rule (and the blanks); the next rule is kept.
                i = j
                continue
        out.append(line)
        i += 1
    return head + out


def collapse_blanks(lines):
    """Collapse runs of 2+ blank lines to one, outside fenced code blocks."""
    out = []
    in_fence = False
    prev_blank = False
    for line in lines:
        if FENCE_RE.match(line):
            in_fence = not in_fence
            out.append(line)
            prev_blank = False
            continue
        if not in_fence and BLANK_RE.match(line):
            if prev_blank:
                continue
            prev_blank = True
            out.append(line)
        else:
            prev_blank = False
            out.append(line)
    # Trim leading/trailing blank lines.
    while out and BLANK_RE.match(out[0]):
        out.pop(0)
    while out and BLANK_RE.match(out[-1]):
        out.pop()
    return out


def process(text: str, do_toc: bool, do_anchors: bool, do_rules: bool = False, do_orphan: bool = False) -> str:
    lines = text.split('\n')
    removed = False
    if do_toc:
        new = strip_toc(lines)
        removed = removed or (len(new) != len(lines))
        lines = new
    if do_orphan:
        new = strip_orphan_numbered_toc(lines)
        removed = removed or (len(new) != len(lines))
        lines = new
    if do_anchors:
        new = strip_anchors(lines)
        removed = removed or (len(new) != len(lines))
        lines = new
    if do_rules:
        new = collapse_rules(lines)
        removed = removed or (len(new) != len(lines))
        lines = new
    # Only rewrite (and tidy whitespace left by removals) when something was
    # actually removed — never touch files with no TOC/anchor/rule artifact,
    # to avoid cosmetic-only churn across the tree.
    if not removed:
        return text
    lines = collapse_rules(lines)
    lines = collapse_blanks(lines)
    return '\n'.join(lines) + '\n'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--toc', action='store_true', help='Remove TABLE OF CONTENTS blocks')
    ap.add_argument('--anchors', action='store_true', help='Remove <!-- ANCHOR --> comment lines')
    ap.add_argument('--collapse-rules', action='store_true',
                    help='Collapse consecutive horizontal rules (cleanup of TOC-removal artifacts)')
    ap.add_argument('--orphan-toc', action='store_true',
                    help='Remove orphaned numbered-TOC link runs left when the bullet-only matcher kept numbered entries')
    ap.add_argument('--dry-run', action='store_true', help='Report files that would change; do not write')
    ap.add_argument('paths', nargs='*', help='Files to process (else read newline-separated from stdin)')
    args = ap.parse_args()
    if not (args.toc or args.anchors or args.collapse_rules or args.orphan_toc):
        ap.error('specify at least one of --toc / --anchors / --collapse-rules / --orphan-toc')

    paths = args.paths or [p.strip() for p in sys.stdin if p.strip()]
    changed = 0
    scanned = 0
    for path in paths:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                original = f.read()
        except (OSError, UnicodeDecodeError) as e:
            print(f'SKIP {path}: {e}', file=sys.stderr)
            continue
        scanned += 1
        new = process(original, args.toc, args.anchors, args.collapse_rules, args.orphan_toc)
        if new != original:
            changed += 1
            if args.dry_run:
                print(f'WOULD CHANGE {path}')
            else:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new)
                print(f'CHANGED {path}')
    print(f'--- scanned={scanned} changed={changed} dry_run={args.dry_run}', file=sys.stderr)


if __name__ == '__main__':
    main()
