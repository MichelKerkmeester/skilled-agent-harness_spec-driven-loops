#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: Reference Rewrite Executor CLI
# ───────────────────────────────────────────────────────────────
"""Plan ledger-bounded rewrites or mutate an opted-in disposable fixture.

Usage:
    reference_rewrite_executor.py --repo <repo> --map <map.json> \
        --ledger <ledger.json> --batch <scc-id>
    reference_rewrite_executor.py --repo <repo> --map <map.json> \
        --ledger <ledger.json> --batch <scc-id> --apply \
        --plan <plan.json> --journal <journal.json>
    reference_rewrite_executor.py --repo <repo> --map <map.json> \
        --ledger <ledger.json> --batch <scc-id> --rollback \
        --plan <plan.json> --journal <journal.json>

Dry-run is the default. Apply and rollback are available only for disposable
Git repositories carrying the committed marker and local configuration opt-in.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path, PurePosixPath
from typing import Callable, Sequence

from reference_rewrite_core import (
    ReferenceRewriteError,
    apply_plan,
    build_plan,
    load_plan,
    rollback_plan,
)


# ───────────────────────────────────────────────────────────────
# 1. ARGUMENTS
# ───────────────────────────────────────────────────────────────


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    """Parse the dry-run-default executor command line."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True, type=Path, help="Exact disposable Git root")
    parser.add_argument("--map", required=True, type=Path, dest="map_path")
    parser.add_argument("--ledger", required=True, type=Path, dest="ledger_path")
    parser.add_argument("--batch", required=True, help="One reference-graph SCC batch ID")
    action = parser.add_mutually_exclusive_group()
    action.add_argument("--apply", action="store_true", help="Apply a reviewed fixture plan")
    action.add_argument("--rollback", action="store_true", help="Roll back an applied fixture journal")
    parser.add_argument("--plan", type=Path, help="Reviewed dry-run plan outside the repository")
    parser.add_argument("--journal", type=Path, help="Rewrite journal outside the repository")
    parser.add_argument(
        "--inject-drift-file",
        type=str,
        help=argparse.SUPPRESS,
    )
    parser.add_argument(
        "--inject-failure-after-writes",
        type=int,
        help=argparse.SUPPRESS,
    )
    args = parser.parse_args(argv)
    if (args.apply or args.rollback) and (args.plan is None or args.journal is None):
        parser.error("--apply and --rollback require both --plan and --journal")
    if args.inject_drift_file and not args.apply:
        parser.error("--inject-drift-file is valid only with --apply")
    if args.inject_failure_after_writes is not None:
        if not args.apply:
            parser.error("--inject-failure-after-writes is valid only with --apply")
        if args.inject_failure_after_writes < 1:
            parser.error("--inject-failure-after-writes must be at least 1")
    return args


# ───────────────────────────────────────────────────────────────
# 2. EXECUTION
# ───────────────────────────────────────────────────────────────


def _print_json(value: object) -> None:
    """Print deterministic, reviewable JSON."""
    print(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True))


def _fixture_drift(relative_path: str) -> Callable[[Path], None]:
    """Build a test-only race that occurs after atomic pre-write validation."""
    candidate = PurePosixPath(relative_path)
    if (
        candidate.is_absolute()
        or candidate.as_posix() != relative_path
        or any(part in {"", ".", "..", ".git"} for part in candidate.parts)
    ):
        raise ReferenceRewriteError("injected fixture drift path must stay inside the repository")

    def _mutate(repository_root: Path) -> None:
        path = repository_root.joinpath(*candidate.parts)
        if path.is_symlink() or not path.is_file():
            raise ReferenceRewriteError("injected fixture drift path must be a regular file")
        content = path.read_text(encoding="utf-8")
        path.write_text(f"fixture drift\n{content}", encoding="utf-8")

    return _mutate


def main(argv: Sequence[str] | None = None) -> int:
    """Execute dry-run, apply or rollback and return a process exit code."""
    args = parse_args(argv if argv is not None else sys.argv[1:])
    try:
        if not args.apply and not args.rollback:
            _print_json(build_plan(args.repo, args.map_path, args.ledger_path, args.batch))
            return 0

        reviewed_plan = load_plan(args.plan)
        if reviewed_plan.get("batch_id") != args.batch:
            raise ReferenceRewriteError("reviewed plan batch does not match --batch")
        if args.apply:
            result = apply_plan(
                args.repo,
                args.map_path,
                args.ledger_path,
                reviewed_plan,
                args.journal,
                inject_drift=(
                    _fixture_drift(args.inject_drift_file)
                    if args.inject_drift_file
                    else None
                ),
                inject_failure_after_writes=args.inject_failure_after_writes,
            )
        else:
            result = rollback_plan(
                args.repo,
                args.map_path,
                args.ledger_path,
                reviewed_plan,
                args.journal,
            )
        _print_json(result)
        return 0
    except ReferenceRewriteError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
