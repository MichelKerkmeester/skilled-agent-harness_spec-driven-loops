#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: README REFERENCE RESOLVER REGRESSIONS
# ───────────────────────────────────────────────────────────────
"""Regression tests for filename templates, bracketed route folders, line citations and spaced paths."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest


SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

import audit_readmes as audit  # type: ignore  # noqa: E402
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


def resolve_all(root: Path, text: str) -> list[references.Resolution]:
    """Resolve every reference in a README kept one folder below the test root."""
    readme = root / "docs" / "README.md"
    readme.parent.mkdir(exist_ok=True)
    readme.write_text(text, encoding="utf-8")
    parsed = references.extract_references(text, readme, root)
    return [references.resolve_reference(item, readme, root) for item in parsed]


def test_line_citation_is_not_part_of_the_path(root: Path) -> None:
    (root / "lib").mkdir()
    (root / "lib" / "flow.md").write_text("flow\n", encoding="utf-8")

    for citation in (":352", ":26-69", ":60,68", ":60, 68"):
        results = resolve_all(root, f"See `../lib/flow.md{citation}`.\n")
        assert results and all(result.resolved for result in results), citation

    missing = resolve_all(root, "See `../lib/gone.md:352`.\n")
    assert [(item.reference.raw, item.resolved) for item in missing] == [("../lib/gone.md", False)]
    assert missing[0].detail == "path does not exist"


def test_line_citation_on_a_link_target_is_still_a_broken_link(root: Path) -> None:
    (root / "lib").mkdir()
    (root / "lib" / "flow.md").write_text("flow\n", encoding="utf-8")

    results = resolve_all(root, "[flow](../lib/flow.md:352)\n")

    assert [(item.reference.kind, item.resolved) for item in results] == [("link", False)]
    assert audit.extract_references("See `../lib/flow.md:352` and [flow](../lib/flow.md:352).") == {
        "../lib/flow.md",
        "../lib/flow.md:352",
    }


def test_code_span_naming_a_path_with_spaces_resolves_as_one_path(root: Path) -> None:
    (root / "claude project" / "knowledge").mkdir(parents=True)
    (root / "sync loop").mkdir()
    (root / "sync loop" / "systems.py").write_text("x\n", encoding="utf-8")

    for span in ("claude project/knowledge/", "../claude project/knowledge/", "sync loop/systems.py"):
        results = resolve_all(root, f"Read `{span}`.\n")
        assert results and all(result.resolved for result in results), span


def test_spaced_path_that_is_gone_and_command_lines_are_still_checked_per_path(root: Path) -> None:
    (root / "claude project").mkdir()
    (root / "tool.py").write_text("x\n", encoding="utf-8")

    gone = resolve_all(root, "Read `claude project/gone/`.\n")
    assert gone and not any(result.resolved for result in gone)

    command = resolve_all(root, "Run `python3 ../tool.py ../missing.md`.\n")
    assert {item.reference.raw: item.resolved for item in command} == {"../tool.py": True, "../missing.md": False}




def test_path_written_from_the_repository_root_resolves_from_a_nested_readme(root: Path) -> None:
    (root / "scripts").mkdir()
    (root / "scripts" / "sync.py").write_text("x\n", encoding="utf-8")
    (root / "bench" / "gates").mkdir(parents=True)

    for span in ("scripts/sync.py", "bench/gates/"):
        results = resolve_all(root, f"Run `{span}`.\n")
        assert results and all(result.resolved for result in results), span


def test_root_folder_head_does_not_hide_a_path_that_is_gone(root: Path) -> None:
    (root / "scripts").mkdir()
    (root / ".git" / "hooks").mkdir(parents=True)

    gone = resolve_all(root, "Run `scripts/gone.py`, `nowhere/tool.py` and `.git/hooks/`.\n")

    assert [(item.reference.raw, item.resolved) for item in gone] == [
        ("scripts/gone.py", False),
        ("nowhere/tool.py", False),
        (".git/hooks/", False),
    ]
