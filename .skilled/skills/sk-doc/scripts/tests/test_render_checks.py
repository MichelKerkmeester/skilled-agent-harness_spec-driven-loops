#!/usr/bin/env python3
"""Regression tests for the render checks in validate_document.py.

The checks read rendered Markdown shape: joined bold labels, setext
underlines, bare URLs, a compound overview heading, an unorienting first
overview block, repeated sentences and labels, H2 numbering, section order
and an intro that restates its Purpose. A finding is always a warning, so a
document whose only findings are render ones stays valid.

Run: python3 -m pytest -q test_render_checks.py
"""

import json
import os
import subprocess
import sys
from pathlib import Path

TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
VALIDATOR = REPO / ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
RENDER = TESTS / "render"

POSITIVES = (
    "web-cascade-and-selectors.md",
    "web-markup-and-css.md",
    "web-performance-and-loading.md",
)


def render_types(name, doc_type="reference"):
    """Validate one fixture and return its exit code, payload and render types."""
    env = dict(os.environ, JEV_FEATURES="0")
    proc = subprocess.run(
        [sys.executable, "-B", str(VALIDATOR), str(RENDER / name), "--type", doc_type, "--json"],
        cwd=REPO,
        capture_output=True,
        text=True,
        check=False,
        env=env,
    )
    payload = json.loads(proc.stdout)
    warnings = payload.get("warnings", [])
    types = [item["type"] for item in warnings if item["type"].startswith("render_")]
    return proc.returncode, payload, types


def test_cascade_control_reports_the_five_render_classes():
    rc, payload, types = render_types("web-cascade-and-selectors.md")
    assert set(types) == {
        "render_bold_label_join",
        "render_bare_url",
        "render_overview_heading",
        "render_overview_orientation",
        "render_repeated_label",
    }
    assert payload["valid"] is True
    assert rc == 0


def test_markup_control_reports_setext_underline():
    rc, payload, types = render_types("web-markup-and-css.md")
    assert "render_setext_underline" in types
    assert payload["valid"] is True
    assert rc == 0


def test_performance_control_reports_repeated_sentence():
    rc, payload, types = render_types("web-performance-and-loading.md")
    assert "render_repeated_sentence" in types
    assert payload["valid"] is True
    assert rc == 0


def test_render_findings_stay_warnings_on_every_positive():
    for name in POSITIVES:
        _rc, payload, types = render_types(name)
        assert types, name
        assert payload["blocking_errors"] == [], name
        assert payload["valid"] is True, name


def test_list_item_labels_are_not_joined_or_repeated():
    _rc, _payload, types = render_types("negative-list-labels.md")
    assert "render_bold_label_join" not in types
    assert "render_repeated_label" not in types


def test_urls_in_a_fence_inline_code_and_autolink_are_not_bare():
    _rc, _payload, types = render_types("negative-urls.md")
    assert "render_bare_url" not in types


def test_placeholder_labels_are_skipped():
    _rc, _payload, types = render_types("negative-placeholder-labels.md")
    assert "render_bold_label_join" not in types
    assert "render_repeated_label" not in types


def test_shared_browser_triple_is_not_a_repeated_sentence():
    _rc, _payload, types = render_types("negative-shared-support-triple.md")
    assert "render_repeated_sentence" not in types


def test_setext_under_a_heading_list_item_and_table_row_is_ignored():
    _rc, _payload, types = render_types("negative-setext-contexts.md")
    assert "render_setext_underline" not in types


def test_router_related_before_machine_router_is_ordered():
    _rc, _payload, types = render_types(
        "negative-router-related-before-machine.md",
        "skill_router",
    )
    assert "render_section_order" not in types
