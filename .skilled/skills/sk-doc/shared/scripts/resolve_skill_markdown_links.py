#!/usr/bin/env python3
"""Resolve relative Markdown links in the repository's skill tree."""

from __future__ import annotations

import argparse
import os
import re
import sys
import tempfile
from pathlib import Path
from urllib.parse import unquote


LINK_PATTERN = re.compile(r"(?<!!)\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)")
EXTERNAL_PATTERN = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//)", re.IGNORECASE)


def exact_entry(root: Path, relative: Path) -> tuple[bool, str]:
    current = root
    for part in relative.parts:
        if part in ("", "."):
            continue
        if part == "..":
            current = current.parent
            continue
        try:
            entries = {entry.name: entry for entry in os.scandir(current)}
        except OSError as error:
            return False, f"unreadable directory: {error}"
        if part not in entries:
            return False, "path does not exist with exact case"
        current = Path(entries[part].path)
    return True, str(current)


def inside_root(root: Path, path: Path) -> bool:
    try:
        path.resolve(strict=False).relative_to(root.resolve())
    except ValueError:
        return False
    return True


def candidate_status(source: Path, target: str, root: Path) -> tuple[bool, str]:
    decoded = unquote(target)
    if decoded.startswith("/"):
        return False, "absolute target is not a relative link"
    relative = Path(decoded)
    lexical = Path(os.path.abspath(source.parent / relative))
    try:
        lexical_relative = lexical.relative_to(root)
    except ValueError:
        return False, "target resolves outside repository root"
    exists, detail = exact_entry(root, lexical_relative)
    if not exists:
        return False, detail
    resolved = Path(os.path.realpath(detail))
    if not inside_root(root, resolved):
        return False, "target resolves outside repository root"
    return True, str(resolved)


def markdown_files(root: Path, scopes: list[str]) -> tuple[list[Path], list[str]]:
    skill_root = root / ".opencode" / "skills"
    if not skill_root.is_dir():
        raise OSError(f"skill root is missing or unreadable: {skill_root}")
    scope_paths = [root / scope for scope in scopes]
    for scope_path in scope_paths:
        if not scope_path.exists():
            raise OSError(f"scope is missing or unreadable: {scope_path}")
    files: list[Path] = []
    for current, directories, names in os.walk(skill_root, followlinks=False):
        directories[:] = sorted(name for name in directories if not (Path(current) / name).is_symlink())
        for name in sorted(names):
            path = Path(current) / name
            if path.suffix.lower() != ".md":
                continue
            if scope_paths and not any(path.is_relative_to(scope) for scope in scope_paths):
                continue
            files.append(path)
    return files, [str(path.relative_to(root)) for path in scope_paths]


def scan(root: Path, scopes: list[str]) -> tuple[int, dict[str, int], list[str]]:
    files, _ = markdown_files(root, scopes)
    examined = 0
    entries_examined = 0
    failures = 0
    excluded_anchor = 0
    excluded_external = 0
    diagnostics: list[str] = []
    for source in files:
        examined += 1
        try:
            text = source.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as error:
            failures += 1
            diagnostics.append(f"FAIL {source.relative_to(root)}: unreadable input: {error}")
            continue
        for line_number, line in enumerate(text.splitlines(), start=1):
            for match in LINK_PATTERN.finditer(line):
                target = match.group(1).strip()
                if target.startswith("<") and target.endswith(">"):
                    target = target[1:-1]
                target = target.strip()
                if not target or target.startswith("#"):
                    excluded_anchor += 1
                    continue
                if EXTERNAL_PATTERN.match(target) or target.startswith(("mailto:", "tel:")):
                    excluded_external += 1
                    continue
                target = target.split("#", 1)[0]
                if not target:
                    excluded_anchor += 1
                    continue
                entries_examined += 1
                ok, detail = candidate_status(source, target, root)
                if not ok:
                    failures += 1
                    diagnostics.append(
                        f"FAIL {source.relative_to(root)}:{line_number}: {target!r}: {detail}"
                    )
    counts = {
        "files_examined": examined,
        "entries_examined": entries_examined,
        "failures": failures,
        "excluded_anchor": excluded_anchor,
        "excluded_external": excluded_external,
    }
    return failures, counts, diagnostics


def self_test() -> int:
    with tempfile.TemporaryDirectory() as temporary:
        root = Path(temporary)
        skill = root / ".opencode" / "skills" / "sample"
        skill.mkdir(parents=True)
        (skill / "Exact.md").write_text("ok\n", encoding="utf-8")
        outside = root.parent / f"{root.name}-outside"
        outside.mkdir()
        (outside / "outside.md").write_text("outside\n", encoding="utf-8")
        (skill / "outside.md").symlink_to(outside / "outside.md")
        (skill / "README.md").write_text(
            "[good](Exact.md) [case](exact.md) [anchor](#part) "
            "[external](https://example.com) [outside](outside.md)\n",
            encoding="utf-8",
        )
        failures, counts, diagnostics = scan(root, [])
        if failures != 2 or counts["excluded_anchor"] != 1 or counts["excluded_external"] != 1:
            print("SELF-TEST FAIL", counts, diagnostics)
            return 1
        print("SELF-TEST PASS: exact-case, anchor, external, and outside-root cases")
    return 0


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--scope", action="append", default=[], help="skill-relative scope to scan")
    parser.add_argument("--self-test", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    if args.self_test:
        return self_test()
    root = Path(args.repo_root).resolve()
    try:
        failures, counts, diagnostics = scan(root, args.scope)
    except OSError as error:
        print(f"FAIL: {error}", file=sys.stderr)
        return 2
    for diagnostic in diagnostics:
        print(diagnostic)
    print(
        "SUMMARY "
        f"files_examined={counts['files_examined']} "
        f"entries_examined={counts['entries_examined']} "
        f"failures={failures} "
        f"excluded_anchor={counts['excluded_anchor']} "
        f"excluded_external={counts['excluded_external']}"
    )
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
