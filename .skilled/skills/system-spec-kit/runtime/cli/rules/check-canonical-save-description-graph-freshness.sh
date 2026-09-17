#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-CANONICAL-SAVE-DESCRIPTION_GRAPH_FRESHNESS
# ───────────────────────────────────────────────────────────────
# Rule: CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS
# Severity: error
# Description: Description and graph timestamps must stay within the slack window. Sourced by validate.sh; the decision lives in the
#   Node module beside this wrapper, which shares its packet reading with
#   the other canonical-save rules through check-canonical-save-shared.cjs.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CANONICAL_SAVE_MODULE="$SCRIPT_DIR/check-canonical-save-description-graph-freshness.cjs"

run_check() {
    local folder="$1"
    local _level="$2"
    local output=""

    RULE_NAME="CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if [[ ! -f "$CANONICAL_SAVE_MODULE" ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Canonical-save rule module missing"
        RULE_DETAILS=("Expected module: $CANONICAL_SAVE_MODULE")
        return 0
    fi

    output="$(node "$CANONICAL_SAVE_MODULE" "$folder")"

    while IFS=$'\t' read -r kind value; do
        [[ -z "$kind" ]] && continue
        case "$kind" in
            rule) RULE_NAME="$value" ;;
            status) RULE_STATUS="$value" ;;
            message) RULE_MESSAGE="$value" ;;
            detail) RULE_DETAILS+=("$value") ;;
        esac
    done <<< "$output"

    if [[ -z "$RULE_MESSAGE" ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Canonical-save rule bridge returned no parseable output"
        RULE_DETAILS=("Raw output: $output")
    fi

    return 0
}
