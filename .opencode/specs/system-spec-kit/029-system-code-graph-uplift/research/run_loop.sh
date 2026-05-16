#!/usr/bin/env bash
# 029 deep-research loop driver — iterates iters $START..$END
# Per iter: render prompt -> gtimeout 900 devin --print -> synthesize delta -> reduce -> convergence check
# Safety: break on 3 consecutive failures; halt on convergence; cap at MAX_ITER (20).

set -u

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET_REL=".opencode/specs/system-spec-kit/029-system-code-graph-uplift"
PACKET_ABS="$REPO_ROOT/$PACKET_REL"
RESEARCH="$PACKET_ABS/research"
PROMPT_TMPL="$REPO_ROOT/.opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl"
AGENT_SRC="$REPO_ROOT/.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json"
REDUCER="$REPO_ROOT/.opencode/skills/deep-research/scripts/reduce-state.cjs"
START=${1:-2}
END=${2:-20}
CONSEC_FAIL=0

cd "$REPO_ROOT"

render_prompt() {
  local n=$1
  local nnn=$(printf "%03d" $n)
  local strategy_focus
  strategy_focus=$(awk '/<!-- ANCHOR:next-focus -->/,/<!-- \/ANCHOR:next-focus -->/' "$RESEARCH/deep-research-strategy.md" | sed -n '3,5p' | head -3 | tr '\n' ' ' | sed 's/  */ /g')
  local last3=""
  for i in $(seq $(( n - 3 )) $(( n - 1 )) ); do
    if [ $i -ge 1 ]; then
      local prev=$(printf "%03d" $i)
      local row=$(grep "\"iteration\":$i," "$RESEARCH/deep-research-state.jsonl" 2>/dev/null | head -1)
      last3+="iter $prev: $row\n"
    fi
  done
  local open_qs=$(jq -r '.openQuestions[].text' "$RESEARCH/findings-registry.json" 2>/dev/null | head -10 | sed 's/^/    - /')

  cat > "$RESEARCH/prompts/iteration-$nnn.md" << EOF
DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — Iteration $n of 20

## STATE

Session: 029-uplift-9002D7A6 | Topic: system-code-graph uplift
Iteration: $n of 20
Focus (from reducer next-focus): $strategy_focus
Remaining Open Questions:
$open_qs

Last 3 iterations summary:
$(printf "$last3")

## STATE FILES

All paths relative to repo root \`$REPO_ROOT\`.
- Config: \`$PACKET_REL/research/deep-research-config.json\`
- State Log: \`$PACKET_REL/research/deep-research-state.jsonl\`
- Strategy: \`$PACKET_REL/research/deep-research-strategy.md\`
- Registry: \`$PACKET_REL/research/findings-registry.json\`
- Iteration narrative target: \`$PACKET_REL/research/iterations/iteration-$nnn.md\`
- Delta file target: \`$PACKET_REL/research/deltas/iter-$nnn.jsonl\`

## CONSTRAINTS

- LEAF agent. No sub-agents.
- 3-5 actions, max 12 tool calls.
- Write all findings to files. No in-context retention.
- Report findings only; no fixes here.
- Sequential thinking ≥5 thoughts before output.

## PROGRESSIVE FOCUS GUIDE

Use this priority order across iters 2-20 to cover the remaining open questions:
- Iter 2-3: Q5 (useful content gaps in SKILL.md / references / per-folder mcp_server READMEs) + Q6 (per-folder mcp_server READMEs needing fresh authoring vs validation-only)
- Iter 4: Q2 (sk-doc --type per authored doc with mandatory anchors)
- Iter 5: Q4 (README structural arc to mimic from Public root + system-spec-kit) — distill 3 paragraph structure exemplars
- Iter 6: Q10 (worst-case HVR pitfalls in root README + system-spec-kit README to avoid)
- Iter 7-8: Q7 (feature_catalog index + per-feature validation) + Q8 (manual_testing_playbook index + per-scenario validation) — sample 3-5 per-feature files per catalog
- Iter 9: Q9 (optimal child-001 task ordering)
- Iter 10-15: Deep dives on specific gaps surfaced in earlier iters
- Iter 16-20: Synthesis-ready consolidation, citing back to iter-NNN.md sources

When focus from the reducer is already substantively answered by previous iters, advance to the next priority above. Always state which Qs you are addressing in the iteration narrative header.

## OUTPUT CONTRACT

1. \`$PACKET_REL/research/iterations/iteration-$nnn.md\` with sections: Focus, Actions Taken, Findings (file:line-cited per-file), Questions Answered (with question IDs from registry), Questions Remaining, Next Focus.

2. APPEND single-line JSON to \`$PACKET_REL/research/deep-research-state.jsonl\`:
\`\`\`json
{"type":"iteration","iteration":$n,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck|complete>","focus":"<short focus phrase>","graphEvents":[]}
\`\`\`

3. Optional: write \`$PACKET_REL/research/deltas/iter-$nnn.jsonl\` with the iteration record + per-finding records. Workflow will synthesize if absent.

## RESOLVING QUESTIONS

When a question is substantively answered, add to your iter-$nnn.md a "Questions Answered" section listing question text + iter source citations. The reducer will resolve them at the next pass IF you also emit a delta record like:
\`\`\`json
{"type":"question_resolved","questionId":"<id-from-registry>","resolvedAtIteration":$n,"answer":"<one-line summary>"}
\`\`\`
EOF

  # Render per-iter agent-config
  local AGENT_TMP="$RESEARCH/prompts/agent-config-iter-$nnn.json"
  sed -e "s|<repo-root>|$REPO_ROOT|g" -e "s|<packet-root>|$PACKET_ABS|g" "$AGENT_SRC" > "$AGENT_TMP"
  python3 -c "
import json, sys
p='$AGENT_TMP'
d=json.load(open(p))
deltas_rule='Write($PACKET_ABS/research/deltas/iter-*.jsonl)'
if deltas_rule not in d['permissions']['allow']:
    d['permissions']['allow'].append(deltas_rule)
json.dump(d, open(p,'w'), indent=2)
"
}

dispatch() {
  local n=$1
  local nnn=$(printf "%03d" $n)
  local PROMPT="$RESEARCH/prompts/iteration-$nnn.md"
  local CFG="$RESEARCH/prompts/agent-config-iter-$nnn.json"
  local STDOUT="$RESEARCH/logs/devin-stdout-iter-$nnn.log"
  local STDERR="$RESEARCH/logs/devin-stderr-iter-$nnn.log"

  echo "[iter-$nnn] starting $(date -u +%H:%M:%S) UTC..."
  gtimeout 900 devin --print \
    --prompt-file "$PROMPT" \
    --model swe-1.6 \
    --permission-mode auto \
    --agent-config "$CFG" \
    </dev/null \
    > "$STDOUT" 2> "$STDERR"
  local EXIT=$?
  echo "[iter-$nnn] devin exited at $(date -u +%H:%M:%S) UTC with code $EXIT"
  return $EXIT
}

validate_and_synthesize_delta() {
  local n=$1
  local nnn=$(printf "%03d" $n)
  local ITER_MD="$RESEARCH/iterations/iteration-$nnn.md"
  local DELTA="$RESEARCH/deltas/iter-$nnn.jsonl"
  local STATE_LOG="$RESEARCH/deep-research-state.jsonl"

  if [ ! -s "$ITER_MD" ]; then
    echo "[iter-$nnn] FAIL: iteration narrative missing or empty"
    return 1
  fi

  local last_row=$(grep "\"iteration\":$n," "$STATE_LOG" 2>/dev/null | tail -1)
  if [ -z "$last_row" ]; then
    echo "[iter-$nnn] FAIL: state-log iteration row missing"
    return 1
  fi

  if [ ! -s "$DELTA" ]; then
    echo "$last_row" > "$DELTA"
    echo "[iter-$nnn] delta synthesized from state-log"
  fi
  return 0
}

reduce_and_check() {
  local n=$1
  local OUT
  OUT=$(node "$REDUCER" "$PACKET_REL" 2>&1)
  echo "$OUT" | tail -10
  # Convergence check: parse dashboard for keyFindings + iteration ratio trend
  local ratios=$(jq -r '.openQuestions | length' "$RESEARCH/findings-registry.json" 2>/dev/null)
  echo "[iter $n] openQuestions remaining: $ratios"
  return 0
}

# ── MAIN LOOP ───────────────────────────────────────────────────────
for n in $(seq $START $END); do
  echo "════════════════════════════════════════════════════════════"
  echo "                       ITERATION $n"
  echo "════════════════════════════════════════════════════════════"
  render_prompt $n
  dispatch $n
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "[iter $n] dispatch failed (rc=$rc)"
    CONSEC_FAIL=$((CONSEC_FAIL + 1))
    if [ $CONSEC_FAIL -ge 3 ]; then
      echo "[loop] 3 consecutive failures, halting"
      exit 3
    fi
    continue
  fi

  if validate_and_synthesize_delta $n; then
    CONSEC_FAIL=0
  else
    CONSEC_FAIL=$((CONSEC_FAIL + 1))
    if [ $CONSEC_FAIL -ge 3 ]; then
      echo "[loop] 3 consecutive validation failures, halting"
      exit 3
    fi
    continue
  fi

  reduce_and_check $n

  # Light convergence heuristic: if 4+ iters done AND open questions <= 2, stop
  ITERS=$(grep -c "\"type\":\"iteration\"" "$RESEARCH/deep-research-state.jsonl" 2>/dev/null || echo 0)
  OPEN=$(jq -r '.openQuestions | length' "$RESEARCH/findings-registry.json" 2>/dev/null || echo 99)
  RESOLVED=$(jq -r '.resolvedQuestions | length' "$RESEARCH/findings-registry.json" 2>/dev/null || echo 0)
  echo "[loop] iter $n done | iters=$ITERS | open=$OPEN | resolved=$RESOLVED"

  if [ $ITERS -ge 4 ] && [ "$OPEN" -le 2 ]; then
    echo "[loop] convergence: $OPEN open questions after $ITERS iters, stopping early"
    exit 0
  fi
done

echo "[loop] reached end of range (iter $END)"
exit 0
