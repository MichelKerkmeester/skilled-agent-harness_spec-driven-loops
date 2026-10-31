#!/usr/bin/env bash
# Post-dispatch check: tree diff, byte compare against the draft, validate_document.
# Usage: _check.sh <NN> <target> <after-file> [validate type]
set -u
P="$(cd "$(dirname "$0")/.." && pwd)"
nn="$1"; target="$2"; after="$3"; vtype="${4:-}"
tail -8 "$P/logs/$nn.last.txt"
git status --porcelain > "$P/logs/$nn.post.txt"
echo "--- tree diff (pre -> post)"
diff "$P/logs/$nn.pre.txt" "$P/logs/$nn.post.txt"
echo "--- cmp target vs draft"
cmp "$target" "$after" && echo "cmp: identical"
echo "--- validate_document"
if [ -n "$vtype" ]; then
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$target" --type "$vtype" > "$P/logs/$nn.vd.txt" 2>&1
else
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$target" > "$P/logs/$nn.vd.txt" 2>&1
fi
echo "vd_exit=$?"
grep -E 'Total issues|VALID|INVALID' "$P/logs/$nn.vd.txt"
