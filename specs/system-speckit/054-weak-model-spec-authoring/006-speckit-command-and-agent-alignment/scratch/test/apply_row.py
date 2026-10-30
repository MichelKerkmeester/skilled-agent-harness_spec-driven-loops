#!/usr/bin/env python3
"""Apply one row from a JSONL ledger to a file, refusing anything but one exact match."""
import json
import sys

ledger, row_id = sys.argv[1], sys.argv[2]
root = sys.argv[3] if len(sys.argv) > 3 else "."
rows = [json.loads(line) for line in open(ledger, encoding="utf-8") if line.strip()]
match = [row for row in rows if row["id"] == row_id]
if len(match) != 1:
    sys.exit(f"FAIL {row_id}: expected 1 ledger row, found {len(match)}")
row = match[0]
if row["expected_text"] in ("OWNED BY PHASE", "DELETE FILE"):
    sys.exit(f"FAIL {row_id}: not a text replacement ({row['expected_text']})")
path = f"{root}/{row['file']}"
text = open(path, encoding="utf-8").read()
count = text.count(row["locator"])
if count != 1:
    sys.exit(f"FAIL {row_id}: locator found {count} times in {row['file']}")
open(path, "w", encoding="utf-8").write(text.replace(row["locator"], row["expected_text"], 1))
print(f"APPLIED {row_id} {row['file']}")
