#!/usr/bin/env bash

set -euo pipefail

run_check() {
    local folder="$1"
    local _level="$2"
    local summary_file="$folder/implementation-summary.md"

    RULE_NAME="CURRENT_STATE_DISCIPLINE"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if [[ ! -f "$summary_file" ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="implementation-summary.md not present; current-state scan skipped"
        return 0
    fi

    local findings
    findings="$(
        awk '
          /^```/ { in_fence = !in_fence; next }
          in_fence { next }
          /<!--/ { in_comment = 1 }
          in_comment {
            if (/-->/) in_comment = 0
            next
          }
          {
            line = tolower($0)
            if (line ~ /merged from/) print "implementation-summary.md:" FNR ": merged from"
            if (line ~ /renamed from/) print "implementation-summary.md:" FNR ": renamed from"
            if (line ~ /collapsed/) print "implementation-summary.md:" FNR ": collapsed"
            if (line ~ /reorganization/) print "implementation-summary.md:" FNR ": reorganization"
            if (line ~ /renumbered from/) print "implementation-summary.md:" FNR ": renumbered from"
            if (line ~ /migrated from/) print "implementation-summary.md:" FNR ": migrated from"
            if ($0 ~ /[0-9]+→[0-9]+/) print "implementation-summary.md:" FNR ": numeric arrow narrative"
          }
        ' "$summary_file"
    )"

    if [[ -z "$findings" ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="implementation-summary.md avoids migration-history tokens"
        return 0
    fi

    RULE_STATUS="info"
    RULE_MESSAGE="implementation-summary.md contains migration-history token(s)"
    RULE_REMEDIATION="Keep canonical summaries focused on current state; move migration history to a decision record, changelog, context index, or source control history."

    while IFS= read -r finding; do
        [[ -n "$finding" ]] && RULE_DETAILS+=("$finding")
    done <<< "$findings"
}
