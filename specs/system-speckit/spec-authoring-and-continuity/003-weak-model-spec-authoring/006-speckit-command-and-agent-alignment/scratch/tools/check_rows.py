# Counts exact string occurrences, so a replacement that spans more than one
# line is checked as one string instead of one count per line.
import json, sys
ledger = sys.argv[1]
root = sys.argv[2] if len(sys.argv) > 2 else "."
for line in open(ledger, encoding="utf-8"):
    if not line.strip():
        continue
    r = json.loads(line)
    text = open(f"{root}/{r['file']}", encoding="utf-8").read()
    print(f"RCHECK {r['id']} locator={text.count(r['locator'])} expected={text.count(r['expected_text'])}")
