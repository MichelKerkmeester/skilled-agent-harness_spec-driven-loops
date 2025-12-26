#!/usr/bin/env bash
# Rule: LEVEL_DECLARED
# Checks if documentation level was explicitly declared vs inferred

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="LEVEL_DECLARED"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    if [[ "$LEVEL_METHOD" == "explicit" ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="Level $level explicitly declared"
        # Only visible in verbose mode
    else
        RULE_STATUS="info"
        RULE_MESSAGE="Level $level was inferred (consider adding explicit Level field to spec.md)"
        RULE_REMEDIATION="Add '| **Level** | $level |' to spec.md metadata table"
    fi
}
