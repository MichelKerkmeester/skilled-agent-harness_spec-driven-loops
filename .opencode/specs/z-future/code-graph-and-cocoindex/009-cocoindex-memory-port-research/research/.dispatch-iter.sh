#!/usr/bin/env bash
# Dispatch a single deep-research iteration via cli-codex.
# Args: ITER_NUM (e.g. 1, 2, ...)
set -uo pipefail

ITER="${1:?usage: $0 <iter_num>}"
ITER_PAD=$(printf "%03d" "$ITER")
PACKET=".opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-memory-port-research"
ART="$PACKET/research"
PROMPT="$ART/prompts/iteration-${ITER}.md"
STATE_LOG="$ART/deep-research-state.jsonl"
LOG="$ART/logs/iter-${ITER_PAD}.log"
mkdir -p "$ART/logs"

if [ ! -f "$PROMPT" ]; then
  echo "ERROR: prompt not found at $PROMPT" >&2
  exit 2
fi

TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION="027-013-cocoindex-port-2026-05-13"

# Pre-dispatch sentinel
printf '%s\n' "{\"type\":\"event\",\"event\":\"dispatch_started\",\"iteration\":${ITER},\"executor\":{\"type\":\"cli-codex\",\"model\":\"gpt-5.5\",\"reasoningEffort\":\"high\",\"serviceTier\":\"fast\",\"sandboxMode\":\"workspace-write\"},\"sessionId\":\"${SESSION}\",\"generation\":1,\"timestamp\":\"${TS}\"}" >> "$STATE_LOG"

START_EPOCH=$(date +%s)
echo "[$(date -u +%FT%TZ)] iter ${ITER} dispatching codex exec gpt-5.5 high fast..." | tee -a "$LOG"

codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort=high \
  -c service_tier=fast \
  -c approval_policy=never \
  --sandbox workspace-write \
  - < "$PROMPT" >> "$LOG" 2>&1
EXIT=$?

END_EPOCH=$(date +%s)
DUR_MS=$(( (END_EPOCH - START_EPOCH) * 1000 ))
END_TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [ $EXIT -eq 0 ]; then
  printf '%s\n' "{\"type\":\"event\",\"event\":\"dispatch_completed\",\"iteration\":${ITER},\"durationMs\":${DUR_MS},\"exitCode\":0,\"sessionId\":\"${SESSION}\",\"generation\":1,\"timestamp\":\"${END_TS}\"}" >> "$STATE_LOG"
  echo "[$(date -u +%FT%TZ)] iter ${ITER} OK (${DUR_MS}ms)" | tee -a "$LOG"
else
  printf '%s\n' "{\"type\":\"event\",\"event\":\"dispatch_failure\",\"iteration\":${ITER},\"durationMs\":${DUR_MS},\"exitCode\":${EXIT},\"sessionId\":\"${SESSION}\",\"generation\":1,\"timestamp\":\"${END_TS}\"}" >> "$STATE_LOG"
  echo "[$(date -u +%FT%TZ)] iter ${ITER} FAILED exit=${EXIT}" | tee -a "$LOG"
fi
exit $EXIT
