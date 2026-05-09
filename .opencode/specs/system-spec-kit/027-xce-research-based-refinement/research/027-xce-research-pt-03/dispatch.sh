#!/usr/bin/env bash
# Pt-03 dispatcher: 10 sequential codex iters (gpt-5.5 / high / fast).
# Per-iter timeout enforced by codex internals (default ~15min); script does not impose extra timeout.
# Memory feedback: NEVER parallelize codex dispatches (silent failures above 1 concurrent).

set -uo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PT03="$REPO_ROOT/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03"
mkdir -p "$PT03/logs"
DISP_LOG="$PT03/logs/dispatcher.log"
STATE_LOG="$PT03/deep-research-state.jsonl"

cd "$REPO_ROOT" || { echo "[FATAL] cd $REPO_ROOT failed" >> "$DISP_LOG"; exit 1; }

echo "[$(date -u +%FT%TZ)] Pt-03 dispatcher START — 10 iters, codex gpt-5.5 high fast, sandbox=workspace-write" >> "$DISP_LOG"
echo "[$(date -u +%FT%TZ)] PWD: $(pwd)" >> "$DISP_LOG"
echo "[$(date -u +%FT%TZ)] PT03: $PT03" >> "$DISP_LOG"

for i in $(seq 1 10); do
  iter_padded=$(printf '%03d' "$i")
  ts=$(date -u +%FT%TZ)
  echo "" >> "$DISP_LOG"
  echo "[$ts] ============ iter $i/10 START ============" >> "$DISP_LOG"

  prompt_file="$PT03/prompts/iter-$i.md"
  if [ ! -f "$prompt_file" ]; then
    echo "[$ts] iter $i FATAL: prompt file missing: $prompt_file" >> "$DISP_LOG"
    continue
  fi

  start_size=$(stat -f%z "$STATE_LOG" 2>/dev/null || echo 0)
  start_epoch=$(date +%s)

  codex exec \
    --model gpt-5.5 \
    -c model_reasoning_effort=high \
    -c service_tier=fast \
    -c approval_policy=never \
    -s workspace-write \
    --skip-git-repo-check \
    - \
    < "$prompt_file" \
    > "$PT03/logs/iter-$i.log" 2>&1
  exit_code=$?

  end_epoch=$(date +%s)
  duration=$((end_epoch - start_epoch))
  end_size=$(stat -f%z "$STATE_LOG" 2>/dev/null || echo 0)
  state_grew=$((end_size - start_size))

  iter_md="$PT03/iterations/iteration-$iter_padded.md"
  delta_jsonl="$PT03/deltas/iter-$iter_padded.jsonl"

  iter_md_present=N; [ -f "$iter_md" ] && iter_md_present=Y
  delta_present=N; [ -f "$delta_jsonl" ] && delta_present=Y

  ts=$(date -u +%FT%TZ)
  if [ "$iter_md_present" = "Y" ] && [ "$state_grew" -gt 0 ] && [ "$delta_present" = "Y" ]; then
    echo "[$ts] iter $i OK (exit=$exit_code, ${duration}s, state+${state_grew}B, iter.md=Y, delta=Y)" >> "$DISP_LOG"
  else
    echo "[$ts] iter $i WARN/FAIL (exit=$exit_code, ${duration}s, state+${state_grew}B, iter.md=$iter_md_present, delta=$delta_present)" >> "$DISP_LOG"
    # Do not abort the loop — record and continue. Synthesis can work with partial deltas.
  fi
done

echo "" >> "$DISP_LOG"
echo "[$(date -u +%FT%TZ)] Pt-03 dispatcher COMPLETE — 10 iters processed" >> "$DISP_LOG"
