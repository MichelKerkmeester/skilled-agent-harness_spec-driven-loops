#!/bin/bash
# Run from the repository root: bash <this file>
# Runs the transcript scorer in session mode with and without a --row-id that
# matches nothing, and prints the exit, stdout and stderr of each. Reads no session.
S=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs
T=$(mktemp -d)
for extra in "" "--row-id no-such-row"; do
  out=$(node "$S" --runtime claude --locator '{"sessionId":"session-1"}' $extra 2>"$T/err"); code=$?
  echo "args [${extra:-none}] exit=$code stdout=$out stderr=$(cat "$T/err")"
done
rm -rf "$T"
sed -n '5,8p;21p' "$S"
