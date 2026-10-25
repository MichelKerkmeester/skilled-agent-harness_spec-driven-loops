#!/usr/bin/env bash
# Guard: every hand-written example keeps the template's required anchors, adds no
# anchor the template does not allow, and carries a description a reader can use.
# Read-only. Prints one line per failure and exits 1.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TEMPLATES="$ROOT/templates"
UTIL="$ROOT/runtime/cli/utils/template-structure.js"
EXAMPLES="${1:-$TEMPLATES/examples}"
status=0

fail() {
  printf 'FAIL %s: %s\n' "$1" "$2"
  status=1
}

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

    report="$(node "$UTIL" compare "$level" "$name" "$example" anchors 2>&1)"
    rc=$?
    if [[ $rc -ne 0 ]]; then
      fail "$example" "template-structure compare exited $rc"
      continue
    fi
    printf '%s\n' "$report" | rg '^(missing_anchor|extra_anchor)' \
      | while read -r kind anchor; do
          printf 'FAIL %s: %s %s\n' "$example" "$kind" "$anchor"
        done
    printf '%s\n' "$report" | rg -q '^(missing_anchor|extra_anchor)' && status=1
  done
done

[[ $status -eq 0 ]] && echo "EXAMPLE_DRIFT_OK"
exit $status
