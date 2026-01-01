#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-SECTIONS
# ───────────────────────────────────────────────────────────────

# Rule: SECTIONS_PRESENT
# Severity: warning
# Description: Checks for required markdown sections based on documentation level (warning only).
#   spec.md: Problem Statement, Requirements, Scope
#   plan.md: Technical Context, Architecture, Implementation
#   checklist.md (L2+): P0, P1
#   decision-record.md (L3): Context, Decision, Consequences

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="SECTIONS_PRESENT"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local -a missing=()

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local -a file_sections=(
        "spec.md:Problem Statement,Requirements,Scope"
        "plan.md:Technical Context,Architecture,Implementation"
    )
    
    [[ "$level" -ge 2 ]] && file_sections+=("checklist.md:P0,P1")
    [[ "$level" -ge 3 ]] && file_sections+=("decision-record.md:Context,Decision,Consequences")
    
    for entry in "${file_sections[@]}"; do
        local filename="${entry%%:*}"
        local sections="${entry#*:}"
        local filepath="$folder/$filename"
        
        [[ ! -f "$filepath" ]] && continue
        
        local headers
        headers=$(grep -E '^#{1,3} ' "$filepath" 2>/dev/null | sed 's/^#* //' || true)
        
        IFS=',' read -ra required <<< "$sections"
        for section in "${required[@]}"; do
            if ! echo "$headers" | grep -qi "$section"; then
                missing+=("$filename: $section")
            fi
        done
    done

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ ${#missing[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All required sections found"
    else
        RULE_STATUS="warn"
        RULE_MESSAGE="Missing ${#missing[@]} recommended section(s)"
        RULE_DETAILS=("${missing[@]}")
        RULE_REMEDIATION="Add missing sections to improve documentation completeness"
    fi
}
