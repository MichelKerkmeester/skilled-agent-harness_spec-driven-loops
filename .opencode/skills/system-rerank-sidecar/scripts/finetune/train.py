#!/usr/bin/env python3
"""Train a domain-tuned cross-encoder reranker.

Planned responsibility: load generated triples, fine-tune the chosen base
cross-encoder for one to three epochs, checkpoint each epoch, and select the
best checkpoint by held-out test-set NDCG.
"""

from __future__ import annotations

import argparse
from pathlib import Path


def train_model(
    train_jsonl: Path,
    test_jsonl: Path,
    output_dir: Path,
    base_model: str,
    epochs: int = 3,
    batch_size: int = 16,
    learning_rate: float = 2e-5,
) -> Path:
    """Train a cross-encoder and return the best checkpoint path."""

    raise NotImplementedError("Phase D implements model training.")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--train", required=True, type=Path)
    parser.add_argument("--test", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--base", required=True)
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--batch", type=int, default=16)
    parser.add_argument("--lr", type=float, default=2e-5)
    args = parser.parse_args(argv)
    train_model(args.train, args.test, args.output, args.base, args.epochs, args.batch, args.lr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
