#!/usr/bin/env python3
"""Publish or locally stage a fine-tuned reranker artifact.

Planned responsibility: copy the selected checkpoint to the operator-approved
local HuggingFace cache path or push it to a private HF repository, then emit
the model id and revision pin for the sidecar allowlist.
"""

from __future__ import annotations

import argparse
from pathlib import Path


def publish_artifact(checkpoint_path: Path, model_name: str, local_only: bool = True) -> str:
    """Publish a checkpoint and return the revision identifier."""

    raise NotImplementedError("Phase F implements artifact publishing.")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("checkpoint_path", type=Path)
    parser.add_argument("--model-name", required=True)
    parser.add_argument("--hf", action="store_true", help="Publish to HuggingFace instead of local cache.")
    args = parser.parse_args(argv)
    publish_artifact(args.checkpoint_path, args.model_name, local_only=not args.hf)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
