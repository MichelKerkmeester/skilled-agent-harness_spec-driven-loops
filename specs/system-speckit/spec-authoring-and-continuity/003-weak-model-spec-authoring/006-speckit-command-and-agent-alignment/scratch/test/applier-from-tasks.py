import json, sys
ledger, row_id = sys.argv[1], sys.argv[2]
root = sys.argv[3] if len(sys.argv) > 3 else "."
rows = [json.loads(l) for l in open(ledger, encoding="utf-8") if l.strip()]
match = [r for r in rows if r["id"] == row_id]
if len(match) != 1:
    sys.exit(f"FAIL {row_id}: expected 1 ledger row, found {len(match)}")
r = match[0]
if r["expected_text"] in ("OWNED BY PHASE", "DELETE FILE"):
    sys.exit(f"FAIL {row_id}: not a text replacement ({r['expected_text']})")
path = f"{root}/{r['file']}"
text = open(path, encoding="utf-8").read()
if r["expected_text"] in text:
    sys.exit(f"FAIL {row_id}: expected text already present in {r['file']}")
count = text.count(r["locator"])
if count != 1:
    sys.exit(f"FAIL {row_id}: locator found {count} times in {r['file']}")
open(path, "w", encoding="utf-8").write(text.replace(r["locator"], r["expected_text"], 1))
print(f"APPLIED {row_id} {r['file']}")
