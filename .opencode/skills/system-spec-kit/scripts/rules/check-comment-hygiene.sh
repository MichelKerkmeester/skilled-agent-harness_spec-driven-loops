#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# RULE: CHECK-COMMENT-HYGIENE
# -----------------------------------------------------------------------------

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: COMMENT_HYGIENE_MARKER
# Severity: error
# Description: Detects ephemeral finding markers inside HTML comments.

# -----------------------------------------------------------------------------
# 1. INITIALIZATION
# -----------------------------------------------------------------------------

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="COMMENT_HYGIENE_MARKER"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local -a files=("spec.md" "plan.md" "tasks.md")
    [[ -f "$folder/checklist.md" ]] && files+=("checklist.md")
    [[ -f "$folder/decision-record.md" ]] && files+=("decision-record.md")
    
    local -a found_markers=()

# -----------------------------------------------------------------------------
# 2. VALIDATION LOGIC
# -----------------------------------------------------------------------------

    for file in "${files[@]}"; do
        local filepath="$folder/$file"
        [[ ! -f "$filepath" ]] && continue

        # Skip: scratch/, memory/, templates/
        if [[ "$filepath" == *"/scratch/"* ]] || \
           [[ "$filepath" == *"/memory/"* ]] || \
           [[ "$filepath" == *"/templates/"* ]]; then
            continue
        fi
        
        if type -t should_skip_path &>/dev/null; then
            if should_skip_path "$filepath"; then
                continue
            fi
        fi

        # Filter out fenced code blocks
        local filtered
        filtered=$(awk '
            BEGIN { in_code = 0 }
            /^```/ { in_code = !in_code; next }
            !in_code { print NR ":" $0 }
        ' "$filepath" 2>/dev/null)
        
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_markers+=("$file:$linenum")
            fi
        done < <(echo "$filtered" | grep -E '<!--[^>]*F-[0-9]+-[A-Z0-9]+-[0-9]+[^>]*-->' 2>/dev/null || true)
    done

    # Deduplicate (bash 3.2 compatible)
    local -a unique_markers=()
    local seen_list=""
    if [[ ${#found_markers[@]} -gt 0 ]]; then
        for item in "${found_markers[@]}"; do
            if [[ "$seen_list" != *"|$item|"* ]]; then
                seen_list="$seen_list|$item|"
                unique_markers+=("$item")
            fi
        done
    fi

# -----------------------------------------------------------------------------
# 3. RESULTS
# -----------------------------------------------------------------------------

    local count=${#unique_markers[@]}

    if [[ $count -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No ephemeral comment-hygiene markers found"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="Found $count ephemeral comment-hygiene marker(s)"
        RULE_DETAILS=("${unique_markers[@]}")
        RULE_REMEDIATION="Remove the ephemeral finding/packet ID from the HTML comment; keep only durable-WHY prose, or delete the comment entirely if it was pure tracking noise."
    fi
}

# Exit codes:
#   0 - Success
