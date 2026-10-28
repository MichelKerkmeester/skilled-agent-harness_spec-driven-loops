#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: README CHECKER COMMAND, LABEL AND COUNT REGRESSIONS
# ───────────────────────────────────────────────────────────────
"""Pin the README checkers on slash commands, placeholders, link labels and count claims.

Each case names a mistake a README once carried, or a correct line the
checkers once misread. A stale command, mode, label, deleted file or count
must fail, and a placeholder, shortened link label or rate must not.

Usage: python3 -m pytest -q test_readme_checker_false_positives.py
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import pytest


SCRIPTS = Path(__file__).resolve().parents[2] / "sk-create-readme" / "scripts"
sys.path.insert(0, str(SCRIPTS))

import check_derived_readme_counts as counts  # type: ignore  # noqa: E402
import check_readme_references as references  # type: ignore  # noqa: E402


def write(path: Path, text: str = "") -> None:
    """Write ``text`` to ``path``, creating any missing parent folders."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def track(root: Path) -> None:
    """Stage every file in the checkout and forget cached listings."""
    subprocess.run(["git", "-c", "core.fsmonitor=false", "-C", str(root), "add", "-A"], check=True)
    references._TRACKED_NAMES.clear()


@pytest.fixture()
def repo(tmp_path: Path) -> Path:
    """A small checkout with a command tree, a doc folder and a README folder."""
    subprocess.run(["git", "-c", "core.fsmonitor=false", "init", "-q", str(tmp_path)], check=True)
    write(
        tmp_path / ".skilled" / "commands" / "create" / "changelog.md",
        '---\nargument-hint: "<target> [:auto|:confirm]"\n---\n# changelog\n',
    )
    write(tmp_path / "docs" / "guide" / "intro.md", "# intro\n")
    write(tmp_path / "pkg" / "run.sh", "#!/usr/bin/env bash\n")
    track(tmp_path)
    return tmp_path


def resolve(repo: Path, body: str) -> dict[str, object]:
    """Check a README holding ``body`` and map each reference to its resolution."""
    readme = repo / "pkg" / "README.md"
    write(readme, body)
    references._TRACKED_NAMES.clear()
    resolutions, missing = references.check_readme(str(readme))
    assert missing is None
    return {item.reference.raw: item for item in resolutions}


def assert_fails(found: dict[str, object], raw: str) -> None:
    assert raw in found, f"{raw!r} was not extracted: {sorted(found)}"
    assert not found[raw].resolved, found[raw].detail


def assert_passes(found: dict[str, object], raw: str) -> None:
    assert raw in found, f"{raw!r} was not extracted: {sorted(found)}"
    assert found[raw].resolved, found[raw].detail


# Slash commands resolve against the command tree.


def test_slash_command_resolves_and_a_missing_one_fails(repo: Path) -> None:
    found = resolve(repo, "Run `/create:changelog`, not `/create:nothing` or `/doc:quality`.\n")
    assert_passes(found, "/create:changelog")
    assert_fails(found, "/create:nothing")
    assert_fails(found, "/doc:quality")


def test_undeclared_command_mode_fails(repo: Path) -> None:
    found = resolve(repo, "```bash\n/create:changelog:auto\n/create:changelog:typo\n```\n")
    assert_passes(found, "/create:changelog:auto")
    assert_fails(found, "/create:changelog:typo")


def test_top_level_command_takes_a_mode(repo: Path) -> None:
    write(repo / ".skilled" / "commands" / "vision.md", '---\nargument-hint: "[:auto|:confirm]"\n---\n')
    found = resolve(repo, "Run `/vision:auto`, not `/vision:typo`, `/visoin:auto` or `/create:auto`.\n")
    assert_passes(found, "/vision:auto")
    assert_fails(found, "/vision:typo")
    assert_fails(found, "/visoin:auto")
    # A group folder is read first, so its missing command is not taken for a mode.
    assert_fails(found, "/create:auto")


def test_hyphen_command_typo_in_a_known_group_fails(repo: Path) -> None:
    found = resolve(repo, "Run `/create-changelog`, not `/create-changelg`. `/goal` is a built-in.\n")
    assert_passes(found, "/create-changelog")
    assert_fails(found, "/create-changelg")
    assert "/goal" not in found or found["/goal"].resolved


def test_hyphen_form_that_spells_no_command_is_not_a_typo(repo: Path) -> None:
    # A skill name that shares a group's prefix, or a route on a fenced line, is
    # not a command, so only a near spelling of a real command fails.
    write(repo / ".skilled" / "commands" / "deep" / "research.md", "# research\n")
    found = resolve(repo, "Use `/deep-dive`, not `/deep-reserch`.\n\n```text\nGET /deep-status\n```\n")
    assert_passes(found, "/deep-dive")
    assert_fails(found, "/deep-reserch")
    assert "/deep-status" not in found or found["/deep-status"].resolved


def test_commented_and_placeholder_commands_are_not_checked(repo: Path) -> None:
    found = resolve(
        repo,
        "<!-- run `/create:gone` -->\n"
        "<!--\n`/create:also-gone`\n-->\n"
        "Close a section with `<!-- /ANCHOR:id -->`.\n"
        "Type `/<command>` or `/create:<name>`, never `/create:nothing`.\n"
        "Legacy `/create:old` stays allowed.\n\n"
        "<!-- readme-check\nallow-ref /create:old | the retired name, quoted as history\n-->\n",
    )
    for raw in ("/create:gone", "/create:also-gone", "/ANCHOR:id", "/<command>", "/create:<name>"):
        assert raw not in found, f"{raw!r} was extracted"
    assert_fails(found, "/create:nothing")
    assert found["/create:old"].resolved and found["/create:old"].detail.startswith("allowed: ")


def test_checkout_without_a_command_tree_skips_commands(tmp_path: Path) -> None:
    subprocess.run(["git", "-c", "core.fsmonitor=false", "init", "-q", str(tmp_path)], check=True)
    found = resolve(tmp_path, "Run `/create:nothing`.\n")
    assert_passes(found, "/create:nothing")
    assert "no command tree" in found["/create:nothing"].detail


# Placeholders are not references.


def test_placeholder_paths_are_not_references(repo: Path) -> None:
    found = resolve(
        repo,
        "Run `path/to/document.md` against `[spec]/memory/*.md`, not `docs/missing.md`.\n"
        "A link to [a placeholder](path/to/file.md) is still followed.\n",
    )
    assert "path/to/document.md" not in found or found["path/to/document.md"].resolved
    assert "[spec]/memory/*.md" not in found or found["[spec]/memory/*.md"].resolved
    assert_fails(found, "docs/missing.md")
    assert_fails(found, "path/to/file.md")


def test_bracketed_folder_after_the_first_segment_is_a_real_path(repo: Path) -> None:
    # A dynamic-route folder such as `[id]/` is real, so a typo below it must fail.
    write(repo / "pkg" / "app" / "[id]" / "page.tsx")
    track(repo)
    found = resolve(repo, "Routes `app/[id]/page.tsx` and `app/[id]/pagee.tsx` from `[spec]/spec.md`.\n")
    assert_passes(found, "app/[id]/page.tsx")
    assert_fails(found, "app/[id]/pagee.tsx")
    assert "[spec]/spec.md" not in found or found["[spec]/spec.md"].resolved


# A code-span link label is a shortened name for its target.


def test_link_label_that_shortens_a_working_target_passes(repo: Path) -> None:
    found = resolve(
        repo,
        "| [`guide/intro.md`](../docs/guide/intro.md) | shortened |\n"
        "| [`global/core-standards.md`](../docs/guide/intro.md) | stale |\n"
        "| [`guide/gone.md`](../docs/guide/gone.md) | broken |\n",
    )
    assert_passes(found, "guide/intro.md")
    assert_fails(found, "global/core-standards.md")
    assert_fails(found, "guide/gone.md")
    assert_fails(found, "../docs/guide/gone.md")


# A bare name resolves only from a file still on disk.


def test_bare_name_of_a_tracked_file_deleted_from_disk_fails(repo: Path) -> None:
    gone = repo / "docs" / "gone.md"
    write(gone, "# gone\n")
    track(repo)
    gone.unlink()
    found = resolve(repo, "See `gone.md`, beside `intro.md`.\n")
    assert_fails(found, "gone.md")
    assert_passes(found, "intro.md")


# Count claims.


COUNT_CLAIMS = [
    ("singular modifier before a plural", "Holds 12 test files.\n", 12, "test"),
    ("singular modifier of another count term", "Holds 12 plugin scripts.\n", 12, "plugin"),
    ("label before the quantity", "Files: 12\n", 12, "files"),
    ("vague quantity with a singular modifier", "Contains several test files.\n", None, "test"),
    ("alternative after a slash", "Holds 7 files/folders in total.\n", 7, "files"),
]


SUBSET_PROSE = [
    ("adjective pair before the term", "Two compiled ESM entrypoints break under symlinks.\n"),
    ("qualified subset with a singular modifier", "It is consumed by four goal-plugin test files.\n"),
    ("count of additions", "This change adds 2 more test files.\n"),
    ("run result after a label", "- Tests: 20/20 pass\n"),
    ("run outcome word after a label", "Tests: 12 passing\n"),
]


@pytest.mark.parametrize("line", [case[1] for case in SUBSET_PROSE], ids=[case[0] for case in SUBSET_PROSE])
def test_subset_and_result_prose_is_not_a_count_claim(line: str) -> None:
    assert counts.line_claims(line) == []


@pytest.mark.parametrize(
    ("line", "value", "term"),
    [case[1:] for case in COUNT_CLAIMS],
    ids=[case[0] for case in COUNT_CLAIMS],
)
def test_count_claim_is_found(line: str, value: int | None, term: str) -> None:
    assert [(claim.value, claim.term) for claim in counts.line_claims(line)] == [(value, term)]


def test_rate_is_not_a_count_claim() -> None:
    assert counts.line_claims("Active cache management (max 300 files/session, 7-day TTL).\n") == []


def failing_lines(readme: Path, body: str) -> list[str]:
    write(readme, body)
    _claims, failures, missing = counts.check_readme(str(readme))
    assert missing is None
    return [claim.text for claim in failures]


@pytest.mark.parametrize(
    "names",
    [("a.test.mjs", "b.test.mjs"), ("test_a.py", "test_b.py"), ("a.test.sh", "test-b.sh")],
    ids=["node test module", "pytest module", "shell test script"],
)
def test_test_file_forms_count_as_tests(repo: Path, names: tuple[str, str]) -> None:
    folder = repo / "pkg" / "forms"
    for name in names + ("helper.mjs", "conftest.py", "util.sh"):
        write(folder / "suite" / name)
    assert failing_lines(folder / "README.md", "Two tests live in `suite/`.\n") == []


def test_tree_line_without_a_hash_counts_its_folder(repo: Path) -> None:
    folder = repo / "pkg" / "described"
    for name in ("tests/a.test.cjs", "tests/b.test.cjs", "tests/fixtures/payload.json"):
        write(folder / name)
    assert failing_lines(
        folder / "README.md",
        "```text\n"
        "described/\n"
        "+-- tests/ two Node test files plus payload fixtures\n"
        "`-- tests/ nine Node test files plus payload fixtures\n"
        "```\n",
    ) == ["`-- tests/ nine Node test files plus payload fixtures"]


def test_tree_comment_counts_its_folder_in_both_glyph_styles(repo: Path) -> None:
    folder = repo / "pkg" / "tree"
    for name in ("docs/a.md", "docs/b.md", "docs/deep/c.md", "docs/deep/d.md", "other/e.md",
                 "tests/s1.test.ts", "tests/s2.test.ts", "tests/deep/s3.test.ts", "lib/a.sh"):
        write(folder / name)
    assert failing_lines(
        folder / "README.md",
        "```\n"
        "tree/\n"
        "├── docs/                # Reference docs (4 files)\n"
        "│   └── deep/            # Nested docs (2 files)\n"
        "└── other/               # Spare docs (3 files)\n"
        "```\n\n"
        "```text\n"
        "tree/\n"
        "+-- tests/    # 3 vitest suites\n"
        "`-- lib/      # 2 scripts\n"
        "```\n",
    ) == ["└── other/               # Spare docs (3 files)", "`-- lib/      # 2 scripts"]


def test_named_folder_is_judged_by_its_own_count(repo: Path) -> None:
    # The README-folder categories are lenient on purpose; a folder the claim names
    # must match its own count, so three notes are not three scripts.
    folder = repo / "pkg" / "lenient"
    for name in ("docs/a.md", "docs/b.md", "docs/c.md", "alpha.ts", "beta.ts"):
        write(folder / name)
    assert failing_lines(
        folder / "README.md",
        "Three scripts live in `docs/`. Three files live in `docs/`.\n\n"
        "Two files live in `gone/`.\n\n"
        "| File | Role |\n|---|---|\n| `alpha.ts` | A |\n| `beta.ts` | B |\n",
    ) == [
        "Three scripts live in `docs/`. Three files live in `docs/`.",
        "Two files live in `gone/`.",
    ]
