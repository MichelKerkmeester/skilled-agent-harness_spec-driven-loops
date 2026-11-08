#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Release Notes Builder
# ---------------------------------------------------------------------------
"""Turn a global changelog entry into the body of its GitHub release.

The release body is the entry as written, minus what a release page shows on
its own: the YAML frontmatter and the editorial title H1, because the release
title already carries it. A pointer to the entry closes the body, so a reader
can find the file the notes came from.

Building it here, not by hand, keeps every publish and every later amend of a
release identical to the entry it came from.

Usage: build_release_notes.py <entry.md> [--out <file>]
Exit codes: 0 notes written, 2 a usage or read error
"""

import re
import sys
from pathlib import Path

FOOTER = "\n&nbsp;\n\nFull changelog: `{path}`\n"


def entry_pointer(entry: Path) -> str:
    """Return the entry path from the repository's .skilled folder down."""
    parts = entry.resolve().parts
    if ".skilled" in parts:
        return "/".join(parts[parts.index(".skilled"):])
    return entry.as_posix()


def build_notes(text: str, pointer: str) -> str:
    """Strip the frontmatter and the H1, then append the pointer footer."""
    body = text
    if body.startswith("---\n"):
        end = body.find("\n---\n", 4)
        if end == -1:
            raise ValueError("frontmatter opens but never closes")
        body = body[end + len("\n---\n"):]
    body = re.sub(r"\A\s*# [^\n]*\n+", "", body, count=1)
    return body.rstrip("\n") + "\n" + FOOTER.format(path=pointer)


def main(argv: list) -> int:
    args = list(argv)
    out = None
    if "--out" in args:
        at = args.index("--out")
        if at + 1 >= len(args):
            print("usage: build_release_notes.py <entry.md> [--out <file>]", file=sys.stderr)
            return 2
        out = args[at + 1]
        del args[at:at + 2]
    if len(args) != 1:
        print("usage: build_release_notes.py <entry.md> [--out <file>]", file=sys.stderr)
        return 2
    entry = Path(args[0])
    try:
        notes = build_notes(entry.read_text(encoding="utf-8"), entry_pointer(entry))
    except (OSError, ValueError) as error:
        print(f"error: {entry}: {error}", file=sys.stderr)
        return 2
    if out:
        Path(out).write_text(notes, encoding="utf-8")
    else:
        sys.stdout.write(notes)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
