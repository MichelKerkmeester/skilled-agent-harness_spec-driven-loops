#!/usr/bin/env python3
"""Check install-guide files and installer entries without leaving the repository."""

from __future__ import annotations

import argparse
import os
import sys
import tempfile
from pathlib import Path


def inside_root(root: Path, path: Path) -> bool:
    try:
        path.resolve(strict=False).relative_to(root.resolve())
    except ValueError:
        return False
    return True


def check_entry(path: Path, root: Path) -> tuple[bool, str]:
    resolved = Path(os.path.realpath(path))
    if not inside_root(root, resolved):
        return False, "target resolves outside repository root"
    if not os.path.exists(path):
        return False, "target does not exist"
    return True, str(resolved)


def entries(directory: Path, suffix: str | None = None) -> list[Path]:
    if not directory.is_dir():
        raise OSError(f"directory is missing or unreadable: {directory}")
    result = []
    for path in sorted(directory.iterdir()):
        if suffix is None or path.suffix.lower() == suffix:
            if path.is_symlink() or path.is_file():
                result.append(path)
    return result


def scan(root: Path, install_root: Path, scripts_root: Path) -> tuple[int, dict[str, int], list[str]]:
    guide_entries = entries(install_root, ".md")
    script_entries = entries(scripts_root)
    failures = 0
    outside = 0
    diagnostics: list[str] = []
    for path in guide_entries + script_entries:
        ok, detail = check_entry(path, root)
        if not ok:
            failures += 1
            if "outside" in detail:
                outside += 1
            diagnostics.append(f"FAIL {path.relative_to(root)}: {detail}")
    counts = {
        "guide_entries_examined": len(guide_entries),
        "guide_resolvable": sum(check_entry(path, root)[0] for path in guide_entries),
        "script_entries_examined": len(script_entries),
        "script_resolvable": sum(check_entry(path, root)[0] for path in script_entries),
        "entries_examined": len(guide_entries) + len(script_entries),
        "failures": failures,
        "outside_root": outside,
    }
    return failures, counts, diagnostics


def self_test() -> int:
    with tempfile.TemporaryDirectory() as temporary:
        root = Path(temporary)
        install = root / "install-guides"
        scripts = install / "install-scripts"
        install.mkdir()
        scripts.mkdir()
        (install / "README.md").write_text("ok\n", encoding="utf-8")
        (scripts / "good.sh").write_text("#!/usr/bin/env bash\n", encoding="utf-8")
        outside = root.parent / f"{root.name}-outside"
        outside.mkdir()
        (outside / "outside.sh").write_text("#!/usr/bin/env bash\n", encoding="utf-8")
        (scripts / "outside.sh").symlink_to(outside / "outside.sh")
        (scripts / "missing.sh").symlink_to(scripts / "absent.sh")
        failures, counts, diagnostics = scan(root, install, scripts)
        if failures != 2 or counts["outside_root"] != 1:
            print("SELF-TEST FAIL", counts, diagnostics)
            return 1
        print("SELF-TEST PASS: missing and outside-root symlink cases")
    return 0


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--install-root", default=".opencode/install-guides")
    parser.add_argument("--scripts-root", default=".opencode/install-guides/install-scripts")
    parser.add_argument("--self-test", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    if args.self_test:
        return self_test()
    root = Path(args.repo_root).resolve()
    install_root = (root / args.install_root).resolve()
    scripts_root = (root / args.scripts_root).resolve()
    try:
        failures, counts, diagnostics = scan(root, install_root, scripts_root)
    except OSError as error:
        print(f"FAIL: {error}", file=sys.stderr)
        return 2
    for diagnostic in diagnostics:
        print(diagnostic)
    print(
        "SUMMARY "
        f"guide_entries_examined={counts['guide_entries_examined']} "
        f"guide_resolvable={counts['guide_resolvable']} "
        f"script_entries_examined={counts['script_entries_examined']} "
        f"script_resolvable={counts['script_resolvable']} "
        f"entries_examined={counts['entries_examined']} "
        f"failures={failures} "
        f"outside_root={counts['outside_root']}"
    )
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
