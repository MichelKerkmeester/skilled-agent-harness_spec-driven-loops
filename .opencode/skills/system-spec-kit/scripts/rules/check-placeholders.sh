#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-PLACEHOLDERS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: PLACEHOLDER_FILLED
# Severity: error
# Description: Detects unfilled spec-doc placeholders: [YOUR_VALUE_HERE:], [NEEDS_CLARIFICATION:] / [NEEDS CLARIFICATION:]
# Parity: mirrors mcp_server orchestrator validatePlaceholders. Mustache {{...}} is NOT flagged
# (not canonical spec-doc placeholder syntax; legit spec-doc content uses it).

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="PLACEHOLDER_FILLED"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local -a files=("spec.md" "plan.md" "tasks.md")
    [[ -f "$folder/checklist.md" ]] && files+=("checklist.md")
    [[ -f "$folder/decision-record.md" ]] && files+=("decision-record.md")
    
    local -a found_placeholders=()

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

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
        
        # Pattern 1: [YOUR_VALUE_HERE:] (skip inline backticks)
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_placeholders+=("$file:$linenum")
            fi
        done < <(echo "$filtered" | grep -E '\[YOUR_VALUE_HERE:' 2>/dev/null | \
                 grep -v '`\[YOUR_VALUE_HERE:' | \
                 grep -v '\[YOUR_VALUE_HERE:[^]]*\]`' || true)
        
        # Pattern 2: [NEEDS_CLARIFICATION:] / [NEEDS CLARIFICATION:] (underscore + space)
        # Strict superset-parity with the canonical orchestrator: both variants flagged.
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_placeholders+=("$file:$linenum")
            fi
        done < <(echo "$filtered" | grep -E '\[NEEDS[_ ]CLARIFICATION:' 2>/dev/null | \
                 grep -v '`\[NEEDS[_ ]CLARIFICATION:' | \
                 grep -v '\[NEEDS[_ ]CLARIFICATION:[^]]*\]`' || true)
    done
    
    # Deduplicate (bash 3.2 compatible)
    local -a unique_placeholders=()
    local seen_list=""
    if [[ ${#found_placeholders[@]} -gt 0 ]]; then
        for item in "${found_placeholders[@]}"; do
            if [[ "$seen_list" != *"|$item|"* ]]; then
                seen_list="$seen_list|$item|"
                unique_placeholders+=("$item")
            fi
        done
    fi

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    local count=${#unique_placeholders[@]}
    
    if [[ $count -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No unfilled placeholders found"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="Found $count unfilled placeholder(s)"
        RULE_DETAILS=("${unique_placeholders[@]}")
        RULE_REMEDIATION="Replace [YOUR_VALUE_HERE:] and [NEEDS_CLARIFICATION:] / [NEEDS CLARIFICATION:] with actual values"
    fi
}

# Exit codes:
#   0 - Success
