#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK EXAMPLE DRIFT
# ───────────────────────────────────────────────────────────────
# Guard: every hand-written example keeps the template's required anchors in the
# template's order, adds no anchor the template does not allow, and carries a
# description a reader can use. Every level has at least one example, because a
# model reads the example at its own level.
# Read-only. Prints one line per failure and exits 1. Exits 2 when rg is missing,
# since the anchor checks read the compare report through rg.
set -euo pipefail

if ! command -v rg >/dev/null 2>&1; then
  echo "check-example-drift.sh: rg (ripgrep) is required and was not found on PATH" >&2
  exit 2
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TEMPLATES="$ROOT/templates"
UTIL="$ROOT/runtime/cli/utils/template-structure.js"
EXAMPLES="${1:-$TEMPLATES/examples}"
LEVELS=(1 2 3 3+)
DRIFT='^(missing_anchor|out_of_order_anchor|extra_anchor)'
status=0

fail() {
  printf 'FAIL %s: %s\n' "$1" "$2"
  status=1
}

shopt -s nullglob

for level in "${LEVELS[@]}"; do
  docs=("$EXAMPLES/level-$level"/*.md)
  [[ ${#docs[@]} -gt 0 ]] || fail "$EXAMPLES/level-$level" "no example docs for Level $level"
done

for dir in "$EXAMPLES"/level-*; do
  level="${dir##*/level-}"
  for example in "$dir"/*.md; do
    name="$(basename "$example")"
    desc="$(awk '/^description:/{sub(/^description:[[:space:]]*/,""); print; exit}' "$example")"
    bare="${desc%\"}"
    bare="${bare#\"}"
    [[ "$bare" == *"-->"* ]] && fail "$example" "description holds an HTML comment tail"
    [[ "$bare" == [[:lower:]]* ]] && fail "$example" "description starts lowercase"
    [[ "$bare" == *. ]] || fail "$example" "description does not end with a period"

    rc=0
    report="$(node "$UTIL" compare "$level" "$name" "$example" anchors 2>&1)" || rc=$?
    if [[ $rc -ne 0 ]]; then
      fail "$example" "template-structure compare exited $rc"
      continue
    fi
    printf '%s\n' "$report" | rg "$DRIFT" \
      | while read -r kind anchor; do
          printf 'FAIL %s: %s %s\n' "$example" "$kind" "$anchor"
        done || true
    printf '%s\n' "$report" | rg -q "$DRIFT" && status=1
  done
done

[[ $status -eq 0 ]] && echo "EXAMPLE_DRIFT_OK"
exit $status
