#!/usr/bin/env bash
#
# lib/common.sh - Shared utilities for modular validation architecture
#
# Provides colors, logging functions, and result tracking used by all validators.
# Sourced by: validators/*.sh, validate-spec.sh, and other scripts
#
# VERSION: 1.0.0
# UPDATED: 2024-12-24

# ============================================================================
# COLOR DEFINITIONS
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# Disable colors for non-TTY (piped output, CI, etc.)
if [[ ! -t 1 ]]; then
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi

# ============================================================================
# GLOBAL RESULT TRACKING
# ============================================================================

declare -a RESULTS=()
ERRORS=0
WARNINGS=0
INFOS=0

# ============================================================================
# LOGGING FUNCTIONS
# ============================================================================

# _json_escape(string)
# Escape a string for safe JSON inclusion
_json_escape() {
    local str="$1"
    str="${str//\\/\\\\}"    # Backslash
    str="${str//\"/\\\"}"    # Double quote
    str="${str//$'\n'/\\n}"  # Newline
    str="${str//$'\t'/\\t}"  # Tab
    str="${str//$'\r'/\\r}"  # Carriage return
    printf '%s' "$str"
}

# log_pass(rule, message, [remediation])
# Log a passing validation check
log_pass() {
    local rule="$1"
    local message="$2"
    local remediation="${3:-}"
    local remediation_json="null"
    
    if [[ -n "$remediation" ]]; then
        remediation_json="\"$(_json_escape "$remediation")\""
    fi
    
    printf "${GREEN}✓${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
    RESULTS+=("{\"rule\":\"$(_json_escape "$rule")\",\"status\":\"pass\",\"message\":\"$(_json_escape "$message")\",\"remediation\":$remediation_json}")
}

# log_warn(rule, message, [remediation])
# Log a warning (non-blocking issue)
log_warn() {
    local rule="$1"
    local message="$2"
    local remediation="${3:-}"
    local remediation_json="null"
    
    if [[ -n "$remediation" ]]; then
        remediation_json="\"$(_json_escape "$remediation")\""
    fi
    
    printf "${YELLOW}⚠${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
    RESULTS+=("{\"rule\":\"$(_json_escape "$rule")\",\"status\":\"warn\",\"message\":\"$(_json_escape "$message")\",\"remediation\":$remediation_json}")
    ((WARNINGS++))
}

# log_error(rule, message, [remediation])
# Log an error (blocking issue)
log_error() {
    local rule="$1"
    local message="$2"
    local remediation="${3:-}"
    local remediation_json="null"
    
    if [[ -n "$remediation" ]]; then
        remediation_json="\"$(_json_escape "$remediation")\""
    fi
    
    printf "${RED}✗${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
    RESULTS+=("{\"rule\":\"$(_json_escape "$rule")\",\"status\":\"error\",\"message\":\"$(_json_escape "$message")\",\"remediation\":$remediation_json}")
    ((ERRORS++))
}

# log_info(rule, message, [remediation])
# Log an informational message
log_info() {
    local rule="$1"
    local message="$2"
    local remediation="${3:-}"
    local remediation_json="null"
    
    if [[ -n "$remediation" ]]; then
        remediation_json="\"$(_json_escape "$remediation")\""
    fi
    
    printf "${BLUE}ℹ${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
    RESULTS+=("{\"rule\":\"$(_json_escape "$rule")\",\"status\":\"info\",\"message\":\"$(_json_escape "$message")\",\"remediation\":$remediation_json}")
    ((INFOS++))
}

# log_detail(message)
# Log an indented detail line (no JSON tracking)
log_detail() {
    local message="$1"
    printf "    - %s\n" "$message"
}

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

# get_script_dir()
# Returns the directory of the calling script
get_script_dir() {
    local source="${BASH_SOURCE[1]}"
    local dir
    
    # Resolve symlinks
    while [[ -L "$source" ]]; do
        dir="$(cd -P "$(dirname "$source")" && pwd)"
        source="$(readlink "$source")"
        [[ "$source" != /* ]] && source="$dir/$source"
    done
    
    cd -P "$(dirname "$source")" && pwd
}
