#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: README REFERENCE RESOLVER REGRESSIONS
# ───────────────────────────────────────────────────────────────
"""Regression tests for filename templates and bracketed route folders."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest


SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

import check_readme_references as references  # type: ignore  # noqa: E402


@pytest.fixture
def root(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    """Return a small filesystem root without invoking Git."""
    monkeypatch.setattr(references, "tracked_names", lambda _root: (set(), {}))
    return tmp_path


def resolve(root: Path, raw: str) -> references.Resolution:
    """Resolve one inline path relative to the test root."""
    readme = root / "README.md"
    readme.write_text(f"`{raw}`\n", encoding="utf-8")
    parsed = references.extract_references(readme.read_text(encoding="utf-8"), readme, root)
    assert len(parsed) == 1
    return references.resolve_reference(parsed[0], readme, root)


def test_filename_placeholder_matches_a_file_in_its_folder(root: Path) -> None:
    changelog = root / "changelog"
    changelog.mkdir()
    (changelog / "v1.3.9.0.md").write_text("# Changelog\n", encoding="utf-8")

    result = resolve(root, "changelog/v[version].md")

    assert result.resolved


def test_bare_filename_placeholder_matches_a_file_in_a_child_folder(root: Path) -> None:
    changelog = root / "changelog"
    changelog.mkdir()
    (changelog / "v1.3.9.0.md").write_text("# Changelog\n", encoding="utf-8")

    result = resolve(root, "v[version].md")

    assert result.resolved


def test_filename_placeholder_fails_without_a_matching_file(root: Path) -> None:
    changelog = root / "changelog"
    changelog.mkdir()
    (changelog / "README.md").write_text("# Changelog index\n", encoding="utf-8")
    (changelog / "v1.3.9.0.md").mkdir()

    result = resolve(root, "changelog/v[version].md")

    assert not result.resolved
    assert result.detail == "path does not exist"


def test_bracketed_dynamic_route_folder_remains_a_checked_path(root: Path) -> None:
    page = root / "app" / "[id]" / "page.tsx"
    page.parent.mkdir(parents=True)
    page.write_text("export {};\n", encoding="utf-8")

    assert not references.is_placeholder("app/[id]/page.tsx")
    assert references.is_placeholder("[spec]/page.tsx")
    assert resolve(root, "app/[id]/page.tsx").resolved
    missing = resolve(root, "app/[id]/pagee.tsx")
    assert not missing.resolved
    assert missing.detail == "path does not exist"
