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
PACKET="${REPO_ROOT}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
PROMPT_DIR="${PACKET}/research/prompts"
OUTPUT_DIR="${PACKET}/research/iterations"
LOG_DIR="${PACKET}/research/logs"
DRIVER_LOG="${LOG_DIR}/run-loop.log"

START_ITER="${1:-1}"
END_ITER="${2:-40}"

# Substitute <repo-root> in the research-iter recipe once
AGENT_CONFIG_TMP="/tmp/agent-config-999-research-iter.json"
sed "s|<repo-root>|${REPO_ROOT}|g" \
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

  cd "${REPO_ROOT}"
  devin --print \
    --prompt-file "${PROMPT}" \
    --model swe-1.6 \
    --permission-mode auto \
    --agent-config "${AGENT_CONFIG_TMP}" \
    </dev/null \
    > "${LOG}" 2>&1
  EXIT_CODE=$?

  END_TS=$(date +%s)
  DURATION=$((END_TS - START_TS))

  if [[ "${EXIT_CODE}" -ne 0 ]]; then
    log "[${NNN}] FAIL — devin exit ${EXIT_CODE} after ${DURATION}s — log: ${LOG}"
    continue
  fi

  if [[ ! -f "${OUTPUT}" ]]; then
    log "[${NNN}] PARTIAL — devin exit 0 but output not written. Possibly the prompt's Write was not executed. log: ${LOG}"
    continue
  fi

  OUTPUT_SIZE=$(stat -f%z "${OUTPUT}" 2>/dev/null || stat -c%s "${OUTPUT}")
  log "[${NNN}] done in ${DURATION}s — output ${OUTPUT_SIZE} bytes"

  # Per-iter commit
  cd "${REPO_ROOT}"
  git add "${OUTPUT}" "${PACKET}/research/deep-research-state.jsonl" 2>/dev/null || true
  git commit -m "iter(999/${NNN}): cli-devin SWE-1.6 — track-from-prompt" 2>/dev/null && log "[${NNN}] committed" || log "[${NNN}] commit no-op (nothing to commit)"
done

log "=== Run-loop end ==="
