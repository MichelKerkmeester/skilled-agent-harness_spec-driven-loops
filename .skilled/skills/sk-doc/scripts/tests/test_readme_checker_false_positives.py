#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: README CHECKER FALSE-POSITIVE REGRESSIONS
# ───────────────────────────────────────────────────────────────
"""Pin the README reference and count checkers against their false-positive classes.

Each class below once failed real READMEs although nothing was wrong, so a
checker change that brings one back fails here. The last case for each
checker proves a real broken path or a real wrong count still fails.

Usage: python3 -m pytest -q test_readme_checker_false_positives.py
"""

from __future__ import annotations

import importlib.util
import subprocess
import sys
from pathlib import Path
from types import ModuleType

import pytest


TESTS = Path(__file__).resolve().parent
SCRIPTS = TESTS.parents[1] / "sk-create-readme" / "scripts"


def load(name: str) -> ModuleType:
    """Import a checker script by file name, since the scripts folder is not a package."""
    spec =importlib.util.spec_from_file_location(name, SCRIPTS / f"{name}.py")
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


references = load("check_readme_references")
counts = load("check_derived_readme_counts")


def write(path: Path, text: str = "") -> None:
    """Write ``text`` to ``path``, creating any missing parent folders."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def track(path: Path) -> None:
    """Stage every file under the checkout holding ``path``, since both checkers read tracked files only."""
    subprocess.run(["git", "-c", "core.fsmonitor=false", "-C", str(path), "add", "-A"], check=True)
    references.clear_caches()
    counts.clear_caches()


@pytest.fixture()
def repo(tmp_path: Path) -> Path:
    """A small checkout holding one example of every file a reference can name."""
    subprocess.run(["git", "-c", "core.fsmonitor=false", "init", "-q", str(tmp_path)], check=True)
    write(tmp_path / ".gitignore", ".claude/settings.local.json\noperator-notes.json\ntools/gen/modes.json\n")
    write(
        tmp_path / ".skilled" / "commands" / "create" / "changelog.md",
        '---\nargument-hint: "<target> [:auto|:confirm]"\n---\n# changelog\n',
    )
    write(tmp_path / "docs" / "guide.md", "# guide\n")
    write(tmp_path / "REPO RULES.md", "# rules\n")
    write(tmp_path / "src" / "tool.ts", "export {};\n")
    write(tmp_path / "templates" / "phase-parent.spec.md.tmpl", "# template\n")
    write(tmp_path / "pkg" / "run.sh", "#!/usr/bin/env bash\n")
    write(tmp_path / "other" / "lib" / "modes.json", "{}\n")
    track(tmp_path)
    return tmp_path


def resolve(repo: Path, body: str) -> dict[str, object]:
    """Check a README holding ``body`` and map each reference to its resolution."""
    readme = repo / "pkg" / "README.md"
    write(readme, body)
    references.clear_caches()
    resolutions, missing = references.check_readme(str(readme))
    assert missing is None
    return {item.reference.raw: item for item in resolutions}


REFERENCE_CLASSES = [
    ("slash command in the command tree", "Run `/create:changelog`.\n", "/create:changelog", False),
    ("bare filename", "See `guide.md`.\n", "guide.md", False),
    ("partial path", "See `docs/guide.md`.\n", "docs/guide.md", False),
    ("gitignored path", "Edit `.claude/settings.local.json`.\n", ".claude/settings.local.json", True),
    ("bare name a slash-free ignore pattern names", "Edit `operator-notes.json`.\n", "operator-notes.json", True),
    ("home-directory path", "Add it to `~/.zshrc`.\n", "~/.zshrc", True),
    ("absolute path outside the checkout", "Run `/opt/elsewhere/run.sh`.\n", "/opt/elsewhere/run.sh", True),
    ("filename with a space", "Read `REPO RULES.md`.\n", "REPO RULES.md", False),
    ("compiled script with a TypeScript source", "Run `tool.js`.\n", "tool.js", False),
    ("anchored shell assignment value", "Set `CONFIG=docs/guide.md`.\n", "docs/guide.md", False),
    ("path/to placeholder", "Run `path/to/document.md`.\n", "path/to/document.md", True),
    ("bracketed placeholder segment", "Not `[spec]/memory/*.md`.\n", "[spec]/memory/*.md", True),
    ("spec doc shipped as a template", "Use `phase-parent.spec.md`.\n", "phase-parent.spec.md", False),
    ("config a doctor command creates", "Edit `.sk-git/` rules.\n", ".sk-git/", True),
    ("quality config a doctor command creates", "Edit `.sk-code/quality.json`.\n", ".sk-code/quality.json", True),
]


@pytest.mark.parametrize(
    ("body", "raw", "skipped"),
    [case[1:] for case in REFERENCE_CLASSES],
    ids=[case[0] for case in REFERENCE_CLASSES],
)
def test_reference_class_is_not_reported(repo: Path, body: str, raw: str, skipped: bool) -> None:
    found = resolve(repo, body)
    assert raw in found, f"{raw!r} was not extracted: {sorted(found)}"
    assert found[raw].resolved, found[raw].detail
    assert found[raw].skipped is skipped, found[raw].detail


def test_fence_comment_is_not_a_reference(repo: Path) -> None:
    found = resolve(repo, "```bash\n./run.sh  # writes out/report.md\n```\n")
    assert sorted(found) == ["./run.sh"]
    assert found["./run.sh"].resolved


def test_real_broken_references_still_fail(repo: Path) -> None:
    found = resolve(
        repo,
        "See `docs/missing.md` and run `/create:nothing`.\n\n```bash\n./missing.sh\n```\n",
    )
    for raw in ("docs/missing.md", "/create:nothing", "./missing.sh"):
        assert raw in found, f"{raw!r} was not extracted: {sorted(found)}"
        # getattr keeps this case runnable against a checker that predates skipping.
        assert not found[raw].resolved and not getattr(found[raw], "skipped", False), found[raw].detail


def assert_fails(found: dict[str, object], raw: str) -> None:
    """Assert ``raw`` was extracted and reported as a real failure, not resolved or skipped."""
    assert raw in found, f"{raw!r} was not extracted: {sorted(found)}"
    assert not found[raw].resolved and not found[raw].skipped, found[raw].detail


def test_broken_local_path_does_not_borrow_a_namesake(repo: Path) -> None:
    # The first segment exists beside the README, so the path is local and must resolve there.
    write(repo / "other" / "references" / "commit-workflows.md", "# elsewhere\n")
    write(repo / "pkg" / "references" / "present.md", "# here\n")
    found = resolve(repo, "See `references/commit-workflows.md`.\n")
    assert_fails(found, "references/commit-workflows.md")


def test_multi_segment_path_never_matches_by_tail(repo: Path) -> None:
    # Neither the README folder nor the root holds the path, only a deeper folder does.
    write(repo / "other" / "notes" / "plan.md", "# elsewhere\n")
    found = resolve(repo, "See `notes/plan.md`.\n")
    assert_fails(found, "notes/plan.md")


def test_hyphen_command_typo_in_a_known_group_fails(repo: Path) -> None:
    found = resolve(repo, "Run `/create-changelog`, not `/create-changelg`, and `/goal`.\n")
    assert found["/create-changelog"].resolved and not found["/create-changelog"].skipped
    assert_fails(found, "/create-changelg")
    assert found["/goal"].resolved and found["/goal"].skipped


def test_undeclared_command_mode_fails(repo: Path) -> None:
    found = resolve(repo, "Run `/create:changelog:auto`, not `/create:changelog:typo`.\n")
    assert found["/create:changelog:auto"].resolved, found["/create:changelog:auto"].detail
    assert_fails(found, "/create:changelog:typo")


def test_code_label_of_a_working_link_is_not_checked(repo: Path) -> None:
    # The label names a path that exists nowhere; only the link target is followed.
    found = resolve(
        repo,
        "| [`guide/README.md`](../docs/guide.md) | doc |\n"
        "| [`broken/README.md`](../docs/missing.md) | doc |\n"
        "Outside a link `loose/README.md` is still a path.\n",
    )
    label = found["guide/README.md"]
    assert label.resolved and not label.skipped, label.detail
    assert found["../docs/guide.md"].resolved
    assert_fails(found, "../docs/missing.md")
    assert_fails(found, "broken/README.md")
    assert_fails(found, "loose/README.md")


def test_top_level_command_takes_a_mode(repo: Path) -> None:
    write(
        repo / ".skilled" / "commands" / "vision.md",
        '---\nargument-hint: "[:auto|:confirm]"\n---\n# vision\n',
    )
    found = resolve(
        repo,
        "Run `/vision:auto`, not `/vision:typo`, `/visoin:auto` or `/create:auto`.\n",
    )
    assert found["/vision:auto"].resolved and not found["/vision:auto"].skipped, found["/vision:auto"].detail
    assert_fails(found, "/vision:typo")
    assert_fails(found, "/visoin:auto")
    # A group folder is read first, so its missing command is not mistaken for a mode.
    assert_fails(found, "/create:auto")


def test_tracked_file_deleted_from_disk_fails(repo: Path) -> None:
    gone = repo / "docs" / "gone.md"
    write(gone, "# gone\n")
    subprocess.run(["git", "-c", "core.fsmonitor=false", "-C", str(repo), "add", "docs/gone.md"], check=True)
    gone.unlink()
    found = resolve(repo, "See `gone.md`.\n")
    assert_fails(found, "gone.md")


COUNT_CLAIMS = [
    ("singular modifier before a plural", "Holds 12 test files.\n", 12, "test"),
    ("singular modifier of another count term", "Holds 12 plugin scripts.\n", 12, "plugin"),
    ("label before the quantity", "Files: 12\n", 12, "files"),
    ("vague quantity with a singular modifier", "Contains several test files.\n", None, "test"),
]


@pytest.mark.parametrize(
    ("line", "value", "term"),
    [case[1:] for case in COUNT_CLAIMS],
    ids=[case[0] for case in COUNT_CLAIMS],
)
def test_count_claim_is_found(line: str, value: int | None, term: str) -> None:
    assert [(claim.value, claim.term) for claim in counts.line_claims(line)] == [(value, term)]


COUNT_NON_CLAIMS = [
    ("single item", "Only a trivial fix of a few characters in one file is exempt.\n"),
    ("number elsewhere on the line", "Gate 3 asks for a spec folder before any file change.\n"),
    ("singular modifier of another noun", "It routes to fifteen workflow modes and a Level 2 file set.\n"),
    ("threshold", "The hook blocks a push that deletes more than 100 tracked files at once.\n"),
    ("compound adjective", "A 9-step workflow covers the work.\n"),
    ("number inside an assignment", "Set `PLUGIN_DISABLED=1` for the OpenCode plugin alone.\n"),
    ("rate or limit", "Active cache management (max 300 files/session, 7-day TTL).\n"),
]


@pytest.mark.parametrize("line", [case[1] for case in COUNT_NON_CLAIMS], ids=[case[0] for case in COUNT_NON_CLAIMS])
def test_count_non_claim_is_ignored(line: str) -> None:
    assert counts.line_claims(line) == []


def count_readme(folder: Path, sentence: str) -> tuple[list, list]:
    write(folder / "alpha.ts")
    write(folder / "beta.ts")
    readme = folder / "README.md"
    write(readme, f"{sentence}\n\n| File | Role |\n|---|---|\n| `alpha.ts` | A |\n| `beta.ts` | B |\n")
    track(folder)
    claims, failures, missing = counts.check_readme(str(readme))
    assert missing is None
    return claims, failures


def test_right_count_passes(repo: Path) -> None:
    claims, failures = count_readme(repo / "pkg" / "right", "Two files live here.")
    assert len(claims) == 1 and failures == []


def test_wrong_count_still_fails(repo: Path) -> None:
    claims, failures = count_readme(repo / "pkg" / "wrong", "Three files live here.")
    assert len(claims) == 1 and len(failures) == 1
    assert failures[0].value == 3 and failures[0].term == "files"


def verdicts(readme: Path, body: str) -> list[tuple[int | None, str, str]]:
    """Write ``body`` to ``readme`` and return (value, term, verdict) for each claim."""
    write(readme, body)
    track(readme.parent)
    report = counts.classify_readme(str(readme))
    assert report.missing is None
    return [(item.claim.value, item.claim.term, item.verdict) for item in report.judgements]


@pytest.fixture()
def named(repo: Path) -> Path:
    """A README folder beside a ``tools/`` folder that holds two scripts and a note."""
    folder = repo / "pkg" / "named"
    for name in ("one.sh", "two.py", "notes.md"):
        write(folder / "tools" / name)
    return folder


def test_named_folder_right_count_passes(named: Path) -> None:
    # The span resolves from the README folder first and from the repository root second.
    found = verdicts(
        named / "README.md",
        "Two scripts sit under `tools/`. Three files sit in `pkg/named/tools/`.\n",
    )
    assert found == [(2, "scripts", "pass"), (3, "files", "pass")]


def test_named_folder_wrong_count_fails(named: Path) -> None:
    found = verdicts(named / "README.md", "Retrieval runs from four scripts under `tools/`.\n")
    assert found == [(4, "scripts", "fail")]


def test_claim_without_a_folder_is_unverified_and_fails(named: Path) -> None:
    # Unverified stays its own verdict for diagnosis, but no number proves it, so it fails.
    found = verdicts(
        named / "README.md",
        "Two example files list them.\n\n"
        "| Symptom | Cause |\n|---|---|\n| A field differs | The two files are different classes |\n",
    )
    assert found == [(2, "files", "unverified"), (2, "files", "unverified")]
    claims, failures, missing = counts.check_readme(str(named / "README.md"))
    assert missing is None and len(claims) == 2 and len(failures) == 2


def test_allow_count_covers_a_deliberate_unverified_claim(named: Path) -> None:
    found = verdicts(
        named / "README.md",
        "Two example files list them. The two files differ.\n\n"
        "<!-- readme-check\nallow-count two example files | the next two bullets name both files\n-->\n",
    )
    assert found == [(2, "files", "pass"), (2, "files", "unverified")]
    claims, failures, missing = counts.check_readme(str(named / "README.md"))
    assert missing is None and [claim.text for claim in failures] == ["Two example files list them. The two files differ."]


def test_unverified_claim_fails_by_default_and_strict_is_an_alias(named: Path) -> None:
    readme = named / "README.md"
    write(readme, "Two example files list them.\n")
    script = SCRIPTS / "check_derived_readme_counts.py"
    default = subprocess.run([sys.executable, str(script), str(readme)], capture_output=True, text=True)
    strict = subprocess.run([sys.executable, str(script), "--strict", str(readme)], capture_output=True, text=True)
    assert default.returncode == 1, default.stdout
    assert "unverified=1" in default.stdout
    assert strict.returncode == 1, strict.stdout
    assert "unverified=1" in strict.stdout


def test_tree_line_counts_its_folder(repo: Path) -> None:
    folder = repo / "pkg" / "tree"
    for name in ("docs/a.md", "docs/b.md", "docs/deep/c.md", "docs/deep/d.md", "other/e.md"):
        write(folder / name)
    found = verdicts(
        folder / "README.md",
        "```\n"
        "tree/\n"
        "├── docs/                # Reference docs (4 files)\n"
        "│   └── deep/            # Nested docs (2 files)\n"
        "└── other/               # Spare docs (3 files)\n"
        "```\n",
    )
    assert found == [(4, "files", "pass"), (2, "files", "pass"), (3, "files", "fail")]


def test_mid_word_hash_does_not_open_a_fence_comment(repo: Path) -> None:
    # The shell reads `build#12` as one word, so the path after it is still a command argument.
    found = resolve(repo, "```bash\necho build#12 .skilled/missing/gone.md\n```\n")
    assert_fails(found, ".skilled/missing/gone.md")


def test_fence_comment_still_checks_anchored_paths(repo: Path) -> None:
    found = resolve(
        repo,
        "```text\n"
        "run.sh   # wraps .skilled/missing/gone.sh\n"
        "run.sh   # reads docs/guide.md and docs/absent.md, writes out/report.md\n"
        "```\n",
    )
    assert_fails(found, ".skilled/missing/gone.sh")
    assert found["docs/guide.md"].resolved and not found["docs/guide.md"].skipped
    assert_fails(found, "docs/absent.md")
    # `out/` exists nowhere, so the comment names no anchored path there.
    assert "out/report.md" not in found


def test_on_demand_config_matches_exact_tokens_only(repo: Path) -> None:
    found = resolve(repo, "Edit `.sk-code/qualty.json` or `.sk-git/hooks.json`.\n")
    assert_fails(found, ".sk-code/qualty.json")
    assert_fails(found, ".sk-git/hooks.json")


def test_untracked_file_does_not_resolve_a_bare_name(repo: Path) -> None:
    write(repo / "notes" / "local-only.json", "{}\n")
    found = resolve(repo, "Read `local-only.json`.\n")
    assert_fails(found, "local-only.json")


def test_ignore_pattern_with_a_slash_does_not_skip_its_basename(repo: Path) -> None:
    # `tools/gen/modes.json` ignores one path; a tracked `modes.json` elsewhere is unrelated.
    found = resolve(repo, "Edit `tools/gen/modes.json`, not `modes.json` or `gone-modes.json`.\n")
    assert found["tools/gen/modes.json"].skipped, found["tools/gen/modes.json"].detail
    assert found["modes.json"].resolved and not found["modes.json"].skipped, found["modes.json"].detail
    assert_fails(found, "gone-modes.json")
    assert "modes.json" not in references.gitignored_names(repo.resolve())


def test_anchored_label_of_a_working_link_is_checked(repo: Path) -> None:
    found = resolve(
        repo,
        "[`../old/guide.md`](../docs/guide.md) and [`../docs/guide.md`](../docs/guide.md)\n",
    )
    assert_fails(found, "../old/guide.md")
    assert found["../docs/guide.md"].resolved


def test_html_comment_tokens_are_not_references(repo: Path) -> None:
    found = resolve(
        repo,
        "Close with `<!-- /ANCHOR:id -->`.\n"
        "<!-- see `gone.md` and /ANCHOR:other -->\n"
        "<!--\n`also-gone.md` and [link](./gone-too.md)\n-->\n"
        "A quoted `<!--` opens nothing, so `docs/missing.md` is still read.\n"
        "Legacy `old-ns/` stays allowed.\n\n"
        "<!-- readme-check\nallow-ref old-ns/ | a git branch namespace, not a folder\n-->\n",
    )
    for raw in ("/ANCHOR:id", "/ANCHOR:other", "gone.md", "also-gone.md", "./gone-too.md"):
        assert raw not in found, f"{raw!r} inside an HTML comment was extracted"
    assert_fails(found, "docs/missing.md")
    assert found["old-ns/"].resolved and found["old-ns/"].detail.startswith("allowed: ")


def test_shell_assignment_value_is_checked_only_when_anchored(repo: Path) -> None:
    found = resolve(
        repo,
        "```bash\n"
        'NOTE_PATH="Daily/2026-08-02.md" bash run.sh\n'
        "CONFIG=docs/missing.md DATA=.skilled/gone.json bash run.sh\n"
        "```\n",
    )
    assert "Daily/2026-08-02.md" not in found
    assert_fails(found, "docs/missing.md")
    assert_fails(found, ".skilled/gone.json")


def test_quality_control_readme_needs_no_slash_command_allowance() -> None:
    # The skill has no slash command, so its README must not need an allowance to mention one.
    readme = TESTS.parents[1] / "sk-create-quality-control" / "README.md"
    references.clear_caches()
    resolutions, missing = references.check_readme(str(readme))
    assert missing is None
    assert [item.reference.raw for item in resolutions if not item.resolved] == []
    assert [item.reference.raw for item in resolutions if item.detail.startswith("allowed: ")] == []
    assert "/doc:quality" not in {item.reference.raw for item in resolutions}


def test_plain_text_tree_line_counts_its_folder(repo: Path) -> None:
    folder = repo / "pkg" / "ascii"
    for name in ("tests/s1.test.ts", "tests/s2.test.ts", "tests/deep/s3.test.ts", "lib/a.sh"):
        write(folder / name)
    found = verdicts(
        folder / "README.md",
        "```text\n"
        "ascii/\n"
        "+-- tests/    # 3 vitest suites\n"
        "|   `-- deep/ # 1 vitest suite\n"
        "`-- lib/      # 2 scripts\n"
        "```\n",
    )
    assert found == [(3, "suites", "pass"), (1, "suite", "pass"), (2, "scripts", "fail")]


def test_untracked_file_does_not_change_a_count(named: Path) -> None:
    found = verdicts(named / "README.md", "Three files sit in `tools/`.\n")
    assert found == [(3, "files", "pass")]
    # A local file another checkout lacks must not turn the same README red here.
    write(named / "tools" / "scratch.sh")
    counts.clear_caches()
    report = counts.classify_readme(str(named / "README.md"))
    assert [item.verdict for item in report.judgements] == ["pass"]


def test_tracked_files_are_listed_once_per_run(named: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    readme = named / "README.md"
    write(readme, "Two scripts sit under `tools/`. Three files sit in `tools/`. Two scripts again in `tools/`.\n")
    track(readme.parent)
    calls: list[list[str]] = []
    real_run = subprocess.run

    def counting_run(command, *args, **kwargs):
        if "ls-files" in command:
            calls.append(command)
        return real_run(command, *args, **kwargs)

    monkeypatch.setattr(counts.subprocess, "run", counting_run)
    report = counts.classify_readme(str(readme))
    assert [item.verdict for item in report.judgements] == ["pass", "pass", "pass"]
    assert len(calls) == 1, calls


def test_tree_entry_description_without_a_hash_counts_its_folder(repo: Path) -> None:
    folder = repo / "pkg" / "described"
    for name in ("tests/a.test.cjs", "tests/b.test.cjs", "tests/fixtures/payload.json"):
        write(folder / name)
    found = verdicts(
        folder / "README.md",
        "```text\n"
        "described/\n"
        "+-- tests/ two Node test files plus payload fixtures\n"
        "`-- tests/ nine Node test files plus payload fixtures\n"
        "```\n",
    )
    assert found == [(2, "test", "pass"), (9, "test", "fail")]


def test_named_folder_is_not_judged_by_the_readme_folder_inventory(repo: Path) -> None:
    # The README-folder categories are lenient on purpose; a folder the claim names
    # must match its own filtered count, so three notes are not three scripts.
    folder = repo / "pkg" / "lenient"
    for name in ("docs/a.md", "docs/b.md", "docs/c.md"):
        write(folder / name)
    found = verdicts(folder / "README.md", "Three scripts live in `docs/`. Three files live in `docs/`.\n")
    assert found == [(3, "scripts", "fail"), (3, "files", "pass")]


def test_code_label_with_an_existing_first_segment_is_checked(repo: Path) -> None:
    # `docs/` exists, so the label names one place, and that place holds no `old.md`.
    found = resolve(repo, "[`docs/old.md`](../docs/guide.md) and [`docs/guide.md`](../docs/guide.md)\n")
    assert_fails(found, "docs/old.md")
    assert found["docs/guide.md"].resolved and not found["docs/guide.md"].skipped


def test_nested_gitignore_name_applies_only_below_its_folder(repo: Path) -> None:
    # A nested ignore file speaks for its own subtree; elsewhere the name is an ordinary missing path.
    write(repo / "sub" / ".gitignore", "only-local.json\n")
    write(repo / "sub" / "keep.md")
    track(repo)
    elsewhere = resolve(repo, "Edit `only-local.json`.\n")
    assert_fails(elsewhere, "only-local.json")
    below = repo / "sub" / "deep" / "README.md"
    write(below, "Edit `only-local.json`.\n")
    references.clear_caches()
    resolutions, missing = references.check_readme(str(below))
    assert missing is None
    found = {item.reference.raw: item for item in resolutions}
    assert found["only-local.json"].skipped, found["only-local.json"].detail


@pytest.mark.parametrize(
    "names",
    [("a.test.mjs", "b.test.mjs"), ("test_a.py", "test_b.py"), ("a.test.sh", "test-b.sh")],
    ids=["node test module", "pytest module", "shell test script"],
)
def test_test_file_forms_count_as_tests(repo: Path, names: tuple[str, str]) -> None:
    folder = repo / "pkg" / "forms"
    for name in names + ("helper.mjs", "conftest.py", "util.sh"):
        write(folder / "suite" / name)
    found = verdicts(folder / "README.md", "Two tests live in `suite/`.\n")
    assert found == [(2, "tests", "pass")]


def test_tracked_paths_are_listed_once_per_reference_run(repo: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    calls: list[list[str]] = []
    real_run = subprocess.run

    def counting_run(command, *args, **kwargs):
        if "ls-files" in command:
            calls.append(command)
        return real_run(command, *args, **kwargs)

    monkeypatch.setattr(references.subprocess, "run", counting_run)
    found = resolve(repo, "Read `guide.md`, `REPO RULES.md` and `tool/scripts/x.py`, run `docs/guide.md`.\n")
    assert found["guide.md"].resolved
    assert len(calls) == 1, calls
