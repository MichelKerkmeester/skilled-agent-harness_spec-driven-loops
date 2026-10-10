#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL PATCH BUMP WITH CHANGELOG ENTRY
# ───────────────────────────────────────────────────────────────
"""
Patch-bump each skill or mode packet whose shipped files a change touched.

A unit is the nearest folder holding a changelog/ directory above a changed
path under .skilled/skills/. Each unit moves one patch version past its newest
changelog entry: SKILL.md and any ROUTER.md or README.md frontmatter that
already carried the old version are updated, and a short entry is written.
A parent hub (one with hub-router.json) is skipped and printed as HANDOFF,
because its version also lives in JSON routing files kept in step by another
owner.

Usage: python3 -I bump_units.py <repo-root> <spec-folder> <topic> <summary> <bullet> [<bullet> ...]
       The changed paths are read from `git status --porcelain` under .skilled/skills/.
Output: one line per bumped unit, one HANDOFF line per skipped hub.
"""

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import re
import subprocess
import sys
from pathlib import Path

# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

VERSION_FILE = re.compile(r"v(\d+)\.(\d+)\.(\d+)\.(\d+)\.md")

# ───────────────────────────────────────────────────────────────
# 3. HELPERS
# ───────────────────────────────────────────────────────────────


def changed_units(root: Path) -> list[Path]:
    """Return the unit folders that hold a changed path, excluding new changelog entries."""
    status = subprocess.run(
        ["git", "status", "--porcelain", "-uall", "--", ".skilled/skills"],
        cwd=root, check=True, capture_output=True, text=True,
    ).stdout.splitlines()
    units: set[Path] = set()
    for line in status:
        rel = line[3:].split(" -> ")[-1]
        path = root / rel
        for parent in path.parents:
            if (parent / "changelog").is_dir() and parent != root:
                units.add(parent)
                break
    return sorted(units)


def latest_version(changelog: Path) -> tuple[int, int, int, int]:
    """Return the newest version among the unit's changelog entries."""
    return max(
        tuple(int(g) for g in m.groups())
        for f in changelog.rglob("v*.md")
        if (m := VERSION_FILE.fullmatch(f.name))
    )


def replace_version_line(path: Path, old: str, new: str) -> None:
    """Rewrite a frontmatter version line when it carries the old version."""
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    updated, count = re.subn(rf"^version: {re.escape(old)}$", f"version: {new}", text, count=1, flags=re.M)
    if count:
        path.write_text(updated, encoding="utf-8")


# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────


def main() -> int:
    """Bump every changed unit once and write its changelog entry."""
    if len(sys.argv) < 6:
        print(__doc__.strip())
        return 2
    root = Path(sys.argv[1]).resolve()
    spec, topic, summary, bullets = sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5:]
    for unit in changed_units(root):
        old = latest_version(unit / "changelog")
        new = (old[0], old[1], old[2] + 1, 0)
        old_s, new_s = ".".join(map(str, old)), ".".join(map(str, new))
        if (unit / "hub-router.json").exists():
            print(f"HANDOFF {unit.relative_to(root)} {old_s} -> {new_s}")
            continue
        skill = unit / "SKILL.md"
        if skill.exists():
            name = re.search(r"^name:\s*(\S+)", skill.read_text(encoding="utf-8"), re.M).group(1)
        else:
            name = "deep-loop-runtime"
        for doc in ("SKILL.md", "ROUTER.md", "README.md"):
            replace_version_line(unit / doc, old_s, new_s)
        glance = "\n".join(f"- {b}" for b in bullets)
        entry = (
            f'---\ntitle: "{name} v{new_s}, {topic}"\n'
            f'description: "v{new_s} {summary}"\n'
            f'trigger_phrases:\n  - "{name} v{new_s}"\n  - "{name} {new_s}"\n  - "{topic}"\n'
            f'importance_tier: "normal"\ncontextType: "general"\nversion: {new_s}\n---\n\n'
            f"# v{new_s}, {topic[0].upper()}{topic[1:]}\n\n"
            f"v{new_s} {summary}\n\n> Spec folder: `{spec}` (Level 2)\n\n&nbsp;\n\n"
            f"## What's New at a Glance\n\n{glance}\n\n&nbsp;\n\n## Upgrade\n\nNo migration required.\n"
        )
        target = unit / "changelog" / f"v{new_s}.md"
        if target.exists():
            raise SystemExit(f"{target} already exists")
        target.write_text(entry, encoding="utf-8")
        print(f"BUMP {unit.relative_to(root)} {old_s} -> {new_s}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
