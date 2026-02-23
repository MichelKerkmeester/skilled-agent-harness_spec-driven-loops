#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: VISUAL EXPLAINER VERSION DRIFT CHECKER
# ───────────────────────────────────────────────────────────────
# Ensure sk-visual-explainer library version pins stay aligned.
#
# Usage: ./check-version-drift.sh
#
# Exit Codes:
#   0 - Success (version references aligned)
#   2 - Drift detected or required metadata missing

set -euo pipefail


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_DIR
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly ROOT_DIR
MATRIX_FILE="${ROOT_DIR}/assets/library_versions.json"
readonly MATRIX_FILE

ERRORS=0
TEMP_STALE_HITS=""


# ───────────────────────────────────────────────────────────────
# 2. COLOR DEFINITIONS
# ───────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

if [[ ! -t 1 ]]; then
  RED='' GREEN='' CYAN='' BOLD='' NC=''
fi


# ───────────────────────────────────────────────────────────────
# 3. LOGGING HELPERS
# ───────────────────────────────────────────────────────────────

log_heading() {
  printf "%s%s%s\n" "${CYAN}${BOLD}" "$1" "${NC}"
}

log_info() {
  printf "%s\n" "$1"
}

log_pass() {
  printf "  %sok%s %s\n" "${GREEN}" "${NC}" "$1"
}

log_error() {
  printf "  %smissing%s %s\n" "${RED}" "${NC}" "$1" >&2
}


# ───────────────────────────────────────────────────────────────
# 4. UTILITY FUNCTIONS
# ───────────────────────────────────────────────────────────────

cleanup_temp_files() {
  if [[ -n "${TEMP_STALE_HITS}" && -f "${TEMP_STALE_HITS}" ]]; then
    rm -f "${TEMP_STALE_HITS}"
  fi
}

extract_version() {
  local key="$1"
  python3 - "${MATRIX_FILE}" "${key}" <<'PY'
import json
import sys

matrix_path = sys.argv[1]
library_key = sys.argv[2]

try:
    with open(matrix_path, "r", encoding="utf-8") as handle:
        data = json.load(handle)
    value = data.get("libraries", {}).get(library_key, {}).get("version", "")
    if value:
        print(value)
except Exception:
    pass
PY
}

require_pattern() {
  local label="$1"
  local pattern="$2"
  local file="$3"

  if rg -q --fixed-strings "${pattern}" "${file}"; then
    log_pass "${label} in $(basename "${file}")"
  else
    log_error "${label} in ${file}"
    ERRORS=$((ERRORS + 1))
  fi
}

check_stale_pattern() {
  local stale_pattern="$1"

  if rg -n --fixed-strings "${stale_pattern}" "${ROOT_DIR}/SKILL.md" "${ROOT_DIR}/references" "${ROOT_DIR}/assets/templates" >"${TEMP_STALE_HITS}" 2>/dev/null; then
    printf "  %sstale%s found pattern '%s'\n" "${RED}" "${NC}" "${stale_pattern}" >&2
    sed 's/^/    /' "${TEMP_STALE_HITS}" >&2
    ERRORS=$((ERRORS + 1))
  fi
}


# ───────────────────────────────────────────────────────────────
# 5. MAIN
# ───────────────────────────────────────────────────────────────

main() {
  local mermaid_version=""
  local elk_version=""
  local chart_version=""
  local anime_version=""
  local stale=""

  if [[ ! -f "${MATRIX_FILE}" ]]; then
    printf "%sMissing version matrix:%s %s\n" "${RED}" "${NC}" "${MATRIX_FILE}" >&2
    return 2
  fi

  mermaid_version="$(extract_version mermaid)"
  elk_version="$(extract_version mermaid_layout_elk)"
  chart_version="$(extract_version chartjs)"
  anime_version="$(extract_version animejs)"

  if [[ -z "${mermaid_version}" || -z "${elk_version}" || -z "${chart_version}" || -z "${anime_version}" ]]; then
    printf "%sUnable to parse one or more versions from matrix%s\n" "${RED}" "${NC}" >&2
    return 2
  fi

  TEMP_STALE_HITS="$(mktemp "${TMPDIR:-/tmp}/ve-stale-version-hits.XXXXXX")"
  trap cleanup_temp_files EXIT

  log_heading "Version Drift Check"
  log_info "Matrix: ${MATRIX_FILE}"
  log_info "Mermaid=${mermaid_version} ELK=${elk_version} Chart.js=${chart_version} anime.js=${anime_version}"

  require_pattern "mermaid pin" "mermaid@${mermaid_version}" "${ROOT_DIR}/references/quick_reference.md"
  require_pattern "mermaid pin" "mermaid@${mermaid_version}" "${ROOT_DIR}/references/library_guide.md"
  require_pattern "mermaid pin" "mermaid@${mermaid_version}" "${ROOT_DIR}/assets/templates/mermaid-flowchart.html"

  require_pattern "layout-elk pin" "@mermaid-js/layout-elk@${elk_version}" "${ROOT_DIR}/references/quick_reference.md"
  require_pattern "layout-elk pin" "@mermaid-js/layout-elk@${elk_version}" "${ROOT_DIR}/references/library_guide.md"
  require_pattern "layout-elk pin" "@mermaid-js/layout-elk@${elk_version}" "${ROOT_DIR}/assets/templates/mermaid-flowchart.html"

  require_pattern "chart pin" "chart.js@${chart_version}" "${ROOT_DIR}/references/quick_reference.md"
  require_pattern "chart pin" "chart.js@${chart_version}" "${ROOT_DIR}/references/library_guide.md"
  require_pattern "chart pin" "chart.js@${chart_version}" "${ROOT_DIR}/references/quality_checklist.md"

  require_pattern "anime pin" "animejs@${anime_version}" "${ROOT_DIR}/references/quick_reference.md"
  require_pattern "anime pin" "animejs@${anime_version}" "${ROOT_DIR}/references/library_guide.md"
  require_pattern "anime pin" "animejs@${anime_version}" "${ROOT_DIR}/references/quality_checklist.md"

  # Reject stale major-path patterns that bypass explicit version pinning.
  local -a stale_patterns=(
    "mermaid@11/dist"
    "chart.js@4/dist"
    "animejs@3.2.2"
    "@mermaid-js/layout-elk/dist"
  )

  for stale in "${stale_patterns[@]}"; do
    check_stale_pattern "${stale}"
  done

  if [[ ${ERRORS} -gt 0 ]]; then
    printf "%s%sVersion drift detected (%s issue(s)).%s\n" "${RED}" "${BOLD}" "${ERRORS}" "${NC}" >&2
    return 2
  fi

  printf "%s%sVersion alignment OK.%s\n" "${GREEN}" "${BOLD}" "${NC}"
  return 0
}

main "$@"
