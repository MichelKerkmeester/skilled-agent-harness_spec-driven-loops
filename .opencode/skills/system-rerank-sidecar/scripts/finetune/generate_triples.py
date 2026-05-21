#!/usr/bin/env python3
"""Generate synthetic training triples for spec-memory reranker fine-tuning.

Planned responsibility: walk the spec-memory corpus, strip template scaffolding,
generate paraphrased queries, choose graph-neighbor hard negatives, and write
train/test JSONL split by packet_id.
"""

from __future__ import annotations

import argparse
from pathlib import Path


def generate_triples(
    corpus_root: Path,
    output_dir: Path,
    n_triples_per_doc: int = 4,
    hard_negatives_per_positive: int = 2,
) -> tuple[Path, Path]:
    """Generate train/test JSONL triples from a corpus root."""

    raise NotImplementedError("Phase C implements triple generation.")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("corpus_root", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--triples-per-doc", type=int, default=4)
    parser.add_argument("--hard-negatives", type=int, default=2)
    args = parser.parse_args(argv)
    generate_triples(args.corpus_root, args.output_dir, args.triples_per_doc, args.hard_negatives)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
