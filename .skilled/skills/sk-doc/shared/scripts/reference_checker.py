#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: REFERENCE CHECKER CLI
# ───────────────────────────────────────────────────────────────
"""Build a read-only disposition ledger from an explicit semantic rename map.

Usage:
    python reference_checker.py --repo <git-root> --map <map.json> \
        --expected-base <sha> [--state pre|post|auto] [--dispositions <file>]

The ledger is written to stdout. The checker never writes into the scanned
repository and rejects dirty or stale worktrees before scanning.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Sequence

from reference_checker_core import (
    SCAN_STATES,
    build_reference_ledger,
    load_dynamic_dispositions,
    validate_ledger,
)
from reference_checker_models import CheckerError, load_semantic_map


# ───────────────────────────────────────────────────────────────
# 1. ARGUMENTS
# ───────────────────────────────────────────────────────────────


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    """Parse the non-mutating checker command line."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True, type=Path, help="Exact Git worktree root")
    parser.add_argument("--map", required=True, type=Path, dest="semantic_map")
    parser.add_argument("--expected-base", required=True, help="Reviewed immutable BASE SHA")
    parser.add_argument("--state", choices=sorted(SCAN_STATES), default="pre")
    parser.add_argument(
        "--dispositions",
        type=Path,
        help="Optional JSON decisions keyed by dynamic site ID or readable site key",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Pretty-print ledger JSON instead of canonical compact JSON",
    )
    return parser.parse_args(argv)


# ───────────────────────────────────────────────────────────────
# 2. EXECUTION
# ───────────────────────────────────────────────────────────────


def main(argv: Sequence[str] | None = None) -> int:
    """Run the checker and return zero only for a complete terminal ledger."""
    args = parse_args(argv if argv is not None else sys.argv[1:])
    try:
        semantic_map = load_semantic_map(args.semantic_map.resolve())
        dispositions = load_dynamic_dispositions(
            args.dispositions.resolve() if args.dispositions else None
        )
        ledger = build_reference_ledger(
            args.repo,
            semantic_map,
            expected_base=args.expected_base,
            state=args.state,
            dispositions=dispositions,
        )
        if args.pretty:
            print(json.dumps(ledger, indent=2, ensure_ascii=False, sort_keys=True))
        else:
            print(
                json.dumps(
                    ledger,
                    ensure_ascii=False,
                    separators=(",", ":"),
                    sort_keys=True,
                )
            )
        validate_ledger(ledger, semantic_map)
        return 0
    except CheckerError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
