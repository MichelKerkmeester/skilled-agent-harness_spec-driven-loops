#!/usr/bin/env bash
# Rule: FILE_EXISTS
# Severity: error
# Description: Validates required files exist for documentation level

# Required files by documentation level
# Level 1: spec.md, plan.md, tasks.md
# Level 2: Level 1 + checklist.md
# Level 3: Level 2 + decision-record.md
#
# implementation-summary.md: Required AFTER implementation starts (detected by completed checklist items)

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="FILE_EXISTS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local missing=()
    
    # Level 1 requirements (all levels)
    [[ ! -f "$folder/spec.md" ]] && missing+=("spec.md")
    [[ ! -f "$folder/plan.md" ]] && missing+=("plan.md")
    [[ ! -f "$folder/tasks.md" ]] && missing+=("tasks.md")
    
    # implementation-summary.md is only required after implementation starts
    # Detect by checking for completed items in checklist.md
    local has_implementation=false
    if [[ -f "$folder/checklist.md" ]]; then
        # Check if any items are marked complete [x] or [X]
        if grep -qE '\[[xX]\]' "$folder/checklist.md" 2>/dev/null; then
            has_implementation=true
        fi
    fi
    
    if [[ "$has_implementation" == "true" ]]; then
        [[ ! -f "$folder/implementation-summary.md" ]] && missing+=("implementation-summary.md (required after implementation)")
    fi
    
    # For Level 1 specs, require implementation-summary.md if tasks are completed
    # Check tasks.md for completed items since Level 1 doesn't require checklist.md
    if [[ "$level" -eq 1 ]] && [[ ! -f "$folder/implementation-summary.md" ]]; then
        if [[ -f "$folder/tasks.md" ]]; then
            if grep -qE '\[[xX]\]' "$folder/tasks.md" 2>/dev/null; then
                # Per AGENTS.md: implementation-summary.md is REQUIRED after implementation completes
                missing+=("implementation-summary.md (required: tasks show completion)")
            fi
        fi
    fi
    
    # Level 2 additions
    if [[ "$level" -ge 2 ]]; then
        [[ ! -f "$folder/checklist.md" ]] && missing+=("checklist.md")
    fi
    
    # Level 3 additions
    if [[ "$level" -ge 3 ]]; then
        [[ ! -f "$folder/decision-record.md" ]] && missing+=("decision-record.md")
    fi
    
    # Set results based on findings
    if [[ ${#missing[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All required files present for Level $level"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="Missing ${#missing[@]} required file(s)"
        RULE_DETAILS=("${missing[@]}")
        
        # Build remediation message
        local missing_list
        missing_list=$(IFS=', '; echo "${missing[*]}")
        RULE_REMEDIATION="Create missing files: $missing_list. Use templates from .opencode/skill/system-spec-kit/templates/"
    fi
    
    # Note: Logging is handled by the orchestrator (validate-spec.sh)
    # Rules should only set RULE_* variables
}
