#!/usr/bin/env bash
# Prove the applier is idempotent for an append row and a rewrite row, then apply all 27 rows to a copy.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../../../../.." && pwd)"
TREE="$HERE/tree-v2"
LEDGER="$HERE/rows-from-tasks.jsonl"
APP="$HERE/apply_row_v2.py"

cd "$ROOT"
rm -rf "$TREE"
mkdir -p "$TREE"
jq -r .file "$LEDGER" | sort -u | while read -r f; do
  mkdir -p "$TREE/$(dirname "$f")"
  cp "$f" "$TREE/$f"
done

echo "=== self-test on R-001, an append row ==="
jq -c 'select(.id=="R-001")' "$LEDGER" > "$HERE/one.jsonl"
python3 -I "$APP" "$HERE/one.jsonl" R-001 "$TREE"
python3 -I "$APP" "$HERE/one.jsonl" R-001 "$TREE"; echo "second_exit=$?"
diff ".skilled/commands/speckit/plan.md" "$TREE/.skilled/commands/speckit/plan.md" | grep -c '^>'

echo "=== apply the other 26 rows ==="
for id in $(jq -r .id "$LEDGER"); do
  [ "$id" = "R-001" ] && continue
  python3 -I "$APP" "$LEDGER" "$id" "$TREE"
done

echo "=== second apply of a rewrite row ==="
jq -c 'select(.id=="R-007")' "$LEDGER" > "$HERE/one7.jsonl"
python3 -I "$APP" "$HERE/one7.jsonl" R-007 "$TREE"; echo "rewrite_second_exit=$?"

echo "=== exact counts after apply ==="
python3 -I "$HERE/check_rows.py" "$LEDGER" "$TREE" > "$HERE/rcheck-v2.txt"
echo "expected_one=$(grep -c 'expected=1$' "$HERE/rcheck-v2.txt") total=$(grep -c '^RCHECK' "$HERE/rcheck-v2.txt")"

echo "=== A1 to A4 searches on the copy ==="
rg -n 'spec-folder authoring now lives in system-spec-kit \(references/workflows/spec-folder' "$TREE/.skilled/commands/speckit"; echo "A1_rc=$?"
