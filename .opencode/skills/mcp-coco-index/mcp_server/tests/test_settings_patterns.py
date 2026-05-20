"""Tests for default file-pattern coverage."""

from __future__ import annotations

from cocoindex_code.config.settings import DEFAULT_INCLUDED_PATTERNS


def test_default_patterns_include_svelte_and_vue() -> None:
    assert "**/*.svelte" in DEFAULT_INCLUDED_PATTERNS
    assert "**/*.vue" in DEFAULT_INCLUDED_PATTERNS
