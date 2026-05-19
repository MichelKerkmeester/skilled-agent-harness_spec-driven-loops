"""Data models and vector-table helpers for CocoIndex Code."""

# Modified by spec-kit-skilled-agent-orchestration: 009 packet REQ-001..006 (see ../NOTICE)
from dataclasses import dataclass
import re
import sqlite3
from typing import Any

DEFAULT_VECTOR_DIM = 768
SUPPORTED_VECTOR_DIMS = frozenset({768, 1024, 1536, 2048})
LEGACY_VECTOR_TABLES = ("vectors", "code_chunks_vec")
_VECTOR_TABLE_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


def _quote_identifier(identifier: str) -> str:
    """Quote a controlled SQLite identifier."""
    if not _VECTOR_TABLE_RE.fullmatch(identifier):
        raise ValueError(f"Unsafe SQLite identifier: {identifier!r}")
    return f'"{identifier}"'


def _table_name_for_dim(dim: int | None) -> str:
    """Return the model-wide vector table name for an embedder dimension."""
    if dim is None:
        raise ValueError("Embedder dimension is unknown; refusing to choose a vector table")
    if dim not in SUPPORTED_VECTOR_DIMS:
        supported = ", ".join(str(value) for value in sorted(SUPPORTED_VECTOR_DIMS))
        raise ValueError(f"Unsupported embedder dimension {dim}; supported dimensions: {supported}")
    return f"vectors_{dim}"


def table_exists(conn: sqlite3.Connection, table_name: str) -> bool:
    """Return True when a SQLite table or virtual table exists."""
    row = conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?",
        (table_name,),
    ).fetchone()
    return row is not None


def vector_tables(conn: sqlite3.Connection) -> list[str]:
    """List current vector tables, including legacy names pending migration."""
    rows = conn.execute(
        """
        SELECT name
        FROM sqlite_master
        WHERE type IN ('table', 'view')
          AND (name GLOB 'vectors_[0-9]*' OR name IN ('vectors', 'code_chunks_vec'))
        ORDER BY name
        """
    ).fetchall()
    return [str(row[0]) for row in rows]


def count_table_rows(conn: sqlite3.Connection, table_name: str) -> int:
    """Count rows in a controlled table name."""
    quoted = _quote_identifier(table_name)
    return int(conn.execute(f"SELECT COUNT(*) FROM {quoted}").fetchone()[0])


def resolve_existing_vector_table(
    conn: sqlite3.Connection,
    preferred_table: str,
) -> str:
    """Resolve the active vector table, allowing legacy fallback before migration."""
    if table_exists(conn, preferred_table):
        return preferred_table
    for legacy_table in LEGACY_VECTOR_TABLES:
        if table_exists(conn, legacy_table):
            return legacy_table
    return preferred_table


@dataclass
class CodeChunk:
    """Represents an indexed code chunk stored in SQLite."""

    id: int
    file_path: str
    source_realpath: str
    language: str
    content: str
    content_hash: str
    path_class: str
    start_line: int
    end_line: int
    embedding: Any  # NDArray - type hint relaxed for compatibility


@dataclass
class QueryResult:
    """Result from a vector similarity query."""

    file_path: str
    language: str
    content: str
    start_line: int
    end_line: int
    score: float
    raw_score: float
    path_class: str
    rankingSignals: list[str]
    fts5_score: float | None = None
    rrf_score: float | None = None
    pre_rerank_score: float | None = None
    reranker_score: float | None = None
