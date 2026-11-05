#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Changelog Shape Check
# ---------------------------------------------------------------------------
"""Fail a global changelog entry whose shape breaks the template's ceilings.

The template in ../assets/changelog-template.md sets the ceilings. This script
holds the same numbers, so a change to one is a change to both.

Five rules, each an error:

  file-total    an expanded entry runs at most 240 lines below its frontmatter
  h4-items      an expanded entry carries at most 26 H4 items
  glance-bullets  What's New at a Glance holds at most 12 bullets
  glance-order  tagged glance bullets follow the order of the sections they name
  spec-line     the spec-folder line carries paths only, never a "(Level N)" label

The order check reads the section each glance bullet names, from a trailing
"<!-- section: Topical Domain -->" comment or a visible "(Topical Domain)" tag
after its bold lead-in. An entry whose bullets carry no tag skips it, because without a
tag a bullet does not say which section it summarizes.

Usage: check_changelog_shape.py <entry.md> [<entry.md> ...]
Exit codes: 0 every entry passes, 1 an entry breaks a rule, 2 a usage or read error
"""

import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# 1. CEILINGS
# ---------------------------------------------------------------------------

EXPANDED_MAX_BODY_LINES = 240
EXPANDED_MAX_H4_ITEMS = 26
GLANCE_MAX_BULLETS = 12

# H2 sections every expanded entry carries. Every other H2 is a topical section.
FIXED_SECTIONS = {"why this release", "what's new at a glance", "upgrade notes", "upgrade"}
GLANCE_SECTION = "what's new at a glance"

FENCE = re.compile(r"^\s*(`{3,}|~{3,})")
H2 = re.compile(r"^##\s+(.+?)\s*#*\s*$")
H4 = re.compile(r"^####\s+\S")
BULLET = re.compile(r"^[-*]\s+")
GLANCE_TAG = re.compile(r"^[-*]\s+\*\*.+?\*\*\s*\(([^()]+)\)")
# The same tag as a trailing comment, which a rendered page and release notes do not show.
GLANCE_COMMENT_TAG = re.compile(r"<!--\s*section:\s*(.+?)\s*-->\s*$")


def glance_tag(line):
    """Return the section a glance bullet names, from its comment or its visible tag."""
    match = GLANCE_COMMENT_TAG.search(line) or GLANCE_TAG.match(line)
    return match.group(1).strip() if match else None
SPEC_LINE = re.compile(r"^>\s*Spec folders?:", re.IGNORECASE)
LEVEL_LABEL = re.compile(r"\(\s*Level\b[^)]*\)", re.IGNORECASE)


# ---------------------------------------------------------------------------
# 2. PARSING
# ---------------------------------------------------------------------------

def split_body(text):
    """Return (offset, body): the lines below the frontmatter and how many lines it took."""
    lines = text.splitlines()
    if lines and lines[0].strip() == "---":
        for index in range(1, len(lines)):
            if lines[index].strip() == "---":
                return index + 1, lines[index + 1:]
    return 0, lines


def outside_fences(lines, offset):
    """Yield (file_line_number, line) for body lines outside fenced code."""
    fence = None
    for number, line in enumerate(lines, start=offset + 1):
        match = FENCE.match(line)
        if match:
            marker = match.group(1)[0]
            if fence is None:
                fence = marker
            elif marker == fence:
                fence = None
            continue
        if fence is None:
            yield number, line


def read_shape(lines, offset):
    """Collect the headings, glance bullets and spec lines the rules read."""
    shape = {"h2": [], "h4": 0, "glance": [], "spec": []}
    current = None
    for number, line in outside_fences(lines, offset):
        heading = H2.match(line)
        if heading:
            current = heading.group(1).strip()
            shape["h2"].append(current)
            continue
        if H4.match(line):
            shape["h4"] += 1
        elif current and current.lower() == GLANCE_SECTION and BULLET.match(line):
            shape["glance"].append((number, line))
        if SPEC_LINE.match(line):
            shape["spec"].append((number, line))
    return shape


def is_expanded(shape):
    """An entry is expanded when it carries H4 items or an Upgrade Notes section."""
    names = {name.lower() for name in shape["h2"]}
    return shape["h4"] > 0 or "upgrade notes" in names


# ---------------------------------------------------------------------------
# 3. RULES
# ---------------------------------------------------------------------------

def check_glance_order(shape):
    """Return (violations, skipped) for the tagged-bullet order rule."""
    tags = [(number, glance_tag(line)) for number, line in shape["glance"]]
    if not any(name for _, name in tags):
        return [], True

    topical = [name for name in shape["h2"] if name.lower() not in FIXED_SECTIONS]
    position = {name.lower(): index for index, name in enumerate(topical)}
    violations = []
    last_index, last_name = -1, None
    for number, name in tags:
        if not name:
            violations.append(f"line {number}: the bullet has no section tag, and every other bullet does")
            continue
        index = position.get(name.lower())
        if index is None:
            violations.append(f"line {number}: the tag ({name}) names no topical section in this entry")
            continue
        if index < last_index:
            violations.append(
                f"line {number}: ({name}) comes after ({last_name}), but its section comes first in the body"
            )
        last_index, last_name = index, name
    return violations, False


def check_entry(text):
    """Return (violations, notes) for one entry, each violation tagged with its rule."""
    offset, lines = split_body(text)
    shape = read_shape(lines, offset)
    expanded = is_expanded(shape)
    violations, notes = [], []

    if expanded and len(lines) > EXPANDED_MAX_BODY_LINES:
        violations.append(
            ("file-total", f"{len(lines)} lines below the frontmatter, ceiling {EXPANDED_MAX_BODY_LINES}")
        )
    if expanded and shape["h4"] > EXPANDED_MAX_H4_ITEMS:
        violations.append(("h4-items", f"{shape['h4']} H4 items, ceiling {EXPANDED_MAX_H4_ITEMS}"))
    if len(shape["glance"]) > GLANCE_MAX_BULLETS:
        violations.append(
            ("glance-bullets", f"{len(shape['glance'])} glance bullets, ceiling {GLANCE_MAX_BULLETS}")
        )

    if expanded:
        order, skipped = check_glance_order(shape)
        violations.extend(("glance-order", message) for message in order)
        if skipped:
            notes.append("glance-order skipped: no glance bullet carries a section tag")

    for number, line in shape["spec"]:
        label = LEVEL_LABEL.search(line)
        if label:
            violations.append(("spec-line", f"line {number}: drop the {label.group(0)} label, the line carries paths only"))

    return violations, notes


# ---------------------------------------------------------------------------
# 4. ENTRY POINT
# ---------------------------------------------------------------------------

def main(argv):
    if not argv:
        print(__doc__.strip().splitlines()[0], file=sys.stderr)
        print("Usage: check_changelog_shape.py <entry.md> [<entry.md> ...]", file=sys.stderr)
        return 2

    failed = 0
    for raw in argv:
        path = Path(raw)
        try:
            text = path.read_text(encoding="utf-8")
        except OSError as error:
            print(f"ERROR {raw}: {error.strerror or error}", file=sys.stderr)
            return 2
        violations, notes = check_entry(text)
        print(f"{'FAIL' if violations else 'PASS'} {raw}")
        for rule, message in violations:
            print(f"  [{rule}] {message}")
        for note in notes:
            print(f"  note: {note}")
        failed += bool(violations)

    print(f"SUMMARY files={len(argv)} pass={len(argv) - failed} fail={failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
