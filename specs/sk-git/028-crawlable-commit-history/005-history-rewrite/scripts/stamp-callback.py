#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: commit message stamper and citation remapper
# ───────────────────────────────────────────────────────────────
"""
Stamp the machine trailer paragraph onto rewritten commit messages.

The history rewrite needs every commit to end with the same trailer
paragraph a fresh commit gets: a ``Spec:`` line when the frozen plan
found a packet and a ``Commit-Id:`` line always.  This module owns that
message shape plus the second-pass citation remap, and it stays free of
git calls so both callbacks can import it inside ``git filter-repo``.

The trailer paragraph joins the message's existing final paragraph when
that paragraph is already a run of ``Token: value`` lines, so git's
trailer parser sees one block.  New keys are placed ahead of the lines
that were already there.

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
TRAILER_LINE = re.compile(rb"^[A-Za-z][A-Za-z0-9-]*:[ \t]+\S.*$")
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


def _is_trailer_block(lines: List[bytes]) -> Optional[int]:
    """Return the start of a final all-trailer paragraph, or None.

    The final paragraph qualifies only when every trailing line is a
    ``Token: value`` line and it is separated from the body by a blank
    line, or the message is nothing but trailers.
    """
    start = len(lines)
    while start > 0 and TRAILER_LINE.match(_line_body(lines[start - 1])):
        start -= 1
    if start == len(lines):
        return None
    if start > 0 and lines[start - 1].strip() != b"":
        return None
    return start


def stamp_message(message: bytes, row: dict) -> bytes:
    """Return message with the plan's Spec and Commit-Id trailers.

    The plan's packet replaces a Refs: line that names the same packet
    and leaves a Refs: line that names another one alone.  Existing
    Spec: and Commit-Id: lines are replaced, so a second stamp is
    idempotent.
    """
    spec = row.get("spec")
    ordinal = str(row["ordinal"])

    kept: List[bytes] = []
    for line in message.split(b"\n"):
        body = _line_body(line)
        ref_match = REFS_LINE.match(body)
        if ref_match is not None and spec is not None and _names_same_packet(ref_match.group(1), spec):
            continue
        if SPEC_LINE.match(body) or COMMIT_ID_LINE.match(body):
            continue
        kept.append(line)

    while kept and kept[-1].strip() == b"":
        kept.pop()
    if kept:
        kept[-1] = kept[-1].rstrip()

    keys: List[bytes] = []
    if spec:
        keys.append(b"Spec: " + str(spec).encode("utf-8"))
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
# 4. CITATION REMAP
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
# 5. CLI
# ───────────────────────────────────────────────────────────────


def main(argv: Optional[List[str]] = None) -> int:
    """Print the usage line; the module is a library, not a command."""
    del argv
    print("usage: stamp-callback.py (library imported by rewrite-run.sh callbacks)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
