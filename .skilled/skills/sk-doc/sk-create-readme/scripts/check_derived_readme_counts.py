#!/usr/bin/env python3
"""Reject stale or unproven numeric file and suite counts in READMEs.

Usage: python3 check_derived_readme_counts.py [--self-test] README.md [...]

Numeric counts are accepted only when a complete direct-file inventory in the
README independently derives the claimed category. Dynamic shell derivations
using ``find``, ``ls``, or ``wc`` are also accepted. Vague count words fail
closed because they cannot be compared with the source directory.
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path


NUMBER_WORDS = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
}
COUNT_TERMS = {
    "file",
    "files",
    "script",
    "scripts",
    "suite",
    "suites",
    "test",
    "tests",
    "harness",
    "harnesses",
    "symlink",
    "symlinks",
    "plugin",
    "plugins",
    "workflow",
    "workflows",
    "entrypoint",
    "entrypoints",
    "guard",
    "guards",
}
VAGUE_TERMS = {
    "several",
    "many",
    "dozens",
    "numerous",
    "various",
    "multiple",
}
NUMBER_PATTERN = re.compile(r"\b(?:\d+|" + "|".join(NUMBER_WORDS) + r")\b", re.IGNORECASE)
WORD_PATTERN = re.compile(r"[A-Za-z][A-Za-z0-9_./*-]*")


@dataclass(frozen=True)
class CountClaim:
    line: int
    value: int | None
    term: str
    text: str
    reason: str


def repository_root(readme: Path) -> Path:
    """Return the checkout root independently of the caller's CWD."""
    result = subprocess.run(
        ["git", "-C", str(readme.parent), "rev-parse", "--show-toplevel"],
        check=True,
        capture_output=True,
        text=True,
    )
    return Path(result.stdout.strip()).resolve()


def direct_files(folder: Path) -> list[Path]:
    """Return regular direct files and symlinks, excluding the README itself."""
    return sorted(
        path for path in folder.iterdir()
        if path.name != "README.md" and (path.is_file() or path.is_symlink())
    )


def derived_values(folder: Path) -> dict[str, set[int]]:
    """Derive count categories from the current directory contents."""
    files = direct_files(folder)
    regular = [path for path in files if not path.is_symlink()]
    symlinks = [path for path in files if path.is_symlink()]
    test_files = [
        path for path in regular
        if path.name.endswith((".test.cjs", ".test.js", ".test.ts", ".vitest.ts"))
    ]
    scripts = [path for path in files if path.suffix in {".sh", ".bash"}]
    return {
        "file": {len(files), len(regular)},
        "files": {len(files), len(regular)},
        "script": {len(scripts), len(regular)},
        "scripts": {len(scripts), len(regular)},
        "suite": {len(test_files)},
        "suites": {len(test_files)},
        "test": {len(test_files), len(files)},
        "tests": {len(test_files), len(files)},
        "harness": {len(files)},
        "harnesses": {len(files)},
        "symlink": {len(symlinks)},
        "symlinks": {len(symlinks)},
        "plugin": {len(files)},
        "plugins": {len(files)},
        "workflow": {len(files)},
        "workflows": {len(files)},
        "entrypoint": {len(files)},
        "entrypoints": {len(files)},
        "guard": {len(files)},
        "guards": {len(files)},
    }


def source_inventory_complete(text: str, folder: Path) -> bool:
    """Check that every direct source filename appears in the README."""
    return all(path.name in text for path in direct_files(folder))


def line_claims(text: str) -> list[CountClaim]:
    """Find numeric or vague count claims in prose and code output."""
    claims: list[CountClaim] = []
    in_fence = False
    for line_number, line in enumerate(text.splitlines(), start=1):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            continue
        if re.match(r"^\s*#{1,6}\s+\d+\.", line):
            continue
        words = [word.lower() for word in WORD_PATTERN.findall(line)]
        if not words:
            continue
        dynamic = in_fence and any(token in line for token in ("find ", "ls ", "wc", "glob"))
        tokens = list(WORD_PATTERN.finditer(line))
        for match in NUMBER_PATTERN.finditer(line):
            value_token = match.group(0).lower()
            value = int(value_token) if value_token.isdigit() else NUMBER_WORDS[value_token]
            nearby = [
                token.group(0).lower()
                for token in tokens
                if abs(token.start() - match.start()) <= 42
            ]
            terms = [term for term in nearby if term in COUNT_TERMS]
            if not terms:
                continue
            claims.append(
                CountClaim(
                    line_number,
                    value,
                    terms[0],
                    line.strip(),
                    "dynamic derivation" if dynamic else "numeric count",
                )
            )
        for vague in VAGUE_TERMS:
            if re.search(rf"\b{vague}\b", line, re.IGNORECASE):
                vague_match = re.search(rf"\b{vague}\b", line, re.IGNORECASE)
                assert vague_match is not None
                nearby = [
                    token.group(0).lower()
                    for token in tokens
                    if abs(token.start() - vague_match.start()) <= 42
                ]
                terms = [term for term in nearby if term in COUNT_TERMS]
                if terms:
                    claims.append(CountClaim(line_number, None, terms[0], line.strip(), "unparseable count"))
    return claims


def evaluate_claim(claim: CountClaim, text: str, folder: Path) -> bool:
    """Accept only dynamic or complete-inventory-backed claims."""
    if claim.reason == "dynamic derivation":
        return True
    if claim.value is None:
        return False
    values = derived_values(folder)
    if claim.value not in values.get(claim.term, set()):
        return False
    return source_inventory_complete(text, folder)


def check_readme(readme_arg: str) -> tuple[list[CountClaim], list[CountClaim], Path | None]:
    """Return count claims, failures, and a missing README marker."""
    readme = Path(readme_arg).resolve()
    if not readme.is_file():
        return [], [], readme
    try:
        repository_root(readme)
        text = readme.read_text(encoding="utf-8")
    except (OSError, subprocess.CalledProcessError):
        return [], [], readme
    claims = line_claims(text)
    failures = [claim for claim in claims if not evaluate_claim(claim, text, readme.parent)]
    return claims, failures, None


def print_result(readme_arg: str, claims: list[CountClaim], failures: list[CountClaim], missing: Path | None) -> bool:
    """Print one count-gate verdict."""
    if missing is not None:
        print(f"FAIL {readme_arg}: README is missing or unreadable")
        return False
    for claim in failures:
        print(f"  line {claim.line}: {claim.reason} for {claim.term!r}: {claim.text}")
    status = "PASS" if not failures else "FAIL"
    print(f"{status} {readme_arg}: claims={len(claims)} failures={len(failures)}")
    return not failures


def run_self_test() -> int:
    """Exercise derived, stale, and unparseable count behavior."""
    with tempfile.TemporaryDirectory() as temp_dir:
        root = Path(temp_dir)
        subprocess.run(["git", "-C", str(root), "init", "-q"], check=True)
        (root / "alpha.ts").write_text("", encoding="utf-8")
        (root / "beta.ts").write_text("", encoding="utf-8")
        positive = root / "README.md"
        positive.write_text(
            "Two files are listed in the inventory.\n\n"
            "| File | Role |\n|---|---|\n| `alpha.ts` | A |\n| `beta.ts` | B |\n",
            encoding="utf-8",
        )
        claims, failures, missing = check_readme(str(positive))
        if missing is not None or not print_result("self-test-positive", claims, failures, missing):
            return 1

        negative = root / "negative.md"
        negative.write_text("Two files are listed, but only `alpha.ts` is documented.\n", encoding="utf-8")
        claims, failures, missing = check_readme(str(negative))
        if missing is not None or print_result("self-test-negative", claims, failures, missing):
            return 1

        vague = root / "vague.md"
        vague.write_text("Several files are present.\n", encoding="utf-8")
        claims, failures, missing = check_readme(str(vague))
        if missing is not None or print_result("self-test-unparseable", claims, failures, missing):
            return 1
    print("SELF-TEST PASS: derived, stale, and unparseable count cases")
    return 0


def parse_args(argv: list[str]) -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("readmes", nargs="*", help="README paths to check")
    parser.add_argument("--self-test", action="store_true", help="run built-in behavior checks")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    """Run the derived-count gate."""
    args = parse_args(argv or sys.argv[1:])
    if args.self_test:
        return run_self_test()
    if not args.readmes:
        print("No README paths supplied", file=sys.stderr)
        return 2
    results = [print_result(path, *check_readme(path)) for path in args.readmes]
    print(
        f"SUMMARY files={len(results)} pass={sum(results)} "
        f"fail={len(results) - sum(results)}"
    )
    return 0 if all(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
