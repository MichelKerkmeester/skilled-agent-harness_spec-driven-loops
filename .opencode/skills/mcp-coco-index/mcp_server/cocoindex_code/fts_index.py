"""SQLite FTS5 helpers for CocoIndex code chunks."""

from __future__ import annotations

import re
import sqlite3
from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from typing import Any

FTS_TABLE = "code_chunks_fts"
TOKEN_RE = re.compile(r"[A-Za-z0-9_./:-]+")


@dataclass(frozen=True)
class FtsChunkRow:
    """Chunk payload mirrored into the FTS5 table."""

    chunk_id: int
    content: str
    file_path: str
    language: str


def ensure_fts_table(conn: sqlite3.Connection) -> None:
    """Create the FTS5 virtual table used by lexical search."""
    conn.execute(
        """
        CREATE VIRTUAL TABLE IF NOT EXISTS code_chunks_fts
        USING fts5(
            content,
            file_path,
            language,
            tokenize='unicode61 remove_diacritics 2'
        )
        """
    )


def _coerce_fts_row(row: Sequence[Any] | FtsChunkRow) -> tuple[int, str, str, str]:
    if isinstance(row, FtsChunkRow):
        return (row.chunk_id, row.content, row.file_path, row.language)
    return (int(row[0]), str(row[1]), str(row[2]), str(row[3]))


def populate_fts(
    conn: sqlite3.Connection,
    chunk_rows: Iterable[Sequence[Any] | FtsChunkRow],
) -> None:
    """Insert or replace chunk rows into the FTS5 table.

    Rows are expected as ``(chunk_id, content, file_path, language)``.
    """
    ensure_fts_table(conn)
    conn.executemany(
        """
        INSERT OR REPLACE INTO code_chunks_fts(rowid, content, file_path, language)
        VALUES (?, ?, ?, ?)
        """,
        [_coerce_fts_row(row) for row in chunk_rows],
    )


def sync_fts_from_code_chunks(conn: sqlite3.Connection) -> None:
    """Mirror current ``code_chunks_vec`` rows into the FTS5 table."""
    source_table = conn.execute(
        "SELECT name FROM sqlite_master WHERE name = 'code_chunks_vec'"
    ).fetchone()
    if source_table is None:
        return

    ensure_fts_table(conn)
    conn.execute(
        """
        DELETE FROM code_chunks_fts
        WHERE rowid NOT IN (SELECT id FROM code_chunks_vec)
        """
    )
    conn.execute(
        """
        INSERT OR REPLACE INTO code_chunks_fts(rowid, content, file_path, language)
        SELECT id, content, file_path, language
        FROM code_chunks_vec
        """
    )


def _normalize_fts_query(query: str) -> str:
    """Convert user text into a safe, recall-oriented FTS5 query."""
    tokens = [token.strip() for token in TOKEN_RE.findall(query) if token.strip()]
    return " OR ".join(f'"{token}"' for token in tokens)


def query_fts(
    conn: sqlite3.Connection,
    query: str,
    limit: int,
    languages: list[str] | None = None,
    paths: list[str] | None = None,
) -> list[tuple[int, float]]:
    """Run a BM25 FTS5 search and return ``(chunk_id, score)`` tuples."""
    sanitized = _normalize_fts_query(query)
    if not sanitized or limit <= 0:
        return []

    ensure_fts_table(conn)
    conditions = ["code_chunks_fts MATCH ?"]
    params: list[Any] = [sanitized]

    if languages:
        placeholders = ",".join("?" for _ in languages)
        conditions.append(f"language IN ({placeholders})")
        params.extend(languages)

    if paths:
        path_clauses = " OR ".join("file_path GLOB ?" for _ in paths)
        conditions.append(f"({path_clauses})")
        params.extend(paths)

    params.append(limit)
    rows = conn.execute(
        f"""
        SELECT rowid AS chunk_id, -bm25(code_chunks_fts) AS bm25_score
        FROM code_chunks_fts
        WHERE {' AND '.join(conditions)}
        ORDER BY bm25_score DESC
        LIMIT ?
        """,
        params,
    ).fetchall()

    return [(int(row[0]), float(row[1] or 0.0)) for row in rows]
