#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: sk-code verifier script name normalizer
# ───────────────────────────────────────────────────────────────
"""Rename the sk-code verifier scripts to kebab-case and update every citation.

The verifier assets and their tests carried snake_case filenames while the rest
of the skill tree uses kebab-case, so consumers had to remember two conventions.
This migration git-moves the five scripts and rewrites the references in the
docs, manifests and scripts that cite them. Changelog entries record history
and are intentionally left alone.

Usage: python3 rename_kebab_scripts.py
Run from the repository root.

Output: One line per edited file with its replaced-token count, then a total.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path
from typing import NoReturn

SKILL_ROOT = Path(".skilled/skills/sk-code")

RENAMES: tuple[tuple[str, str], ...] = (
    (
        "sk-code-opencode/assets/scripts/router_replay_lib.cjs",
        "sk-code-opencode/assets/scripts/router-replay-lib.cjs",
    ),
    (
        "sk-code-opencode/assets/scripts/verify_doc_claims.cjs",
        "sk-code-opencode/assets/scripts/verify-doc-claims.cjs",
    ),
    (
        "sk-code-opencode/assets/scripts/verify_router_sync.cjs",
        "sk-code-opencode/assets/scripts/verify-router-sync.cjs",
    ),
    (
        "sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs",
        "sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs",
    ),
    (
        "sk-code-opencode/scripts/tests/verify_router_sync.test.cjs",
        "sk-code-opencode/scripts/tests/verify-router-sync.test.cjs",
    ),
)

REPLACEMENTS: tuple[tuple[str, str], ...] = (
    ("router_replay_lib", "router-replay-lib"),
    ("verify_doc_claims", "verify-doc-claims"),
    ("verify_router_sync", "verify-router-sync"),
)

# Files that cite the scripts from prose, manifests or wrappers.
CITED_FILES: tuple[str, ...] = (
    "leaf-manifest.json",
    "benchmark/README.md",
    "sk-code-obsidian/manual-testing-playbook/holdout/accessibility-independent.md",
    "sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md",
    "sk-code-opencode/SKILL.md",
    "sk-code-opencode/assets/scripts/README.md",
    "sk-code-opencode/scripts/README.md",
    "sk-code-opencode/scripts/run-all-drift-guards.sh",
    "sk-code-opencode/references/shared/alignment-verification-automation.md",
    "sk-code-opencode/manual-testing-playbook/authoring-verification/verification-alignment.md",
)


def fail(message: str) -> NoReturn:
    """Abort with a precondition error before any mutation."""
    raise SystemExit(f"ERROR: {message}")


def edited_text_files() -> tuple[Path, ...]:
    """Return the cited files plus the renamed scripts at their post-rename paths."""
    cited = tuple(SKILL_ROOT / rel for rel in CITED_FILES)
    renamed = tuple(SKILL_ROOT / destination for _, destination in RENAMES)
    return cited + renamed


def check_preconditions() -> None:
    """Stop while the tree is still in its expected start state."""
    if not SKILL_ROOT.is_dir():
        fail(f"{SKILL_ROOT} not found; run this script from the repository root")

    for source, destination in RENAMES:
        if not (SKILL_ROOT / source).is_file():
            fail(f"rename source missing: {SKILL_ROOT / source}")
        if (SKILL_ROOT / destination).exists():
            fail(f"rename destination already exists: {SKILL_ROOT / destination}")

    for rel in CITED_FILES:
        if not (SKILL_ROOT / rel).is_file():
            fail(f"cited file missing: {SKILL_ROOT / rel}")


def git_move_scripts() -> None:
    """Rename every script with git mv so each move stays a tracked rename."""
    for source, destination in RENAMES:
        subprocess.run(
            ["git", "mv", str(SKILL_ROOT / source), str(SKILL_ROOT / destination)],
            check=True,
        )


def rewrite_citations(path: Path) -> int:
    """Replace every old token in one file and return the replaced count.

    Args:
        path: File to rewrite in place.

    Returns:
        Number of token occurrences replaced; zero leaves the file untouched.
    """
    content = path.read_text(encoding="utf-8")
    updated = content
    replaced = 0
    for old, new in REPLACEMENTS:
        replaced += updated.count(old)
        updated = updated.replace(old, new)
    if replaced:
        path.write_text(updated, encoding="utf-8")
    return replaced


def main() -> int:
    """Run the migration, printing one count line per file plus a total."""
    check_preconditions()
    git_move_scripts()

    targets = edited_text_files()
    total = 0
    for path in targets:
        count = rewrite_citations(path)
        total += count
        print(f"{path.relative_to(SKILL_ROOT)}: {count}")

    print(f"TOTAL: {total} replacements across {len(targets)} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
