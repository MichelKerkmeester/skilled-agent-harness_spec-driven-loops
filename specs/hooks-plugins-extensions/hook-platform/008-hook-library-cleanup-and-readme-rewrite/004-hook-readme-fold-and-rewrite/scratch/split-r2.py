#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SESSION-HANDOVER SPLIT CORRECTION BRIEF
# ───────────────────────────────────────────────────────────────

"""
Turn a split brief into a correction pass for the document it wrote.

Usage: python3 split-r2.py <doc name> <notes file> <suffix>
Output: writes briefs/split--<doc>-<suffix>.md and prints its line count.
        Exit 2 on a brief of 90 lines or more.
"""

import sys
from pathlib import Path

SCRATCH = Path(__file__).resolve().parent
HEADER = ("   - This is a correction pass. The output file exists and passes the check. Keep its shape"
          " and every other line, and fix only the defects below.")


def main() -> int:
    """Swap the facts step of the first brief for the correction notes."""
    name, notes, suffix = sys.argv[1], Path(sys.argv[2]), sys.argv[3]
    text = (SCRATCH / "briefs" / f"split--{name}.md").read_text(encoding="utf-8")
    start = text.index("5. Facts for this file:\n") + len("5. Facts for this file:\n")
    end = text.index("6. Write the output file")
    text = text[:start] + HEADER + "\n" + notes.read_text(encoding="utf-8").rstrip() + "\n" + text[end:]
    text = text.replace("It does not exist yet:", "It exists:")
    count = len(text.splitlines())
    if count >= 90:
        print(f"Error: {count} lines", file=sys.stderr)
        return 2
    (SCRATCH / "briefs" / f"split--{name}-{suffix}.md").write_text(text, encoding="utf-8")
    print(f"split--{name}-{suffix} lines={count}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
