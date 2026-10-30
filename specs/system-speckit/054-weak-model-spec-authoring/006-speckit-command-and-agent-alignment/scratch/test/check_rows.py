#!/usr/bin/env python3
"""Count exact string occurrences for every row, so a multi-line replacement is one string."""
import json
import sys

ledger = sys.argv[1]
root = sys.argv[2] if len(sys.argv) > 2 else "."
for line in open(ledger, encoding="utf-8"):
    if not line.strip():
        continue
    row = json.loads(line)
    text = open(f"{root}/{row['file']}", encoding="utf-8").read()
    print(f"RCHECK {row['id']} locator={text.count(row['locator'])} expected={text.count(row['expected_text'])}")
