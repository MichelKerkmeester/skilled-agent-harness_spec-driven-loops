#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-SOURCE-TAGS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: SOURCE_TAGS
# Severity: warn
# Description: Resolves the path:line citations inside [SOURCE: ...] tags in a
#   packet's research and review artifacts, using sk-doc's citation scanner.
#   Packets created on or before SPECKIT_SOURCE_TAG_CUTOFF are skipped. A pass
#   means the cited path and line exist; it never says the lines support the claim.

run_check() {
    local folder="$1"
    local _level="$2"
    local rule_dir
    rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    RULE_NAME="SOURCE_TAGS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local output
    if ! output=$(node "$rule_dir/check-source-tags-helper.mjs" "$folder" 2>&1); then
        RULE_STATUS="warn"
        RULE_MESSAGE="[SOURCE:] check skipped: the repository or the redirect table could not be read"
        RULE_DETAILS=("$output")
        return 0
    fi

    local -a warnings=()
    local checked=0 skip_reason="" kind field2 field3 field4 field5
    while IFS=$'\t' read -r kind field2 field3 field4 field5; do
        case "${kind:-}" in
            SKIP) skip_reason="$field2" ;;
            CHECKED) checked="$field2" ;;
            WARN) warnings+=("$field2 [SOURCE: $field3] $field4: $field5") ;;
        esac
    done <<< "$output"

    if [[ -n "$skip_reason" ]]; then
        RULE_MESSAGE="[SOURCE:] check skipped: $skip_reason"
        return 0
    fi

    if [[ ${#warnings[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="${#warnings[@]} of $checked [SOURCE:] citation(s) do not resolve to an existing path and line"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="Point each tag at the current path and a line inside the file. A moved tag names its new path. Passing tags only prove the path and line exist; whether the lines support the claim is not checked."
        return 0
    fi

    if [[ "$checked" == "0" ]]; then
        RULE_MESSAGE="No [SOURCE:] path:line citations in research or review artifacts"
    else
        RULE_MESSAGE="$checked [SOURCE:] citation(s) resolve: each path and line exists, which says nothing about whether the lines support the claim"
    fi
}
