#!/usr/bin/env bash
# Planning probe: what the doctor's wiring check reads for a Vibe turn-start block
# whose match selector is not the main agent, beside the same block with match main.
# Usage: wiring-match.sh <path to hook-wiring-check.cjs>
# Writes only under one mktemp folder in TMPDIR and removes it before it exits.
set -u
CHECK="$1"
T=$(mktemp -d "${TMPDIR:-/tmp}/wiring-match.XXXXXX") || exit 1
trap 'rm -rf "$T"' EXIT
COMMAND='command = "node \"$(git rev-parse --show-toplevel)/.skilled/hooks/session-lifecycle/vibe/turn-start.mjs\""'
for match in agents_spawn main; do
  mkdir -p "$T/$match/.vibe"
  printf '[[hooks]]\nname = "turn-start"\ntype = "pre_agent"\nmatch = "%s"\n%s\n' "$match" "$COMMAND" > "$T/$match/.vibe/hooks.toml"
  out=$(node "$CHECK" --root "$T/$match")
  code=$?
  echo "match=$match $(printf '%s' "$out" | grep vibe) exit=$code"
done
