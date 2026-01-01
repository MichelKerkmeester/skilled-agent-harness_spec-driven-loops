#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# LIB: OUTPUT FORMATTING
# ───────────────────────────────────────────────────────────────
#
# Output formatting for validation results (modular architecture)

should_output() {
    local level="$1"
    [[ "${JSON_MODE:-false}" == "true" ]] && return 1
    if [[ "${QUIET_MODE:-false}" == "true" ]]; then
        [[ "$level" == "error" ]] && return 0 || return 1
    fi
    [[ "$level" == "info" && "${VERBOSE:-false}" != "true" ]] && return 1
    return 0
}

print_header() {
    [[ "${JSON_MODE:-false}" == "true" || "${QUIET_MODE:-false}" == "true" ]] && return 0
    echo ""
    echo -e "${BLUE:-}───────────────────────────────────────────────────────────────${NC:-}"
    echo -e "${BLUE:-}  Spec Folder Validation${NC:-}"
    echo -e "${BLUE:-}───────────────────────────────────────────────────────────────${NC:-}"
    echo ""
    echo -e "  ${BOLD:-}Folder:${NC:-} ${FOLDER_PATH:-unknown}"
    echo -e "  ${BOLD:-}Level:${NC:-}  ${DETECTED_LEVEL:-?} (${LEVEL_METHOD:-unknown})"
    echo ""
    echo -e "${BLUE:-}───────────────────────────────────────────────────────────────${NC:-}"
    echo ""
}

print_summary() {
    [[ "${JSON_MODE:-false}" == "true" || "${QUIET_MODE:-false}" == "true" ]] && return 0
    local e="${ERRORS:-0}" wr="${WARNINGS:-0}" i="${INFOS:-0}"
    echo ""
    echo -e "${BLUE:-}───────────────────────────────────────────────────────────────${NC:-}"
    echo ""
    echo -e "  ${BOLD:-}Summary:${NC:-}"
    echo -e "    ${RED:-}Errors:${NC:-}   $e"
    echo -e "    ${YELLOW:-}Warnings:${NC:-} $wr"
    echo -e "    ${BLUE:-}Info:${NC:-}     $i"
    echo ""
    if [[ $e -gt 0 ]]; then
        echo -e "  ${RED:-}${BOLD:-}RESULT: FAILED${NC:-}"
    elif [[ $wr -gt 0 ]]; then
        [[ "${STRICT_MODE:-false}" == "true" ]] && echo -e "  ${RED:-}${BOLD:-}RESULT: FAILED${NC:-} (strict mode)" || echo -e "  ${YELLOW:-}${BOLD:-}RESULT: PASSED WITH WARNINGS${NC:-}"
    else
        echo -e "  ${GREEN:-}${BOLD:-}RESULT: PASSED${NC:-}"
    fi
    echo ""
}

_escape_json() {
    local s="$1"
    s="${s//\\/\\\\}"; s="${s//\"/\\\"}"; s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"; s="${s//$'\t'/\\t}"
    echo "$s"
}

generate_json() {
    local e="${ERRORS:-0}" wr="${WARNINGS:-0}" i="${INFOS:-0}" passed="true"
    [[ $e -gt 0 ]] && passed="false"
    [[ $wr -gt 0 && "${STRICT_MODE:-false}" == "true" ]] && passed="false"

    local rj="" first=true
    if [[ -n "${RESULTS[*]:-}" && ${#RESULTS[@]} -gt 0 ]]; then
        for r in "${RESULTS[@]}"; do
            [[ "$first" == "true" ]] && { rj="$r"; first=false; } || rj="$rj,$r"
        done
    fi

    cat << EOF
{
  "folder": "$(_escape_json "${FOLDER_PATH:-}")",
  "level": ${DETECTED_LEVEL:-1},
  "levelMethod": "$(_escape_json "${LEVEL_METHOD:-unknown}")",
  "results": [$rj],
  "summary": { "errors": $e, "warnings": $wr, "info": $i },
  "passed": $passed
}
EOF
}

get_exit_code() {
    local e="${ERRORS:-0}" wr="${WARNINGS:-0}"
    if [[ $e -gt 0 ]]; then echo 2
    elif [[ $wr -gt 0 ]]; then [[ "${STRICT_MODE:-false}" == "true" ]] && echo 2 || echo 1
    else echo 0
    fi
}
