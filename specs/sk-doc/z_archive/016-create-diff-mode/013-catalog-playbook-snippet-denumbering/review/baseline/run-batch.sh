#!/usr/bin/env bash
# Dispatch deep-review iterations to DeepSeek-v4-pro (read-only, --pure, no --agent),
# capped concurrency in waves, parsing each into canonical artifacts as it returns.
# Each dispatch self-caps via gtimeout; partial failures are logged and skipped.
set -euo pipefail
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public || exit 1
DIR=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
REVIEW="$DIR/.opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/review"
CONC="${CONC:-3}"
TMO="${DISPATCH_TIMEOUT:-600}"

dispatch_one() {
  local n="$1"
  local NNN
  NNN=$(printf '%03d' "$n")
  local PROMPT
  PROMPT="$(cat "$REVIEW/prompts/iteration-$NNN.md")"
  # Capture the dispatch exit so strict mode does not abort the wave when a single
  # dispatch times out (124) — partial failures are logged and the batch continues.
  local rc=0
  gtimeout -k 60 "$TMO" opencode run \
    --model deepseek/deepseek-v4-pro --pure --format json --dir "$DIR" \
    "$PROMPT" </dev/null > "$REVIEW/raw/iter-$NNN.json" 2> "$REVIEW/raw/iter-$NNN.err" || rc=$?
  echo "dispatch $NNN exit=$rc  ($(wc -c < "$REVIEW/raw/iter-$NNN.json" | tr -d ' ') bytes)"
  node "$REVIEW/baseline/parse-result.cjs" "$n" || echo "parse $NNN FAILED"
}

batch=()
for n in "$@"; do
  dispatch_one "$n" &
  batch+=("$!")
  if [ "${#batch[@]}" -ge "$CONC" ]; then wait; batch=(); fi
done
wait
echo "BATCH COMPLETE: $*"
