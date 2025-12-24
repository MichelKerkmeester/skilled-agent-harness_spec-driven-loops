#!/usr/bin/env bash
# Rule: FILE_EXISTS
# Severity: error
# Description: Validates required files exist for documentation level

# Required files by documentation level
# Level 1: spec.md, plan.md, tasks.md
# Level 2: Level 1 + checklist.md
# Level 3: Level 2 + decision-record.md

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
