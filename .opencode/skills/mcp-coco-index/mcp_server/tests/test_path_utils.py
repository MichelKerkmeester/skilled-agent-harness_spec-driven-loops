"""Tests for mirror path helper utilities."""

from __future__ import annotations

from dataclasses import dataclass

from cocoindex_code.path_utils import (
    extract_path_stem,
    is_mirror_path,
    select_canonical_mirror_copy,
)


MIRRORS = [".opencode/", ".codex/", ".gemini/", ".claude/"]


@dataclass(frozen=True)
class Candidate:
    file_path: str
    chunk_id: int


def test_extract_path_stem_strips_matching_mirror_prefix() -> None:
    assert (
        extract_path_stem(".opencode/skills/example/file.py", MIRRORS)
        == "skills/example/file.py"
    )


def test_extract_path_stem_returns_original_without_mirror_match() -> None:
    assert extract_path_stem("src/example/file.py", MIRRORS) == "src/example/file.py"


def test_is_mirror_path_matches_configured_prefixes() -> None:
    assert is_mirror_path(".gemini/skills/example/file.py", MIRRORS) is True
    assert is_mirror_path("skills/example/file.py", MIRRORS) is False


def test_select_canonical_mirror_copy_prefers_canonical_when_present() -> None:
    canonical = Candidate(".opencode/skills/example/file.py", 3)
    codex = Candidate(".codex/skills/example/file.py", 1)
    gemini = Candidate(".gemini/skills/example/file.py", 2)

    winner, losers = select_canonical_mirror_copy(
        [codex, gemini, canonical],
        ".opencode",
        MIRRORS,
    )

    assert winner == canonical
    assert losers == [codex, gemini]


def test_select_canonical_mirror_copy_keeps_first_when_canonical_absent() -> None:
    gemini = Candidate(".gemini/skills/example/file.py", 9)
    claude = Candidate(".claude/skills/example/file.py", 1)

    winner, losers = select_canonical_mirror_copy(
        [gemini, claude],
        ".opencode",
        MIRRORS,
    )

    assert winner == gemini
    assert losers == [claude]


def test_select_canonical_mirror_copy_handles_single_candidate() -> None:
    only = Candidate(".codex/skills/example/file.py", 1)

    winner, losers = select_canonical_mirror_copy([only], ".opencode", MIRRORS)

    assert winner == only
    assert losers == []


def test_select_canonical_mirror_copy_handles_empty_input() -> None:
    winner, losers = select_canonical_mirror_copy([], ".opencode", MIRRORS)

    assert winner is None
    assert losers == []


def test_select_canonical_mirror_copy_stabilizes_multiple_canonical_by_chunk_id() -> None:
    later = Candidate(".opencode/skills/example/file.py", 5)
    earlier = Candidate(".opencode/skills/example/file.py", 2)

    winner, losers = select_canonical_mirror_copy([later, earlier], ".opencode", MIRRORS)

    assert winner == earlier
    assert losers == [later]
