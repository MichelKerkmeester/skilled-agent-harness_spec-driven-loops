#!/usr/bin/env python3
"""Verify train/test packet_id separation for generated triples.

Planned responsibility: read train.jsonl and test.jsonl, collect positive and
negative packet IDs, and fail if any packet_id appears on both sides.
"""

from __future__ import annotations

import argparse
from pathlib import Path


def verify_split(train_jsonl: Path, test_jsonl: Path) -> bool:
    """Return True when train/test triples have no packet_id leakage."""

    raise NotImplementedError("Phase C implements split verification.")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("train_jsonl", type=Path)
    parser.add_argument("test_jsonl", type=Path)
    args = parser.parse_args(argv)
    return 0 if verify_split(args.train_jsonl, args.test_jsonl) else 1


if __name__ == "__main__":
    raise SystemExit(main())
