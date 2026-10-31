#!/usr/bin/env python3
"""Insert the exact row records into plan.md at the ROWS:INSERT marker."""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.abspath(os.path.join(HERE, "..", "..", "plan.md"))
ROWS = os.path.join(HERE, "rows-candidate.jsonl")
MARKER = "<!-- ROWS:INSERT -->"

rows = [json.loads(line) for line in open(ROWS, encoding="utf-8") if line.strip()]
parts = []
for row in rows:
    kind = "MIRROR" if row["file"].startswith(".claude/") else "CHANGE"
    parts.append(
        f"**{row['id']}** `{row['check']}` {kind} `{row['file']}`\n"
        f"```text\nOLD: {row['locator']}\nNEW: {row['expected_text']}\n```\n"
    )
block = "\n".join(parts)

text = open(PLAN, encoding="utf-8").read()
if MARKER not in text:
    raise SystemExit("marker not found")
open(PLAN, "w", encoding="utf-8").write(text.replace(MARKER, block, 1))
print(f"inserted {len(rows)} rows, {len(block)} chars")
