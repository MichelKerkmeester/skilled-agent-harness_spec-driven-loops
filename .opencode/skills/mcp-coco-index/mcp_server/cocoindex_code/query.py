"""Query implementation for codebase search."""

# Modified by spec-kit-skilled-agent-orchestration: 009 packet REQ-001..006 (see ../NOTICE)
from __future__ import annotations

import heapq
import hashlib
import logging
import sqlite3
from pathlib import Path
from typing import Any

from . import reranker
from .config import config
from .fts_index import query_fts
from .fusion import FusedRow, RankedRow, rrf_fuse
from .observability import (
    LANE_HYBRID_RERANK,
    LANE_HYBRID_RRF,
    LANE_VECTOR_ONLY,
    elapsed_ms,
    log_stage,
    monotonic_ms,
)
from .schema import QueryResult
from .settings import PROJECT_SETTINGS, is_canonical_path
from .shared import EMBEDDER, SQLITE_DB, query_prompt_name

logger = logging.getLogger(__name__)


def _l2_to_score(distance: float) -> float:
    """Convert L2 distance to cosine similarity (exact for unit vectors)."""
    return 1.0 - distance * distance / 2.0


class QueryResults(list[QueryResult]):
    """List of query results with response-level dedup telemetry."""

    dedupedAliases: int
    uniqueResultCount: int

    def __init__(
        self,
        results: list[QueryResult],
        *,
        deduped_aliases: int,
        unique_result_count: int,
    ) -> None:
        super().__init__(results)
        self.dedupedAliases = deduped_aliases
        self.uniqueResultCount = unique_result_count


IMPLEMENTATION_INTENT_KEYWORDS = [
    "implementation",
    "function",
    "handler",
    "class ",
    "method",
    "callers",
    "caller",
    "called by",
    "calls ",
    "implements ",
    "code for",
    "source for",
    "definition of",
]


def _has_implementation_intent(query: str) -> bool:
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in IMPLEMENTATION_INTENT_KEYWORDS)


def _normalize_chunk_content(content: str) -> str:
    return " ".join(content.strip().split())


def _hash_content(content: str) -> str:
    return hashlib.sha256(_normalize_chunk_content(content).encode()).hexdigest()


def _chunk_columns(conn: sqlite3.Connection) -> set[str]:
    rows = conn.execute("PRAGMA table_info(code_chunks_vec)").fetchall()
    return {row[1] for row in rows}


def _select_chunk_columns(conn: sqlite3.Connection) -> str:
    columns = _chunk_columns(conn)
    source_realpath = "source_realpath" if "source_realpath" in columns else "NULL"
    content_hash = "content_hash" if "content_hash" in columns else "NULL"
    path_class = "path_class" if "path_class" in columns else "'implementation'"
    return (
        "file_path, "
        f"{source_realpath} AS source_realpath, "
        "language, content, "
        f"{content_hash} AS content_hash, "
        f"{path_class} AS path_class, "
        "start_line, end_line"
    )


def _select_chunk_columns_with_id(conn: sqlite3.Connection) -> str:
    return f"id AS chunk_id, {_select_chunk_columns(conn)}"


def _knn_query(
    conn: sqlite3.Connection,
    embedding_bytes: bytes,
    k: int,
    language: str | None = None,
) -> list[tuple[Any, ...]]:
    """Run a vec0 KNN query, optionally constrained to a language partition."""
    if language is not None:
        select_columns = _select_chunk_columns(conn)
        return conn.execute(
            f"""
            SELECT {select_columns}, distance
            FROM code_chunks_vec
            WHERE embedding MATCH ? AND k = ? AND language = ?
            ORDER BY distance
            """,
            (embedding_bytes, k, language),
        ).fetchall()
    select_columns = _select_chunk_columns(conn)
    return conn.execute(
        f"""
        SELECT {select_columns}, distance
        FROM code_chunks_vec
        WHERE embedding MATCH ? AND k = ?
        ORDER BY distance
        """,
        (embedding_bytes, k),
    ).fetchall()


def _full_scan_query(
    conn: sqlite3.Connection,
    embedding_bytes: bytes,
    limit: int,
    offset: int,
    languages: list[str] | None = None,
    paths: list[str] | None = None,
) -> list[tuple[Any, ...]]:
    """Full scan with SQL-level distance computation and filtering."""
    select_columns = _select_chunk_columns(conn)
    conditions: list[str] = []
    params: list[Any] = [embedding_bytes]

    if languages:
        placeholders = ",".join("?" for _ in languages)
        conditions.append(f"language IN ({placeholders})")
        params.extend(languages)

    if paths:
        path_clauses = " OR ".join("file_path GLOB ?" for _ in paths)
        conditions.append(f"({path_clauses})")
        params.extend(paths)

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    params.extend([limit, offset])

    return conn.execute(
        f"""
        SELECT {select_columns},
               vec_distance_L2(embedding, ?) as distance
        FROM code_chunks_vec
        {where}
        ORDER BY distance
        LIMIT ? OFFSET ?
        """,
        params,
    ).fetchall()


def _knn_query_with_ids(
    conn: sqlite3.Connection,
    embedding_bytes: bytes,
    k: int,
    language: str | None = None,
) -> list[tuple[Any, ...]]:
    """Run a vec0 KNN query and include the chunk id for fusion."""
    select_columns = _select_chunk_columns_with_id(conn)
    if language is not None:
        return conn.execute(
            f"""
            SELECT {select_columns}, distance
            FROM code_chunks_vec
            WHERE embedding MATCH ? AND k = ? AND language = ?
            ORDER BY distance
            """,
            (embedding_bytes, k, language),
        ).fetchall()

    return conn.execute(
        f"""
        SELECT {select_columns}, distance
        FROM code_chunks_vec
        WHERE embedding MATCH ? AND k = ?
        ORDER BY distance
        """,
        (embedding_bytes, k),
    ).fetchall()


def _full_scan_query_with_ids(
    conn: sqlite3.Connection,
    embedding_bytes: bytes,
    limit: int,
    offset: int,
    languages: list[str] | None = None,
    paths: list[str] | None = None,
) -> list[tuple[Any, ...]]:
    """Full scan with chunk ids included for fusion."""
    select_columns = _select_chunk_columns_with_id(conn)
    conditions: list[str] = []
    params: list[Any] = [embedding_bytes]

    if languages:
        placeholders = ",".join("?" for _ in languages)
        conditions.append(f"language IN ({placeholders})")
        params.extend(languages)

    if paths:
        path_clauses = " OR ".join("file_path GLOB ?" for _ in paths)
        conditions.append(f"({path_clauses})")
        params.extend(paths)

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    params.extend([limit, offset])

    return conn.execute(
        f"""
        SELECT {select_columns},
               vec_distance_L2(embedding, ?) as distance
        FROM code_chunks_vec
        {where}
        ORDER BY distance
        LIMIT ? OFFSET ?
        """,
        params,
    ).fetchall()


def _dedup_key(row: tuple[Any, ...]) -> tuple[str, str, int, int]:
    (
        _file_path,
        source_realpath,
        _language,
        content,
        content_hash,
        _path_class,
        start_line,
        end_line,
        _distance,
    ) = row
    if source_realpath:
        return ("source_realpath", str(source_realpath), start_line, end_line)
    fallback_hash = content_hash or _hash_content(content)
    return ("content_hash", str(fallback_hash), start_line, end_line)


def _dedup_key_from_record(record: dict[str, Any]) -> tuple[str, str, int, int]:
    source_realpath = record.get("source_realpath")
    start_line = int(record["start_line"])
    end_line = int(record["end_line"])
    if source_realpath:
        return ("source_realpath", str(source_realpath), start_line, end_line)
    fallback_hash = record.get("content_hash") or _hash_content(str(record["content"]))
    return ("content_hash", str(fallback_hash), start_line, end_line)


def _record_from_vector_row(row: tuple[Any, ...]) -> dict[str, Any]:
    (
        chunk_id,
        file_path,
        source_realpath,
        language,
        content,
        content_hash,
        path_class,
        start_line,
        end_line,
        distance,
    ) = row
    return {
        "chunk_id": int(chunk_id),
        "file_path": file_path,
        "source_realpath": source_realpath,
        "language": language,
        "content": content,
        "content_hash": content_hash,
        "path_class": path_class,
        "start_line": start_line,
        "end_line": end_line,
        "distance": distance,
    }


def _record_from_chunk_row(row: tuple[Any, ...]) -> dict[str, Any]:
    (
        chunk_id,
        file_path,
        source_realpath,
        language,
        content,
        content_hash,
        path_class,
        start_line,
        end_line,
    ) = row
    return {
        "chunk_id": int(chunk_id),
        "file_path": file_path,
        "source_realpath": source_realpath,
        "language": language,
        "content": content,
        "content_hash": content_hash,
        "path_class": path_class,
        "start_line": start_line,
        "end_line": end_line,
        "distance": None,
    }


def _fetch_chunk_records(
    conn: sqlite3.Connection,
    chunk_ids: list[int],
) -> dict[int, dict[str, Any]]:
    if not chunk_ids:
        return {}

    placeholders = ",".join("?" for _ in chunk_ids)
    rows = conn.execute(
        f"""
        SELECT {_select_chunk_columns_with_id(conn)}
        FROM code_chunks_vec
        WHERE id IN ({placeholders})
        """,
        chunk_ids,
    ).fetchall()
    return {
        record["chunk_id"]: record
        for record in (_record_from_chunk_row(row) for row in rows)
    }


def _ranked_result(
    row: tuple[Any, ...],
    *,
    implementation_intent: bool,
    canonical_paths: list[str] | None = None,
) -> QueryResult:
    (
        file_path,
        _source_realpath,
        language,
        content,
        _content_hash,
        path_class,
        start_line,
        end_line,
        distance,
    ) = row
    raw_score = _l2_to_score(distance)
    score = raw_score
    ranking_signals: list[str] = []

    if implementation_intent:
        if path_class == "implementation":
            score += 0.05
            ranking_signals.append("implementation_boost")
        elif path_class == "spec_research":
            score -= 0.05
            ranking_signals.append("spec_research_penalty")
        elif path_class == "docs":
            score -= 0.05
            ranking_signals.append("docs_penalty")

    if canonical_paths and is_canonical_path(file_path, canonical_paths):
        score += 0.10
        ranking_signals.append("canonical_resource_boost")

    return QueryResult(
        file_path=file_path,
        language=language,
        content=content,
        start_line=start_line,
        end_line=end_line,
        score=score,
        raw_score=raw_score,
        path_class=path_class or "implementation",
        rankingSignals=ranking_signals,
    )


def _hybrid_ranked_result(
    fused: FusedRow,
    record: dict[str, Any],
    *,
    implementation_intent: bool,
    canonical_paths: list[str] | None = None,
) -> QueryResult:
    raw_score = fused.vector_score if fused.vector_score is not None else 0.0
    score = fused.rrf_score
    path_class = record.get("path_class") or "implementation"
    ranking_signals = ["hybrid_rrf"]

    if fused.vector_rank is not None:
        ranking_signals.append("vector_lane")
    if fused.fts_rank is not None:
        ranking_signals.append("fts5_lane")

    if implementation_intent:
        if path_class == "implementation":
            score += 0.05
            ranking_signals.append("implementation_boost")
        elif path_class == "spec_research":
            score -= 0.05
            ranking_signals.append("spec_research_penalty")
        elif path_class == "docs":
            score -= 0.05
            ranking_signals.append("docs_penalty")

    file_path = str(record["file_path"])
    if canonical_paths and is_canonical_path(file_path, canonical_paths):
        score += 0.10
        ranking_signals.append("canonical_resource_boost")

    return QueryResult(
        file_path=file_path,
        language=str(record["language"]),
        content=str(record["content"]),
        start_line=int(record["start_line"]),
        end_line=int(record["end_line"]),
        score=score,
        raw_score=raw_score,
        path_class=str(path_class),
        rankingSignals=ranking_signals,
        fts5_score=fused.fts_score,
        rrf_score=fused.rrf_score,
    )


def _dedup_and_rank_rows(
    rows: list[tuple[Any, ...]],
    *,
    query: str,
    canonical_paths: list[str] | None = None,
) -> tuple[list[QueryResult], int]:
    implementation_intent = _has_implementation_intent(query)
    ranked = [
        (
            _ranked_result(
                row,
                implementation_intent=implementation_intent,
                canonical_paths=canonical_paths,
            ),
            row,
        )
        for row in rows
    ]
    ranked.sort(key=lambda item: item[0].score, reverse=True)

    seen: set[tuple[str, str, int, int]] = set()
    unique: list[QueryResult] = []
    deduped_aliases = 0
    for result, row in ranked:
        key = _dedup_key(row)
        if key in seen:
            deduped_aliases += 1
            continue
        seen.add(key)
        unique.append(result)

    return unique, deduped_aliases


def _dedup_and_rank_hybrid_rows(
    fused_rows: list[FusedRow],
    records_by_id: dict[int, dict[str, Any]],
    *,
    query: str,
    canonical_paths: list[str] | None = None,
) -> tuple[list[QueryResult], int]:
    implementation_intent = _has_implementation_intent(query)
    ranked = [
        (
            _hybrid_ranked_result(
                fused,
                record,
                implementation_intent=implementation_intent,
                canonical_paths=canonical_paths,
            ),
            record,
        )
        for fused in fused_rows
        if (record := records_by_id.get(fused.chunk_id)) is not None
    ]
    ranked.sort(key=lambda item: item[0].score, reverse=True)

    seen: set[tuple[str, str, int, int]] = set()
    unique: list[QueryResult] = []
    deduped_aliases = 0
    for result, record in ranked:
        key = _dedup_key_from_record(record)
        if key in seen:
            deduped_aliases += 1
            continue
        seen.add(key)
        unique.append(result)

    return unique, deduped_aliases


def _window_results(
    candidates: list[QueryResult],
    *,
    limit: int,
    offset: int,
    deduped_aliases: int,
) -> QueryResults:
    window = candidates[offset : offset + limit]
    return QueryResults(
        window,
        deduped_aliases=deduped_aliases,
        unique_result_count=len(window),
    )


def _hybrid_vector_rows(
    conn: sqlite3.Connection,
    embedding_bytes: bytes,
    fetch_k: int,
    languages: list[str] | None,
    paths: list[str] | None,
) -> list[tuple[Any, ...]]:
    if paths:
        return _full_scan_query_with_ids(conn, embedding_bytes, fetch_k, 0, languages, paths)
    if not languages or len(languages) == 1:
        lang = languages[0] if languages else None
        return _knn_query_with_ids(conn, embedding_bytes, fetch_k, lang)
    return heapq.nsmallest(
        fetch_k,
        (
            row
            for lang in languages
            for row in _knn_query_with_ids(conn, embedding_bytes, fetch_k, lang)
        ),
        key=lambda row: row[9],
    )


async def query_codebase(
    query: str,
    target_sqlite_db_path: Path,
    env: Any,
    limit: int = 10,
    offset: int = 0,
    languages: list[str] | None = None,
    paths: list[str] | None = None,
    req_id: str | None = None,
) -> QueryResults:
    """
    Perform vector similarity search using vec0 KNN index.

    Uses sqlite-vec's vec0 virtual table for indexed nearest-neighbor search.
    Language filtering uses vec0 partition keys for exact index-level filtering.
    Path filtering triggers a full scan with distance computation.
    """
    if not target_sqlite_db_path.exists():
        raise RuntimeError(
            f"Index database not found at {target_sqlite_db_path}. "
            "Please run a query with refresh_index=True first."
        )

    db = env.get_context(SQLITE_DB)
    embedder = env.get_context(EMBEDDER)
    project_settings = env.get_context(PROJECT_SETTINGS)

    # Generate query embedding.
    stage_start = monotonic_ms()
    query_embedding = await embedder.embed(query, query_prompt_name)
    if req_id is not None:
        log_stage(
            logger,
            req_id=req_id,
            stage="embedding",
            duration_ms=elapsed_ms(stage_start),
        )

    embedding_bytes = query_embedding.astype("float32").tobytes()
    unique_k = max(limit + offset, 1)
    fetch_k = unique_k * 4

    stage_start = monotonic_ms()
    with db.readonly() as conn:
        if config.hybrid_enabled:
            vector_rows = _hybrid_vector_rows(conn, embedding_bytes, fetch_k, languages, paths)
            vector_records = {
                record["chunk_id"]: record
                for record in (_record_from_vector_row(row) for row in vector_rows)
            }
            vector_results = [
                RankedRow(
                    chunk_id=int(row[0]),
                    score=_l2_to_score(float(row[9])),
                )
                for row in vector_rows
            ]
            fts_rows = query_fts(
                conn,
                query,
                fetch_k,
                languages=languages,
                paths=paths,
            )
            fts_results = [
                RankedRow(chunk_id=chunk_id, score=bm25_score)
                for chunk_id, bm25_score in fts_rows
            ]
            fused_rows = rrf_fuse(
                vector_results,
                fts_results,
                k=config.hybrid_rrf_k,
                vector_weight=config.hybrid_vector_weight,
                fts_weight=config.hybrid_fts5_weight,
            )
            missing_ids = [
                fused.chunk_id
                for fused in fused_rows
                if fused.chunk_id not in vector_records
            ]
            records_by_id = {
                **vector_records,
                **_fetch_chunk_records(conn, missing_ids),
            }
            rows = []
        elif paths:
            rows = _full_scan_query(conn, embedding_bytes, fetch_k, 0, languages, paths)
        elif not languages or len(languages) == 1:
            lang = languages[0] if languages else None
            rows = _knn_query(conn, embedding_bytes, fetch_k, lang)
        else:
            rows = heapq.nsmallest(
                fetch_k,
                (
                    row
                    for lang in languages
                    for row in _knn_query(conn, embedding_bytes, fetch_k, lang)
                ),
                key=lambda r: r[8],
            )
    if req_id is not None:
        log_stage(
            logger,
            req_id=req_id,
            stage="index_lookup",
            duration_ms=elapsed_ms(stage_start),
            result_count=len(fused_rows) if config.hybrid_enabled else len(rows),
            lane=LANE_HYBRID_RRF if config.hybrid_enabled else LANE_VECTOR_ONLY,
        )

    stage_start = monotonic_ms()
    rerank_applied = False
    if config.hybrid_enabled:
        candidates, deduped_aliases = _dedup_and_rank_hybrid_rows(
            fused_rows,
            records_by_id,
            query=query,
            canonical_paths=project_settings.canonical_resource_paths,
        )
        if config.rerank_enabled:
            reranked_candidates = reranker.rerank(
                query,
                candidates,
                top_k=config.rerank_top_k,
                model_name=config.rerank_model,
            )
            rerank_applied = reranked_candidates is not candidates
            candidates = reranked_candidates
    else:
        candidates, deduped_aliases = _dedup_and_rank_rows(
            rows,
            query=query,
            canonical_paths=project_settings.canonical_resource_paths,
        )
    results = _window_results(
        candidates,
        limit=limit,
        offset=offset,
        deduped_aliases=deduped_aliases,
    )
    if req_id is not None:
        log_stage(
            logger,
            req_id=req_id,
            stage="rerank" if rerank_applied else "heuristic_rank",
            duration_ms=elapsed_ms(stage_start),
            result_count=len(results),
            lane=(
                LANE_HYBRID_RERANK
                if rerank_applied
                else LANE_HYBRID_RRF
                if config.hybrid_enabled
                else LANE_VECTOR_ONLY
            ),
        )
    return results
