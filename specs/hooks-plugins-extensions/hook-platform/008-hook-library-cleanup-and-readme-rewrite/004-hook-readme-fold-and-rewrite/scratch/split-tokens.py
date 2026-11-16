#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SESSION-HANDOVER SPLIT TOKEN CHECK
# ───────────────────────────────────────────────────────────────

"""
Check that each sibling document keeps the backticked tokens of the lines it took.

G7 reads the README together with every sibling, so while the old README is
still on disk it passes no matter what a sibling dropped. This check reads each
sibling alone against its own line ranges of the saved README.

Run it from the repository root.

Usage: python3 split-tokens.py
Output: one "SPLIT <doc> missing=N" line per document, then each missing token.
        Exit 0 when nothing is missing, 1 otherwise.
"""

import importlib.util
import sys
from pathlib import Path

SCRATCH = Path(__file__).resolve().parent
SAVED = SCRATCH / "before" / "session-handover" / "README.md"
FOLDER = Path(".skilled/hooks/session-handover")
REMOVABLE = {"023-session-relaunch-loop/003"}
# Line ranges of the saved README each document takes, matching the briefs.
RANGES = {
    "handoff-protocol.md": [(120, 158), (193, 198), (221, 240)],
    "goal-carry-over.md": [(159, 192), (199, 220)],
    "runtime-behavior.md": [(21, 74), (101, 119)],
    "state-files.md": [(241, 281)],
    "troubleshooting.md": [(311, 334)],
}


def load_gates():
    """Load readme-gates.py, so both scripts read inline tokens the same way."""
    spec = importlib.util.spec_from_file_location("readme_gates", SCRATCH / "readme-gates.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> int:
    """Print the tokens each document lost from its own source lines."""
    gates = load_gates()
    lines = SAVED.read_text(encoding="utf-8").splitlines()
    failed = 0
    for name, ranges in RANGES.items():
        source = "\n".join("\n".join(lines[start - 1:end]) for start, end in ranges)
        target = FOLDER / name
        text = target.read_text(encoding="utf-8") if target.is_file() else ""
        # Each range starts at a heading, so inline_tokens reads it all as body.
        tokens = gates.inline_tokens(source)
        missing = [t for t in tokens if t not in text and t not in REMOVABLE]
        failed += bool(missing) or not text
        print(f"SPLIT {name} missing={len(missing)}" + ("" if text else " (no file)"))
        for token in missing:
            print(f"  {token}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
