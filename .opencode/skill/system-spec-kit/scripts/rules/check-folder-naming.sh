#!/usr/bin/env bash
# Rule: FOLDER_NAMING
# Severity: error
# Description: Validates spec folder follows ###-short-name convention

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="FOLDER_NAMING"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    # Get the folder name (basename)
    local folder_name
    folder_name=$(basename "$folder")
    
    # Pattern: 3 digits, hyphen, lowercase alphanumeric with hyphens
    local pattern='^[0-9]{3}-[a-z0-9-]+$'
    
    if [[ ! "$folder_name" =~ $pattern ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Folder name '$folder_name' does not follow naming convention"
        RULE_DETAILS+=("Expected pattern: ###-short-name (e.g., 001-auth-feature)")
        RULE_DETAILS+=("Got: $folder_name")
        
        # Provide specific feedback
        if [[ ! "$folder_name" =~ ^[0-9]{3}- ]]; then
            RULE_DETAILS+=("Missing 3-digit prefix (e.g., 001-, 042-)")
        fi
        if [[ "$folder_name" =~ [A-Z] ]]; then
            RULE_DETAILS+=("Contains uppercase letters (use lowercase only)")
        fi
        if [[ "$folder_name" =~ _ ]]; then
            RULE_DETAILS+=("Contains underscores (use hyphens instead)")
        fi
        
        RULE_REMEDIATION="Rename folder to follow pattern: ###-short-name (lowercase, hyphens only)"
    else
        RULE_MESSAGE="Folder name '$folder_name' follows naming convention"
    fi
}
