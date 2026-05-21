#!/usr/bin/env python3
"""Tests for spec-kit template stripping."""

from scripts.finetune.strip_templates import strip_templates


def test_removes_yaml_frontmatter():
    doc = "---\ntitle: Example\nflags:\n  - one\n---\n# Body\n"

    assert strip_templates(doc) == "# Body"


def test_removes_anchor_comments_only():
    doc = "<!-- ANCHOR:scope -->\nKeep this paragraph.\n<!-- /ANCHOR:scope -->\n"

    assert strip_templates(doc) == "Keep this paragraph."


def test_removes_speckit_comments():
    doc = "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->\nKeep.\n<!-- SPECKIT_LEVEL: 1 -->\n"

    assert strip_templates(doc) == "Keep."


def test_removes_numbered_all_caps_section_headers():
    doc = "Intro\n## 1. METADATA\nDetails\n## 2. PROBLEM & PURPOSE\nMore details\n## 3. Mixed Case\nKeep heading\n"

    stripped = strip_templates(doc)

    assert "## 1. METADATA" not in stripped
    assert "## 2. PROBLEM & PURPOSE" not in stripped
    assert "## 3. Mixed Case" in stripped
    assert "Details" in stripped


def test_removes_language_tagged_fence_delimiters_and_preserves_content():
    doc = "Before\n```bash\necho '<!-- ANCHOR:inside -->'\n```\nAfter\n"

    stripped = strip_templates(doc)

    assert "```bash" not in stripped
    assert "```\necho '<!-- ANCHOR:inside -->'\n```" in stripped
    assert "echo '<!-- ANCHOR:inside -->'" in stripped
    assert stripped.startswith("Before")
    assert stripped.endswith("After")


def test_keeps_untagged_fences_and_does_not_strip_anchor_strings_inside():
    doc = "Before\n```\n<!-- ANCHOR:not-template -->\nvalue\n```\nAfter\n"

    stripped = strip_templates(doc)

    assert "```\n<!-- ANCHOR:not-template -->\nvalue\n```" in stripped


def test_nested_anchors_are_removed_without_removing_content():
    doc = (
        "<!-- ANCHOR:outer -->\n"
        "Outer content\n"
        "<!-- ANCHOR:inner -->\n"
        "Inner content\n"
        "<!-- /ANCHOR:inner -->\n"
        "<!-- /ANCHOR:outer -->\n"
    )

    stripped = strip_templates(doc)

    assert "ANCHOR:" not in stripped
    assert "Outer content" in stripped
    assert "Inner content" in stripped


def test_unterminated_language_tagged_fence_preserves_remaining_content():
    doc = "Intro\n```python\nprint('still content')\n<!-- ANCHOR:inside -->\n"

    stripped = strip_templates(doc)

    assert "```python" not in stripped
    assert stripped.count("```") == 1
    assert "print('still content')" in stripped
    assert "<!-- ANCHOR:inside -->" in stripped


def test_multiline_frontmatter_is_removed():
    doc = "---\ntitle: Packet\n_memory:\n  continuity:\n    recent_action: test\n---\nBody\n"

    assert strip_templates(doc) == "Body"


def test_idempotent():
    doc = (
        "---\ntitle: Packet\n---\n"
        "<!-- SPECKIT_LEVEL: 1 -->\n"
        "<!-- ANCHOR:metadata -->\n"
        "## 1. METADATA\n"
        "Body with `inline` code.\n"
        "```ts\nconst anchor = '<!-- ANCHOR:inside -->';\n```\n"
        "<!-- /ANCHOR:metadata -->\n"
    )

    once = strip_templates(doc)

    assert strip_templates(once) == once
