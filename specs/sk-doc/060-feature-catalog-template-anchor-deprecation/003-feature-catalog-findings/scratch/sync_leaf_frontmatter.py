#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: FEATURE-CATALOG LEAF FRONTMATTER SYNC
# ───────────────────────────────────────────────────────────────

"""Sync leaf frontmatter title and description values from the validator report.

The package validator reports `root_leaf_title_mismatch` and
`root_leaf_description_mismatch` when a leaf file's frontmatter drifts from the
root catalog H3 entry that links it. This script runs that validator, collects
both violation types and rewrites the first matching key line inside each leaf's
leading frontmatter block to the value the root catalog declares.

A key whose value spans several lines is never rewritten, because replacing only
the key line would orphan the continuation. Those rows are reported as skipped.

Usage:
    python3 sync_leaf_frontmatter.py [--apply]

Output:
    One CHANGE line per rewritten key, a SKIPPED list, and a TOTAL line.
    The default invocation is a dry run; --apply writes files.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

VALIDATOR_RELATIVE_PATH = (
    Path(".skilled")
    / "skills"
    / "sk-doc"
    / "sk-create-feature-catalog"
    / "scripts"
    / "validate_catalog_package.py"
)
KEY_BY_VIOLATION_TYPE = {
    "root_leaf_title_mismatch": "title",
    "root_leaf_description_mismatch": "description",
}
FRONTMATTER_DELIMITER = "---"

# ───────────────────────────────────────────────────────────────
# 2. VALIDATOR REPORT
# ───────────────────────────────────────────────────────────────


def find_repo_anchor(start: Path) -> Path:
    """Locate the repository root that holds the catalog validator.

    Args:
        start: Directory to begin the upward search from.

    Returns:
        The nearest ancestor that carries the validator at its relative path.

    Raises:
        SystemExit: When no ancestor carries the validator.
    """
    for candidate in (start, *start.parents):
        if (candidate / VALIDATOR_RELATIVE_PATH).is_file():
            return candidate
    raise SystemExit(f"ERROR: cannot locate {VALIDATOR_RELATIVE_PATH} above {start}")


def run_validator(repo_root: Path) -> Dict[str, Any]:
    """Run the catalog package validator and return its parsed JSON report.

    Args:
        repo_root: Repository root that holds the validator.

    Returns:
        The decoded validator report.

    Raises:
        SystemExit: When the validator exits non-zero or emits unreadable JSON.
    """
    validator = repo_root / VALIDATOR_RELATIVE_PATH
    completed = subprocess.run(
        [sys.executable, "-I", str(validator), "--report-only", "--json"],
        capture_output=True,
        encoding="utf-8",
        check=False,
    )
    if completed.returncode != 0:
        sys.stderr.write(completed.stderr)
        raise SystemExit(f"ERROR: catalog validator exited {completed.returncode}")
    try:
        return json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise SystemExit(f"ERROR: catalog validator did not emit JSON: {error}")


# ───────────────────────────────────────────────────────────────
# 3. FRONTMATTER EDITING
# ───────────────────────────────────────────────────────────────


def escape_double_quoted(value: str) -> str:
    """Escape a value for a YAML double-quoted scalar."""
    return value.replace("\\", "\\\\").replace('"', '\\"')


def value_spans_multiple_lines(
    lines: List[str], key_index: int, block_end: int, value: str
) -> bool:
    """Report whether replacing only the key line would orphan continuation lines.

    Args:
        lines: All file lines, newline endings preserved.
        key_index: Index of the key line being replaced.
        block_end: Index of the frontmatter closing delimiter.
        value: The stripped value found after the key's colon.

    Returns:
        True when the value continues on later lines inside the frontmatter.
    """
    if value[:1] in ("|", ">"):
        return True

    # An empty value continues as an indented plain scalar on later lines.
    if not value:
        return any(
            lines[index].strip() and lines[index][:1].isspace()
            for index in range(key_index + 1, block_end)
        )

    # A quoted scalar that never closes on its line continues on later lines.
    if value[0] in ('"', "'") and not value.endswith(value[0]):
        return True

    return False


def patch_frontmatter(text: str, key: str, expected: str) -> Tuple[Optional[str], str]:
    """Rewrite the first leading-frontmatter line for key, preserving line endings.

    Args:
        text: Full file content.
        key: Frontmatter key to replace, either title or description.
        expected: New value, written double-quoted.

    Returns:
        Tuple of (updated_text, "") on success, or (None, skip_reason) when the
        value spans several lines or the key was not found.
    """
    lines = text.splitlines(keepends=True)
    if not lines or lines[0].rstrip() != FRONTMATTER_DELIMITER:
        return None, "no leading frontmatter block"

    block_end: Optional[int] = None
    for index in range(1, len(lines)):
        if lines[index].rstrip() == FRONTMATTER_DELIMITER:
            block_end = index
            break
    if block_end is None:
        return None, "unterminated frontmatter block"

    prefix = f"{key}:"
    for index in range(1, block_end):
        line = lines[index]
        if not line.startswith(prefix):
            continue
        value = line[len(prefix):].strip()
        if value_spans_multiple_lines(lines, index, block_end, value):
            return None, "multi-line value"
        line_ending = line[len(line.rstrip("\r\n")):]
        lines[index] = f'{prefix} "{escape_double_quoted(expected)}"' + line_ending
        return "".join(lines), ""

    return None, f"no {key} line in frontmatter"


# ───────────────────────────────────────────────────────────────
# 4. CLI
# ───────────────────────────────────────────────────────────────


def main(argv: List[str]) -> int:
    """Apply or report frontmatter syncs from the current validator report."""
    parser = argparse.ArgumentParser(description="Sync leaf frontmatter to root catalog values.")
    parser.add_argument("--apply", action="store_true", help="Write changes; default is a dry run.")
    args = parser.parse_args(argv)

    repo_root = find_repo_anchor(Path(__file__).resolve().parent)
    report = run_validator(repo_root)
    violations = [
        violation
        for violation in report.get("violations", [])
        if violation.get("type") in KEY_BY_VIOLATION_TYPE
    ]

    change_count = 0
    changed_leaves = set()
    skipped: List[Tuple[str, str, str]] = []
    for violation in violations:
        key = KEY_BY_VIOLATION_TYPE[violation["type"]]
        leaf = Path(violation["leaf"])
        display = str(leaf.relative_to(repo_root))
        with leaf.open("r", encoding="utf-8", newline="") as handle:
            original = handle.read()
        updated, skip_reason = patch_frontmatter(original, key, violation["expected"])
        if updated is None:
            skipped.append((display, key, skip_reason))
            continue
        if args.apply:
            with leaf.open("w", encoding="utf-8", newline="") as handle:
                handle.write(updated)
        change_count += 1
        changed_leaves.add(display)
        quoted = escape_double_quoted(violation["expected"])
        print(f'CHANGE  {display} :: {key} = "{quoted}"')

    print(f"SKIPPED ({len(skipped)}):" + ("" if skipped else " none"))
    for display, key, reason in skipped:
        print(f"  - {display} :: {key} ({reason})")

    mode = "applied" if args.apply else "dry run; pass --apply to write"
    print(f"TOTAL: {change_count} change(s) across {len(changed_leaves)} file(s) [{mode}]")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
