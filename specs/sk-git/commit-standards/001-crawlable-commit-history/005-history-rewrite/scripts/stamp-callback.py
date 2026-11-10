#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: commit message stamper and citation remapper
# ───────────────────────────────────────────────────────────────
"""
Stamp the machine trailer paragraph onto rewritten commit messages.

The history rewrite needs every commit to end with the same trailer
paragraph a fresh commit gets: one ``Spec:`` line per packet the commit
touched, dominant first, and a ``Commit-Id:`` line always.  This module
owns that message shape, the planned subject replacement, the
attribution strip and the second-pass citation remap, and it stays free
of git calls so both callbacks can import it inside ``git filter-repo``.

The trailer paragraph joins the message's existing final paragraph when
that paragraph is already a run of ``Token: value`` lines, so git's
trailer parser sees one block.  New keys are placed ahead of the lines
that were already there.  Attribution lines are dropped wherever they
sit: history carries the work and nothing else.

The subject grammar the commit-msg hook enforces is ported here, so the
runner's invariants can prove every rewritten subject still passes it.

Usage:
    Imported by rewrite-run.sh; no command line of its own.

Output:
    Pure functions over bytes.  stamp_message() returns the message the
    commit callback assigns, remap_message() the one the message
    callback returns.
"""
import json
import re
import sys
from typing import Dict, List, Optional

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# A Refs: body line whose value names a packet, matched on a byte line.
REFS_LINE = re.compile(rb"^Refs:[ \t]*(\S.*?)[ \t]*$")
# The keys this stamper owns; an existing copy is replaced, not doubled.
SPEC_LINE = re.compile(rb"^Spec:")
COMMIT_ID_LINE = re.compile(rb"^Commit-Id:")
# A line git's trailer parser recognizes as ``Token: value``.
TRAILER_LINE = re.compile(rb"^([A-Za-z][A-Za-z0-9-]*):[ \t]+\S.*$")
# Legacy messages end in a paragraph such as ``chore: align skill docs``: the shape of a
# trailer, the meaning of a subject. Treating it as a trailer block would bury the keys
# above prose, where git's parser no longer sees them.
PROSE_TOKENS = frozenset(
    {b"feat", b"fix", b"docs", b"chore", b"refactor", b"test", b"ci", b"build", b"style", b"perf",
     b"release", b"revert", b"merge", b"spec", b"review", b"research", b"commit", b"wip", b"note", b"config"}
)
# Attribution the rewritten history must not carry: the named keys wherever
# they sit, and any trailer-shaped line naming the assistant vendor.
FORBIDDEN_KEY_LINE = re.compile(rb"^(Co-Authored-By|Claude-Session):")
ANTHROPIC_TOKEN = re.compile(rb"anthropic", re.IGNORECASE)
# The subject grammar the commit-msg hook enforces, ported so the runner's
# invariant can prove a rewritten subject still passes it.
SUBJECT_TYPES = (
    "build", "chore", "ci", "docs", "feat", "fix", "merge", "perf",
    "refactor", "release", "revert", "style", "test",
)
SUBJECT_RE = re.compile(
    r"^(?P<type>" + "|".join(SUBJECT_TYPES) + r")"
    r"\((?P<scope>[a-z0-9]+(?:-[a-z0-9]+)*)\)(?P<breaking>!)?: (?P<summary>.+)$"
)
NUMERIC_SCOPE_RE = re.compile(r"^[0-9]+$")
EXEMPT_SUBJECTS = (b"Merge ", b'Revert "', b"fixup! ", b"squash! ", b"amend! ")
LOWERCASE_START_RE = re.compile(r"^[a-z]")
REPEATED_SPACE_RE = re.compile(r" {2,}")
TRAILING_PUNCT_RE = re.compile(r"[.!?;:,]$")
VAGUE_SUMMARIES = frozenset({
    "change files", "changes", "checkpoint", "cleanup", "fix", "fix bug", "misc",
    "misc changes", "miscellaneous changes", "stuff", "update", "update files",
    "update stuff", "various changes", "work in progress", "wip",
})
MAX_SUBJECT_LENGTH = 100
# A commit citation between non-alphanumeric boundaries, 10 to 40 hex.
HEX_TOKEN = re.compile(rb"(?<![0-9a-zA-Z])[0-9a-f]{10,40}(?![0-9a-zA-Z])")
SPEC_ROOTS = (b".opencode/specs/", b"specs/")
ORDINAL_LENGTH = 7


# ───────────────────────────────────────────────────────────────
# 2. PLAN
# ───────────────────────────────────────────────────────────────


def load_plan(path: str) -> Dict[bytes, dict]:
    """Read a JSONL plan and index it by the old commit SHA as bytes."""
    plan: Dict[bytes, dict] = {}
    with open(path, "r", encoding="utf-8") as handle:
        for line in handle:
            stripped = line.strip()
            if not stripped:
                continue
            row = json.loads(stripped)
            plan[row["old"].encode("ascii")] = row
    return plan


# ───────────────────────────────────────────────────────────────
# 3. MESSAGE SHAPE
# ───────────────────────────────────────────────────────────────


def _line_body(line: bytes) -> bytes:
    """Return the line without a trailing carriage return, if any."""
    return line[:-1] if line.endswith(b"\r") else line


def _strip_spec_root(value: bytes) -> bytes:
    """Return a specs-relative path from a specs/ or .opencode/specs/ path."""
    for root in SPEC_ROOTS:
        if value.startswith(root):
            return value[len(root):]
    return value


def _names_same_packet(value: bytes, spec: str) -> bool:
    """Return True when a Refs: value resolves to the plan's packet path."""
    candidate = _strip_spec_root(value).rstrip(b"/")
    return candidate == spec.encode("utf-8")


def _is_trailer_line(body: bytes) -> bool:
    """Return True for a ``Token: value`` line whose token is not a subject type."""
    match = TRAILER_LINE.match(body)
    return match is not None and match.group(1).lower() not in PROSE_TOKENS


def _is_trailer_block(lines: List[bytes]) -> Optional[int]:
    """Return the start of a final all-trailer paragraph, or None.

    The final paragraph qualifies only when every trailing line is a
    ``Token: value`` line and it is separated from the body by a blank
    line, or the message is nothing but trailers.
    """
    start = len(lines)
    while start > 0 and _is_trailer_line(_line_body(lines[start - 1])):
        start -= 1
    if start == len(lines):
        return None
    if start > 0 and lines[start - 1].strip() != b"":
        return None
    return start


def is_forbidden_line(line: bytes) -> bool:
    """Return True for an attribution line the history must not carry.

    The named keys are forbidden wherever they sit; a trailer-shaped
    line naming the assistant vendor is forbidden too.  A prose line
    that merely mentions the vendor is not, because only trailers are
    machine data.
    """
    body = _line_body(line)
    if FORBIDDEN_KEY_LINE.match(body) is not None:
        return True
    return ANTHROPIC_TOKEN.search(body) is not None and _is_trailer_line(body)


def _collapse_blank_runs(lines: List[bytes]) -> List[bytes]:
    """Return the lines with each run of blank lines reduced to one."""
    collapsed: List[bytes] = []
    for line in lines:
        if line.strip() == b"" and collapsed and collapsed[-1].strip() == b"":
            continue
        collapsed.append(line)
    return collapsed


def packet_paths(row: dict) -> List[str]:
    """Return the row's touched packets, dominant first, deduplicated."""
    names: List[str] = []
    spec = row.get("spec")
    if spec:
        names.append(str(spec))
    candidates = row.get("candidates")
    if isinstance(candidates, list):
        for candidate in candidates:
            if candidate:
                names.append(str(candidate))
    unique: List[str] = []
    seen = set()
    for name in names:
        if name not in seen:
            seen.add(name)
            unique.append(name)
    return unique


def replace_subject(message: bytes, subject_new: Optional[str]) -> bytes:
    """Return the message with its first line replaced by the planned subject.

    A null or empty plan value keeps the subject the commit already has,
    which is what an exempt or residual row means.
    """
    if not subject_new:
        return message
    lines = message.split(b"\n")
    lines[0] = subject_new.encode("utf-8")
    return b"\n".join(lines)


def stamp_message(message: bytes, row: dict, subject_new: Optional[str] = None) -> bytes:
    """Return message with the planned subject and machine trailers.

    A planned subject replaces the first line; a null one leaves the
    subject alone.  Each packet the row names gets one Spec: line,
    dominant first, and a Refs: line naming one of those packets is
    dropped.  Attribution lines are stripped wherever they sit, and the
    trailer paragraph still ends the message.  Existing Spec: and
    Commit-Id: lines are replaced, so a second stamp is idempotent.
    """
    message = replace_subject(message, subject_new)
    packets = packet_paths(row)
    ordinal = str(row["ordinal"])

    dropped = 0
    kept: List[bytes] = []
    for line in message.split(b"\n"):
        body = _line_body(line)
        ref_match = REFS_LINE.match(body)
        if ref_match is not None and any(
            _names_same_packet(ref_match.group(1), packet) for packet in packets
        ):
            continue
        if SPEC_LINE.match(body) or COMMIT_ID_LINE.match(body):
            continue
        if is_forbidden_line(body):
            dropped += 1
            continue
        kept.append(line)

    if dropped:
        kept = _collapse_blank_runs(kept)

    while kept and kept[-1].strip() == b"":
        kept.pop()
    if kept:
        kept[-1] = kept[-1].rstrip()

    keys: List[bytes] = [b"Spec: " + packet.encode("utf-8") for packet in packets]
    keys.append(b"Commit-Id: " + ordinal.encode("ascii"))

    start = _is_trailer_block(kept)
    if start is not None:
        lines = kept[:start] + keys + kept[start:]
    elif kept:
        lines = kept + [b""] + keys
    else:
        lines = keys
    return b"\n".join(lines) + b"\n"


# ───────────────────────────────────────────────────────────────
# 4. SUBJECT GRAMMAR
# ───────────────────────────────────────────────────────────────


def is_exempt_subject(subject: bytes) -> bool:
    """Return True for the git-generated subjects the grammar does not judge."""
    return subject.startswith(EXEMPT_SUBJECTS)


def subject_errors(subject: bytes) -> List[str]:
    """Return the commit-msg grammar failures for one subject line."""
    text = subject.decode("utf-8", "replace")
    errors: List[str] = []
    if len(text) > MAX_SUBJECT_LENGTH:
        errors.append("subject exceeds the length cap")
    match = SUBJECT_RE.match(text)
    if match is None:
        errors.append("subject must match type(scope): a lowercase summary")
        return errors
    summary = match.group("summary")
    if NUMERIC_SCOPE_RE.match(match.group("scope")):
        errors.append("scope is numeric-only")
    if LOWERCASE_START_RE.match(summary) is None:
        errors.append("summary does not start lowercase")
    if REPEATED_SPACE_RE.search(summary):
        errors.append("summary contains repeated spaces")
    if TRAILING_PUNCT_RE.search(summary):
        errors.append("summary ends with punctuation")
    if summary in VAGUE_SUMMARIES:
        errors.append("summary is too vague")
    return errors


# ───────────────────────────────────────────────────────────────
# 5. CITATION REMAP
# ───────────────────────────────────────────────────────────────


def remap_message(message: bytes, prefix_map: Dict[str, str]) -> bytes:
    """Return message with each old hash prefix replaced by the new one.

    Only tokens of ten to forty hex characters that equal an old prefix
    are rewritten; the replacement is the new hash sliced to the token's
    length, so an abbreviation stays an abbreviation.  A message with no
    candidate token is returned unchanged.
    """
    if HEX_TOKEN.search(message) is None:
        return message

    def replace(match: "re.Match[bytes]") -> bytes:
        token = match.group(0).decode("ascii")
        new_hash = prefix_map.get(token)
        if new_hash is None:
            return match.group(0)
        return new_hash[: len(token)].encode("ascii")

    return HEX_TOKEN.sub(replace, message)


# ───────────────────────────────────────────────────────────────
# 6. CLI
# ───────────────────────────────────────────────────────────────


def main(argv: Optional[List[str]] = None) -> int:
    """Print the usage line; the module is a library, not a command."""
    del argv
    print("usage: stamp-callback.py (library imported by rewrite-run.sh callbacks)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
