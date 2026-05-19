"""SQLite schema migrations for CocoIndex Code."""

from __future__ import annotations

from importlib import import_module

_per_dim_tables = import_module("cocoindex_code.migrations.001_per_dim_tables")

PerDimTableMigrationResult = _per_dim_tables.PerDimTableMigrationResult
migrate_connection = _per_dim_tables.migrate_connection
migrate_db_path = _per_dim_tables.migrate_db_path

__all__ = [
    "PerDimTableMigrationResult",
    "migrate_connection",
    "migrate_db_path",
]
