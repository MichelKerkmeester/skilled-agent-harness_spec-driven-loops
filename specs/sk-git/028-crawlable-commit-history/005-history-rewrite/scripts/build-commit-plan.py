#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: commit plan builder
# ───────────────────────────────────────────────────────────────
"""
Build the frozen old-SHA-to-ordinal-and-packet plan for a history rewrite.

Walks one pinned tip in reverse topological order, reads each commit's
subject, body and changed paths in a single git-log pass, and applies the
retrofit cascade: a Refs:/Spec: packet path, a numeric scope with exactly one
matching touched packet, a unique touched packet under a consistent scope, or
the dominant packet by changed-file count.  Emits one JSON object per line in
ordinal order and a summary on stderr; --sample also writes a judgeable slice.

Usage:
    python3 build-commit-plan.py --repo . --tip <sha> --out plan.jsonl
    python3 build-commit-plan.py --repo . --tip <sha> --out plan.jsonl --sample 100 --seed 28

Output:
    <out> JSONL, one object per commit; <out>.sample.jsonl when --sample is set.
"""
import argparse
import json
import random
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Set, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

RECORD_SEP = b"\x00"
FIELD_SEP = b"\x1f"
SPEC_ROOTS = (".opencode/specs/", "specs/")
SKILL_ROOT = ".opencode/skills/"
Z_ARCHIVE = "z_archive"
PACKET_DIR_RE = re.compile(r"^[0-9]{3}-")
SCOPE_RE = re.compile(r"^[a-z]+\(([^()]*)\)!?: ")
TRAILER_RE = re.compile(r"^(Refs|Spec):\s*(\S.*?)\s*$")
EXEMPT_PREFIXES = ("Merge ", 'Revert "', "fixup! ", "squash! ", "amend! ")
EXCLUDED_BASENAMES = frozenset({"goal.md", "graph-metadata.json", "description.json", "handover.md"})
EXCLUDED_SEGMENTS = frozenset({"activation", "scratch"})
EXCLUDED_SUFFIXES = (".jsonl", ".log")
GENERIC_SCOPES = frozenset({"specs", "spec-kit", "speckit", "docs", "repo"})
# Prefix words a scope drops when it shortens a track name, so deep-loop still names system-deep-loop.
SCOPE_NOISE_TOKENS = frozenset({"system", "sk", "skilled"})
NUMERIC_SCOPE_RE = re.compile(r"^([0-9]{3})(?:[/-].*)?$")
RULE_ORDER = ("refs", "scope-dir", "unique-touch", "dominant-touch", "none")

# ───────────────────────────────────────────────────────────────
# 2. GIT ACCESS
# ───────────────────────────────────────────────────────────────


def run_git(repo: str, args: Sequence[str]) -> bytes:
    """Run a git command in repo and return its stdout, failing loudly."""
    completed = subprocess.run(["git", "-C", repo, *args], capture_output=True, check=False)
    if completed.returncode != 0:
        detail = completed.stderr.decode("utf-8", errors="replace").strip()
        raise SystemExit(f"error: git {' '.join(args)} failed: {detail}")
    return completed.stdout


def ordered_hashes(repo: str, tip: str) -> List[str]:
    """Return the tip's commits in ascending reverse-topological order."""
    raw = run_git(repo, ["rev-list", "--reverse", "--topo-order", tip])
    return raw.decode("ascii", errors="replace").split()


def read_history(repo: str, tip: str) -> bytes:
    """Read subject, body and changed paths for the whole tip in one pass."""
    return run_git(
        repo,
        ["log", "--reverse", "--topo-order", "--format=%x00%H%x1f%s%x1f%b%x1f", "--name-only", tip],
    )


def read_tree_paths(repo: str, tip: str, pathspec: str) -> List[str]:
    """List every blob path under a pathspec in one revision's tree."""
    raw = run_git(repo, ["ls-tree", "-r", "--name-only", tip, "--", pathspec])
    return [line for line in raw.decode("utf-8", errors="replace").split("\n") if line]


def parse_history(raw: bytes) -> Dict[str, Tuple[str, str, List[str]]]:
    """Index one git-log pass by commit hash into subject, body and paths."""
    history: Dict[str, Tuple[str, str, List[str]]] = {}
    for chunk in raw.split(RECORD_SEP):
        if not chunk:
            continue
        parts = chunk.split(FIELD_SEP, 3)
        if len(parts) != 4:
            raise SystemExit("error: unexpected git log record shape")
        old = parts[0].decode("ascii", errors="replace").strip()
        subject = parts[1].decode("utf-8", errors="replace")
        body = parts[2].decode("utf-8", errors="replace")
        paths = [line for line in parts[3].decode("utf-8", errors="replace").split("\n") if line]
        history[old] = (subject, body, paths)
    return history


# ───────────────────────────────────────────────────────────────
# 3. SPEC PATH GRAMMAR
# ───────────────────────────────────────────────────────────────


def strip_spec_root(path: str) -> Optional[str]:
    """Return a specs-relative path for a specs/ or .opencode/specs/ path."""
    for root in SPEC_ROOTS:
        if path.startswith(root):
            return path[len(root):]
    return None


def packet_candidates(relative: str, drop_last: bool) -> List[str]:
    """Return the progressively deeper numbered packet paths on a specs path."""
    parts = [part for part in relative.split("/") if part and part != Z_ARCHIVE]
    if drop_last and parts:
        parts = parts[:-1]
    if len(parts) < 2:
        return []
    candidates: List[str] = []
    current = [parts[0]]
    for part in parts[1:]:
        if PACKET_DIR_RE.match(part) is None:
            break
        current = current + [part]
        candidates.append("/".join(current))
    return candidates


def leading_number(packet: str) -> Optional[int]:
    """Return the first three-digit packet number on a packet path."""
    for part in packet.split("/")[1:]:
        if PACKET_DIR_RE.match(part):
            return int(part[:3])
    return None


def build_existing_dirs(tree_paths: Iterable[str]) -> Set[str]:
    """Collect every directory path under specs/, normalized and archive-stripped."""
    directories: Set[str] = set()
    for path in tree_paths:
        relative = strip_spec_root(path)
        if relative is None:
            continue
        parts = [part for part in relative.split("/") if part and part != Z_ARCHIVE]
        for depth in range(1, len(parts)):
            directories.add("/".join(parts[:depth]))
    return directories


def build_skill_topics(skill_paths: Iterable[str]) -> Dict[str, str]:
    """Map every skill directory name to the topic directory that contains it."""
    topics: Dict[str, str] = {}
    for path in skill_paths:
        if not path.endswith("/SKILL.md"):
            continue
        relative = path[len(SKILL_ROOT):-len("/SKILL.md")]
        parts = relative.split("/")
        if not parts or not parts[0]:
            continue
        topics.setdefault(parts[0], parts[0])
        if len(parts) >= 2:
            topics[parts[1]] = parts[0]
    return topics


# ───────────────────────────────────────────────────────────────
# 4. TOUCH SIGNAL
# ───────────────────────────────────────────────────────────────


def is_excluded_path(path: str) -> bool:
    """Return True for rolling, generated or diagnostic spec files."""
    parts = path.split("/")
    name = parts[-1]
    if name in EXCLUDED_BASENAMES or name.endswith(EXCLUDED_SUFFIXES):
        return True
    return any(part in EXCLUDED_SEGMENTS for part in parts)


def touched_packets(paths: Iterable[str]) -> Dict[str, int]:
    """Count changed files per touched packet, honouring the exclusion list."""
    counts: Dict[str, int] = {}
    for path in paths:
        if is_excluded_path(path):
            continue
        relative = strip_spec_root(path)
        if relative is None:
            continue
        candidates = packet_candidates(relative, drop_last=True)
        if not candidates:
            continue
        packet = candidates[-1]
        counts[packet] = counts.get(packet, 0) + 1
    return counts


def resolve_ref_packet(value: str, existing_dirs: Set[str]) -> Optional[str]:
    """Resolve a Refs:/Spec: value to the deepest packet it names.

    An existing packet wins. A well-shaped path under a known track still maps when
    the packet has since moved or been archived, because the packet name is what a
    reader searches for, not the directory's current location.
    """
    relative = strip_spec_root(value)
    if relative is None:
        relative = value
    candidates = packet_candidates(relative, drop_last=False)
    resolved: Optional[str] = None
    for candidate in candidates:
        if candidate in existing_dirs:
            resolved = candidate
    if resolved is None and candidates:
        track = candidates[0].split("/", 1)[0]
        if strip_spec_root(value) is not None or track in existing_dirs:
            resolved = candidates[-1]
    return resolved


def find_ref_packet(body: str, existing_dirs: Set[str]) -> Optional[str]:
    """Return the first packet named by a Refs: or Spec: body line."""
    for line in body.split("\n"):
        match = TRAILER_RE.match(line.strip())
        if match is None:
            continue
        packet = resolve_ref_packet(match.group(2), existing_dirs)
        if packet is not None:
            return packet
    return None


# ───────────────────────────────────────────────────────────────
# 5. CASCADE
# ───────────────────────────────────────────────────────────────


def extract_scope(subject: str) -> Optional[str]:
    """Return the parenthesised subject scope, or None when absent."""
    match = SCOPE_RE.match(subject)
    return match.group(1) if match else None


def segment_numbers(packet: str) -> List[int]:
    """Return every three-digit number on a packet path, outermost first."""
    return [int(part[:3]) for part in packet.split("/")[1:] if PACKET_DIR_RE.match(part)]


def _scope_tokens(name: str) -> Set[str]:
    return {token for token in name.replace("_", "-").split("-") if token and token not in SCOPE_NOISE_TOKENS}


def is_contradicting_scope(
    scope: Optional[str], packet: str, existing_dirs: Set[str], skill_topics: Dict[str, str]
) -> bool:
    """Return True only when the subject scope positively names something other than the packet.

    A missing, generic or unknown scope cannot contradict a single touched packet. A scope that
    shortens the track name, shares a token with it, names a skill under it, or carries a phase
    number that appears on the packet path agrees with it. A scope that names another known
    track, another skill's topic, or a packet number absent from the path contradicts it.
    """
    if not scope or scope in GENERIC_SCOPES:
        return False
    track = packet.split("/", 1)[0]
    if scope == track:
        return False
    numeric = NUMERIC_SCOPE_RE.match(scope)
    if numeric:
        return int(numeric.group(1)) not in segment_numbers(packet)
    if scope.replace("-", "") == track.replace("-", ""):
        return False
    if _scope_tokens(scope) & _scope_tokens(track):
        return False
    topic = skill_topics.get(scope)
    if topic == track:
        return False
    if scope in existing_dirs:
        return True
    return topic is not None and topic != track


def dominant_packet(candidates: List[str], counts: Dict[str, int]) -> Tuple[Optional[str], bool]:
    """Pick the most-touched packet; break ties by depth then lexicographic."""
    top = max(counts[packet] for packet in candidates)
    tied = [packet for packet in candidates if counts[packet] == top]
    ranked = sorted(tied, key=lambda packet: (-packet.count("/"), packet))
    if len(ranked) > 1 and ranked[0] == ranked[1]:
        return None, True
    return ranked[0], False


def decide(
    subject: str, body: str, paths: List[str], existing_dirs: Set[str], skill_topics: Dict[str, str]
) -> Dict[str, object]:
    """Apply the mapping cascade to one commit and return its decision."""
    counts = touched_packets(paths)
    candidates = sorted(counts)
    packet = find_ref_packet(body, existing_dirs)
    if packet is not None:
        return _decision(packet, "refs", False, candidates)
    if subject.startswith(EXEMPT_PREFIXES):
        return _decision(None, "none", False, candidates)
    scope = extract_scope(subject)
    numeric = NUMERIC_SCOPE_RE.match(scope) if scope else None
    if numeric:
        wanted = int(numeric.group(1))
        matching = [item for item in candidates if wanted in segment_numbers(item)]
        if len(matching) == 1:
            return _decision(matching[0], "scope-dir", False, candidates)
    if len(candidates) == 1:
        if not is_contradicting_scope(scope, candidates[0], existing_dirs, skill_topics):
            return _decision(candidates[0], "unique-touch", False, candidates)
    if len(candidates) > 1:
        winner, tie = dominant_packet(candidates, counts)
        if winner is None:
            return _decision(None, "none", tie, candidates)
        return _decision(winner, "dominant-touch", tie, candidates)
    return _decision(None, "none", False, candidates)


def _decision(spec: Optional[str], rule: str, tie: bool, candidates: List[str]) -> Dict[str, object]:
    """Assemble one decision record."""
    return {"spec": spec, "rule": rule, "tie": tie, "candidates": list(candidates)}


# ───────────────────────────────────────────────────────────────
# 6. OUTPUT
# ───────────────────────────────────────────────────────────────


def build_rows(
    hashes: List[str],
    history: Dict[str, Tuple[str, str, List[str]]],
    existing_dirs: Set[str],
    skill_topics: Dict[str, str],
) -> List[Dict[str, object]]:
    """Build one plan row per commit, in ordinal order."""
    rows: List[Dict[str, object]] = []
    for index, old in enumerate(hashes, start=1):
        entry = history.get(old)
        if entry is None:
            raise SystemExit(f"error: git log did not return commit {old}")
        subject, body, paths = entry
        decision = decide(subject, body, paths, existing_dirs, skill_topics)
        rows.append(
            {
                "old": old,
                "ordinal": f"{index:07d}",
                "spec": decision["spec"],
                "rule": decision["rule"],
                "tie": decision["tie"],
                "candidates": decision["candidates"],
            }
        )
    return rows


def write_plan(out_path: Path, rows: List[Dict[str, object]]) -> None:
    """Write the plan as one JSON object per line."""
    with out_path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row) + "\n")


def write_sample(
    out_path: Path,
    rows: List[Dict[str, object]],
    history: Dict[str, Tuple[str, str, List[str]]],
    count: int,
    seed: int,
) -> None:
    """Write a seeded random slice with subject and paths for hand judgment."""
    size = min(count, len(rows))
    indices = sorted(random.Random(seed).sample(range(len(rows)), size))
    with Path(f"{out_path}.sample.jsonl").open("w", encoding="utf-8") as handle:
        for index in indices:
            row = rows[index]
            subject, _body, paths = history[str(row["old"])]
            handle.write(json.dumps(dict(row, subject=subject, paths=sorted(paths))) + "\n")


def summarise(rows: List[Dict[str, object]]) -> str:
    """Format the total, per-rule counts and tie count."""
    counts = Counter(str(row["rule"]) for row in rows)
    lines = [f"total: {len(rows)}"]
    lines.extend(f"{rule}: {counts.get(rule, 0)}" for rule in RULE_ORDER)
    lines.append(f"ties: {sum(1 for row in rows if row['tie'])}")
    return "\n".join(lines)


# ───────────────────────────────────────────────────────────────
# 7. CLI
# ───────────────────────────────────────────────────────────────


def parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    """Parse the command line."""
    parser = argparse.ArgumentParser(description="Build the frozen history rewrite plan.")
    parser.add_argument("--repo", required=True, metavar="PATH", help="repository to read")
    parser.add_argument("--tip", required=True, metavar="SHA", help="commit the plan walks from")
    parser.add_argument("--out", required=True, metavar="JSONL", help="plan output path")
    parser.add_argument("--sample", type=int, default=0, metavar="N", help="also write N random rows")
    parser.add_argument("--seed", type=int, default=0, metavar="S", help="sample RNG seed")
    return parser.parse_args(argv)


def main(argv: Optional[Sequence[str]] = None) -> int:
    """Build the plan, write the outputs and print the summary."""
    args = parse_args(argv)
    hashes = ordered_hashes(args.repo, args.tip)
    history = parse_history(read_history(args.repo, args.tip))
    existing_dirs = build_existing_dirs(read_tree_paths(args.repo, args.tip, "specs"))
    skill_topics = build_skill_topics(read_tree_paths(args.repo, args.tip, ".opencode/skills"))
    rows = build_rows(hashes, history, existing_dirs, skill_topics)
    out_path = Path(args.out)
    write_plan(out_path, rows)
    if args.sample > 0:
        write_sample(out_path, rows, history, args.sample, args.seed)
    print(summarise(rows), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
