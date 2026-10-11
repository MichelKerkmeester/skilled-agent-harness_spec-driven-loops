#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: FEATURE CATALOG TEMPLATE ANCHOR REMOVAL
# ───────────────────────────────────────────────────────────────
"""
Remove the template-name comment from every tracked feature catalog file.

The feature catalog scaffold used to stamp `<!-- sk-doc-template:
skill_asset_feature_catalog -->` under each H1, and some older files carry a
hyphenated spelling. Nothing reads the comment, so every copy is deleted along
with the blank line that separated it from the next section.

Usage: python3 -I remove_template_anchor.py <repo-root>
Output: one line per changed file, a summary line, and a JSON report written
        next to this script. Exits 1 when a copy sits anywhere other than on
        a line of its own, so nothing is half-removed.
"""

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import json
import re
import subprocess
import sys
from pathlib import Path

# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

MARKER_LINE = re.compile(r"<!-- sk-doc-template: skill_asset_feature[_-]catalog -->")
MARKER_TEXT = re.compile(r"sk-doc-template: skill_asset_feature[_-]catalog")
REPORT_NAME = "remove-template-anchor-report.json"

# ───────────────────────────────────────────────────────────────
# 3. HELPERS
# ───────────────────────────────────────────────────────────────


def list_catalog_files(repo_root: Path) -> list[str]:
    """Return tracked markdown paths that sit inside a feature-catalog folder.

    Args:
        repo_root: Repository root to run git in.

    Returns:
        Sorted repository-relative paths.
    """
    output = subprocess.run(
        ["git", "ls-files", "-z", "--", ".skilled"],
        cwd=repo_root,
        check=True,
        capture_output=True,
        text=True,
    ).stdout
    return sorted(
        path
        for path in output.split("\0")
        if path.endswith(".md") and "/feature-catalog/" in path
    )


def strip_markers(lines: list[str]) -> tuple[list[str], int]:
    """Drop every marker line and the blank line that followed it.

    The following blank line goes only when a blank line also precedes the
    marker, so the heading and the next section keep exactly one blank line
    between them.

    Args:
        lines: File lines with their line endings.

    Returns:
        The kept lines and the number of markers removed.
    """
    kept: list[str] = []
    removed = 0
    skip_next_blank = False
    for line in lines:
        if skip_next_blank:
            skip_next_blank = False
            if line.strip() == "":
                continue
        if MARKER_LINE.fullmatch(line.strip()):
            removed += 1
            skip_next_blank = bool(kept) and kept[-1].strip() == ""
            continue
        kept.append(line)
    return kept, removed


# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────


def main() -> int:
    """Remove the marker from every catalog file and write the report."""
    if len(sys.argv) != 2:
        print(__doc__.strip())
        return 2
    repo_root = Path(sys.argv[1]).resolve()

    changed: dict[str, int] = {}
    inline: list[str] = []
    for relative in list_catalog_files(repo_root):
        path = repo_root / relative
        with path.open(encoding="utf-8", newline="") as handle:
            lines = handle.readlines()
        kept, removed = strip_markers(lines)
        if any(MARKER_TEXT.search(line) for line in kept):
            inline.append(relative)
            continue
        if removed == 0:
            continue
        with path.open("w", encoding="utf-8", newline="") as handle:
            handle.writelines(kept)
        changed[relative] = removed
        print(f"removed {removed} {relative}")

    report = {
        "files_changed": len(changed),
        "markers_removed": sum(changed.values()),
        "inline_copies_left": inline,
        "files": changed,
    }
    report_path = Path(__file__).resolve().parent / REPORT_NAME
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(
        f"files_changed={report['files_changed']} "
        f"markers_removed={report['markers_removed']} "
        f"inline_copies_left={len(inline)}"
    )
    return 1 if inline else 0


if __name__ == "__main__":
    sys.exit(main())
