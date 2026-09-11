#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: commit citation remapper
# ───────────────────────────────────────────────────────────────
"""
Remap commit hash citations after a git filter-repo history rewrite.

Reads a filter-repo commit map, builds a table from every old-hash
prefix to its replacement, and rewrites matching citations in files
under the given roots. Everything outside a recognized token stays
byte-identical, including line endings and every decoy. Dry run unless
--apply is set.

Usage:
    python3 remap-citations.py --commit-map map.txt --root specs --ext .md
    python3 remap-citations.py --commit-map map.txt --root specs --ext .md --apply --report report.json

Output:
    A JSON report on stdout, plus the same JSON at --report when given.
    Exit codes: 0 on success, 2 on a bad or ambiguous commit map, 3 when
    the post-apply residue check still finds old prefixes.
"""
import argparse
import json
import os
import re
import sys
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Iterator, List, NoReturn, Optional, Set, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

TOKEN_PATTERN = re.compile(rb"(?<![0-9a-zA-Z])[0-9a-f]{10,40}(?![0-9a-zA-Z])")
MAP_HEADER = "old new"
HASH_LENGTH = 40
PREFIX_MIN_LENGTH = 7
COLLISION_LENGTH = 10
ZERO_HASH = "0" * HASH_LENGTH
MAP_LINE_PATTERN = re.compile(r"\A([0-9a-f]{40})[ \t]+([0-9a-f]{40})\Z")

# ───────────────────────────────────────────────────────────────
# 2. SHARED STATE
# ───────────────────────────────────────────────────────────────


@dataclass
class RunStats:
    """Accumulated counts for one remap pass."""

    files_scanned: int = 0
    files_changed: int = 0
    recognized: Set[str] = field(default_factory=set)
    replaced: Set[str] = field(default_factory=set)
    skipped: Set[str] = field(default_factory=set)
    by_length: Counter = field(default_factory=Counter)


# ───────────────────────────────────────────────────────────────
# 3. COMMIT MAP
# ───────────────────────────────────────────────────────────────


def _fail(message: str, code: int = 2) -> NoReturn:
    """Print an error and stop with the given exit code."""
    print(f"error: {message}", file=sys.stderr)
    sys.exit(code)


def find_prefix_collisions(old_hashes: List[str]) -> Dict[str, List[str]]:
    """Group old hashes by ten-character prefix, keeping groups of two or more."""
    groups: Dict[str, List[str]] = {}
    for old_hash in old_hashes:
        groups.setdefault(old_hash[:COLLISION_LENGTH], []).append(old_hash)
    return {prefix: group for prefix, group in groups.items() if len(group) > 1}


def load_commit_map(map_path: Path) -> Dict[str, str]:
    """
    Parse a filter-repo commit map into a prefix-to-replacement table.

    Args:
        map_path: Path to the commit map whose first line is the ``old new`` header.

    Returns:
        Every old-hash prefix of length 7 to 40 mapped to its new hash. Commits
        whose new hash is all zeros are dropped, since they no longer exist.

    Raises:
        SystemExit: If the header is missing, a line is malformed, or two old
            hashes share a ten-character prefix and would be ambiguous.
    """
    lines = map_path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].split() != MAP_HEADER.split():
        _fail(f"commit map '{map_path}' does not start with the '{MAP_HEADER}' header")
    pairs: List[Tuple[str, str]] = []
    for line_number, line in enumerate(lines[1:], start=2):
        if not line.strip():
            continue
        match = MAP_LINE_PATTERN.match(line.strip())
        if match is None:
            _fail(f"commit map '{map_path}' line {line_number} is not an '<old> <new>' pair")
        old_hash, new_hash = match.group(1), match.group(2)
        if new_hash != ZERO_HASH:
            pairs.append((old_hash, new_hash))
    collisions = find_prefix_collisions([old for old, _ in pairs])
    if collisions:
        for prefix, group in sorted(collisions.items()):
            _fail(f"old hashes {', '.join(sorted(set(group)))} share the '{prefix}' prefix")
    table: Dict[str, str] = {}
    for old_hash, new_hash in pairs:
        for length in range(PREFIX_MIN_LENGTH, HASH_LENGTH + 1):
            table[old_hash[:length]] = new_hash
    return table


# ───────────────────────────────────────────────────────────────
# 4. FILE PROCESSING
# ───────────────────────────────────────────────────────────────


def iter_scannable_files(roots: List[str], extensions: List[str]) -> Iterator[Path]:
    """Yield files under each root whose lowercase suffix is in extensions."""
    for root in roots:
        base = Path(root)
        if not base.is_dir():
            _fail(f"root '{root}' is not a directory")
        for dirpath, _dirnames, filenames in os.walk(base):
            for filename in sorted(filenames):
                path = Path(dirpath) / filename
                if path.suffix.lower() in extensions:
                    yield path


def remap_bytes(data: bytes, table: Dict[str, str], stats: RunStats) -> bytes:
    """Return data with every commit citation replaced by its new hash."""

    def replace(match: "re.Match[bytes]") -> bytes:
        token = match.group(0).decode("ascii")
        new_hash = table.get(token)
        if new_hash is None:
            stats.skipped.add(token)
            return match.group(0)
        stats.recognized.add(token)
        replacement = new_hash[: len(token)].encode("ascii")
        if replacement != match.group(0):
            stats.replaced.add(token)
            stats.by_length[len(token)] += 1
        return replacement

    return TOKEN_PATTERN.sub(replace, data)


def remap_roots(roots: List[str], extensions: List[str], table: Dict[str, str], apply: bool) -> RunStats:
    """Scan every root and write the remapped bytes in place when applying."""
    stats = RunStats()
    for path in iter_scannable_files(roots, extensions):
        stats.files_scanned += 1
        original = path.read_bytes()
        updated = remap_bytes(original, table, stats)
        if updated != original:
            stats.files_changed += 1
            if apply:
                path.write_bytes(updated)
    return stats


def count_residue(roots: List[str], extensions: List[str], table: Dict[str, str]) -> int:
    """Count tokens that still equal an old prefix after an apply pass."""
    residue = 0
    for path in iter_scannable_files(roots, extensions):
        for match in TOKEN_PATTERN.finditer(path.read_bytes()):
            if match.group(0).decode("ascii") in table:
                residue += 1
    return residue


# ───────────────────────────────────────────────────────────────
# 5. CLI
# ───────────────────────────────────────────────────────────────


def normalize_extensions(values: List[str]) -> List[str]:
    """Lowercase extensions and ensure each keeps its leading dot."""
    extensions = []
    for value in values:
        extension = value.strip().lower()
        extensions.append(extension if extension.startswith(".") else f".{extension}")
    return extensions


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    """Parse the command line."""
    parser = argparse.ArgumentParser(description="Remap commit hash citations after a filter-repo rewrite.")
    parser.add_argument("--commit-map", required=True, metavar="PATH", help="filter-repo commit map to read")
    parser.add_argument("--root", required=True, action="append", metavar="DIR", help="directory to scan; repeatable")
    parser.add_argument(
        "--ext", required=True, action="append", metavar="EXT", help="file extension to scan, e.g. .md; repeatable"
    )
    parser.add_argument("--apply", action="store_true", help="write the remapped files in place")
    parser.add_argument("--report", metavar="JSON", help="also write the JSON report to this path")
    return parser.parse_args(argv)


def build_report(
    args: argparse.Namespace, extensions: List[str], stats: RunStats, residue: Optional[int]
) -> Dict[str, object]:
    """Assemble the JSON-serializable run report."""
    return {
        "applied": args.apply,
        "commit_map": args.commit_map,
        "roots": list(args.root),
        "extensions": extensions,
        "files_scanned": stats.files_scanned,
        "files_changed": stats.files_changed,
        "replacements_by_length": {str(length): count for length, count in sorted(stats.by_length.items())},
        "distinct_tokens_replaced": len(stats.replaced),
        "distinct_tokens_recognized": len(stats.recognized),
        "distinct_tokens_skipped": len(stats.skipped),
        "residue_after_apply": residue,
    }


def main(argv: Optional[List[str]] = None) -> int:
    """Run the remapper and return the process exit code."""
    args = parse_args(argv)
    extensions = normalize_extensions(args.ext)
    table = load_commit_map(Path(args.commit_map))
    stats = remap_roots(list(args.root), extensions, table, args.apply)
    residue = count_residue(list(args.root), extensions, table) if args.apply else None
    report = build_report(args, extensions, stats, residue)
    text = json.dumps(report, indent=2, sort_keys=True)
    print(text)
    if args.report:
        Path(args.report).write_text(text + "\n", encoding="utf-8")
    if residue:
        print(f"error: residue check found {residue} tokens still matching old prefixes", file=sys.stderr)
        return 3
    return 0


if __name__ == "__main__":
    sys.exit(main())
