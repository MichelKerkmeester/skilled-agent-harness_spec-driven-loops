#!/usr/bin/env python3
"""Check local README links, file references, and command paths.

Usage: python3 check_readme_references.py [--self-test] README.md [...]

Relative links and inline file references resolve from the README directory.
Repository-root command anchors such as ``.opencode/...`` are resolved from
the Git repository root when the README documents a command run from that root.
Fence info strings containing ``example`` explicitly mark illustrative paths.
"""

from __future__ import annotations

import argparse
import glob
import re
import shlex
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


FENCE_PATTERN = re.compile(r"^\s*(`{3,}|~{3,})(.*)$")
LINK_PATTERN = re.compile(r"\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)")
INLINE_PATTERN = re.compile(r"`([^`\n]+)`")
TRAILING_PUNCTUATION = ".,;:!?)]}>'\""
KNOWN_SUFFIXES = {
    ".bash",
    ".cjs",
    ".css",
    ".json",
    ".js",
    ".mjs",
    ".md",
    ".plist",
    ".py",
    ".sh",
    ".ts",
    ".tsx",
    ".txt",
    ".yml",
    ".yaml",
}
REPOSITORY_ROOT_PREFIXES = (
    ".github/",
    ".opencode/",
    "opencode.json",
    ".utcp_config.json",
    "package.json",
)


@dataclass(frozen=True)
class Reference:
    line: int
    raw: str
    kind: str
    example: bool = False


@dataclass(frozen=True)
class Resolution:
    reference: Reference
    resolved: bool
    detail: str


def repository_root(readme: Path) -> Path:
    """Return the checkout root without depending on the caller's CWD."""
    result = subprocess.run(
        ["git", "-C", str(readme.parent), "rev-parse", "--show-toplevel"],
        check=True,
        capture_output=True,
        text=True,
    )
    return Path(result.stdout.strip()).resolve()


def clean_candidate(value: str) -> str:
    """Normalize a Markdown or shell token while retaining meaningful dots."""
    candidate = value.strip().strip("`<>'\"")
    if "#" in candidate:
        candidate, _fragment = candidate.split("#", 1)
    candidate = candidate.rstrip(TRAILING_PUNCTUATION)
    return candidate


def looks_like_path(value: str) -> bool:
    """Recognize file and directory tokens without treating prose as paths."""
    if not value or value.startswith(("-", "@", "$")):
        return False
    if "://" in value or value.startswith(("#", "mailto:")):
        return False
    if ":" in value and "/" not in value:
        return False
    if any(character in value for character in "(){}<>\""):
        return False
    if value in {"//", "Node.js", "node:test"}:
        return False
    if value.startswith(("./", "../", "/", "~/", ".opencode/", ".github/")):
        return True
    if "/" in value and ("*" not in value and "?" not in value):
        return True
    if ("*" in value or "?" in value) and Path(value).suffix.lower() in KNOWN_SUFFIXES:
        return True
    if Path(value).suffix.lower() in KNOWN_SUFFIXES:
        return True
    return value in {"README.md", "pre-commit", "package.json"}


def token_candidates(value: str) -> Iterable[str]:
    """Yield path-like shell tokens from a code span or command line."""
    try:
        tokens = shlex.split(value, comments=False, posix=True)
    except ValueError:
        tokens = value.split()
    for token in tokens:
        cleaned = clean_candidate(token)
        if looks_like_path(cleaned):
            yield cleaned


def extract_references(text: str) -> list[Reference]:
    """Extract links, inline paths, and command paths with source line numbers."""
    references: list[Reference] = []
    active_fence: str | None = None
    example_fence = False

    for line_number, line in enumerate(text.splitlines(), start=1):
        fence_match = FENCE_PATTERN.match(line)
        if fence_match:
            marker = fence_match.group(1)
            if active_fence is None:
                active_fence = marker[0]
                example_fence = "example" in fence_match.group(2).lower().split()
            elif marker[0] == active_fence:
                active_fence = None
                example_fence = False
            continue

        if example_fence:
            continue

        for match in LINK_PATTERN.finditer(line):
            candidate = clean_candidate(match.group(1))
            if candidate and not candidate.startswith(("http://", "https://", "mailto:")):
                references.append(Reference(line_number, candidate, "link"))

        for match in INLINE_PATTERN.finditer(line):
            for candidate in token_candidates(match.group(1)):
                references.append(Reference(line_number, candidate, "inline"))

        if active_fence is not None:
            for candidate in token_candidates(line):
                references.append(Reference(line_number, candidate, "command"))

    return references


def candidate_paths(candidate: str, base: Path, root: Path) -> list[Path]:
    """Resolve a literal or glob from the README directory and safe root anchors."""
    if candidate.rstrip("/") == base.name:
        return [base]
    if candidate.startswith("/"):
        return [Path(candidate)]
    paths = [base / candidate]
    if candidate.startswith(REPOSITORY_ROOT_PREFIXES):
        root_path = root / candidate
        if root_path not in paths:
            paths.append(root_path)
    return paths


def resolve_reference(reference: Reference, readme: Path, root: Path) -> Resolution:
    """Resolve one reference and reject broken or escaping symlink targets."""
    for candidate_path in candidate_paths(reference.raw, readme.parent, root):
        matches = sorted(glob.glob(str(candidate_path), recursive=True)) if any(
            marker in str(candidate_path) for marker in ("*", "?")
        ) else [str(candidate_path)]
        for match in matches:
            path = Path(match)
            if not path.exists():
                continue
            resolved = path.resolve()
            try:
                resolved.relative_to(root)
            except ValueError:
                return Resolution(reference, False, "resolves outside the repository")
            return Resolution(reference, True, str(resolved))
    return Resolution(reference, False, "path does not exist")


def check_readme(readme_arg: str) -> tuple[list[Resolution], Path | None]:
    """Check one README and return reference receipts plus a read error."""
    readme = Path(readme_arg).resolve()
    if not readme.is_file():
        return [], readme
    try:
        root = repository_root(readme)
        text = readme.read_text(encoding="utf-8")
    except (OSError, subprocess.CalledProcessError):
        return [], readme
    references = extract_references(text)
    return [resolve_reference(reference, readme, root) for reference in references], None


def print_result(readme_arg: str, resolutions: list[Resolution], missing: Path | None) -> bool:
    """Print a human-readable verdict for one README."""
    if missing is not None:
        print(f"FAIL {readme_arg}: README is missing or unreadable")
        return False
    failures = [item for item in resolutions if not item.resolved]
    examples = 0
    for item in resolutions:
        if item.reference.example:
            examples += 1
        if not item.resolved:
            print(
                f"  line {item.reference.line}: {item.reference.kind} "
                f"{item.reference.raw!r}: {item.detail}"
            )
    status = "PASS" if not failures else "FAIL"
    print(
        f"{status} {readme_arg}: references={len(resolutions)} "
        f"unresolved={len(failures)} examples={examples}"
    )
    return not failures


def run_self_test() -> int:
    """Exercise a valid README, a missing path, and an explicit example fence."""
    with tempfile.TemporaryDirectory() as temp_dir:
        root = Path(temp_dir)
        (root / ".git").mkdir()
        subprocess.run(["git", "-C", str(root), "init", "-q"], check=True)
        (root / "docs").mkdir()
        (root / "docs" / "README.md").write_text(
            "[source](../source.md)\n\n```bash\n./run.sh\n```\n\n"
            "```bash example\n./illustrative.sh\n```\n",
            encoding="utf-8",
        )
        (root / "source.md").write_text("source\n", encoding="utf-8")
        (root / "docs" / "run.sh").write_text("#!/usr/bin/env bash\n", encoding="utf-8")
        valid, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or not print_result("self-test-positive", valid, None):
            return 1

        (root / "docs" / "README.md").write_text("```bash\n./missing.sh\n```\n", encoding="utf-8")
        invalid, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or print_result("self-test-negative", invalid, None):
            return 1
    print("SELF-TEST PASS: positive, negative, and example-fence cases")
    return 0


def parse_args(argv: list[str]) -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("readmes", nargs="*", help="README paths to check")
    parser.add_argument("--self-test", action="store_true", help="run built-in behavior checks")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    """Run the reference gate."""
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
