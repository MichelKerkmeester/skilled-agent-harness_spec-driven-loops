#!/usr/bin/env python3
"""Regression tests for the render checks in validate_document.py.

The checks read rendered Markdown shape: joined bold labels, setext
underlines, bare URLs, a compound overview heading, an unorienting first
overview block, missing or out-of-order overview subsections, repeated
sentences and labels, H2 numbering and numbering sequence, section order,
section citations, an intro that restates its Purpose, and the three intro
checks: a missing hook, a hook that points at the content instead of a moment
to read the file, and a hook sentence that repeats the Purpose or the
frontmatter description. A finding is always a warning, so a document whose
only findings are render ones stays valid.

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


def test_cascade_control_reports_the_six_render_classes():
    rc, payload, types = render_types("web-cascade-and-selectors.md")
    assert set(types) == {
        "render_bold_label_join",
        "render_bare_url",
        "render_overview_heading",
        "render_overview_orientation",
        "render_overview_subsections",
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


def test_hard_break_labels_are_not_joined():
    _rc, _payload, types = render_types("negative-hard-break-labels.md")
    assert "render_bold_label_join" not in types
    _rc, _payload, types = render_types("web-cascade-and-selectors.md")
    assert "render_bold_label_join" in types


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


def test_unrelated_heading_is_not_the_related_section():
    _rc, _payload, types = render_types(
        "negative-reference-unrelated-before-related.md",
    )
    assert "render_section_order" not in types


def test_related_specs_heading_is_not_the_related_section():
    _rc, _payload, types = render_types(
        "negative-reference-related-specs-heading.md",
    )
    assert "render_section_order" not in types


def test_related_before_notes_is_still_out_of_order():
    _rc, _payload, types = render_types("reference-related-before-notes.md")
    assert "render_section_order" in types


def test_h2_sub_number_is_reported_once_as_a_sub_number():
    _rc, payload, types = render_types("reference-h2-sub-number.md")
    assert types.count("render_h2_numbering") == 1
    messages = [
        item["message"]
        for item in payload["warnings"]
        if item["type"] == "render_h2_numbering"
    ]
    assert "sub-number" in messages[0]


def test_h2_number_gap_and_repeat_are_reported():
    _rc, payload, types = render_types("negative-h2-sequence-gap-and-repeat.md")
    assert types.count("render_h2_sequence") == 2
    messages = [
        item["message"]
        for item in payload["warnings"]
        if item["type"] == "render_h2_sequence"
    ]
    assert messages == [
        "H2 number 3 follows 1; number sections 1, 2, 3 without gaps or repeats.",
        "H2 number 3 follows 3; number sections 1, 2, 3 without gaps or repeats.",
    ]


def test_h2_numbers_in_order_are_not_reported():
    _rc, _payload, types = render_types("negative-h2-sequence-in-order.md")
    assert "render_h2_sequence" not in types


def overview_subsection_findings(name):
    """The render_overview_subsections messages of one fixture."""
    _rc, payload, _types = render_types(name)
    return [
        item["message"]
        for item in payload["warnings"]
        if item["type"] == "render_overview_subsections"
    ]


def test_overview_without_purpose_names_the_missing_subsection():
    assert overview_subsection_findings("reference-overview-missing-purpose.md") == [
        'OVERVIEW has no "### Purpose" subsection; open it with Purpose then When to Use.'
    ]


def test_overview_with_purpose_then_when_to_use_is_clean():
    assert overview_subsection_findings("negative-reference-overview-subsections.md") == []


def test_overview_subsections_out_of_order_are_reported():
    assert overview_subsection_findings("reference-overview-subsection-order.md") == [
        'OVERVIEW subsections run out of order; put Purpose before When to Use.',
    ]


def section_reference_findings(name):
    """The render_section_reference messages of one fixture."""
    _rc, payload, _types = render_types(name)
    return [
        item["message"]
        for item in payload["warnings"]
        if item["type"] == "render_section_reference"
    ]


def test_citation_of_a_missing_section_is_reported():
    assert section_reference_findings("reference-section-reference-missing.md") == [
        '"§8 EXAMPLES" points at section 8, but this file has no section 8.',
    ]


def test_citation_matching_the_section_title_is_clean():
    assert section_reference_findings("negative-section-reference-match.md") == []


def test_citation_naming_the_wrong_title_is_reported():
    assert section_reference_findings("reference-section-reference-title-mismatch.md") == [
        '"§2 EXAMPLES" names EXAMPLES, but section 2 of this file is RULES.',
    ]


def test_citation_of_an_unresolvable_file_is_clean():
    assert section_reference_findings("negative-section-reference-unknown-file.md") == []


INTRO_TYPES = (
    "render_intro_missing",
    "render_intro_pointer",
    "render_intro_sentence_restates",
)


def intro_findings(name):
    """The intro-check findings of one fixture, as (type, message) pairs."""
    _rc, payload, _types = render_types(name)
    return [
        (item["type"], item["message"])
        for item in payload["warnings"]
        if item["type"] in INTRO_TYPES
    ]


def test_reference_without_an_intro_reports_a_missing_hook():
    assert intro_findings("reference-intro-missing.md") == [
        (
            "render_intro_missing",
            "No intro paragraph sits between the H1 and the first section; "
            "add a one- or two-sentence hook.",
        )
    ]


def test_missing_hook_is_reported_on_the_h1_line():
    _rc, payload, _types = render_types("reference-intro-missing.md")
    fixture = (RENDER / "reference-intro-missing.md").read_text().splitlines()
    h1 = next(number for number, line in enumerate(fixture, start=1) if line.startswith("# "))
    reported = [
        item["line_number"]
        for item in payload["warnings"]
        if item["type"] == "render_intro_missing"
    ]
    assert reported == [h1]


def test_intro_that_points_at_the_content_is_reported():
    assert intro_findings("reference-intro-pointer.md") == [
        (
            "render_intro_pointer",
            'The intro sentence "This reference explains the cache rules." '
            "points at the content instead of saying when to open the file; "
            "rewrite it as a hook.",
        )
    ]


def test_intro_sentence_copying_the_purpose_is_reported():
    (kind, message), = intro_findings("reference-intro-sentence-restates.md")
    assert kind == "render_intro_sentence_restates"
    assert "repeats the Purpose (1.00 overlap)" in message


def test_hook_intro_raises_none_of_the_three():
    assert intro_findings("negative-intro-hook.md") == []


def test_intro_checks_skip_document_types_that_do_not_opt_in():
    _rc, _payload, types = render_types("reference-intro-missing.md", "skill")
    assert [kind for kind in types if kind in INTRO_TYPES] == []


def test_related_commands_heading_must_close_the_document():
    _rc, _payload, types = render_types("reference-related-commands-before-workflow.md")
    assert "render_section_order" in types


def test_overview_subsections_after_another_subsection_are_reported():
    assert overview_subsection_findings("reference-overview-subsection-late.md") == [
        'OVERVIEW opens with "### Rules"; open it with Purpose then When to Use.',
    ]
