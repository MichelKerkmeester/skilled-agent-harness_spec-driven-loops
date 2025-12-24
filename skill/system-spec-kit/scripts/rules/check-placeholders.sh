#!/usr/bin/env bash
# Rule: PLACEHOLDER_FILLED
# Detects unfilled placeholders like [YOUR_VALUE_HERE:] and [NEEDS CLARIFICATION:]

# Requires: should_skip_path() from common-rules.sh (optional)

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="PLACEHOLDER_FILLED"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    # Files to check based on existence
    local -a files=("spec.md" "plan.md" "tasks.md")
    [[ -f "$folder/checklist.md" ]] && files+=("checklist.md")
    [[ -f "$folder/decision-record.md" ]] && files+=("decision-record.md")
    
    local -a found_placeholders=()
    
    for file in "${files[@]}"; do
        local filepath="$folder/$file"
        [[ ! -f "$filepath" ]] && continue
        
        # Skip directories: scratch/, memory/, templates/
        if [[ "$filepath" == *"/scratch/"* ]] || \
           [[ "$filepath" == *"/memory/"* ]] || \
           [[ "$filepath" == *"/templates/"* ]]; then
            continue
        fi
        
        # Use should_skip_path if available (from common-rules.sh)
        if type -t should_skip_path &>/dev/null; then
            if should_skip_path "$filepath"; then
                continue
            fi
        fi
        
        # Filter out fenced code blocks using awk
        # Outputs: "LINE_NUMBER:content" for non-code-block lines
        local filtered
        filtered=$(awk '
            BEGIN { in_code = 0 }
            /^```/ { in_code = !in_code; next }
            !in_code { print NR ":" $0 }
        ' "$filepath" 2>/dev/null)
        
        # Pattern 1: [YOUR_VALUE_HERE: ...]
        # Skip lines where pattern is inside inline backticks
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_placeholders+=("$file:$linenum")
            fi
        done < <(echo "$filtered" | grep -E '\[YOUR_VALUE_HERE:' 2>/dev/null | \
                 grep -v '`\[YOUR_VALUE_HERE:' | \
                 grep -v '\[YOUR_VALUE_HERE:[^]]*\]`' || true)
        
        # Pattern 2: [NEEDS CLARIFICATION: ...]
        # Skip lines where pattern is inside inline backticks
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_placeholders+=("$file:$linenum")
            fi
        done < <(echo "$filtered" | grep -E '\[NEEDS CLARIFICATION:' 2>/dev/null | \
                 grep -v '`\[NEEDS CLARIFICATION:' | \
                 grep -v '\[NEEDS CLARIFICATION:[^]]*\]`' || true)
    done
    
    # Deduplicate results (same line might match multiple patterns)
    # Using bash 3.2-compatible deduplication (no associative arrays)
    local -a unique_placeholders=()
    local seen_list=""
    for item in "${found_placeholders[@]}"; do
        # Check if already seen using string matching
        if [[ "$seen_list" != *"|$item|"* ]]; then
            seen_list="$seen_list|$item|"
            unique_placeholders+=("$item")
        fi
    done
    
    # Report results
    local count=${#unique_placeholders[@]}
    
    if [[ $count -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No unfilled placeholders found"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="Found $count unfilled placeholder(s)"
        RULE_DETAILS=("${unique_placeholders[@]}")
        RULE_REMEDIATION="Replace [YOUR_VALUE_HERE:] and [NEEDS CLARIFICATION:] with actual values"
    fi
}
