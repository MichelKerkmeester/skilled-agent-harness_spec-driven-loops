#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Check Doc Pointers
# ───────────────────────────────────────────────────────────────
# Assert every structured doc pointer cited in AGENTS.md resolves on disk.
# A dead pointer in the most-read surface silently misleads readers — and was
# observed to lead a research lineage to a false conclusion — so this turns that
# rot into a fail-loud check rather than a sentence that quietly goes stale.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../.." && pwd)"
AGENTS="$ROOT/AGENTS.md"
SSK="$ROOT/.opencode/skills/system-spec-kit"
BT='`' # literal backtick, held in a variable so it never opens a command substitution

if [[ ! -f "$AGENTS" ]]; then
  echo "FAIL: AGENTS.md not found at $AGENTS" >&2
  exit 2
fi

tmp="$(mktemp)"
trap 'rm -f "$tmp" "$tmp.dead"' EXIT

# Only structured references/constitutional pointers — the char class excludes
# glob/placeholder forms (e.g. NNN-name patterns) so the check never false-fails.
grep -oE "${BT}(\.opencode/skills/system-spec-kit/)?(references|constitutional)/[A-Za-z0-9_/.-]+\.md${BT}" "$AGENTS" \
  | tr -d "$BT" | sort -u > "$tmp"

: > "$tmp.dead"
while IFS= read -r p; do
  [[ -z "$p" ]] && continue
  case "$p" in
    .opencode/*) cand="$ROOT/$p" ;;
    *)           cand="$SSK/$p" ;;
  esac
  [[ -f "$cand" ]] || echo "DEAD: $p" >> "$tmp.dead"
done < "$tmp"

if [[ -s "$tmp.dead" ]]; then
  cat "$tmp.dead" >&2
  echo "FAIL: AGENTS.md cites doc pointer(s) that do not resolve" >&2
  exit 1
fi

echo "PASS: all AGENTS.md references/constitutional doc pointers resolve"
exit 0
