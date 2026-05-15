#!/usr/bin/env bash
# Codex loop orchestrator for the 999 deep-research run — track 11.
# Dispatches cli-codex gpt-5.5 with reasoning_effort=medium service_tier=fast
# against iter prompts 041-050.
# Resume-aware: skips iter with existing output >= 500 bytes.
#
# Usage:
#   bash run-codex-loop.sh                # dispatch iter 41-50
#   bash run-codex-loop.sh 41 45          # dispatch iter 41-45 only
#
# Each iter uses ~5 min wall-clock with gpt-5.5 medium fast tier.
# Stdout (devin-style: the iter content) captured to research/iterations/iteration-NNN.md.
# Stderr captured to research/logs/iteration-NNN.log.

set -u

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET="${REPO_ROOT}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
PROMPT_DIR="${PACKET}/research/prompts"
OUTPUT_DIR="${PACKET}/research/iterations"
LOG_DIR="${PACKET}/research/logs"
DRIVER_LOG="${LOG_DIR}/run-codex-loop.log"

START_ITER="${1:-41}"
END_ITER="${2:-50}"

mkdir -p "${OUTPUT_DIR}" "${LOG_DIR}"

log() {
  echo "[$(date +%H:%M:%S)] $*" | tee -a "${DRIVER_LOG}"
}

log "=== Codex run-loop start: iter ${START_ITER}..${END_ITER} ==="
log "Model: gpt-5.5 | reasoning_effort: medium | service_tier: fast | sandbox: read-only"

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

  log "[${NNN}] start (codex gpt-5.5 medium fast)"
  START_TS=$(date +%s)

  # codex exec dispatch:
  # - -m gpt-5.5: model
  # - -c model_reasoning_effort=medium: per user request
  # - -c service_tier=fast: per memory feedback_codex_cli_fast_mode
  # - -s read-only: this is research-only; sandbox blocks Writes (per memory feedback_codex_sandbox_blocks_network the workspace-write mode blocks subprocess network, not relevant for read-only)
  # - -o OUTPUT: write last agent message to OUTPUT file
  # - --skip-git-repo-check: dispatched from inside repo, no warning
  # - prompt via stdin: large prompt files don't fit cleanly in positional arg
  cd "${REPO_ROOT}"
  cat "${PROMPT}" | codex exec \
    -m gpt-5.5 \
    -c model_reasoning_effort=medium \
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

  if [[ "${EXIT_CODE}" -ne 0 ]]; then
    log "[${NNN}] FAIL — codex exit ${EXIT_CODE} after ${DURATION}s — stderr: ${LOG}"
    [[ -f "${OUTPUT}" ]] && mv "${OUTPUT}" "${OUTPUT}.failed"
    continue
  fi

  if [[ ! -f "${OUTPUT}" ]]; then
    log "[${NNN}] PARTIAL — codex exit 0 but ${OUTPUT} not written. stderr: ${LOG}"
    continue
  fi

  OUTPUT_SIZE=$(stat -f%z "${OUTPUT}" 2>/dev/null || stat -c%s "${OUTPUT}")
  if [[ "${OUTPUT_SIZE}" -lt 500 ]]; then
    log "[${NNN}] PARTIAL — output ${OUTPUT_SIZE} bytes (< 500). stderr: ${LOG}"
    mv "${OUTPUT}" "${OUTPUT}.partial"
    continue
  fi

  # Extract JSONL delta row from iter content
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
  git commit -m "iter(999/${NNN}): cli-codex gpt-5.5 medium fast — track 11" 2>/dev/null && log "[${NNN}] committed" || log "[${NNN}] commit no-op"
done

log "=== Codex run-loop end ==="
