#!/usr/bin/env bash
# Rule: EVIDENCE_CITED
# Checks that completed P0/P1 checklist items have evidence citations.
# P2 items are exempt from evidence requirements.
#
# Evidence patterns recognized:
#   - [EVIDENCE: ...] or [Evidence: ...]
#   - | Evidence: (pipe-separated)
#   - ✓ or ✔ with description
#   - (verified), (tested), (confirmed) at end
#   - [DEFERRED: ...] counts as explained

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="EVIDENCE_CITED"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local checklist="$folder/checklist.md"
    
    # Only run for Level 2+ (when checklist.md exists)
    if [[ ! -f "$checklist" ]]; then
        RULE_STATUS="skip"
        RULE_MESSAGE="No checklist.md (Level 1 or missing)"
        return 0
    fi
    
    local current_priority=""
    local line_num=0
    local missing_count=0
    
    while IFS= read -r line || [[ -n "$line" ]]; do
        ((line_num++)) || true
        
        # Detect priority section headers (## P0, ## P1, ## P2)
        if [[ "$line" =~ ^##[[:space:]]+(P[0-2]) ]]; then
            current_priority="${BASH_REMATCH[1]}"
            continue
        fi
        
        # Skip if no priority context yet (items before any P0/P1/P2 header)
        [[ -z "$current_priority" ]] && continue
        
        # P2 items are exempt from evidence requirements
        [[ "$current_priority" == "P2" ]] && continue
        
        # Check for completed items: - [x] or - [X]
        if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[xX]\] ]]; then
            # Extract task text (after the checkbox)
            local task_text="${line#*] }"
            
            # Check for evidence patterns using glob patterns (portable)
            local has_evidence=false
            local line_lower
            line_lower=$(echo "$line" | tr '[:upper:]' '[:lower:]')
            
            # Pattern 1: [EVIDENCE: ...] or [Evidence: ...]
            [[ "$line_lower" == *"[evidence:"* ]] && has_evidence=true
            
            # Pattern 2: | Evidence: (pipe-separated)
            [[ "$line_lower" == *"| evidence:"* ]] && has_evidence=true
            
            # Pattern 3: ✓ or ✔ with description after
            [[ "$line" == *"✓ "* || "$line" == *"✔ "* ]] && has_evidence=true
            
            # Pattern 4: (verified), (tested), (confirmed) at end
            [[ "$line_lower" == *"(verified)"* || "$line_lower" == *"(tested)"* || "$line_lower" == *"(confirmed)"* ]] && has_evidence=true
            
            # Pattern 5: [DEFERRED: ...] counts as explained
            [[ "$line_lower" == *"[deferred:"* ]] && has_evidence=true
            
            if [[ "$has_evidence" == "false" ]]; then
                ((missing_count++)) || true
                # Truncate long task descriptions for display
                local display_task="$task_text"
                if [[ ${#display_task} -gt 50 ]]; then
                    display_task="${display_task:0:47}..."
                fi
                RULE_DETAILS+=("${current_priority}:${line_num}: ${display_task}")
            fi
        fi
    done < "$checklist"
    
    # Set result based on findings
    if [[ $missing_count -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All completed P0/P1 items have evidence"
    else
        RULE_STATUS="warn"
        RULE_MESSAGE="Found ${missing_count} completed item(s) without evidence"
        RULE_REMEDIATION="Add [EVIDENCE: description] to completed P0/P1 items"
    fi
}
