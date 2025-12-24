#!/usr/bin/env bash
#
# check-sections.sh - SECTIONS_PRESENT validation rule
#
# Checks for required markdown sections in spec files based on documentation level.
# This is a WARNING-only check (missing sections don't block, but are recommended).
#
# VERSION: 1.0.0
# CREATED: 2024-12-24

# ============================================================================
# RULE INTERFACE
# ============================================================================

# run_check(folder, level)
# Main entry point - validates required sections exist in spec files
#
# Required sections by file:
#   spec.md:            Problem Statement, Requirements, Scope
#   plan.md:            Technical Context, Architecture, Implementation
#   checklist.md (L2+): P0, P1
#   decision-record.md (L3): Context, Decision, Consequences
#
run_check() {
    local folder="$1"
    local level="$2"
    
    # Initialize rule interface variables
    RULE_NAME="SECTIONS_PRESENT"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local -a missing=()
    
    # Define required sections per file
    # Format: "filename:section1,section2,section3"
    local -a file_sections=(
        "spec.md:Problem Statement,Requirements,Scope"
        "plan.md:Technical Context,Architecture,Implementation"
    )
    
    # Add level-specific requirements
    if [[ "$level" -ge 2 ]]; then
        file_sections+=("checklist.md:P0,P1")
    fi
    
    if [[ "$level" -ge 3 ]]; then
        file_sections+=("decision-record.md:Context,Decision,Consequences")
    fi
    
    # Check each file for required sections
    for entry in "${file_sections[@]}"; do
        local filename="${entry%%:*}"
        local sections="${entry#*:}"
        local filepath="$folder/$filename"
        
        # Skip if file doesn't exist (FILE_EXISTS rule handles this)
        [[ ! -f "$filepath" ]] && continue
        
        # Extract all markdown headers (# ## ###)
        local headers
        headers=$(grep -E '^#{1,3} ' "$filepath" 2>/dev/null | sed 's/^#* //' || true)
        
        # Check each required section (case-insensitive)
        IFS=',' read -ra required <<< "$sections"
        for section in "${required[@]}"; do
            if ! echo "$headers" | grep -qi "$section"; then
                missing+=("$filename: $section")
            fi
        done
    done
    
    # Set results based on findings
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
