"""Migrate legacy vector storage to per-dimension tables."""

from __future__ import annotations

import logging
import sqlite3
from dataclasses import dataclass
from pathlib import Path

from cocoindex_code.schema import (
    DEFAULT_VECTOR_DIM,
    LEGACY_VECTOR_TABLES,
    _quote_identifier,
    _table_name_for_dim,
    table_exists,
)

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class PerDimTableMigrationResult:
    """Result of the per-dimension vector-table migration."""

    renamed_from: str | None = None
    target_table: str = _table_name_for_dim(DEFAULT_VECTOR_DIM)
    skipped_reason: str | None = None


def migrate_connection(conn: sqlite3.Connection) -> PerDimTableMigrationResult:
    """Rename one legacy vector table to ``vectors_768`` when needed.

    The migration is idempotent. If ``vectors_768`` already exists, legacy
    tables are retained and the new table remains authoritative.
    """
    target_table = _table_name_for_dim(DEFAULT_VECTOR_DIM)
    if table_exists(conn, target_table):
        legacy_present = [name for name in LEGACY_VECTOR_TABLES if table_exists(conn, name)]
        if legacy_present:
            logger.warning(
                "Per-dim migration found %s and legacy vector tables %s; using %s",
                target_table,
                ", ".join(legacy_present),
                target_table,
            )
        return PerDimTableMigrationResult(
            target_table=target_table,
            skipped_reason="target_exists",
        )

    legacy_sources = [name for name in LEGACY_VECTOR_TABLES if table_exists(conn, name)]
    if not legacy_sources:
        return PerDimTableMigrationResult(
            target_table=target_table,
            skipped_reason="no_legacy_table",
        )

    source_table = "vectors" if "vectors" in legacy_sources else legacy_sources[0]
    if len(legacy_sources) > 1:
        logger.warning(
            "Multiple legacy vector tables present (%s); migrating %s to %s",
            ", ".join(legacy_sources),
            source_table,
            target_table,
        )

    with conn:
        conn.execute(
            f"ALTER TABLE {_quote_identifier(source_table)} RENAME TO {_quote_identifier(target_table)}"
        )
    return PerDimTableMigrationResult(
        renamed_from=source_table,
        target_table=target_table,
    )


def migrate_db_path(db_path: Path) -> PerDimTableMigrationResult:
    """Run the per-dimension table migration against a SQLite database path."""
    if not db_path.exists():
        return PerDimTableMigrationResult(skipped_reason="db_missing")
    conn = sqlite3.connect(db_path)
    try:
        return migrate_connection(conn)
    finally:
        conn.close()

