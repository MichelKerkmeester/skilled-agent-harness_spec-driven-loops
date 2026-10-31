#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: FEATURE CATALOG PHANTOM PATH LINKER
# ───────────────────────────────────────────────────────────────

"""
Rewrite plain-text markdown-path tokens in root catalogs into markdown links.

The package validator reports phantom rows when a root catalog names a
markdown file as plain text instead of linking it. This script re-runs that
validator, resolves every reported token against the catalog folder first,
then the package folder and finally the repository root, and rewrites the
first hit into a link whose target is relative to the catalog folder. A token
wrapped in backticks becomes a linked code span; a bare token becomes a plain
link. Tokens that resolve nowhere are reported and left untouched.

Usage: python3 -I link_phantom_rows.py [--apply]
Output: one CHANGE line per rewritten token, one UNRESOLVED line per token
        that resolves nowhere, then total_tokens_linked=<n> and
        total_tokens_unresolved=<n>. Without --apply no file is written.
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import argparse
import json
import posixpath
import re
import subprocess
import sys
from pathlib import Path

# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

VALIDATOR_RELATIVE_PATH = Path(
    ".skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py"
)
VALIDATOR_FLAGS = ("--report-only", "--json")
ISSUE_TYPE = "phantom_root_row"
SKILLS_RELATIVE_PATH = Path(".skilled/skills")
CATALOG_DIRNAME = "feature-catalog"
ROOT_CATALOG_FILENAME = "feature-catalog.md"
CODE_FENCE = "`"

# The validator separates linked from plain targets with these two patterns;
# reusing them keeps the rewrite and the report on the same view of a line.
FULL_MD_LINK_RE = re.compile(r"\[[^\]]*\]\([^)]+\)")
MD_PATH_TOKEN_RE = re.compile(r"(?<![\w])(?:[A-Za-z0-9_.-]+/)*[A-Za-z0-9_.-]+\.md\b")

# ───────────────────────────────────────────────────────────────
# 3. HELPERS
# ───────────────────────────────────────────────────────────────


def repo_root() -> Path:
    """Return the top level of the current git work tree."""
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        capture_output=True,
        check=True,
        text=True,
    )
    return Path(result.stdout.strip())


def run_validator(root: Path) -> list[dict]:
    """Run the package validator and return its phantom-row violations.

    Args:
        root: Repository root the validator reads its catalogs from.

    Returns:
        Every violation record of type phantom_root_row.
    """
    validator = root / VALIDATOR_RELATIVE_PATH
    command = [sys.executable, "-I", str(validator), *VALIDATOR_FLAGS]
    result = subprocess.run(command, capture_output=True, text=True)
    try:
        report = json.loads(result.stdout)
    except json.JSONDecodeError:
        sys.stderr.write(result.stderr or result.stdout)
        print("ERROR: validator output was not JSON", file=sys.stderr)
        raise SystemExit(2)
    return [
        violation
        for violation in report.get("violations", [])
        if violation.get("type") == ISSUE_TYPE
    ]


def strip_links(line: str) -> tuple[str, list[int]]:
    """Return the line without markdown links plus a plain-to-source index map.

    Args:
        line: One source line without its line ending.

    Returns:
        The link-free text and, for each character in it, the index of that
        character in the source line.
    """
    plain_chars: list[str] = []
    index_map: list[int] = []
    position = 0
    for match in FULL_MD_LINK_RE.finditer(line):
        for index in range(position, match.start()):
            plain_chars.append(line[index])
            index_map.append(index)
        position = match.end()
    for index in range(position, len(line)):
        plain_chars.append(line[index])
        index_map.append(index)
    return "".join(plain_chars), index_map


def find_plain_token(line: str, token: str) -> tuple[int, int] | None:
    """Locate a plain-text token outside every markdown link.

    Args:
        line: One source line without its line ending.
        token: The exact path token the validator reported.

    Returns:
        The half-open character span in line, or None when the token no
        longer appears as plain text.
    """
    plain, index_map = strip_links(line)
    for match in MD_PATH_TOKEN_RE.finditer(plain):
        if match.group(0) != token:
            continue
        start = index_map[match.start()]
        end = index_map[match.end() - 1] + 1
        if end - start != match.end() - match.start():
            continue  # Match exists only because a link was removed; skip it.
        return start, end
    return None


def link_token(line: str, token: str, target: str) -> str | None:
    """Rewrite the first plain-text occurrence of token into a markdown link.

    Args:
        line: One source line without its line ending.
        token: The exact path token to link.
        target: Link destination relative to the catalog folder.

    Returns:
        The rewritten line, or None when no plain-text occurrence remains.
    """
    span = find_plain_token(line, token)
    if span is None:
        return None
    start, end = span
    framed = (
        start > 0
        and end < len(line)
        and line[start - 1] == CODE_FENCE
        and line[end] == CODE_FENCE
    )
    if framed:
        return f"{line[: start - 1]}[{CODE_FENCE}{token}{CODE_FENCE}]({target}){line[end + 1:]}"
    return f"{line[:start]}[{token}]({target}){line[end:]}"


def resolve_token(root: Path, package: str, token: str) -> Path | None:
    """Return the first existing candidate path for token, or None.

    Args:
        root: Repository root, the last resolution base.
        package: Package id relative to the skills root.
        token: The path token as the validator reported it.

    Returns:
        The resolved hit, or None when no base holds the token.
    """
    package_root = root / SKILLS_RELATIVE_PATH / package
    for base in (package_root / CATALOG_DIRNAME, package_root, root):
        candidate = base / token
        if candidate.exists():
            return candidate
    return None


def relative_target(catalog_dir: Path, hit: Path) -> str:
    """Return hit as a link target relative to the catalog folder."""
    return posixpath.relpath(hit.as_posix(), catalog_dir.as_posix())


def split_line_ending(line: str) -> tuple[str, str]:
    """Return a line split into its body and its original line ending."""
    body = line.rstrip("\r\n")
    return body, line[len(body):]


# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────


def parse_args(argv: list[str]) -> argparse.Namespace:
    """Parse the optional --apply switch; the default run only reports."""
    parser = argparse.ArgumentParser(
        description="Rewrite phantom root-catalog path tokens into relative markdown links."
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write the rewritten catalogs to disk; omit for a dry run.",
    )
    return parser.parse_args(argv)


def main() -> int:
    """Report every planned rewrite and write it only with --apply."""
    args = parse_args(sys.argv[1:])
    root = repo_root()
    violations = run_validator(root)

    catalogs: dict[Path, list[str]] = {}
    changed_catalogs: set[Path] = set()
    linked = 0
    unresolved = 0

    for violation in violations:
        package = str(violation.get("package", ""))
        token = str(violation.get("path", ""))
        line_number = int(violation.get("line") or 0)
        label = f"{package}:{line_number} {token}".strip()
        catalog = (
            root / SKILLS_RELATIVE_PATH / package / CATALOG_DIRNAME / ROOT_CATALOG_FILENAME
        )
        if not package or not token or line_number < 1 or not catalog.is_file():
            print(f"UNRESOLVED {label}")
            unresolved += 1
            continue
        if catalog not in catalogs:
            with catalog.open(encoding="utf-8", newline="") as handle:
                catalogs[catalog] = handle.readlines()
        if line_number > len(catalogs[catalog]):
            print(f"UNRESOLVED {label}")
            unresolved += 1
            continue
        hit = resolve_token(root, package, token)
        if hit is None:
            print(f"UNRESOLVED {label}")
            unresolved += 1
            continue
        target = relative_target(catalog.parent, hit)
        body, ending = split_line_ending(catalogs[catalog][line_number - 1])
        rewritten = link_token(body, token, target)
        if rewritten is None:
            print(f"UNRESOLVED {label}")
            unresolved += 1
            continue
        catalogs[catalog][line_number - 1] = rewritten + ending
        changed_catalogs.add(catalog)
        print(f"CHANGE {label} -> {target}")
        linked += 1

    if args.apply:
        for catalog in sorted(changed_catalogs):
            with catalog.open("w", encoding="utf-8", newline="") as handle:
                handle.writelines(catalogs[catalog])

    print(f"total_tokens_linked={linked}")
    print(f"total_tokens_unresolved={unresolved}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
