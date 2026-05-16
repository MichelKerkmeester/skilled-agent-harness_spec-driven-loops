#!/usr/bin/env bash
# Multi-AI council review dispatcher for 999.
# Dispatches cli-codex gpt-5.5 reasoning_effort=xhigh service_tier=fast
# against research/prompts/multi-ai-council-review.md.
# Outputs to research/council-review.md (the model's last message).
#
# Usage:
#   bash run-council-review.sh
#
# Prerequisite: research/research.md AND resource-map.md exist (the
# council prompt reads them as inputs).

set -u

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET="${REPO_ROOT}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
PROMPT="${PACKET}/research/prompts/multi-ai-council-review.md"
OUTPUT="${PACKET}/research/council-review.md"
LOG="${PACKET}/research/logs/council-review.log"

if [[ ! -f "${PACKET}/research/research.md" ]]; then
  echo "ERROR: research.md does not exist — synthesis pass must complete first"
  exit 1
fi

if [[ ! -f "${PACKET}/resource-map.md" ]]; then
  echo "WARNING: resource-map.md does not exist — council will review research.md alone"
fi

echo "[$(date +%H:%M:%S)] Council review dispatch start (codex gpt-5.5 xhigh fast)"
START_TS=$(date +%s)

cd "${REPO_ROOT}"
# codex exec dispatch — gpt-5.5 xhigh fast tier, read-only sandbox
cat "${PROMPT}" | codex exec \
  -m gpt-5.5 \
  -c model_reasoning_effort=xhigh \
  -c service_tier=fast \
  -s read-only \
  -o "${OUTPUT}" \
  --skip-git-repo-check \
  --cd "${REPO_ROOT}" \
  - \
  2> "${LOG}"
EXIT_CODE=$?

END_TS=$(date +%s)
DURATION=$((END_TS - START_TS))

echo "[$(date +%H:%M:%S)] Council review end — exit=${EXIT_CODE} duration=${DURATION}s"

if [[ "${EXIT_CODE}" -ne 0 ]]; then
  echo "FAIL — codex exit ${EXIT_CODE}. See ${LOG}."
  exit "${EXIT_CODE}"
fi

if [[ -f "${OUTPUT}" ]]; then
  SIZE=$(stat -f%z "${OUTPUT}" 2>/dev/null || stat -c%s "${OUTPUT}")
  echo "Council review output: ${OUTPUT} (${SIZE} bytes)"
  echo "Last 30 lines of council verdict:"
  tail -30 "${OUTPUT}"
else
  echo "WARNING: ${OUTPUT} not written. Check ${LOG}."
  exit 1
fi

# Commit
cd "${REPO_ROOT}"
git add "${OUTPUT}"
git commit -m "council(999): gpt-5.5 xhigh fast review of restructure proposal" && \
  echo "Council review committed."
