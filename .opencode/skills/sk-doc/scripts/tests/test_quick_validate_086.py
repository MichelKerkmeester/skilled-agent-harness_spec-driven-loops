#!/usr/bin/env python3
"""
Tests for packet 086 — description-length budget check in quick_validate.py.

Builds fixtures in a temporary directory at test time so no persistent SKILL.md
files live under .opencode/skills/ where runtime scanners (Codex, Claude Code,
opencode) would treat them as real skills and emit invalid-description errors.

Verifies four cases:
  1. under-target:  description ≤ 130 chars     → valid, no length warning
  2. at-target:     description ~130 chars      → valid, no length warning (boundary)
  3. over-soft:     description > 130, ≤ 1536   → valid, length warning emitted
  4. over-hard:     description > 1536          → invalid (hard fail)

Plus a helper-contract case that pins check_description_length() at three
boundaries without touching the file system.

Usage:
    python3 test_quick_validate_086.py
    python3 test_quick_validate_086.py --verbose

Exit codes:
    0 - all tests passed
    1 - one or more tests failed
"""

import argparse
import sys
import tempfile
from pathlib import Path
from typing import Tuple

# Make quick_validate importable
SCRIPTS_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPTS_DIR))

from quick_validate import (  # type: ignore
    DESCRIPTION_HARD_CAP,
    DESCRIPTION_SOFT_TARGET_SKILL,
    validate_skill,
    check_description_length,
)


# ───────────────────────────────────────────────────────────────
# 1. FIXTURE BUILDER (runtime tempdir)
# ───────────────────────────────────────────────────────────────


SKILL_TEMPLATE = """---
name: {name}
description: "{description}"
allowed-tools: [Read, Write]
version: 1.0.0
---
# {title}

Body content irrelevant to the description-length test.
"""


def write_fixture(parent: Path, name: str, description: str) -> Path:
    skill_dir = parent / name
    skill_dir.mkdir(parents=True, exist_ok=True)
    skill_md = skill_dir / "SKILL.md"
    skill_md.write_text(
        SKILL_TEMPLATE.format(name=name, description=description, title=name.replace("-", " ").title()),
        encoding="utf-8",
    )
    return skill_dir


def build_under_target(parent: Path) -> Path:
    desc = "Concise skill description well under the soft target. Routes correctly via verb + noun."
    assert len(desc) < DESCRIPTION_SOFT_TARGET_SKILL, "fixture invariant: under-target must be < soft"
    return write_fixture(parent, "under-target", desc)


def build_at_target(parent: Path) -> Path:
    # Fill to exactly DESCRIPTION_SOFT_TARGET_SKILL chars. The boundary is INCLUSIVE — lengths
    # equal to the target are NOT a warning.
    base = "At-target boundary fixture: "
    filler = "x" * (DESCRIPTION_SOFT_TARGET_SKILL - len(base))
    desc = base + filler
    assert len(desc) == DESCRIPTION_SOFT_TARGET_SKILL, f"fixture invariant: at-target must be exactly {DESCRIPTION_SOFT_TARGET_SKILL}"
    return write_fixture(parent, "at-target", desc)


def build_over_soft(parent: Path) -> Path:
    # Length must overshoot soft target but stay well under the hard cap.
    desc = "Bloated description: " + ("x" * (DESCRIPTION_SOFT_TARGET_SKILL + 50 - len("Bloated description: ")))
    assert DESCRIPTION_SOFT_TARGET_SKILL < len(desc) < DESCRIPTION_HARD_CAP
    return write_fixture(parent, "over-soft", desc)


def build_over_hard(parent: Path) -> Path:
    # Length must exceed Claude Code's 1,536 hard cap. Use a deterministic pad.
    desc = "Catastrophic over-hard fixture: " + ("y" * (DESCRIPTION_HARD_CAP + 20 - len("Catastrophic over-hard fixture: ")))
    assert len(desc) > DESCRIPTION_HARD_CAP
    return write_fixture(parent, "over-hard", desc)


# ───────────────────────────────────────────────────────────────
# 2. ASSERTION HELPERS
# ───────────────────────────────────────────────────────────────


def assert_eq(name: str, actual, expected, verbose: bool) -> bool:
    if actual != expected:
        print(f"  FAIL {name}: expected {expected!r}, got {actual!r}")
        return False
    if verbose:
        print(f"  ok   {name}")
    return True


def assert_contains_substring(name: str, haystack_list, needle: str, verbose: bool) -> bool:
    for entry in haystack_list:
        if needle in entry:
            if verbose:
                print(f"  ok   {name}")
            return True
    print(f"  FAIL {name}: no entry in {haystack_list!r} contains {needle!r}")
    return False


def assert_no_substring(name: str, haystack_list, needle: str, verbose: bool) -> bool:
    for entry in haystack_list:
        if needle in entry:
            print(f"  FAIL {name}: found unexpected substring {needle!r} in {entry!r}")
            return False
    if verbose:
        print(f"  ok   {name}")
    return True


# ───────────────────────────────────────────────────────────────
# 3. TEST RUNNER
# ───────────────────────────────────────────────────────────────


def run_tests(verbose: bool) -> int:
    failed = 0
    with tempfile.TemporaryDirectory(prefix="quick-validate-086-") as tmp:
        parent = Path(tmp)
        under = build_under_target(parent)
        at = build_at_target(parent)
        over_soft = build_over_soft(parent)
        over_hard = build_over_hard(parent)

        # Case 1 — under-target
        print("Case 1: under-target")
        valid, msg, warnings = validate_skill(under)
        if not assert_eq("valid", valid, True, verbose):
            failed += 1
        if not assert_no_substring("no length warning", warnings, "exceeds soft target", verbose):
            failed += 1

        # Case 2 — at-target (boundary)
        print("Case 2: at-target")
        valid, msg, warnings = validate_skill(at)
        if not assert_eq("valid", valid, True, verbose):
            failed += 1
        if not assert_no_substring("no length warning at boundary", warnings, "exceeds soft target", verbose):
            failed += 1

        # Case 3 — over-soft (warning expected)
        print("Case 3: over-soft")
        valid, msg, warnings = validate_skill(over_soft)
        if not assert_eq("valid (still passes)", valid, True, verbose):
            failed += 1
        if not assert_contains_substring("length warning present", warnings, "exceeds soft target", verbose):
            failed += 1

        # Case 4 — over-hard (hard fail expected)
        print("Case 4: over-hard")
        valid, msg, warnings = validate_skill(over_hard)
        if not assert_eq("invalid (hard fail)", valid, False, verbose):
            failed += 1
        if not assert_contains_substring("hard cap message", [msg], "hard cap", verbose):
            failed += 1

    # Case 5 — helper contract (no file system)
    print("Case 5: helper contract")
    err, warn = check_description_length("x" * 50, DESCRIPTION_SOFT_TARGET_SKILL)
    if not assert_eq("short → no error", err, None, verbose):
        failed += 1
    if not assert_eq("short → no warning", warn, None, verbose):
        failed += 1
    err, warn = check_description_length("x" * (DESCRIPTION_SOFT_TARGET_SKILL + 5), DESCRIPTION_SOFT_TARGET_SKILL)
    if not assert_eq("over-soft → no error", err, None, verbose):
        failed += 1
    if warn is None or "exceeds soft target" not in warn:
        print(f"  FAIL over-soft → warning missing or wrong content: {warn!r}")
        failed += 1
    elif verbose:
        print("  ok   over-soft → warning emitted")
    err, warn = check_description_length("x" * (DESCRIPTION_HARD_CAP + 10), DESCRIPTION_SOFT_TARGET_SKILL)
    if err is None or "hard cap" not in err:
        print(f"  FAIL over-hard → error missing or wrong content: {err!r}")
        failed += 1
    elif verbose:
        print("  ok   over-hard → error emitted")

    print(f"\n{'PASS' if failed == 0 else f'FAIL ({failed} assertion(s))'}")
    return 0 if failed == 0 else 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()
    sys.exit(run_tests(args.verbose))


if __name__ == "__main__":
    main()
