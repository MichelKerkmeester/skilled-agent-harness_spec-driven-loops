#!/usr/bin/env bash
# Render-contract adherence gauntlet for /memory:search.
#
# THE HARNESS RULE THIS SCRIPT EXISTS TO ENFORCE: `opencode run "<slash text>"`
# does NOT invoke the command runtime — the slash text reaches the model as raw
# prose and the command template never enters the session. Probing adherence
# that way measures a model that never received the contract. Registered
# commands must be dispatched with `--command <family>/<name>` (args become
# $ARGUMENTS). Verified on opencode 1.17.4.
#
# Usage: bash probe.sh [model] [variant] [query]
#   defaults: openai/gpt-5.5  medium  "daemon lease heartbeat"
# PASS: all 3 corrected probes contain header, divider, >=1 result row, STATUS
# footer (in order). The negative control MUST keep failing — if it ever
# passes, opencode changed run-message semantics; re-pin the protocol note in
# cli-opencode SKILL.md.

set -u
MODEL="${1:-openai/gpt-5.5}"
VARIANT="${2:-medium}"
QUERY="${3:-daemon lease heartbeat}"
DIR="$(cd "$(dirname "$0")/../../../../../.." && pwd)"
OUT_PREFIX="${TMPDIR:-/tmp}/l8-gauntlet"
PASS=0

check_envelope() {
  local f="$1"
  grep -qE '^MEMORY:SEARCH ".+" intent=[a-z_]+ results=[0-9]+' "$f" \
    && grep -q -- '--------------------------------------------------' "$f" \
    && grep -qE '^  [0-9.]+  #[0-9]+  .+$' "$f" \
    && grep -qE '^STATUS=OK RESULTS=[0-9]+ INTENT=[a-z_]+' "$f"
}

echo "== Corrected protocol (--command memory/search): 3 probes =="
for i in 1 2 3; do
  AI_SESSION_CHILD=1 gtimeout -k 30 420 opencode run --command memory/search \
    --model "$MODEL" --variant "$VARIANT" --dir "$DIR" "$QUERY" \
    </dev/null > "${OUT_PREFIX}-${i}.out" 2>&1
  if check_envelope "${OUT_PREFIX}-${i}.out"; then
    echo "probe $i: PASS (${OUT_PREFIX}-${i}.out)"
    PASS=$((PASS + 1))
  else
    echo "probe $i: FAIL (${OUT_PREFIX}-${i}.out)"
  fi
done

echo "== Negative control (raw slash text — command runtime NOT invoked) =="
AI_SESSION_CHILD=1 gtimeout -k 30 420 opencode run \
  --model "$MODEL" --variant "$VARIANT" --dir "$DIR" "/memory:search $QUERY" \
  </dev/null > "${OUT_PREFIX}-negctrl.out" 2>&1
if check_envelope "${OUT_PREFIX}-negctrl.out"; then
  echo "negative control: UNEXPECTED PASS — opencode run-message semantics changed; re-pin the protocol"
else
  echo "negative control: fails as expected (${OUT_PREFIX}-negctrl.out)"
fi

echo "== RESULT: ${PASS}/3 corrected probes passed =="
[ "$PASS" -eq 3 ]
