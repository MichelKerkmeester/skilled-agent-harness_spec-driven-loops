#!/usr/bin/env bash
# Run-loop orchestrator for 999 deep-research run.
# Dispatches cli-devin SWE-1.6 against each iter prompt, commits per-iter.
# Resumes from where it left off — skips iter with existing output >= 500 bytes.
# Usage:
#   bash run-loop.sh                       # dispatch all 40 iter sequentially
#   bash run-loop.sh 5 22                  # dispatch iter 5..22 only
#   bash run-loop.sh 35 38                 # dispatch iter 35..38 (e.g., re-run track 9)
#
# Output redirected per-iter to research/logs/iteration-NNN.log
# Driver log appended to research/logs/run-loop.log

set -u

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET="${REPO_ROOT}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research"
PROMPT_DIR="${PACKET}/research/prompts"
OUTPUT_DIR="${PACKET}/research/iterations"
LOG_DIR="${PACKET}/research/logs"
DRIVER_LOG="${LOG_DIR}/run-loop.log"

START_ITER="${1:-1}"
END_ITER="${2:-20}"

# Substitute <repo-root> and <packet-root> in the research-iter recipe once.
# v1.0.4.0: recipe ships with both placeholders so the narrow Write scope can be
# pinned to the active packet directory. <packet-root> resolves to ${PACKET}.
AGENT_CONFIG_TMP="/tmp/agent-config-998-research-iter.json"
sed -e "s|<repo-root>|${REPO_ROOT}|g" -e "s|<packet-root>|${PACKET}|g" \
  "${REPO_ROOT}/.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json" \
  > "${AGENT_CONFIG_TMP}"

mkdir -p "${OUTPUT_DIR}" "${LOG_DIR}"

log() {
  echo "[$(date +%H:%M:%S)] $*" | tee -a "${DRIVER_LOG}"
}

log "=== Run-loop start: iter ${START_ITER}..${END_ITER} ==="
log "Agent-config: ${AGENT_CONFIG_TMP}"

for n in $(seq "${START_ITER}" "${END_ITER}"); do
  NNN=$(printf "%03d" "${n}")
  PROMPT="${PROMPT_DIR}/iteration-${NNN}.md"
  OUTPUT="${OUTPUT_DIR}/iteration-${NNN}.md"
  LOG="${LOG_DIR}/iteration-${NNN}.log"

  if [[ ! -f "${PROMPT}" ]]; then
    log "[${NNN}] SKIP — prompt missing: ${PROMPT}"
    continue
  fi

  if [[ -f "${OUTPUT}" ]] && [[ $(stat -f%z "${OUTPUT}" 2>/dev/null || stat -c%s "${OUTPUT}") -ge 500 ]]; then
    log "[${NNN}] SKIP — output already exists and >= 500 bytes"
    continue
  fi

  log "[${NNN}] start"
  START_TS=$(date +%s)

  # Devin stdout is the iter content; stderr is dispatch noise / errors.
  # The research-iter recipe is read-only, so devin can't Write the iter file itself —
  # the dispatcher captures stdout directly to OUTPUT.
  # v1.0.4.0: gtimeout 900 caps every iter at 15 min to prevent silent hangs
  # (packet 999 iter 039 originally ran 6h before manual kill).
  cd "${REPO_ROOT}"
  gtimeout 900 devin --print \
    --prompt-file "${PROMPT}" \
    --model swe-1.6 \
    --permission-mode auto \
    --agent-config "${AGENT_CONFIG_TMP}" \
    </dev/null \
    > "${OUTPUT}" 2> "${LOG}"
  EXIT_CODE=$?

  END_TS=$(date +%s)
  DURATION=$((END_TS - START_TS))

  # v1.0.4.0: classify the iter outcome before deciding fail / partial / continue.
  # Same taxonomy as the spec_kit_deep-*_auto.yaml if_cli_devin branches.
  if [[ "${EXIT_CODE}" -eq 124 ]]; then
    ITER_OUTCOME="timeout"
  elif grep -q "A tool was rejected by the user" "${LOG}" 2>/dev/null; then
    ITER_OUTCOME="tool_rejected"
  elif grep -qE "(I cannot write|read-only mode|permission errors when attempting to write)" "${OUTPUT}" 2>/dev/null; then
    ITER_OUTCOME="degraded_stdout_fallback"
  else
    ITER_OUTCOME="clean"
  fi
  log "[${NNN}] outcome=${ITER_OUTCOME}"

  if [[ "${EXIT_CODE}" -ne 0 ]]; then
    log "[${NNN}] FAIL — devin exit ${EXIT_CODE} after ${DURATION}s (outcome=${ITER_OUTCOME}) — stderr: ${LOG}"
    # Move partial output aside if it exists, for inspection
    [[ -f "${OUTPUT}" ]] && mv "${OUTPUT}" "${OUTPUT}.failed"
    continue
  fi

  OUTPUT_SIZE=$(stat -f%z "${OUTPUT}" 2>/dev/null || stat -c%s "${OUTPUT}")
  if [[ "${OUTPUT_SIZE}" -lt 500 ]]; then
    log "[${NNN}] PARTIAL — devin exit 0 but output ${OUTPUT_SIZE} bytes (< 500). stderr: ${LOG}"
    mv "${OUTPUT}" "${OUTPUT}.partial"
    continue
  fi

  # Extract JSONL delta row from the iter content and append to state file.
  # The iter prompt asks devin to print the JSONL row in the final section.
  JSONL_ROW=$(grep -E '^\{"iter_id":' "${OUTPUT}" | head -1)
  if [[ -n "${JSONL_ROW}" ]]; then
    echo "${JSONL_ROW}" >> "${PACKET}/research/deep-research-state.jsonl"
    log "[${NNN}] done in ${DURATION}s — output ${OUTPUT_SIZE} bytes + JSONL appended"
  else
    log "[${NNN}] done in ${DURATION}s — output ${OUTPUT_SIZE} bytes (no JSONL row found)"
  fi

  # Per-iter commit
  cd "${REPO_ROOT}"
  git add "${OUTPUT}" "${PACKET}/research/deep-research-state.jsonl" 2>/dev/null || true
  git commit -m "iter(999/${NNN}): cli-devin SWE-1.6 — track-from-prompt" 2>/dev/null && log "[${NNN}] committed" || log "[${NNN}] commit no-op (nothing to commit)"
done

log "=== Run-loop end ==="
