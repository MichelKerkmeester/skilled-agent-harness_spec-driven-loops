#!/usr/bin/env python3
"""
Regression tests for how validate_document.py types benchmark report companion
files and singular-named fixture folders.

A benchmark run folder holds a README plus companion files whose shape the
report contract owns, so they must not fall back to README rules and fail for a
missing Overview. A folder named `<something>-fixture` holds the shapes a test
reads, the same as a `fixtures` folder, so the validator skips it.

Run: python3 -m pytest -q test_benchmark_companion_typing.py
"""

import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(SCRIPTS_DIR))

from validate_document import detect_document_type, load_rules, should_exclude_path, validate_document  # type: ignore

RUN = ".skilled/skills/example-skill/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook"
COMPANIONS = ("failed-runs.md", "source.md", "skill-benchmark-report.md", "findings-and-recommendations.md")


def test_companion_files_in_a_run_folder_get_the_companion_type() -> None:
    rules = load_rules()
    grouped = ".skilled/skills/example-skill/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high"
    for name in COMPANIONS:
        assert detect_document_type(f"{RUN}/{name}", "", rules) == "benchmark_companion", name
        assert detect_document_type(f"{grouped}/{name}", "", rules) == "benchmark_companion", name


def test_run_readme_and_same_names_elsewhere_keep_their_type() -> None:
    rules = load_rules()
    assert detect_document_type(f"{RUN}/README.md", "", rules) == "readme"
    assert detect_document_type(".skilled/skills/example-skill/benchmark/reports/source.md", "", rules) != "benchmark_companion"
    assert detect_document_type(".skilled/skills/example-skill/benchmark/source.md", "", rules) != "benchmark_companion"
    assert detect_document_type(".skilled/skills/example-skill/references/source.md", "", rules) == "reference"


def test_generated_companion_shape_has_no_blocking_errors(tmp_path: Path) -> None:
    run = tmp_path / "benchmark" / "reports" / "2026-07-29--manual-testing-playbook--goal-hook"
    run.mkdir(parents=True)
    companion = run / "failed-runs.md"
    companion.write_text(
        "# Failed Runs\n\nNo scenario recorded a FAIL verdict.\n\n## Dimension scores\n\n| D | Score |\n|---|---|\n| D1 | 1 |\n",
        encoding="utf-8",
    )

    result = validate_document(str(companion), rules=load_rules())

    assert result["document_type"] == "benchmark_companion"
    assert result["blocking_errors"] == []
    assert not any(w["type"] == "document_type_fallback" for w in result["warnings"])


def test_singular_fixture_folder_is_skipped_but_a_numbered_packet_is_not() -> None:
    assert should_exclude_path(".skilled/skills/sk-x/scripts/review-output-fixture/heading-shape-valid.md")[0] is True
    assert should_exclude_path("specs/track/002-baseline-fixture/spec.md") == (False, None)
    assert should_exclude_path(".skilled/skills/sk-x/references/fixture-notes.md") == (False, None)
