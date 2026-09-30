"""Tare deterministic dataset splits.

Every item lands in exactly one of ``train`` / ``dev`` / ``test`` (by
default 80/10/10), decided by ``sha256`` over normalized state+question
text — never by RNG draw order.  Same item, same split, every run, across
machines, languages of the caller, and process restarts.

Usage::

    from split import split_for

    which = split_for(state="user is 42", question="Refund?")
    assert which == split_for("User is  42. ", "refund?")

If you need splits that don't collide with another harness using the same
text, set ``seed`` to a namespace constant (e.g. ``"tare-1"``).
"""

from __future__ import annotations

import hashlib
import re
from typing import Sequence

__all__ = [
    "SPLIT_LABELS",
    "SPLIT_RATIOS",
    "normalize_text",
    "split_hash",
    "split_for",
    "split_dataset",
]

SPLIT_LABELS: tuple[str, ...] = ("train", "dev", "test")
SPLIT_RATIOS: tuple[float, ...] = (0.8, 0.1, 0.1)


def normalize_text(text: str) -> str:
    """Canonical form used for hashing: case-folded, whitespace-collapsed.

    ``"  The  Question? "`` and ``"the question?"`` hash identically.
    """
    return re.sub(r"\s+", " ", str(text)).strip().casefold()


def split_hash(state: str, question: str, seed: str = "") -> str:
    """Hex digest of the normalized state+question (+ optional seed)."""
    h = hashlib.sha256(seed.encode("utf-8"))
    h.update(b"\x00")
    h.update(normalize_text(state).encode("utf-8"))
    h.update(b"\x00")
    h.update(normalize_text(question).encode("utf-8"))
    return h.hexdigest()


def _bucket(hexdigest: str, ratios: Sequence[float]) -> int:
    """Map a digest onto [0, len(ratios)) by cumulative mass."""
    # Convert the leading digest bits to a float in [0, 1) — full precision.
    sample = int.from_bytes(bytes.fromhex(hexdigest[:16]), "big")
    x = sample / float(1 << 64)
    cumulative = 0.0
    for i, ratio in enumerate(ratios):
        cumulative += ratio
        if x < cumulative:
            return i
    return len(ratios) - 1


def split_for(
    state: str,
    question: str,
    seed: str = "",
    ratios: Sequence[float] = SPLIT_RATIOS,
    labels: Sequence[str] = SPLIT_LABELS,
) -> str:
    """Deterministic split label for one item (default 80/10/10).

    Raises ``ValueError`` on non-positive ratios or a label/ratio length
    mismatch.  Ratios need not be normalized; they are treated as relative
    weights.
    """
    if len(ratios) != len(labels):
        raise ValueError(
            f"{len(labels)} labels but {len(ratios)} ratios"
        )
    if any(r <= 0 for r in ratios):
        raise ValueError(f"ratios must be positive, got {ratios!r}")
    digest = split_hash(state, question, seed)
    return labels[_bucket(digest, ratios)]


def split_dataset(
    items: Sequence[dict],
    seed: str = "",
    ratios: Sequence[float] = SPLIT_RATIOS,
    labels: Sequence[str] = SPLIT_LABELS,
    key: str = "question",
) -> dict[str, list[dict]]:
    """Group records into split buckets.

    Each item is a dict with at least a question field (default
    ``"question"``; the state text, if any, lives in ``"state"``).  Returns
    ``{label: [items...]}`` in ``labels`` order.
    """
    out: dict[str, list[dict]] = {label: [] for label in labels}
    for item in items:
        which = split_for(
            item.get("state", ""),
            item[key],
            seed=seed,
            ratios=ratios,
            labels=labels,
        )
        out[which].append(item)
    return out
