#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: LEFTOVER TEMPLATE COMMENT REMOVER
# ───────────────────────────────────────────────────────────────

"""Remove whole-line template-name comments from tracked markdown files.

Walks every tracked markdown file under a scan path, deletes each line whose
stripped text consists solely of a ``<!-- sk-doc-template: name -->`` comment,
and, when the deleted line sat between blank neighbours, also removes the blank
line that followed it so a single blank line remains between the neighbours.

The rewrite is byte-preserving: untouched lines, line endings and the presence
or absence of a trailing newline all survive. A file that would still contain a
``sk-doc-template:`` marker after the edit is left untouched and reported.

Usage:
    python3 -I remove_leftover_template_comments.py

Output: one line per changed file, then a summary line of the form
    files_changed=<n> lines_removed=<n> left_inline=<n>
"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

SCAN_PATH = ".skilled"
TEMPLATE_LINE = re.compile(rb"<!-- sk-doc-template: [a-z_-]+ -->")
MARKER = b"sk-doc-template:"


def repo_root() -> Path:
    """Return the top level of the current git work tree."""
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        capture_output=True,
        check=True,
        text=True,
    )
    return Path(result.stdout.strip())


def tracked_markdown(root: Path) -> list[str]:
    """List tracked markdown files under the scan path, as root-relative paths."""
    result = subprocess.run(
        ["git", "-C", str(root), "ls-files", "-z", "--", SCAN_PATH],
        capture_output=True,
        check=True,
    )
    names = result.stdout.decode("utf-8", "surrogateescape").split("\0")
    return [name for name in names if name.endswith(".md")]


def remove_template_lines(data: bytes) -> tuple[bytes, int]:
    """Drop whole-line template comments and the blank line they may leave behind."""
    lines = data.split(b"\n")
    matched = [TEMPLATE_LINE.fullmatch(line.strip()) is not None for line in lines]
    delete = [False] * len(lines)
    for index, is_match in enumerate(matched):
        if not is_match:
            continue
        delete[index] = True
        blank_before = index > 0 and lines[index - 1].strip() == b""
        blank_after = index + 1 < len(lines) and lines[index + 1].strip() == b""
        if blank_before and blank_after:
            delete[index + 1] = True
    kept = [line for index, line in enumerate(lines) if not delete[index]]
    return b"\n".join(kept), sum(matched)


def main() -> int:
    root = repo_root()
    files_changed = 0
    lines_removed = 0
    left_inline = 0
    for name in tracked_markdown(root):
        path = root / name
        data = path.read_bytes()
        updated, removed = remove_template_lines(data)
        if removed == 0:
            left_inline += data.count(MARKER)
            continue
        if MARKER in updated:
            print(f"SKIPPED {name}: residual sk-doc-template marker")
            left_inline += updated.count(MARKER)
            continue
        path.write_bytes(updated)
        files_changed += 1
        lines_removed += removed
        print(f"changed {name} (removed {removed})")
    print(
        f"files_changed={files_changed} "
        f"lines_removed={lines_removed} "
        f"left_inline={left_inline}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
