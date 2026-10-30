#!/usr/bin/env bash
# Copy the audited files, apply every row to the copy, and run the four searches there.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../../../../.." && pwd)"
TREE="$HERE/tree"
LEDGER="$HERE/rows-candidate.jsonl"

rm -rf "$TREE"
mkdir -p "$TREE"
cd "$ROOT"

jq -r .file "$LEDGER" | sort -u | while read -r f; do
  mkdir -p "$TREE/$(dirname "$f")"
  cp "$f" "$TREE/$f"
done

for id in $(jq -r .id "$LEDGER"); do
  python3 -I "$HERE/apply_row.py" "$LEDGER" "$id" "$TREE"
done

echo "=== A1 remaining references to the long authoring docs ==="
rg -n 'references/workflows/spec-folder-(authoring-checklist|write-recipe)' "$TREE/.skilled/commands/speckit" "$TREE/.skilled/agents" || true

echo "=== A2 old placeholder classifier ==="
rg -n 'placeholder-upgrade: ".*block healthy-folder status' "$TREE/.skilled/commands" || true

echo "=== A3 checklist.md in commands and agents ==="
rg -n -i 'checklist\.md' "$TREE/.skilled/commands/speckit" "$TREE/.skilled/agents" || true

echo "=== A4 writer told to read a template instead of an example ==="
rg -n 'level contract or manifest templates|Read .*\.tmpl' "$TREE/.skilled/agents" "$TREE/.skilled/commands/speckit" || true
