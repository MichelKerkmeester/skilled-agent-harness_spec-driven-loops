#!/usr/bin/env bash
# Rule: PRIORITY_TAGS
# Validates checklist items have priority context (P0/P1/P2 headers or inline tags)
# Only runs for Level 2+ (when checklist.md exists)

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="PRIORITY_TAGS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    # Only check Level 2+ (when checklist.md is required)
    if [[ "$level" -lt 2 ]]; then
        RULE_STATUS="skip"
        RULE_MESSAGE="Skipped (Level 1 - no checklist required)"
        return
    fi
    
    local checklist="$folder/checklist.md"
    
    # Skip if checklist doesn't exist (FILE_EXISTS rule will catch this)
    if [[ ! -f "$checklist" ]]; then
        RULE_STATUS="skip"
        RULE_MESSAGE="Skipped (checklist.md not found)"
        return
    fi
    
    local current_priority=""
    local items_without_priority=0
    local line_number=0
    
    # Process checklist line by line
    while IFS= read -r line || [[ -n "$line" ]]; do
        ((line_number++))
        
        # Check for priority section headers
        # Matches: ## P0, ## P0 - Blockers, ### P0:, ## P1, etc.
        if [[ "$line" =~ ^#{1,3}[[:space:]]+(P[012])([[:space:]]|$|:|-) ]]; then
            current_priority="${BASH_REMATCH[1]}"
            continue
        fi
        
        # Check for checklist items: - [ ] or - [x] with optional leading whitespace
        if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[[:space:]xX]\] ]]; then
            # Validate item format: must have space after ] and description text
            if [[ ! "$line" =~ ^[[:space:]]*-[[:space:]]\[[[:space:]xX]\][[:space:]]+.+ ]]; then
                RULE_DETAILS+=("Line $line_number: Invalid format (missing space or description)")
                ((items_without_priority++))
                continue
            fi
            
            # Check if item has priority context
            local has_priority=false
            
            # Option 1: Under a P0/P1/P2 header
            if [[ -n "$current_priority" ]]; then
                has_priority=true
            fi
            
            # Option 2: Has inline priority tag like [P0], [P1], [P2]
            if [[ "$line" =~ \[P[012]\] ]]; then
                has_priority=true
            fi
            
            # Record items without priority
            if [[ "$has_priority" == "false" ]]; then
                # Extract task description (first 50 chars after checkbox)
                local desc="${line#*] }"
                desc="${desc:0:50}"
                [[ ${#desc} -eq 50 ]] && desc="${desc}..."
                RULE_DETAILS+=("Line $line_number: $desc")
                ((items_without_priority++))
            fi
        fi
    done < "$checklist"
    
    # Set result based on findings
    if [[ $items_without_priority -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All checklist items have priority context"
    else
        RULE_STATUS="warn"
        RULE_MESSAGE="Found $items_without_priority checklist item(s) without priority context"
        RULE_REMEDIATION="Move items under P0/P1/P2 headers or add inline [P0]/[P1]/[P2] tags"
    fi
}
