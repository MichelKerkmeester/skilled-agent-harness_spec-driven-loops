#!/usr/bin/env python3
"""The rewrite guard keeps what a form-only rewrite of a Markdown doc must not change.

Every case builds a throwaway repository under tmp_path and commits a base, so the
guard compares against a revision the test controls rather than this checkout. A
fake skills tree and its ledger file decide which docs are exempt or pinned, which
keeps the cases independent of the real repo's ledger.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

import pytest

TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
GUARD = REPO / ".skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py"

# git resolves its repository from these in preference to the working directory, so
# a case that leaves one in place commits to this checkout instead of the fixture.
GIT_REDIRECTORS = (
    "GIT_DIR", "GIT_WORK_TREE", "GIT_COMMON_DIR", "GIT_INDEX_FILE",
    "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES", "GIT_CONFIG",
    "GIT_CONFIG_COUNT", "GIT_NAMESPACE", "GIT_CEILING_DIRECTORIES",
)

BLOCK_RE = re.compile(r"^```[^\n]*\n.*?^```[ \t]*$", re.S | re.M)

GUIDE = '''---
title: Guide
description: How the guard compares a rewrite with its base text
version: 1.0.0
---

# Guide

This document explains how a rewrite keeps every claim it started with.

## 1. Overview

Each skill keeps its reference material beside the SKILL.md file of that skill.

## 2. Sources

The guard follows the shape described in (research: the readability pass memo).

## 3. Output Format

A finding prints one line.

```text
HARD frontmatter docs/guide.md: "title: Guide" became "title: Handbook"
```

Every finding names the file it came from.
'''

LINKER = '''# Linker

The format is described in [the output format](guide.md#3-output-format).

The overview at guide.md §1 explains where reference material lives.

A pointer that never resolved, kept as a reminder: [gone](guide.md#never-there).
'''

SKILL_DOC = '''# SKILL

The skill's routing table lives here.

## 1. Routes

Each route names the reference file it loads.
'''

PINNED_DOC = '''---
title: Pinned
version: 1.0.0
---

# Pinned

The approved wording of the shared rule set.
'''

CONSUMER = '''"""Parse sk-doc/SKILL.md and hold the pinned wording of pinned.md."""


def routes(text):
    return [line for line in text.splitlines() if line.startswith("## ")]
'''

LEDGER = {
    "description": "Docs the guard reports as code input rather than prose.",
    "exempt": {
        "sk-doc/SKILL.md": {
            "consumer": "sk-doc/scripts/consumer.py",
            "reason": "the consumer parses the routing table by its heading",
        },
    },
    "pinned": [
        {
            "doc": "sk-doc/references/pinned.md",
            "consumer": "sk-doc/scripts/consumer.py",
            "reason": "the rule copies are pinned to this exact wording",
        },
    ],
}

BASE_FILES = {
    "docs/guide.md": GUIDE,
    "docs/linker.md": LINKER,
    ".skilled/skills/sk-doc/SKILL.md": SKILL_DOC,
    ".skilled/skills/sk-doc/references/pinned.md": PINNED_DOC,
    ".skilled/skills/sk-doc/scripts/consumer.py": CONSUMER,
}


class Repo:
    """A throwaway repository whose base commit holds the fixture docs."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.skills = root / ".skilled/skills"
        self.ledger = root / "render-ledger.json"

    def write(self, relative: str, text: str) -> None:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")

    def read(self, relative: str) -> str:
        return (self.root / relative).read_text(encoding="utf-8")

    def git(self, *args: str) -> subprocess.CompletedProcess:
        result = subprocess.run(
            ["git", *args], cwd=str(self.root), capture_output=True, text=True, env=self.env()
        )
        assert result.returncode == 0, result.stderr
        return result

    def commit(self, message: str) -> None:
        self.git("add", "-A")
        self.git("-c", "core.hooksPath=/dev/null", "commit", "-q", "-m", message)

    def env(self) -> dict:
        env = {key: value for key, value in os.environ.items() if key not in GIT_REDIRECTORS}
        env["RENDER_DEBT_FILE"] = str(self.ledger)
        env["RENDER_SKILLS_ROOT"] = str(self.skills)
        return env

    def guard(self, *args: str) -> subprocess.CompletedProcess:
        result = subprocess.run(
            [sys.executable, str(GUARD), *args],
            cwd=str(self.root), capture_output=True, text=True, env=self.env(),
        )
        return result


@pytest.fixture
def repo(tmp_path: Path) -> Repo:
    """Return a committed repository holding the fixture docs, at a base commit."""
    subject = Repo(tmp_path / "repo")
    subject.root.mkdir()
    subject.git("init", "-q")
    subject.git("config", "user.name", "Guard Test")
    subject.git("config", "user.email", "guard@example.invalid")
    subject.git("config", "commit.gpgsign", "false")
    for relative, text in BASE_FILES.items():
        subject.write(relative, text)
    subject.write("render-ledger.json", json.dumps(LEDGER, indent=2) + "\n")
    subject.commit("base")
    return subject


def edit(repo: Repo, relative: str, *replacements: tuple) -> None:
    """Rewrite a fixture doc by applying literal replacements in order."""
    text = repo.read(relative)
    for old, new in replacements:
        assert old in text, old
        text = text.replace(old, new)
    repo.write(relative, text)


def move_code_block(text: str) -> str:
    """Move the doc's first fenced block to the end, leaving its text untouched."""
    match = BLOCK_RE.search(text)
    assert match, text
    block = match.group(0)
    remainder = text[: match.start()] + "The sample moved to the end of the doc.\n\n" + text[match.end() :]
    return remainder.rstrip("\n") + "\n\n" + block + "\n"


def test_frontmatter_title_change_is_hard(repo: Repo) -> None:
    edit(repo, "docs/guide.md", ("title: Guide", "title: Handbook"))

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 1, result.stdout
    assert 'HARD frontmatter docs/guide.md: "title: Guide" became "title: Handbook"' in result.stdout


def test_frontmatter_version_bump_is_not_a_change(repo: Repo) -> None:
    edit(repo, "docs/guide.md", ("version: 1.0.0", "version: 1.0.1"))

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 0, result.stdout
    assert "HARD" not in result.stdout
    assert "doc-rewrite-guard: 1 files, 0 hard, 0 advisory" in result.stdout


def test_edited_code_block_is_hard(repo: Repo) -> None:
    edit(
        repo,
        "docs/guide.md",
        ('"title: Guide" became "title: Handbook"', '"title: Guide" became "title: Guide"'),
    )

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 1, result.stdout
    assert "HARD code-block docs/guide.md:" in result.stdout
    assert "edited fenced block" in result.stdout


def test_moved_code_block_is_not_a_change(repo: Repo) -> None:
    repo.write("docs/guide.md", move_code_block(repo.read("docs/guide.md")))

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 0, result.stdout
    assert "HARD" not in result.stdout


def test_dropped_citation_is_hard(repo: Repo) -> None:
    edit(repo, "docs/guide.md", (" in (research: the readability pass memo)", ""))

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 1, result.stdout
    assert "HARD citation docs/guide.md: citation gone: (research: the readability pass memo)" in result.stdout


def test_kept_citation_is_not_a_change(repo: Repo) -> None:
    edit(
        repo,
        "docs/guide.md",
        ("The guard follows the shape described in (research: the readability pass memo).",
         "(research: the readability pass memo) records the shape the guard follows here."),
    )

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 0, result.stdout
    assert "HARD" not in result.stdout


def test_removed_cited_anchor_is_hard(repo: Repo) -> None:
    edit(repo, "docs/guide.md", ("## 3. Output Format", "## 3. Output Layout"))

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 1, result.stdout
    assert "HARD cited-section docs/guide.md: inbound link #3-output-format from docs/linker.md:3" in result.stdout


def test_kept_cited_anchor_is_not_a_change(repo: Repo) -> None:
    repo.write("docs/guide.md", repo.read("docs/guide.md") + "\nA closing note about the format.\n")

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 0, result.stdout
    assert "HARD" not in result.stdout


def test_retitled_cited_section_number_is_hard(repo: Repo) -> None:
    edit(repo, "docs/guide.md", ("## 1. Overview", "## 1. Summary"))

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 1, result.stdout
    assert "HARD cited-section docs/guide.md: section 1 cited by docs/linker.md:5 was retitled" in result.stdout


def test_renamed_and_rewritten_doc_is_compared_with_its_old_text(repo: Repo) -> None:
    repo.git("mv", "docs/guide.md", "docs/handbook.md")
    edit(repo, "docs/handbook.md", ("title: Guide", "title: Handbook"))

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 1, result.stdout
    assert "HARD frontmatter docs/handbook.md" in result.stdout


def test_edit_inside_an_indented_fence_is_hard(repo: Repo) -> None:
    repo.write(
        "docs/steps.md",
        "# Steps\n\nRun the steps in order.\n\n1. Clean up:\n\n   ```bash\n   rm -rf /tmp/x\n   ```\n",
    )
    repo.commit("indented fence")
    edit(repo, "docs/steps.md", ("rm -rf /tmp/x", "rm -rf /"))

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 1, result.stdout
    assert "HARD code-block docs/steps.md" in result.stdout


def test_section_cited_with_a_backticked_file_name_is_seen(repo: Repo) -> None:
    repo.write("docs/citer.md", "# Citer\n\nSee `guide.md` §1 for the overview.\n")
    repo.commit("backticked citation")
    edit(repo, "docs/guide.md", ("## 1. Overview", "## 1. Summary"))

    result = repo.guard("--base", "HEAD")

    assert "section 1 cited by docs/citer.md:3 was retitled" in result.stdout


def test_same_name_in_another_skill_is_not_cited(repo: Repo) -> None:
    # Each skill keeps its own references/delegation.md, so a citation inside one
    # skill names that skill's copy, never the one the rewrite touched.
    repo.write(".skilled/skills/alpha/references/delegation.md", "# Delegation\n\nAlpha.\n\n## 1. Roster\n\nAgents.\n")
    repo.write(".skilled/skills/beta/references/delegation.md", "# Delegation\n\nBeta.\n\n## 1. Roster\n\nAgents.\n")
    repo.write(".skilled/skills/beta/SKILL.md", "# Beta\n\nSee `delegation.md` §1 for the roster.\n")
    repo.commit("two skills")
    edit(repo, ".skilled/skills/alpha/references/delegation.md", ("## 1. Roster", "## 1. Agents"))

    result = repo.guard("--base", "HEAD")

    assert "cited-section" not in result.stdout, result.stdout


def test_path_citation_reaches_only_its_file(repo: Repo) -> None:
    repo.write("other/guide.md", "# Other\n\nOther guide.\n\n## 1. Overview\n\nText.\n")
    repo.write("other/citer.md", "# Citer\n\nSee [the guide](../docs/guide.md) §1 for the overview.\n")
    repo.commit("path citation")
    edit(repo, "docs/guide.md", ("## 1. Overview", "## 1. Summary"))
    edit(repo, "other/guide.md", ("## 1. Overview", "## 1. Recap"))

    result = repo.guard("--base", "HEAD")

    assert "HARD cited-section docs/guide.md: section 1 cited by other/citer.md:3 was retitled" in result.stdout
    assert "cited-section other/guide.md: section 1 cited by other/citer.md" not in result.stdout


def test_citation_renumbered_with_its_section_is_not_reported(repo: Repo) -> None:
    repo.write("docs/manual.md", "# Manual\n\nThe manual.\n\n## 1. Setup\n\nA.\n\n## 2. Troubleshooting\n\nB.\n\n## 3. Support\n\nD.\n")
    repo.write("docs/pointer.md", "# Pointer\n\nSee `manual.md` §2 for fixes.\n")
    repo.commit("renumber base")
    edit(repo, "docs/manual.md", ("## 3. Support", "## 4. Support"), ("## 2. Troubleshooting", "## 2. Caveats\n\nC.\n\n## 3. Troubleshooting"))
    edit(repo, "docs/pointer.md", ("§2", "§3"))

    result = repo.guard("--base", "HEAD")

    assert "cited-section docs/manual.md" not in result.stdout, result.stdout


def test_citation_left_on_a_renumbered_section_is_still_hard(repo: Repo) -> None:
    repo.write("docs/manual.md", "# Manual\n\nThe manual.\n\n## 1. Setup\n\nA.\n\n## 2. Troubleshooting\n\nB.\n")
    repo.write("docs/pointer.md", "# Pointer\n\nSee `manual.md` §2 for fixes.\n")
    repo.commit("stale base")
    edit(repo, "docs/manual.md", ("## 2. Troubleshooting", "## 2. Caveats\n\nC.\n\n## 3. Troubleshooting"))

    result = repo.guard("--base", "HEAD")

    assert "HARD cited-section docs/manual.md: section 2 cited by docs/pointer.md:3 was retitled" in result.stdout


def test_run_from_a_subdirectory_reads_the_same_files(repo: Repo) -> None:
    edit(repo, "docs/guide.md", ("## 1. Overview", "## 1. Summary"))

    result = subprocess.run(
        [sys.executable, str(GUARD), "--base", "HEAD", "."],
        cwd=str(repo.root / "docs"), capture_output=True, text=True, env=repo.env(),
    )

    assert "section 1 cited by docs/linker.md:5 was retitled" in result.stdout
    assert "is gone" not in result.stdout
    assert "ADVISORY intro" not in result.stdout


def test_non_ascii_doc_name_is_checked(repo: Repo) -> None:
    repo.write("docs/caf\u00e9.md", "# Cafe\n\nA sample.\n\n```text\nold\n```\n")
    repo.commit("non-ascii name")
    edit(repo, "docs/caf\u00e9.md", ("old", "new"))

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 1, result.stdout
    assert "HARD code-block docs/caf\u00e9.md" in result.stdout


def test_edited_exempt_document_is_hard(repo: Repo) -> None:
    repo.write(".skilled/skills/sk-doc/SKILL.md", repo.read(".skilled/skills/sk-doc/SKILL.md") + "\nA new note.\n")

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 1, result.stdout
    assert (
        "HARD protected .skilled/skills/sk-doc/SKILL.md: exempt doc, read by sk-doc/scripts/consumer.py"
        in result.stdout
    )


def test_untouched_exempt_document_is_not_reported(repo: Repo) -> None:
    repo.write("docs/guide.md", repo.read("docs/guide.md") + "\nA closing note.\n")

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 0, result.stdout
    assert "protected" not in result.stdout


def test_edited_pinned_document_is_hard(repo: Repo) -> None:
    edit(repo, ".skilled/skills/sk-doc/references/pinned.md", ("approved wording", "approved text"))

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 1, result.stdout
    assert (
        "HARD protected .skilled/skills/sk-doc/references/pinned.md: "
        "pinned doc, pinned by sk-doc/scripts/consumer.py"
    ) in result.stdout


def test_untouched_pinned_document_is_not_reported(repo: Repo) -> None:
    repo.write("docs/guide.md", repo.read("docs/guide.md") + "\nA closing note.\n")

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 0, result.stdout
    assert "protected" not in result.stdout


def test_lost_line_is_advisory(repo: Repo) -> None:
    edit(
        repo,
        "docs/guide.md",
        ("Each skill keeps its reference material beside the SKILL.md file of that skill.\n\n", ""),
    )

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 0, result.stdout
    assert "ADVISORY lost-line docs/guide.md: removed line no longer present:" in result.stdout
    assert "0 hard, 1 advisory" in result.stdout


def test_intro_change_is_advisory(repo: Repo) -> None:
    edit(
        repo,
        "docs/guide.md",
        ("This document explains how a rewrite keeps every claim it started with.",
         "A short guide to the rewrite guard."),
    )

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 0, result.stdout
    assert 'ADVISORY intro docs/guide.md: was "This document explains' in result.stdout
    assert 'now "A short guide to the rewrite guard."' in result.stdout


def test_new_untracked_document_has_no_base_to_compare(repo: Repo) -> None:
    repo.write(
        "docs/added.md",
        "---\ntitle: Added\n---\n\n# Added\n\n## 3. Output Format\n\n(research: a memo)\n",
    )

    result = repo.guard("--base", "HEAD")

    assert result.returncode == 0, result.stdout
    assert "HARD" not in result.stdout
    assert "doc-rewrite-guard: 1 files, 0 hard, 0 advisory" in result.stdout


def test_help_exits_zero(repo: Repo) -> None:
    result = repo.guard("--help")

    assert result.returncode == 0, result.stderr
    assert "--base" in result.stdout


def test_unknown_base_exits_two(repo: Repo) -> None:
    result = repo.guard("--base", "no-such-ref")

    assert result.returncode == 2, result.stdout
    assert 'unknown base ref "no-such-ref"' in result.stderr


# A rewrite the readability review sent back for a changed rule, replayed against
# the commit it was made on. The guard must name the rewritten line; a shallow
# clone without that commit cannot rebuild the base, so the replay is skipped.
REPLAY_BASE = "16e06ed2c6"
REPLAY_PATCH = (
    REPO
    / "specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/013-system-spec-kit/scratch/diff-1.patch"
)
REPLAY_LINE = "Tests should stay beside parser modules when they validate parser-only behavior."


def _replay_repo(tmp_path):
    clean_env = {k: v for k, v in os.environ.items() if k not in GIT_REDIRECTORS}
    has_base = subprocess.run(
        ["git", "-C", str(REPO), "cat-file", "-e", f"{REPLAY_BASE}^{{commit}}"],
        capture_output=True, env=clean_env,
    ).returncode == 0
    if not has_base or not REPLAY_PATCH.is_file():
        pytest.skip("replay base commit or patch is not in this checkout")
    repo = tmp_path / "replay"
    repo.mkdir()
    git = ["git", "-c", "core.hooksPath=/dev/null", "-C", str(repo)]

    def run_git(args):
        subprocess.run(git + args, check=True, env=clean_env)

    run_git(["init", "-q"])
    run_git(["config", "user.email", "replay@example.invalid"])
    run_git(["config", "user.name", "replay"])
    patched = sorted({
        line.split()[2][2:]
        for line in REPLAY_PATCH.read_text(encoding="utf-8").splitlines()
        if line.startswith("diff --git ")
    })
    for rel in patched:
        shown = subprocess.run(
            ["git", "-C", str(REPO), "show", f"{REPLAY_BASE}:{rel}"],
            capture_output=True, env=clean_env,
        )
        if shown.returncode == 0:
            target = repo / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(shown.stdout)
    run_git(["add", "-A"])
    run_git(["commit", "-qm", "base", "--no-verify"])
    ledger = tmp_path / "ledger.json"
    ledger.write_text('{"debt": {}, "exempt": {}}', encoding="utf-8")
    env = dict(
        clean_env,
        RENDER_DEBT_FILE=str(ledger),
        RENDER_SKILLS_ROOT=str(repo / ".skilled" / "skills"),
    )
    return repo, run_git, env


def test_replayed_rewrite_is_reported(tmp_path):
    repo, run_git, env = _replay_repo(tmp_path)
    clean = subprocess.run(
        [sys.executable, str(GUARD), "--base", "HEAD"],
        cwd=repo, env=env, capture_output=True, text=True,
    )
    assert clean.returncode == 0, clean.stdout + clean.stderr
    assert "0 hard, 0 advisory" in clean.stdout

    run_git(["apply", str(REPLAY_PATCH)])
    result = subprocess.run(
        [sys.executable, str(GUARD), "--base", "HEAD"],
        cwd=repo, env=env, capture_output=True, text=True,
    )
    flagged = [
        line for line in result.stdout.splitlines()
        if "system-spec-kit/shared/parsing/README.md" in line and REPLAY_LINE in line
    ]
    assert flagged, result.stdout[-2000:]
