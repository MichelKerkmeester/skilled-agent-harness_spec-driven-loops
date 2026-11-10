#!/usr/bin/env bash
# Proves each saved label row now shows its own target path and that the target resolves.
# Run from the repository root: bash <this file>
set -u
ROWS="specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/label-rows.txt"
ok=0
bad=0
while IFS= read -r row; do
  f="${row%%:*}"
  rest="${row#*:}"
  n="${rest%%:*}"
  t="$(printf '%s' "$row" | sed -E 's/.*\]\(([^)]+)\).*/\1/')"
  if test -e "$(dirname "$f")/$t" && sed -n "${n}p" "$f" | grep -qF "[\`$t\`]($t)"; then
    ok=$((ok + 1))
  else
    bad=$((bad + 1))
    echo "BAD $f:$n $t"
  fi
done < "$ROWS"
echo "OK=$ok BAD=$bad"
