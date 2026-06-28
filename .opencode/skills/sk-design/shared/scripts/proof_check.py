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

Required proof fields (matched case-insensitively, tolerant of formatting):
  REGISTER / DIALS, CONTRAST PAIRS, INTERFACE PREFLIGHT, AUDIT EVIDENCE,
  plus a READY verdict.
Exit: 0 = complete + READY; 1 = missing field or NOT READY; 2 = usage error.
"""
import json
import re
import sys

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


def _present(text: str, patterns) -> bool:
    return any(re.search(p, text, re.I | re.S) for p in patterns)


def check(text: str, require_cards: bool) -> dict:
    fields = {label: _present(text, pats) for label, pats in PROOF_FIELDS.items()}
    cards = {label: _present(text, pats) for label, pats in CARD_SECTIONS.items()} if require_cards else {}
    not_ready = bool(NOT_READY.search(text))
    ready = bool(READY.search(text)) and not not_ready
    missing = [k for k, v in fields.items() if not v] + [k for k, v in cards.items() if not v]
    ok = not missing and ready
    return {
        "fields": fields,
        "cards": cards,
        "ready": ready,
        "not_ready_flag": not_ready,
        "missing": missing,
        "ok": ok,
    }


def main(argv) -> int:
    as_json = "--json" in argv
    require_cards = "--require-cards" in argv
    paths = [a for a in argv if not a.startswith("--")]
    if len(paths) != 1:
        sys.stderr.write("usage: proof_check.py [--json] [--require-cards] <proof-card-or-notes.md>\n")
        return 2
    try:
        with open(paths[0], "r", encoding="utf-8") as fh:
            text = fh.read()
    except OSError as e:
        sys.stderr.write(f"cannot read {paths[0]}: {e}\n")
        return 2

    r = check(text, require_cards)
    if as_json:
        print(json.dumps({"file": paths[0], **r}, indent=2))
    else:
        print(f"Proof-of-application gate — {paths[0]}")
        for label, ok in {**r["fields"], **r["cards"]}.items():
            print(f"  [{'x' if ok else ' '}] {label}")
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
