#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# LIB: VALIDATION UTILITIES
# ───────────────────────────────────────────────────────────────
#
# Colors, logging functions, and result tracking for validators.
# NOTE: Separate from scripts/common.sh (repo/branch/path utilities)

# ───────────────────────────────────────────────────────────────
# 1. COLOR DEFINITIONS
# ───────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

if [[ ! -t 1 ]]; then
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi

# ───────────────────────────────────────────────────────────────
# 2. GLOBAL RESULT TRACKING
# ───────────────────────────────────────────────────────────────

declare -a RESULTS=()
ERRORS=0
WARNINGS=0
INFOS=0

# ───────────────────────────────────────────────────────────────
# 3. LOGGING FUNCTIONS
# ───────────────────────────────────────────────────────────────

_json_escape() {
    local str="$1"
    str="${str//\\/\\\\}"
    str="${str//\"/\\\"}"
    str="${str//$'\n'/\\n}"
    str="${str//$'\t'/\\t}"
    str="${str//$'\r'/\\r}"
    printf '%s' "$str"
}

log_pass() {
    local rule="$1"
    local message="$2"
    local remediation="${3:-}"
    local remediation_json="null"
    [[ -n "$remediation" ]] && remediation_json="\"$(_json_escape "$remediation")\""
    printf "${GREEN}✓${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
    RESULTS+=("{\"rule\":\"$(_json_escape "$rule")\",\"status\":\"pass\",\"message\":\"$(_json_escape "$message")\",\"remediation\":$remediation_json}")
}

log_warn() {
    local rule="$1"
    local message="$2"
    local remediation="${3:-}"
    local remediation_json="null"
    [[ -n "$remediation" ]] && remediation_json="\"$(_json_escape "$remediation")\""
    printf "${YELLOW}⚠${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
    RESULTS+=("{\"rule\":\"$(_json_escape "$rule")\",\"status\":\"warn\",\"message\":\"$(_json_escape "$message")\",\"remediation\":$remediation_json}")
    ((WARNINGS++))
}

log_error() {
    local rule="$1"
    local message="$2"
    local remediation="${3:-}"
    local remediation_json="null"
    [[ -n "$remediation" ]] && remediation_json="\"$(_json_escape "$remediation")\""
    printf "${RED}✗${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
    RESULTS+=("{\"rule\":\"$(_json_escape "$rule")\",\"status\":\"error\",\"message\":\"$(_json_escape "$message")\",\"remediation\":$remediation_json}")
    ((ERRORS++))
}

log_info() {
    local rule="$1"
    local message="$2"
    local remediation="${3:-}"
    local remediation_json="null"
    [[ -n "$remediation" ]] && remediation_json="\"$(_json_escape "$remediation")\""
    printf "${BLUE}ℹ${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
    RESULTS+=("{\"rule\":\"$(_json_escape "$rule")\",\"status\":\"info\",\"message\":\"$(_json_escape "$message")\",\"remediation\":$remediation_json}")
    ((INFOS++))
}

log_detail() {
    printf "    - %s\n" "$1"
}

# ───────────────────────────────────────────────────────────────
# 4. UTILITY FUNCTIONS
# ───────────────────────────────────────────────────────────────

get_script_dir() {
    local source="${BASH_SOURCE[1]}"
    local dir
    while [[ -L "$source" ]]; do
        dir="$(cd -P "$(dirname "$source")" && pwd)"
        source="$(readlink "$source")"
        [[ "$source" != /* ]] && source="$dir/$source"
    done
    cd -P "$(dirname "$source")" && pwd
}
