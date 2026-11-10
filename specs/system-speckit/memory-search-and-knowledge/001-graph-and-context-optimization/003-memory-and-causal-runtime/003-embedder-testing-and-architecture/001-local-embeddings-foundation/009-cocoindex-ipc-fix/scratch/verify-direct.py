#!/usr/bin/env python3
"""Verify direct sqlite-vec KNN still works against target_sqlite.db."""

from __future__ import annotations

import sqlite3
from pathlib import Path

import sqlite_vec


ROOT = Path(__file__).resolve().parents[7]
DB_PATH = ROOT / ".cocoindex_code" / "target_sqlite.db"


def main() -> None:
    conn = sqlite3.connect(DB_PATH)
    conn.enable_load_extension(True)
    sqlite_vec.load(conn)

    query_embedding = conn.execute(
        "SELECT embedding FROM code_chunks_vec LIMIT 1"
    ).fetchone()[0]
    rows = conn.execute(
        """
        SELECT file_path, language, distance
        FROM code_chunks_vec
        WHERE embedding MATCH ? AND k = 3
        ORDER BY distance
        """,
        (query_embedding,),
    ).fetchall()

    if not rows:
        raise SystemExit("FAIL: no sqlite-vec KNN rows returned")

    print(f"PASS: sqlite-vec KNN returned {len(rows)} rows")
    for file_path, language, distance in rows:
        print(f"{distance:.6f}\t{language}\t{file_path}")


if __name__ == "__main__":
    main()
