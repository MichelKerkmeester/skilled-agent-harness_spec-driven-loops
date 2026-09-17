#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Semantic Rename Engine
# ---------------------------------------------------------------------------
"""Plan semantic Git renames, or mutate an opted-in disposable fixture.

Usage:
  semantic_rename_engine.py --repo <path> --map <map.json>
  semantic_rename_engine.py --repo <path> --map <map.json> --apply \
      --plan <reviewed-plan.json> --journal <journal.json>
  semantic_rename_engine.py --repo <path> --map <map.json> --rollback \
      --plan <reviewed-plan.json> --journal <journal.json>

Dry-run is the default and prints the complete plan to standard output. Apply
and rollback are rejected unless the target is an explicitly opted-in,
disposable Git repository.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Sequence

from rename_engine_core import (
    RenameEngineError,
    apply_plan,
    build_plan,
    load_plan,
    load_semantic_map,
    rollback_plan,
)


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    """Parse the command-line contract."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, required=True, help="Disposable Git repository root")
    parser.add_argument("--map", dest="map_path", type=Path, required=True, help="Semantic map JSON")
    action = parser.add_mutually_exclusive_group()
    action.add_argument("--apply", action="store_true", help="Apply a reviewed plan")
    action.add_argument("--rollback", action="store_true", help="Roll back a journal")
    parser.add_argument("--plan", type=Path, help="Reviewed dry-run plan JSON")
    parser.add_argument("--journal", type=Path, help="Journal path outside the repository")
    parser.add_argument(
        "--inject-failure-after-moves",
        type=int,
        help=argparse.SUPPRESS,
    )
    args = parser.parse_args(argv)
    if (args.apply or args.rollback) and (args.plan is None or args.journal is None):
        parser.error("--apply and --rollback require both --plan and --journal")
    if args.inject_failure_after_moves is not None and not args.apply:
        parser.error("--inject-failure-after-moves is valid only with --apply")
    if args.inject_failure_after_moves is not None and args.inject_failure_after_moves < 1:
        parser.error("--inject-failure-after-moves must be at least 1")
    return args


def _print_json(value: object) -> None:
    print(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True))


def main(argv: Sequence[str]) -> int:
    """Execute dry-run, apply, or rollback and return a process exit code."""
    args = parse_args(argv)
    try:
        if not args.apply and not args.rollback:
            semantic_map = load_semantic_map(args.map_path)
            _print_json(build_plan(args.repo, semantic_map))
            return 0

        reviewed_plan = load_plan(args.plan)
        if args.apply:
            result = apply_plan(
                args.repo,
                args.map_path,
                reviewed_plan,
                args.journal,
                inject_failure_after_moves=args.inject_failure_after_moves,
            )
        else:
            result = rollback_plan(
                args.repo,
                args.map_path,
                reviewed_plan,
                args.journal,
            )
        _print_json(result)
        return 0
    except RenameEngineError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
