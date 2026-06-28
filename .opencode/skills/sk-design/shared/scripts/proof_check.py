#!/usr/bin/env python3
"""Deterministic proof-of-application gate for sk-design context-loading.

The benchmark showed the contract changes behaviour when handed to a delegate,
but nothing makes the orchestrator's own path *prove* it. This is that gate: a
build/delivery/CI step runs it on the filled proof-of-application card (or the
notes file that embeds it) and it exits non-zero unless every required proof
field is present and the verdict reads READY. A calculator for "is the contract
actually applied", not a vibe check.

Usage:
  proof_check.py notes.md
  proof_check.py --json notes.md
  proof_check.py --require-cards notes.md   # also require both card sections
  proof_check.py --require-source-proof notes.md

Required proof fields (matched case-insensitively, tolerant of formatting):
  REGISTER / DIALS, CONTRAST PAIRS, INTERFACE PREFLIGHT, AUDIT EVIDENCE,
  plus a READY verdict.
Exit: 0 = complete + READY; 1 = missing field or NOT READY; 2 = usage error.
"""
import hashlib
import json
from pathlib import Path
import re
import sys
from typing import Optional

# label -> regexes that satisfy it (any match counts)
PROOF_FIELDS = {
    "REGISTER / DIALS": [r"\bregister\b.*\bdials?\b", r"\bregister\s*/\s*dials\b", r"\bVARIANCE\b.*\bDENSITY\b"],
    "CONTRAST PAIRS": [r"\bcontrast[\s-]*pairs?\b", r"\bcontrast[\s-]*pair\s+inventory\b"],
    "INTERFACE PREFLIGHT": [r"\binterface\s+pre-?flight\b", r"\bpre-?flight\b.*\b(pass|fail|ship)\b"],
    "AUDIT EVIDENCE": [r"\baudit\s+evidence\b", r"\bevidence\s+labels?\b", r"\bconfirmed\b.*\binferred\b.*\bnot[\s-]*assessed\b"],
}
CARD_SECTIONS = {
    "Context Loaded card": [r"context[\s-]*loaded\s+card"],
    "Proof Of Application card": [r"proof[\s-]*of[\s-]*application\s+card"],
}
# Verdict detection is checkbox-aware: a card lists both "[x] READY" and
# "[ ] NOT READY" as options, so match only the CHECKED/asserted form, never the
# bare unchecked label.
READY = re.compile(r"(?:\[x\]|\*\*|verdict[:\s*]+|result[:\s*]+)\s*READY\b", re.I)
NOT_READY = re.compile(r"(?:\[x\]|\*\*)\s*NOT[\s-]*READY\b", re.I)
SOURCE_PROOF_HEADING = re.compile(r"^#{1,6}\s+.*SOURCE\s+PROOF.*$", re.I)
MARKDOWN_HEADING = re.compile(r"^#{1,6}\s+")
SHA256 = re.compile(r"^(?:sha256:)?([0-9a-f]{64})$", re.I)


def _present(text: str, patterns) -> bool:
    return any(re.search(p, text, re.I | re.S) for p in patterns)


def _clean_cell(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == "`" and value[-1] == "`":
        value = value[1:-1].strip()
    return value


def _is_placeholder(value: str) -> bool:
    cleaned = _clean_cell(value)
    return not cleaned or bool(re.fullmatch(r"(?:sha256:)?_+", cleaned))


def _split_table_row(line: str) -> list[str]:
    line = line.strip()
    if not line.startswith("|") or not line.endswith("|"):
        return []
    return [cell.strip() for cell in line.strip("|").split("|")]


def _is_separator_row(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell.strip()) for cell in cells)


def _find_source_proof_rows(text: str) -> list[dict]:
    lines = text.splitlines()
    start = None
    for i, line in enumerate(lines):
        if SOURCE_PROOF_HEADING.search(line):
            start = i + 1
            break
    if start is None:
        return []

    rows = []
    in_table = False
    for line in lines[start:]:
        if MARKDOWN_HEADING.match(line):
            break
        cells = _split_table_row(line)
        if not cells:
            if in_table:
                break
            continue
        if len(cells) != 4:
            continue
        normalized = [_clean_cell(cell).lower() for cell in cells]
        if normalized == ["path", "sha256", "anchor", "echo"] or _is_separator_row(cells):
            in_table = True
            continue
        in_table = True
        if all(_is_placeholder(cell) for cell in cells):
            continue
        rows.append({
            "path": _clean_cell(cells[0]),
            "sha256": _clean_cell(cells[1]),
            "anchor": _clean_cell(cells[2]),
            "echo": _clean_cell(cells[3]),
        })
    return rows


def _repo_root(card_path: Optional[str]) -> Path:
    start = Path(card_path).resolve().parent if card_path else Path.cwd().resolve()
    for candidate in (start, *start.parents):
        if (candidate / ".opencode").exists() or (candidate / ".git").exists():
            return candidate
    return Path.cwd().resolve()


def _validate_source_proof(text: str, card_path: Optional[str]) -> dict:
    rows = _find_source_proof_rows(text)
    result = {
        "rows": len(rows),
        "items": [],
        "missing": [],
        "ok": True,
    }
    if not rows:
        result["missing"].append("source-proof rows missing")
        result["ok"] = False
        return result

    root = _repo_root(card_path)
    for row in rows:
        item = {"path": row["path"], "ok": False, "errors": []}
        if _is_placeholder(row["path"]):
            item["errors"].append("source path missing")
        if _is_placeholder(row["anchor"]):
            item["errors"].append("anchor missing")
        if _is_placeholder(row["echo"]):
            item["errors"].append("anchor echo absent/forged")

        digest_match = SHA256.match(row["sha256"])
        if not digest_match:
            item["errors"].append("digest malformed")

        raw = None
        if not item["errors"] or digest_match:
            try:
                with open(root / row["path"], "rb") as fh:
                    raw = fh.read()
            except OSError:
                item["errors"].append("source file unreadable")

        if raw is not None and digest_match:
            actual = hashlib.sha256(raw).hexdigest()
            if actual != digest_match.group(1).lower():
                item["errors"].append("digest mismatch")

        if raw is not None and not _is_placeholder(row["echo"]):
            try:
                source_text = raw.decode("utf-8")
            except UnicodeDecodeError:
                source_text = raw.decode("utf-8", errors="replace")
            if row["echo"] not in source_text:
                item["errors"].append("anchor echo absent/forged")

        item["ok"] = not item["errors"]
        result["items"].append(item)
        if item["errors"]:
            result["missing"].extend(f"{row['path']}: {error}" for error in item["errors"])

    result["ok"] = not result["missing"]
    return result


def check(text: str, require_cards: bool, require_source_proof: bool = False, source_path: Optional[str] = None) -> dict:
    fields = {label: _present(text, pats) for label, pats in PROOF_FIELDS.items()}
    cards = {label: _present(text, pats) for label, pats in CARD_SECTIONS.items()} if require_cards else {}
    not_ready = bool(NOT_READY.search(text))
    ready = bool(READY.search(text)) and not not_ready
    missing = [k for k, v in fields.items() if not v] + [k for k, v in cards.items() if not v]
    source_proof = _validate_source_proof(text, source_path) if require_source_proof else None
    if source_proof:
        missing.extend(source_proof["missing"])
    ok = not missing and ready
    result = {
        "fields": fields,
        "cards": cards,
        "ready": ready,
        "not_ready_flag": not_ready,
        "missing": missing,
        "ok": ok,
    }
    if source_proof:
        result["source_proof"] = source_proof
    return result


def main(argv) -> int:
    as_json = "--json" in argv
    require_cards = "--require-cards" in argv
    require_source_proof = "--require-source-proof" in argv
    paths = [a for a in argv if not a.startswith("--")]
    if len(paths) != 1:
        sys.stderr.write("usage: proof_check.py [--json] [--require-cards] [--require-source-proof] <proof-card-or-notes.md>\n")
        return 2
    try:
        with open(paths[0], "r", encoding="utf-8") as fh:
            text = fh.read()
    except OSError as e:
        sys.stderr.write(f"cannot read {paths[0]}: {e}\n")
        return 2

    r = check(text, require_cards, require_source_proof, paths[0])
    if as_json:
        print(json.dumps({"file": paths[0], **r}, indent=2))
    else:
        print(f"Proof-of-application gate — {paths[0]}")
        for label, ok in {**r["fields"], **r["cards"]}.items():
            print(f"  [{'x' if ok else ' '}] {label}")
        if require_source_proof:
            source_ok = r["source_proof"]["ok"]
            print(f"  [{'x' if source_ok else ' '}] SOURCE PROOF")
        print(f"  verdict READY: {'yes' if r['ready'] else 'no'}"
              + (" (NOT READY found)" if r["not_ready_flag"] else ""))
        if r["ok"]:
            print("PASS — contract applied; all proof fields present and READY.")
        else:
            gaps = ", ".join(r["missing"]) or "verdict not READY"
            print(f"FAIL — {gaps}. Do not claim ready/accessible/release until complete.")
    return 0 if r["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
