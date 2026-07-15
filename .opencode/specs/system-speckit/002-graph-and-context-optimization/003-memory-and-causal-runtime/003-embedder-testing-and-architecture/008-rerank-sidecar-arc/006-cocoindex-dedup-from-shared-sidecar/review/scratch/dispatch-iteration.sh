#!/usr/bin/env bash
# Dispatch one cli-codex iteration.
# Usage: dispatch-iteration.sh <NNN>
set -u

ITER="${1:?usage: dispatch-iteration.sh <NNN>}"
PACKET_REL=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar"
REVIEW_DIR="${PACKET_REL}/review"
PROMPT_PATH="${REVIEW_DIR}/prompts/iteration-${ITER}.md"
LOG_PATH="${REVIEW_DIR}/prompts/codex-iter-${ITER}.log"

if [ ! -f "${PROMPT_PATH}" ]; then
  echo "ERROR: prompt missing at ${PROMPT_PATH}" >&2
  exit 2
fi

echo "iter ${ITER} START $(date -u +%Y-%m-%dT%H:%M:%SZ)"
gtimeout 1500 codex exec \
  --model "gpt-5.5" \
  -c model_reasoning_effort="xhigh" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  -c sandbox_workspace_write.network_access=true \
  - < "${PROMPT_PATH}" \
  > "${LOG_PATH}" 2>&1
EC=$?
echo "iter ${ITER} END $(date -u +%Y-%m-%dT%H:%M:%SZ) exit=${EC}"
exit ${EC}
