#!/usr/bin/env bash
# check-version-drift.sh — Ensure sk-visual-explainer library versions stay aligned.
# Exit: 0=aligned, 2=drift/errors

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RESET='\033[0m'
BOLD='\033[1m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MATRIX_FILE="${ROOT_DIR}/assets/library_versions.json"

if [[ ! -f "${MATRIX_FILE}" ]]; then
  echo -e "${RED}Missing version matrix:${RESET} ${MATRIX_FILE}"
  exit 2
fi

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

MERMAID_VERSION="$(extract_version mermaid)"
ELK_VERSION="$(extract_version mermaid_layout_elk)"
CHART_VERSION="$(extract_version chartjs)"
ANIME_VERSION="$(extract_version animejs)"

if [[ -z "${MERMAID_VERSION}" || -z "${ELK_VERSION}" || -z "${CHART_VERSION}" || -z "${ANIME_VERSION}" ]]; then
  echo -e "${RED}Unable to parse one or more versions from matrix${RESET}"
  exit 2
fi

FILES=(
  "${ROOT_DIR}/SKILL.md"
  "${ROOT_DIR}/references/quick_reference.md"
  "${ROOT_DIR}/references/library_guide.md"
  "${ROOT_DIR}/references/quality_checklist.md"
  "${ROOT_DIR}/assets/templates/mermaid-flowchart.html"
)

ERRORS=0

echo -e "${CYAN}${BOLD}Version Drift Check${RESET}"
echo "Matrix: ${MATRIX_FILE}"
echo "Mermaid=${MERMAID_VERSION} ELK=${ELK_VERSION} Chart.js=${CHART_VERSION} anime.js=${ANIME_VERSION}"

require_pattern() {
  local label="$1"
  local pattern="$2"
  local file="$3"
  if rg -q --fixed-strings "${pattern}" "${file}"; then
    echo -e "  ${GREEN}ok${RESET} ${label} in $(basename "${file}")"
  else
    echo -e "  ${RED}missing${RESET} ${label} in ${file}"
    ERRORS=$((ERRORS + 1))
  fi
}

require_pattern "mermaid pin" "mermaid@${MERMAID_VERSION}" "${ROOT_DIR}/references/quick_reference.md"
require_pattern "mermaid pin" "mermaid@${MERMAID_VERSION}" "${ROOT_DIR}/references/library_guide.md"
require_pattern "mermaid pin" "mermaid@${MERMAID_VERSION}" "${ROOT_DIR}/assets/templates/mermaid-flowchart.html"

require_pattern "layout-elk pin" "@mermaid-js/layout-elk@${ELK_VERSION}" "${ROOT_DIR}/references/quick_reference.md"
require_pattern "layout-elk pin" "@mermaid-js/layout-elk@${ELK_VERSION}" "${ROOT_DIR}/references/library_guide.md"
require_pattern "layout-elk pin" "@mermaid-js/layout-elk@${ELK_VERSION}" "${ROOT_DIR}/assets/templates/mermaid-flowchart.html"

require_pattern "chart pin" "chart.js@${CHART_VERSION}" "${ROOT_DIR}/references/quick_reference.md"
require_pattern "chart pin" "chart.js@${CHART_VERSION}" "${ROOT_DIR}/references/library_guide.md"
require_pattern "chart pin" "chart.js@${CHART_VERSION}" "${ROOT_DIR}/references/quality_checklist.md"

require_pattern "anime pin" "animejs@${ANIME_VERSION}" "${ROOT_DIR}/references/quick_reference.md"
require_pattern "anime pin" "animejs@${ANIME_VERSION}" "${ROOT_DIR}/references/library_guide.md"
require_pattern "anime pin" "animejs@${ANIME_VERSION}" "${ROOT_DIR}/references/quality_checklist.md"

# Reject common stale patterns.
STALE_PATTERNS=(
  "mermaid@11/dist"
  "chart.js@4/dist"
  "animejs@3.2.2"
  "@mermaid-js/layout-elk/dist"
)

for stale in "${STALE_PATTERNS[@]}"; do
  if rg -n --fixed-strings "${stale}" "${ROOT_DIR}/SKILL.md" "${ROOT_DIR}/references" "${ROOT_DIR}/assets/templates" >/tmp/ve-stale-version-hits.txt 2>/dev/null; then
    echo -e "  ${RED}stale${RESET} found pattern '${stale}'"
    sed 's/^/    /' /tmp/ve-stale-version-hits.txt
    ERRORS=$((ERRORS + 1))
  fi
done
rm -f /tmp/ve-stale-version-hits.txt

if [[ ${ERRORS} -gt 0 ]]; then
  echo -e "${RED}${BOLD}Version drift detected (${ERRORS} issue(s)).${RESET}"
  exit 2
fi

echo -e "${GREEN}${BOLD}Version alignment OK.${RESET}"
exit 0
