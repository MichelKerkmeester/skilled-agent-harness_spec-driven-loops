#!/usr/bin/env python3
"""
Regression tests for check_derived_readme_counts.py.

The checker can prove a count only from the README's own folder, so a number is
a count claim only when it counts a plural term directly ("three files", "12
shell scripts") on a line that names no other path. Prose such as "in one file",
a number glued to other text such as "LIVE=1", and a count in a sentence that
points at another folder are not claims. A sentence that names the README's own
folder still counts it, and a stale count about the folder must still fail.

Run: python3 -m pytest -q test_derived_readme_counts.py
"""

import subprocess
import sys
from pathlib import Path

SK_DOC = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(SK_DOC / "sk-create-readme" / "scripts"))

from check_derived_readme_counts import check_readme  # type: ignore  # noqa: E402


def _folder(tmp_path: Path) -> Path:
    subprocess.run(["git", "-C", str(tmp_path), "init", "-q"], check=True)
    for name in ("alpha.sh", "beta.sh"):
        (tmp_path / name).write_text("#!/usr/bin/env bash\n", encoding="utf-8")
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    for name in ("a.js", "b.js", "c.js"):
        (plugins / name).write_text("", encoding="utf-8")
    return tmp_path


def _failures(readme: Path, text: str) -> list:
    readme.write_text(text, encoding="utf-8")
    _claims, failures, missing = check_readme(str(readme))
    assert missing is None
    return [claim.text for claim in failures]


def test_prose_and_counts_about_other_things_are_not_claims(tmp_path: Path) -> None:
    root = _folder(tmp_path)
    text = (
        "The rule lives in one file and the hook writes one log file.\n\n"
        "One advisor identity routes nine bridges through five workflow packets.\n\n"
        "The runner reports 11 pass, 0 fail across the plugin suite.\n\n"
        "See [`the spec`](./spec.md), which lists 40 scripts.\n\n"
        "The `./plugins/` folder holds 7 plugins.\n\n"
        "```bash\nDOCTOR_LIVE=1 bash scripts/doctor.sh\n```\n\n"
        "| File | Role |\n|---|---|\n| `alpha.sh` | A |\n| `beta.sh` | B |\n"
    )

    assert _failures(root / "README.md", text) == []


def test_counts_proven_from_the_readme_folder_pass(tmp_path: Path) -> None:
    root = _folder(tmp_path)
    text = (
        "Two scripts sit here, `alpha.sh` and `beta.sh`.\n\n"
        "| File | Role |\n|---|---|\n| `alpha.sh` | A |\n| `beta.sh` | B |\n"
    )

    assert _failures(root / "README.md", text) == []


def test_stale_counts_still_fail(tmp_path: Path) -> None:
    root = _folder(tmp_path)
    text = (
        "Three scripts sit here.\n\n"
        "The folder holds 5 shell scripts.\n\n"
        "| File | Role |\n|---|---|\n| `alpha.sh` | A |\n| `beta.sh` | B |\n"
    )

    assert _failures(root / "README.md", text) == [
        "Three scripts sit here.",
        "The folder holds 5 shell scripts.",
    ]


def test_own_count_without_a_complete_inventory_still_fails(tmp_path: Path) -> None:
    root = _folder(tmp_path)

    assert _failures(root / "README.md", "Two scripts sit here, `alpha.sh` among them.\n") == [
        "Two scripts sit here, `alpha.sh` among them."
    ]


def test_count_naming_its_own_folder_beside_another_path_is_checked(tmp_path: Path) -> None:
    root = _folder(tmp_path)
    (root / ".skilled").mkdir()
    readme = root / "README.md"
    text = (
        "`./` holds 3 scripts owned under `.skilled/`. See [the owner](.skilled/README.md) for more.\n\n"
        "| File | Role |\n|---|---|\n| `alpha.sh` | A |\n| `beta.sh` | B |\n"
    )

    assert _failures(readme, text) == [
        "`./` holds 3 scripts owned under `.skilled/`. See [the owner](.skilled/README.md) for more."
    ]
