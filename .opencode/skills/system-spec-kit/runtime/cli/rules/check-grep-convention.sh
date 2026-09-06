#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-GREP-CONVENTION
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: GREP_CONVENTION
# Severity: error
# Description: Checks markdown documents against the greppable-corpus
# convention: frontmatter variant, trigger phrase quality, anchor grammar and
# naming. Classification lives in the node helper because bash cannot parse
# YAML honestly.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GREP_CONVENTION_HELPER="${GREP_CONVENTION_HELPER:-$SCRIPT_DIR/check-grep-convention-helper.mjs}"

run_check() {
    local folder="$1"
    local _level="$2"
    local rule_id="GREP_CONVENTION"

    RULE_NAME="$rule_id"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if [[ ! -f "$GREP_CONVENTION_HELPER" ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Grep convention helper missing"
        RULE_DETAILS=("Expected helper: $GREP_CONVENTION_HELPER")
        return 0
    fi

    local output=""
    if ! output="$(node "$GREP_CONVENTION_HELPER" "$folder" "$rule_id" 2>&1)"; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Grep convention helper failed to run"
        RULE_DETAILS=("$output")
        return 0
    fi

    local kind value
    while IFS=$'\t' read -r kind value; do
        [[ -z "${kind:-}" ]] && continue
        case "$kind" in
            rule) RULE_NAME="$value" ;;
            status) RULE_STATUS="$value" ;;
            message) RULE_MESSAGE="$value" ;;
            detail) RULE_DETAILS+=("$value") ;;
        esac
    done <<< "$output"

    if [[ -z "$RULE_MESSAGE" ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Grep convention rule bridge returned no parseable output"
        RULE_DETAILS=("Raw output: $output")
        return 0
    fi

    if [[ "$RULE_STATUS" != "pass" ]]; then
        RULE_REMEDIATION="Repair the reported documents: give each one a conforming frontmatter block, replace generic trigger phrases with author-controlled terms, and pair every anchor marker."
    fi

    return 0
}
