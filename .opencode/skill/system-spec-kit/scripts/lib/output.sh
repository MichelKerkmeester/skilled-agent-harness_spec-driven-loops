#!/usr/bin/env bash
# output.sh - Output formatting for validation results (modular architecture)
# VERSION: 1.0.0 | CREATED: 2024-12-25
#
# DEPENDENCIES: Sources lib/common.sh (colors, RESULTS, ERRORS, WARNINGS, INFOS)
# GLOBALS: FOLDER_PATH, DETECTED_LEVEL, LEVEL_METHOD, JSON_MODE, QUIET_MODE,
#          STRICT_MODE, VERBOSE, ERRORS, WARNINGS, INFOS, RESULTS[]

# should_output(level) - Returns 0 if should output based on mode
# Args: $1 - level: "pass", "warn", "error", "info", "detail"
should_output() {
    local level="$1"
    # JSON mode: suppress all text output
    [[ "${JSON_MODE:-false}" == "true" ]] && return 1
    # Quiet mode: only show errors
    if [[ "${QUIET_MODE:-false}" == "true" ]]; then
        [[ "$level" == "error" ]] && return 0 || return 1
    fi
    # Normal mode: show all except info (unless verbose)
    [[ "$level" == "info" ]] && [[ "${VERBOSE:-false}" != "true" ]] && return 1
    return 0
}

# print_header() - Prints validation header with folder info
print_header() {
    [[ "${JSON_MODE:-false}" == "true" || "${QUIET_MODE:-false}" == "true" ]] && return 0
    local w=63
    echo ""
    echo -e "${BLUE:-}$(printf '═%.0s' $(seq 1 $w))${NC:-}"
    echo -e "${BLUE:-}  Spec Folder Validation${NC:-}"
    echo -e "${BLUE:-}$(printf '═%.0s' $(seq 1 $w))${NC:-}"
    echo ""
    echo -e "  ${BOLD:-}Folder:${NC:-} ${FOLDER_PATH:-unknown}"
    echo -e "  ${BOLD:-}Level:${NC:-}  ${DETECTED_LEVEL:-?} (${LEVEL_METHOD:-unknown})"
    echo ""
    echo -e "${BLUE:-}$(printf '─%.0s' $(seq 1 $w))${NC:-}"
    echo ""
}

# print_summary() - Prints result summary with counts and final status
print_summary() {
    [[ "${JSON_MODE:-false}" == "true" || "${QUIET_MODE:-false}" == "true" ]] && return 0
    local w=63 e="${ERRORS:-0}" wr="${WARNINGS:-0}" i="${INFOS:-0}"
    echo ""
    echo -e "${BLUE:-}$(printf '─%.0s' $(seq 1 $w))${NC:-}"
    echo ""
    echo -e "  ${BOLD:-}Summary:${NC:-}"
    echo -e "    ${RED:-}Errors:${NC:-}   $e"
    echo -e "    ${YELLOW:-}Warnings:${NC:-} $wr"
    echo -e "    ${BLUE:-}Info:${NC:-}     $i"
    echo ""
    if [[ $e -gt 0 ]]; then
        echo -e "  ${RED:-}${BOLD:-}RESULT: FAILED${NC:-}"
    elif [[ $wr -gt 0 ]]; then
        if [[ "${STRICT_MODE:-false}" == "true" ]]; then
            echo -e "  ${RED:-}${BOLD:-}RESULT: FAILED${NC:-} (strict mode)"
        else
            echo -e "  ${YELLOW:-}${BOLD:-}RESULT: PASSED WITH WARNINGS${NC:-}"
        fi
    else
        echo -e "  ${GREEN:-}${BOLD:-}RESULT: PASSED${NC:-}"
    fi
    echo ""
}

# _escape_json(string) - Escapes string for safe JSON inclusion
_escape_json() {
    local s="$1"
    s="${s//\\/\\\\}"; s="${s//\"/\\\"}"; s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"; s="${s//$'\t'/\\t}"
    echo "$s"
}

# generate_json() - Outputs complete validation result as JSON
generate_json() {
    local e="${ERRORS:-0}" wr="${WARNINGS:-0}" i="${INFOS:-0}"
    local passed="true"
    [[ $e -gt 0 ]] && passed="false"
    [[ $wr -gt 0 && "${STRICT_MODE:-false}" == "true" ]] && passed="false"

    # Build results array from RESULTS[]
    local rj=""
    if [[ -n "${RESULTS[*]:-}" && ${#RESULTS[@]} -gt 0 ]]; then
        local first=true
        for r in "${RESULTS[@]}"; do
            [[ "$first" == "true" ]] && { rj="$r"; first=false; } || rj="$rj,$r"
        done
    fi

    local ef; ef="$(_escape_json "${FOLDER_PATH:-}")"
    local em; em="$(_escape_json "${LEVEL_METHOD:-unknown}")"

    cat << EOF
{
  "folder": "$ef",
  "level": ${DETECTED_LEVEL:-1},
  "levelMethod": "$em",
  "results": [$rj],
  "summary": {
    "errors": $e,
    "warnings": $wr,
    "info": $i
  },
  "passed": $passed
}
EOF
}

# get_exit_code() - Returns appropriate exit code
# Returns: 0=pass, 1=warnings (non-strict), 2=errors or warnings+strict
get_exit_code() {
    local e="${ERRORS:-0}" wr="${WARNINGS:-0}"
    if [[ $e -gt 0 ]]; then echo 2
    elif [[ $wr -gt 0 ]]; then
        [[ "${STRICT_MODE:-false}" == "true" ]] && echo 2 || echo 1
    else echo 0
    fi
}
