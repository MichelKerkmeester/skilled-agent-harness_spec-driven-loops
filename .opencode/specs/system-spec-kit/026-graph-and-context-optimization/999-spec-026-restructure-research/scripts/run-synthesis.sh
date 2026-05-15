#!/usr/bin/env bash
# Synthesis dispatcher for the 999 deep-research run.
# Runs after all 40 iter files exist.
# Dispatches cli-devin SWE-1.6 with the synthesis recipe to consolidate iter outputs into research/research.md.
#
# Usage:
#   bash run-synthesis.sh
#
# Output captured to research/logs/synthesis.log

set -u

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET_ROOT_REL=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
PACKET="${REPO_ROOT}/${PACKET_ROOT_REL}"
LOG="${PACKET}/research/logs/synthesis.log"
SYNTH_PROMPT="${PACKET}/research/prompts/synthesis.md"
SYNTH_OUTPUT="${PACKET}/research/research.md"

# Substitute placeholders in the synthesis recipe
AGENT_CONFIG_TMP="/tmp/agent-config-999-synthesis.json"
sed -e "s|<repo-root>|${REPO_ROOT}|g" -e "s|<packet-root>|${PACKET_ROOT_REL}|g" \
  "${REPO_ROOT}/.opencode/skills/cli-devin/assets/agent-config-synthesis.json" \
  > "${AGENT_CONFIG_TMP}"

# Verify 40 iter files exist before dispatch
ITER_COUNT=$(ls "${PACKET}/research/iterations/" 2>/dev/null | wc -l | tr -d ' ')
if [[ "${ITER_COUNT}" -lt 40 ]]; then
  echo "WARNING: only ${ITER_COUNT}/40 iter files exist. Continuing anyway, but synthesis may be incomplete."
fi

echo "[$(date +%H:%M:%S)] Synthesis dispatch start — iter count: ${ITER_COUNT}/40"
START_TS=$(date +%s)

cd "${REPO_ROOT}"
# Synthesis recipe has Write scope — devin can write research.md directly.
devin --print \
  --prompt-file "${SYNTH_PROMPT}" \
  --model swe-1.6 \
  --permission-mode auto \
  --agent-config "${AGENT_CONFIG_TMP}" \
  </dev/null \
  > "${LOG}" 2>&1
EXIT_CODE=$?

END_TS=$(date +%s)
DURATION=$((END_TS - START_TS))

echo "[$(date +%H:%M:%S)] Synthesis dispatch end — exit=${EXIT_CODE} duration=${DURATION}s"

if [[ "${EXIT_CODE}" -ne 0 ]]; then
  echo "FAIL — devin exit ${EXIT_CODE}. See ${LOG} for details."
  exit "${EXIT_CODE}"
fi

if [[ -f "${SYNTH_OUTPUT}" ]]; then
  SYNTH_SIZE=$(stat -f%z "${SYNTH_OUTPUT}" 2>/dev/null || stat -c%s "${SYNTH_OUTPUT}")
  echo "Synthesis output: ${SYNTH_OUTPUT} (${SYNTH_SIZE} bytes)"
else
  echo "WARNING: ${SYNTH_OUTPUT} does not exist. Check if devin wrote elsewhere or skipped the Write."
  echo "Stdout content (first 1000 bytes of log):"
  head -c 1000 "${LOG}"
  exit 1
fi

# Commit
cd "${REPO_ROOT}"
git add "${SYNTH_OUTPUT}"
git commit -m "synthesis(999): consolidate 40 iter outputs into research/research.md" && \
  echo "Synthesis committed."
