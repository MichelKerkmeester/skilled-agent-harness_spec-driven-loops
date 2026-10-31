#!/bin/bash
# usage: smoke.sh <run number>
# One Level 1 smoke run of the authoring card on cli-devin swe-2-max, measured with the five
# status-diff and validator commands. Exit 2 = track existed before the run, exit 3 = rate-limit reply.
WT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/217-weak-model-spec-authoring
cd "$WT" || exit 1
N=$1
PHASE=specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card
S=.skilled/skills/system-spec-kit
B=$PHASE/scratch/card-bench; R=$PHASE/scratch/runs
PKT=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/fcd93cd7-b3f2-45e6-b976-87fabe792df3/scratchpad/bench-packets/card-l1
P=specs/zz-bench-card/001-quiet-flag
[ -e specs/zz-bench-card ] && { echo "ABORT: specs/zz-bench-card exists before run $N"; exit 2; }
PRE="GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and
SYSTEM_SPEC_GATE_ENFORCE=0 are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt."
BODY=$(cat "$B/brief-body.txt")
PROMPT="$PRE
$BODY"
printf '%s\n' "$PROMPT" > "$B/brief-$N.txt"
mkdir -p $PHASE/scratch/briefs && cp "$B/brief-$N.txt" "$PHASE/scratch/briefs/T012-$N.txt"
git -c core.fsmonitor=false status --porcelain > "$B/status-before-$N.txt"
( git -c core.fsmonitor=false diff HEAD -- .skilled; git -c core.fsmonitor=false ls-files -o --exclude-standard -- .skilled ) | shasum -a 256 > "$B/skilled-hash-before-$N.txt"
T0=$(date +%s); echo "$T0" > "$R/T012-$N.t0"
AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 devin -p --model swe-2-max --permission-mode dangerous -- "$PROMPT" \
  </dev/null > "$R/T012-$N.txt" 2> "$R/T012-$N.err" &
PID=$!
( sleep 2700; kill -9 $PID 2>/dev/null ) & WD=$!
wait $PID; RC=$?
kill $WD 2>/dev/null; pkill -9 -P $PID 2>/dev/null
date +%s > "$R/T012-$N.t1"; echo "$RC" > "$R/T012-$N.rc"
if grep -qiE 'rate.?limit|usage limit|quota|too many requests' "$R/T012-$N.txt" "$R/T012-$N.err" && [ ! -d specs/zz-bench-card ]; then
  K=1; while [ -e "$R/T012-$N.attempt$K.txt" ]; do K=$((K+1)); done
  for e in txt err rc t0 t1; do mv "$R/T012-$N.$e" "$R/T012-$N.attempt$K.$e"; done
  echo "RATELIMIT run $N attempt $K"; exit 3
fi
M1=$(bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | grep -c 'RESULT: PASSED')
M2=$(grep -hoF '[YOUR_VALUE_HERE: ' $P/spec.md $P/plan.md $P/tasks.md $P/implementation-summary.md 2>/dev/null | wc -l | tr -d ' ')
M3=0; while read f n; do have=$(rg -c '<!-- ANCHOR:' $P/$f.md 2>/dev/null || echo 0); [ "$have" -lt "$n" ] && M3=$((M3 + n - have)); done < "$B/anchors-level1.txt"
git -c core.fsmonitor=false status --porcelain > "$B/status-after-$N.txt"
( git -c core.fsmonitor=false diff HEAD -- .skilled; git -c core.fsmonitor=false ls-files -o --exclude-standard -- .skilled ) | shasum -a 256 > "$B/skilled-hash-after-$N.txt"
M4=$(diff "$B/status-before-$N.txt" "$B/status-after-$N.txt" | grep '^>' | grep -v 'zz-bench-card' | grep -v '054-weak-model-spec-authoring/005-' | grep -v '054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/' | wc -l | tr -d ' ')
M5=$(( $(cat "$R/T012-$N.t1") - $(cat "$R/T012-$N.t0") ))
echo "{\"run\":$N,\"strict_passed\":$M1,\"leftover_tokens\":$M2,\"missing_anchors\":$M3,\"out_of_scope_writes\":$M4,\"seconds\":$M5}" >> "$B/runs.jsonl"
jq -s '{runs: .}' "$B/runs.jsonl" > "$B/baseline.json"
[ -d specs/zz-bench-card ] && mkdir -p "$PKT" && cp -R specs/zz-bench-card "$PKT/packet-$N" && rm -r specs/zz-bench-card
echo "run $N done rc=$RC M1=$M1 M2=$M2 M3=$M3 M4=$M4 M5=$M5 hashsame=$(cmp -s $B/skilled-hash-before-$N.txt $B/skilled-hash-after-$N.txt && echo yes || echo NO)"
