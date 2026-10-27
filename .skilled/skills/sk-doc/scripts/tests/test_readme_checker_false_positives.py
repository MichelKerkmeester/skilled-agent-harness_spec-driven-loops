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


@pytest.fixture()
def repo(tmp_path: Path) -> Path:
    """A small checkout holding one example of every file a reference can name."""
    subprocess.run(["git", "-c", "core.fsmonitor=false", "init", "-q", str(tmp_path)], check=True)
    write(tmp_path / ".gitignore", ".claude/settings.local.json\n")
    write(
        tmp_path / ".skilled" / "commands" / "create" / "changelog.md",
        '---\nargument-hint: "<target> [:auto|:confirm]"\n---\n# changelog\n',
    )
    write(tmp_path / "docs" / "guide.md", "# guide\n")
    write(tmp_path / "REPO RULES.md", "# rules\n")
    write(tmp_path / "src" / "tool.ts", "export {};\n")
    write(tmp_path / "templates" / "phase-parent.spec.md.tmpl", "# template\n")
    write(tmp_path / "pkg" / "run.sh", "#!/usr/bin/env bash\n")
    return tmp_path


def resolve(repo: Path, body: str) -> dict[str, object]:
    """Check a README holding ``body`` and map each reference to its resolution."""
    readme = repo / "pkg" / "README.md"
    write(readme, body)
    resolutions, missing = references.check_readme(str(readme))
    assert missing is None
    return {item.reference.raw: item for item in resolutions}


REFERENCE_CLASSES = [
    ("slash command in the command tree", "Run `/create:changelog`.\n", "/create:changelog", False),
    ("bare filename", "See `guide.md`.\n", "guide.md", False),
    ("partial path", "See `docs/guide.md`.\n", "docs/guide.md", False),
    ("gitignored path", "Edit `.claude/settings.local.json`.\n", ".claude/settings.local.json", True),
    ("bare gitignored filename", "Edit `settings.local.json`.\n", "settings.local.json", True),
    ("home-directory path", "Add it to `~/.zshrc`.\n", "~/.zshrc", True),
    ("absolute path outside the checkout", "Run `/opt/elsewhere/run.sh`.\n", "/opt/elsewhere/run.sh", True),
    ("filename with a space", "Read `REPO RULES.md`.\n", "REPO RULES.md", False),
    ("compiled script with a TypeScript source", "Run `tool.js`.\n", "tool.js", False),
    ("shell assignment value", "Set `CONFIG=docs/guide.md`.\n", "docs/guide.md", False),
    ("path/to placeholder", "Run `path/to/document.md`.\n", "path/to/document.md", True),
    ("bracketed placeholder segment", "Not `[spec]/memory/*.md`.\n", "[spec]/memory/*.md", True),
    ("spec doc shipped as a template", "Use `phase-parent.spec.md`.\n", "phase-parent.spec.md", False),
    ("config a doctor command creates", "Edit `.sk-git/` rules.\n", ".sk-git/", True),
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
]


@pytest.mark.parametrize("line", [case[1] for case in COUNT_NON_CLAIMS], ids=[case[0] for case in COUNT_NON_CLAIMS])
def test_count_non_claim_is_ignored(line: str) -> None:
    assert counts.line_claims(line) == []


def count_readme(folder: Path, sentence: str) -> tuple[list, list]:
    write(folder / "alpha.ts")
    write(folder / "beta.ts")
    readme = folder / "README.md"
    write(readme, f"{sentence}\n\n| File | Role |\n|---|---|\n| `alpha.ts` | A |\n| `beta.ts` | B |\n")
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


def test_claim_without_a_folder_is_unverified_not_failed(named: Path) -> None:
    found = verdicts(
        named / "README.md",
        "Two example files list them.\n\n"
        "| Symptom | Cause |\n|---|---|\n| A field differs | The two files are different classes |\n",
    )
    assert found == [(2, "files", "unverified"), (2, "files", "unverified")]
    claims, failures, missing = counts.check_readme(str(named / "README.md"))
    assert missing is None and len(claims) == 2 and failures == []


def test_strict_fails_an_unverified_claim(named: Path) -> None:
    readme = named / "README.md"
    write(readme, "Two example files list them.\n")
    script = SCRIPTS / "check_derived_readme_counts.py"
    lenient = subprocess.run([sys.executable, str(script), str(readme)], capture_output=True, text=True)
    strict = subprocess.run([sys.executable, str(script), "--strict", str(readme)], capture_output=True, text=True)
    assert lenient.returncode == 0, lenient.stdout
    assert "unverified=1" in lenient.stdout
    assert strict.returncode == 1, strict.stdout


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
