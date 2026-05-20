"""Tests for mirror-aware hybrid deduplication."""

from __future__ import annotations

from typing import Any

from cocoindex_code.retrieval.fusion import FusedRow
from cocoindex_code.retrieval.query import _dedup_and_rank_hybrid_rows


MIRRORS = [".opencode/", ".codex/", ".gemini/", ".claude/"]


def _fused(chunk_id: int, score: float) -> FusedRow:
    return FusedRow(
        chunk_id=chunk_id,
        rrf_score=score,
        vector_rank=None,
        fts_rank=None,
        vector_score=score,
        fts_score=None,
    )


def _record(
    chunk_id: int,
    file_path: str,
    *,
    source_realpath: str = "/real/skills/example/file.py",
    content_hash: str = "hash-example",
    path_class: str = "implementation",
    start_line: int = 1,
    end_line: int = 10,
    content: str = "def example(): pass",
) -> dict[str, Any]:
    return {
        "chunk_id": chunk_id,
        "file_path": file_path,
        "source_realpath": source_realpath,
        "language": "python",
        "content": content,
        "content_hash": content_hash,
        "path_class": path_class,
        "start_line": start_line,
        "end_line": end_line,
    }


def _dedup(
    records: list[dict[str, Any]],
    scores: list[float] | None = None,
    *,
    mirror_prefixes: list[str] | None = None,
) -> tuple[list[str], int]:
    scores = scores or [1.0 - (index * 0.01) for index, _record_item in enumerate(records)]
    fused_rows = [_fused(record["chunk_id"], score) for record, score in zip(records, scores)]
    records_by_id = {record["chunk_id"]: record for record in records}
    results, deduped_aliases = _dedup_and_rank_hybrid_rows(
        fused_rows,
        records_by_id,
        query="plain lookup",
        canonical_mirror=".opencode",
        mirror_prefixes=MIRRORS if mirror_prefixes is None else mirror_prefixes,
    )
    return [result.file_path for result in results], deduped_aliases


def test_four_mirror_collapse_keeps_canonical_copy() -> None:
    records = [
        _record(1, ".gemini/skills/example/file.py"),
        _record(2, ".codex/skills/example/file.py"),
        _record(3, ".claude/skills/example/file.py"),
        _record(4, ".opencode/skills/example/file.py"),
    ]

    paths, deduped_aliases = _dedup(records, [0.99, 0.98, 0.97, 0.10])

    assert paths == [".opencode/skills/example/file.py"]
    assert deduped_aliases == 3


def test_canonical_absent_keeps_first_ranked_mirror_copy() -> None:
    records = [
        _record(1, ".gemini/skills/example/file.py"),
        _record(2, ".claude/skills/example/file.py"),
        _record(3, ".codex/skills/example/file.py"),
    ]

    paths, deduped_aliases = _dedup(records, [0.90, 0.80, 0.70])

    assert paths == [".gemini/skills/example/file.py"]
    assert deduped_aliases == 2


def test_mixed_mirror_and_non_mirror_same_stem_preserves_non_mirror() -> None:
    records = [
        _record(1, ".codex/skills/example/file.py"),
        _record(2, ".opencode/skills/example/file.py"),
        _record(
            3,
            "skills/example/file.py",
            source_realpath="/real/non-mirror/file.py",
            content_hash="hash-non-mirror",
        ),
    ]

    paths, deduped_aliases = _dedup(records, [0.90, 0.10, 0.50])

    assert paths == ["skills/example/file.py", ".opencode/skills/example/file.py"]
    assert deduped_aliases == 1


def test_empty_candidate_set_returns_empty_results() -> None:
    paths, deduped_aliases = _dedup([])

    assert paths == []
    assert deduped_aliases == 0


def test_single_candidate_is_unchanged() -> None:
    records = [_record(1, ".codex/skills/example/file.py")]

    paths, deduped_aliases = _dedup(records)

    assert paths == [".codex/skills/example/file.py"]
    assert deduped_aliases == 0


def test_empty_mirror_prefixes_disable_mirror_collapse() -> None:
    records = [
        _record(1, ".gemini/skills/example/file.py"),
        _record(2, ".opencode/skills/example/file.py"),
    ]

    paths, deduped_aliases = _dedup(records, [0.90, 0.80], mirror_prefixes=[])

    assert paths == [".gemini/skills/example/file.py"]
    assert deduped_aliases == 1


def test_mirror_collapse_does_not_depend_on_matching_source_realpath() -> None:
    records = [
        _record(
            1,
            ".gemini/skills/example/file.py",
            source_realpath="/mirror/gemini/skills/example/file.py",
        ),
        _record(
            2,
            ".opencode/skills/example/file.py",
            source_realpath="/mirror/opencode/skills/example/file.py",
        ),
    ]

    paths, deduped_aliases = _dedup(records, [0.90, 0.80])

    assert paths == [".opencode/skills/example/file.py"]
    assert deduped_aliases == 1


def test_hybrid_boosts_do_not_override_strong_rrf_lead() -> None:
    records = [
        _record(
            1,
            "docs/reference.md",
            content_hash="hash-docs",
            path_class="docs",
            source_realpath="/real/docs/reference.md",
        ),
        _record(
            2,
            ".opencode/skills/example/impl.py",
            content_hash="hash-impl",
            path_class="implementation",
            source_realpath="/real/skills/example/impl.py",
        ),
    ]
    fused_rows = [_fused(1, 0.10), _fused(2, 0.03)]
    records_by_id = {record["chunk_id"]: record for record in records}

    results, deduped_aliases = _dedup_and_rank_hybrid_rows(
        fused_rows,
        records_by_id,
        query="implementation lookup",
        canonical_paths=[".opencode/skills/**"],
        canonical_mirror=".opencode",
        mirror_prefixes=[],
    )

    assert [result.file_path for result in results] == [
        "docs/reference.md",
        ".opencode/skills/example/impl.py",
    ]
    assert deduped_aliases == 0
    assert results[0].score > results[1].score
