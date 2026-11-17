#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Changelog Shape Check Tests
# ---------------------------------------------------------------------------
"""Each shape rule passes at its ceiling and fails one past it.

The published v4.0.2.1 release entry is the model for readability and for the
testing section, so it must pass every rule as it stands. A ceiling it breaks
is the wrong ceiling.

Run: python3 -m pytest -q test_check_changelog_shape.py
"""

import subprocess
import sys
from pathlib import Path

SK_DOC = Path(__file__).resolve().parents[2]
REPO_ROOT = Path(__file__).resolve().parents[5]
CHECKER = SK_DOC / "sk-create-changelog" / "scripts" / "check_changelog_shape.py"
MODEL_ENTRY = REPO_ROOT / ".skilled" / "changelog" / "skilled" / "v4.0.2.1.md"

sys.path.insert(0, str(CHECKER.parent))
from check_changelog_shape import check_entry  # type: ignore  # noqa: E402

FRONTMATTER = '---\ntitle: "demo v1.0.0.0"\n---\n'


def expanded(glance=None, sections=None, spec="> Spec folder: `specs/demo/001-demo`", padding=0, checked=True, extra=""):
    """Build an expanded entry: glance bullets, then one topical H2 per (name, h4_count).

    The spec-folder line closes the entry, after an `&nbsp;` line, so padding
    and any extra text go in before it.
    """
    glance = glance if glance is not None else ["- **One gain.** It helps."]
    sections = sections if sections is not None else [("Alpha", 2)]
    parts = [FRONTMATTER, "Opening.\n", "&nbsp;\n", "## Why This Release\n", "The gap.\n"]
    parts += ["&nbsp;\n", "## What's New at a Glance\n", "\n".join(glance) + "\n"]
    for name, count in sections:
        parts += ["&nbsp;\n", f"## {name}\n"]
        parts += [f"#### Item {name} {n}\n\nOne paragraph.\n" for n in range(count)]
    if checked:
        parts += ["&nbsp;\n", "## How It Was Checked\n", "The suite passes.\n"]
    parts += ["&nbsp;\n", "## Upgrade Notes\n", "- **Anyone:** nothing to do.\n"]
    text = "\n".join(parts) + "\nFiller line.\n" * padding + extra
    return text + "\n&nbsp;\n\n" + spec + "\n"


def rules(text):
    violations, _notes = check_entry(text)
    return [rule for rule, _message in violations]


def body_lines(text):
    return len(text.splitlines()) - len(FRONTMATTER.splitlines())


def test_the_model_entry_passes_every_rule():
    violations, notes = check_entry(MODEL_ENTRY.read_text(encoding="utf-8"))
    assert violations == []
    assert notes == []


def test_an_expanded_entry_has_no_line_ceiling():
    base = expanded()
    long_entry = expanded(padding=(1000 - body_lines(base)) // 2)
    assert body_lines(long_entry) == 1000
    assert rules(long_entry) == []


def test_a_compact_entry_has_no_line_or_h4_rule():
    compact = FRONTMATTER + "Summary.\n\n&nbsp;\n\n## What's New at a Glance\n\n- **A fix.** It works.\n\n## Upgrade\n\nNo migration required.\n"
    assert rules(compact + "Filler line.\n" * 300) == []


def test_an_entry_has_no_h4_or_glance_ceiling():
    bullets = [f"- **Gain {n}.** It helps." for n in range(30)]
    assert rules(expanded(glance=bullets, sections=[("Alpha", 30), ("Beta", 30)])) == []


def test_glance_order_follows_the_tagged_sections():
    sections = [("Alpha", 1), ("Beta", 1)]
    in_order = ["- **First.** (Alpha) It helps.", "- **Second.** (Beta) It helps.", "- **Third.** (Beta) Too."]
    assert rules(expanded(glance=in_order, sections=sections)) == []
    reversed_order = ["- **First.** (Beta) It helps.", "- **Second.** (Alpha) It helps."]
    violations, _notes = check_entry(expanded(glance=reversed_order, sections=sections))
    assert [rule for rule, _ in violations] == ["glance-order"]
    assert "(Alpha) comes after (Beta)" in violations[0][1]


def test_glance_order_fails_an_untagged_bullet_or_an_unknown_section_once_tags_are_used():
    sections = [("Alpha", 1), ("Beta", 1)]
    mixed = ["- **First.** (Alpha) It helps.", "- **Second.** It has no tag."]
    assert rules(expanded(glance=mixed, sections=sections)) == ["glance-order"]
    unknown = ["- **First.** (Gamma) It helps."]
    assert rules(expanded(glance=unknown, sections=sections)) == ["glance-order"]


def test_spec_line_fails_a_level_label():
    assert rules(expanded(spec="> Spec folder: `specs/demo/001-demo` (Level 2)")) == ["spec-line"]
    assert rules(expanded(spec="> Spec folders: `specs/a` and `specs/b` (Level 2 and 3)")) == ["spec-line"]


def test_a_spec_line_inside_a_code_fence_is_not_read():
    fenced = expanded(extra="\n```markdown\n> Spec folder: `{path}` (Level {N})\n## Not A Section\n#### Not an item\n```\n")
    assert rules(fenced) == []


def test_spec_line_closes_the_entry_after_an_nbsp_line():
    """The old place, under the opening paragraph, fails both halves of the rule."""
    old_place = FRONTMATTER + "Opening.\n\n> Spec folder: `specs/demo/001-demo`\n\n## Changes\n\n- One fix.\n"
    assert rules(old_place) == ["spec-position", "spec-position"]
    no_nbsp = FRONTMATTER + "Opening.\n\n## Changes\n\n- One fix.\n\n> Spec folder: `specs/demo/001-demo`\n"
    assert rules(no_nbsp) == ["spec-position"]
    wrapped = expanded(spec="> Spec folder: `specs/demo/001-demo\\\n>/002-child`")
    assert rules(wrapped) == []


def test_one_spec_block_per_dated_section_may_precede_the_next_heading():
    section = "## 2026-11-01\n\nOne fix.\n\n&nbsp;\n\n> Spec folder: `specs/demo/{n}`\n"
    two = FRONTMATTER + section.format(n="001") + "\n" + section.format(n="002")
    assert rules(two) == []
    single = FRONTMATTER + section.format(n="001") + "\n## 2026-11-02\n\nAnother fix.\n"
    assert rules(single) == ["spec-position"]


def test_the_command_line_exits_0_1_and_2(tmp_path):
    good = tmp_path / "good.md"
    good.write_text(expanded(), encoding="utf-8")
    bad = tmp_path / "bad.md"
    bad.write_text(expanded(spec="> Spec folder: `specs/demo` (Level 1)"), encoding="utf-8")

    def run(*args):
        return subprocess.run([sys.executable, str(CHECKER), *args], capture_output=True, text=True, check=False)

    passed = run(str(good))
    assert passed.returncode == 0, passed.stdout
    assert "SUMMARY files=1 pass=1 fail=0" in passed.stdout
    failed = run(str(good), str(bad))
    assert failed.returncode == 1
    assert f"FAIL {bad}" in failed.stdout
    assert "[spec-line]" in failed.stdout
    assert run().returncode == 2
    assert run(str(tmp_path / "missing.md")).returncode == 2


def test_comment_tags_drive_the_order_rule():
    sections = [("Alpha", 1), ("Beta", 1)]
    in_order = ["- **A.** One. <!-- section: Alpha -->", "- **B.** Two. <!-- section: Beta -->"]
    assert rules(expanded(glance=in_order, sections=sections)) == []
    reversed_order = list(reversed(in_order))
    assert rules(expanded(glance=reversed_order, sections=sections)) == ["glance-order"]


def test_the_template_ceilings_match_the_checker():
    """The template's ceiling table and the checker constants must name the same numbers."""
    import re
    import check_changelog_shape as shape

    template = (SK_DOC / "sk-create-changelog" / "assets" / "changelog-template.md").read_text(encoding="utf-8")

    def ceiling(row):
        # The same row name also heads the keep-and-drop table, so take the row whose last cell holds a number.
        for text in template.splitlines():
            if text.startswith(f"| {row} |"):
                numbers = re.findall(r"\d+", text.split("|")[3])
                if numbers:
                    return int(numbers[0])
        raise AssertionError(f"no ceiling row named {row}")

    assert ceiling("Sentence") == shape.SENTENCE_MAX_WORDS
    assert ceiling("Sentence average") == shape.SENTENCE_MEAN_WORDS


def test_the_workflow_ceilings_match_the_checker():
    """A writer drafts from the workflow's ceiling line, so it must name the numbers the checker enforces."""
    import re
    import check_changelog_shape as shape

    for mode in ("auto", "confirm"):
        workflow = (REPO_ROOT / ".skilled" / "commands" / "create" / "assets" / f"create-changelog-{mode}.yaml").read_text(encoding="utf-8")
        line = workflow.split("Expanded ceilings", 1)[1]
        assert int(re.search(r"(\d+) words a sentence,", line).group(1)) == shape.SENTENCE_MAX_WORDS, mode
        assert int(re.search(r"(\d+) words a sentence on average", line).group(1)) == shape.SENTENCE_MEAN_WORDS, mode


def test_an_expanded_entry_needs_the_checked_section():
    assert rules(expanded(checked=False)) == ["checked-section"]
    compact = FRONTMATTER + "Summary.\n\n&nbsp;\n\n## What's New at a Glance\n\n- **One gain.** It helps.\n"
    assert rules(compact) == []


def test_a_sentence_fails_one_word_past_22():
    at_ceiling = " ".join(["word"] * 22) + "."
    assert rules(expanded(extra=at_ceiling + "\n")) == []
    assert rules(expanded(extra="word " + at_ceiling + "\n")) == ["sentence-max"]


def test_the_average_sentence_fails_past_10_words():
    # Long enough to pull the average up, short enough to stay under the single-sentence ceiling.
    long_run = (" ".join(["word"] * 20) + ".\n\n") * 40
    assert rules(expanded(extra=long_run)) == ["sentence-mean"]


def test_code_tables_and_quotes_are_not_prose():
    long_line = " ".join(["word"] * 30)
    not_prose = f"| {long_line} |\n\n> {long_line}\n\n```\n{long_line}\n```\n\nRun `{long_line}` now.\n"
    assert rules(expanded(extra=not_prose)) == []


def test_a_hard_wrapped_sentence_counts_as_one():
    words = ["word"] * 30
    wrapped = " ".join(words[:15]) + "\n" + " ".join(words[15:]) + ".\n"
    assert rules(expanded(extra=wrapped)) == ["sentence-max"]


def test_a_colon_does_not_end_a_sentence():
    long_tail = "Run this: " + " ".join(["word"] * 22) + ".\n"
    assert rules(expanded(extra=long_tail)) == ["sentence-max"]


def test_a_closing_quote_ends_the_sentence_it_closes():
    fifteen = " ".join(["word"] * 14)
    quoted = f'{fifteen} "PASS." {fifteen} end.\n'
    assert rules(expanded(extra=quoted)) == []


def test_an_ordered_list_number_is_not_a_sentence():
    items = "\n".join(f"{n}. " + " ".join(["word"] * 15) + "." for n in range(1, 21)) + "\n"
    assert rules(expanded(extra=items)) == ["sentence-mean"]


def glance_table(*sections):
    rows = [f"| [Change {n}](#c-change-{n}) | What it means. | {name} |" for n, name in enumerate(sections)]
    return ["| Change | What It Means | Section |", "|---|---|---|", *rows]


def test_glance_table_rows_follow_the_section_column():
    sections = [("Alpha", 1), ("Beta", 1)]
    assert rules(expanded(glance=glance_table("Alpha", "Beta", "Beta"), sections=sections)) == []
    violations, _notes = check_entry(expanded(glance=glance_table("Beta", "Alpha"), sections=sections))
    assert [rule for rule, _ in violations] == ["glance-order"]
    assert "(Alpha) comes after (Beta)" in violations[0][1]
    assert rules(expanded(glance=glance_table("Gamma"), sections=sections)) == ["glance-order"]


def test_a_glance_table_without_a_section_column_skips_the_order_rule():
    table = ["| Change | What It Means |", "|---|---|", "| One | It helps. |"]
    violations, notes = check_entry(expanded(glance=table, sections=[("Alpha", 1)]))
    assert violations == []
    assert notes == ["glance-order skipped: no glance row or bullet names a section"]


def test_a_spec_line_folded_in_a_details_block_still_closes_the_entry():
    folded = "<details>\n<summary><b>Spec folders (2)</b></summary>\n\n> Spec folders: specs/a, specs/b\n\n</details>"
    assert rules(expanded(spec=folded)) == []
    assert rules(expanded(spec=folded + "\n\nA closing line.")) == ["spec-position"]


def test_html_tag_lines_are_not_prose():
    """A summary or details line is not a short sentence that pulls the average down."""
    thirteen = (" ".join(["word"] * 13) + ".\n\n") * 40
    folds = "<details>\n<summary><b>Smaller fixes</b></summary>\n\n</details>\n\n" * 40
    assert rules(expanded(extra=thirteen + folds)) == ["sentence-mean"]


def test_consecutive_spec_lines_are_one_block():
    two = "> Spec folder: `specs/demo/001-a`\n> Spec folder: `specs/demo/002-b`"
    assert rules(expanded(spec=two)) == []
