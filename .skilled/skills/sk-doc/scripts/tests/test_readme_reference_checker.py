#!/usr/bin/env python3
"""
Regression tests for check_readme_references.py.

The checker shares audit_readmes.py's token rules: a slash command is not a
path and a prose code span counts only when it opens with ./, ../, .skilled/,
.opencode/ or specs/. Every link target is checked, and so are inventory table
cells and tree entries. A reference resolves from the README folder, the
nearest package root or the repository root. A real broken path must fail.

Run: python3 -m pytest -q test_readme_reference_checker.py
"""

import subprocess
import sys
from pathlib import Path

SK_DOC = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(SK_DOC / "sk-create-readme" / "scripts"))

from check_readme_references import check_readme  # type: ignore  # noqa: E402


def _repo(tmp_path: Path) -> Path:
    subprocess.run(["git", "-C", str(tmp_path), "init", "-q"], check=True)
    return tmp_path


def _unresolved(readme: Path) -> list:
    resolutions, missing = check_readme(str(readme))
    assert missing is None
    return sorted(item.reference.raw for item in resolutions if not item.resolved)


def test_slash_commands_bare_names_and_slashed_prose_are_not_references(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    (root / "elsewhere").mkdir()
    (root / "elsewhere" / "mode-registry.json").write_text("{}\n", encoding="utf-8")
    readme = root / "docs" / "README.md"
    readme.parent.mkdir()
    readme.write_text(
        "Run `/speckit:plan` or `/deep:review` first.\n\n"
        "The hub reads `mode-registry.json` and routes `read/write` work to `gpt-5.5/high`.\n\n"
        "```bash\npython3 validate.py --type readme\n/doctor:ci list\n```\n",
        encoding="utf-8",
    )

    assert _unresolved(readme) == []


def test_bare_link_resolves_from_the_package_root(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    package = root / "pkg"
    (package / "lib").mkdir(parents=True)
    (package / "package.json").write_text("{}\n", encoding="utf-8")
    (package / "lib" / "config.ts").write_text("export {};\n", encoding="utf-8")
    readme = package / "docs" / "README.md"
    readme.parent.mkdir()
    readme.write_text("See [config](lib/config.ts).\n", encoding="utf-8")

    assert _unresolved(readme) == []


def test_real_broken_paths_still_fail(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    readme = root / "docs" / "README.md"
    readme.parent.mkdir()
    (readme.parent / "run.sh").write_text("#!/usr/bin/env bash\n", encoding="utf-8")
    readme.write_text(
        "Run `./run.sh`, then `./missing.sh`.\n\n"
        "See [gone](../gone.md), [dir](missing-dir/), [noext](missing-file), [deep](sub/missing.md) and [img](missing.png).\n\n"
        "```bash\nbash .skilled/scripts/absent.sh\n```\n",
        encoding="utf-8",
    )

    assert _unresolved(readme) == [
        "../gone.md", "./missing.sh", ".skilled/scripts/absent.sh",
        "missing-dir/", "missing-file", "missing.png", "sub/missing.md",
    ]


def test_stale_inventory_rows_and_tree_lines_fail(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    readme = root / "pkg" / "README.md"
    (readme.parent / "lib").mkdir(parents=True)
    (readme.parent / "kept.py").write_text("", encoding="utf-8")
    (readme.parent / "lib" / "kept.sh").write_text("", encoding="utf-8")
    readme.write_text(
        "| File | Purpose |\n|------|---------|\n"
        "| `kept.py` | Present |\n| `gone.py` | Removed long ago |\n"
        "| Workers | `kept.py`, `lost.py` |\n\n"
        "```text\npkg/\n+-- kept.py\n+-- lib/\n|   +-- kept.sh\n+-- gone.sh       # removed\n```\n",
        encoding="utf-8",
    )

    assert _unresolved(readme) == ["gone.py", "gone.sh", "lost.py"]


def test_example_fence_is_still_skipped(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    readme = root / "README.md"
    readme.write_text("```bash example\n./illustrative.sh\n```\n", encoding="utf-8")

    assert _unresolved(readme) == []


def test_git_ignored_runtime_path_is_not_broken(tmp_path: Path) -> None:
    root = _repo(tmp_path)
    (root / ".gitignore").write_text("logs/\n", encoding="utf-8")
    readme = root / "README.md"
    readme.write_text("The hook writes [its log](logs/run.log) and [a typo](lgos/run.log).\n", encoding="utf-8")

    assert _unresolved(readme) == ["lgos/run.log"]
