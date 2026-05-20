"""Reciprocal Rank Fusion for hybrid code search."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class RankedRow:
    """Single channel result passed to RRF fusion."""

    chunk_id: int
    score: float


@dataclass(frozen=True)
class FusedRow:
    """Fused chunk with per-channel provenance for auditability."""

    chunk_id: int
    rrf_score: float
    vector_rank: int | None
    fts_rank: int | None
    vector_score: float | None
    fts_score: float | None


def _min_max_scores(rows: list[RankedRow]) -> dict[int, float]:
    if not rows:
        return {}

    scores = [row.score for row in rows]
    min_score = min(scores)
    max_score = max(scores)
    if max_score == min_score:
        return {row.chunk_id: 1.0 for row in rows}

    span = max_score - min_score
    return {row.chunk_id: (row.score - min_score) / span for row in rows}


def rrf_fuse(
    vector_results: list[RankedRow],
    fts_results: list[RankedRow],
    k: int = 60,
    vector_weight: float = 0.7,
    fts_weight: float = 0.7,
) -> list[FusedRow]:
    """Fuse vector and FTS5 ranked lists using weighted RRF."""
    effective_k = max(1, k)
    vector_norm = _min_max_scores(vector_results)
    fts_norm = _min_max_scores(fts_results)
    chunk_ids = {row.chunk_id for row in vector_results} | {row.chunk_id for row in fts_results}

    vector_ranks = {row.chunk_id: rank for rank, row in enumerate(vector_results, start=1)}
    fts_ranks = {row.chunk_id: rank for rank, row in enumerate(fts_results, start=1)}

    fused: list[FusedRow] = []
    for chunk_id in chunk_ids:
        vector_rank = vector_ranks.get(chunk_id)
        fts_rank = fts_ranks.get(chunk_id)
        score = 0.0
        if vector_rank is not None:
            score += vector_weight * (1 / (effective_k + vector_rank))
        if fts_rank is not None:
            score += fts_weight * (1 / (effective_k + fts_rank))

        fused.append(
            FusedRow(
                chunk_id=chunk_id,
                rrf_score=score,
                vector_rank=vector_rank,
                fts_rank=fts_rank,
                vector_score=vector_norm.get(chunk_id),
                fts_score=fts_norm.get(chunk_id),
            )
        )

    return sorted(
        fused,
        key=lambda row: (
            row.rrf_score,
            row.vector_score if row.vector_score is not None else -1.0,
            row.fts_score if row.fts_score is not None else -1.0,
        ),
        reverse=True,
    )
