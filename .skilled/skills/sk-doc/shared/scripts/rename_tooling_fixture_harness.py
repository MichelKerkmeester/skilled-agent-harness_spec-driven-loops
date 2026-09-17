#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Rename Tooling Fixture Harness
# ---------------------------------------------------------------------------
"""Run the semantic rename fixture corpus without touching the real worktree.

Usage:
    rename_tooling_fixture_harness.py [--corpus <corpus.json>]
        [--protected-root <git-root>] [--repeat <count>]
        [--exercise-apply --exercise-rollback]

Dry-run is the default. Apply and rollback are opt-in fixture exercises and are
confined to disposable repositories created by the harness.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Sequence

from rename_tooling_fixture_core import DEFAULT_CORPUS, HarnessError, run_harness


def _current_git_root() -> Path:
    """Resolve the current exact Git worktree root for non-mutation protection."""
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise HarnessError("--protected-root is required outside a Git worktree")
    return Path(result.stdout.strip()).resolve()


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    """Parse the dry-run-default harness command line."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS)
    parser.add_argument("--protected-root", type=Path)
    parser.add_argument("--repeat", type=int, default=2)
    parser.add_argument(
        "--exercise-apply",
        action="store_true",
        help="Exercise rename apply only inside harness-created disposable repositories",
    )
    parser.add_argument(
        "--exercise-rollback",
        action="store_true",
        help="Exercise rollback after explicit disposable-repository apply",
    )
    args = parser.parse_args(argv)
    if args.exercise_rollback and not args.exercise_apply:
        parser.error("--exercise-rollback requires --exercise-apply")
    if args.repeat < 1:
        parser.error("--repeat must be at least one")
    return args


def main(argv: Sequence[str] | None = None) -> int:
    """Run the corpus and emit deterministic JSON evidence."""
    args = parse_args(argv if argv is not None else sys.argv[1:])
    try:
        report = run_harness(
            corpus_path=args.corpus.resolve(),
            protected_root=(args.protected_root or _current_git_root()).resolve(),
            repeat=args.repeat,
            exercise_apply=args.exercise_apply,
            exercise_rollback=args.exercise_rollback,
        )
    except HarnessError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2
    print(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
