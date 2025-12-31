#!/usr/bin/env bash
# Rule: FRONTMATTER_VALID
# Severity: warning
# Description: Validates YAML frontmatter structure in markdown files (optional check)

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="FRONTMATTER_VALID"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local issues=()
    
    # Check key markdown files for frontmatter
    local files_to_check=("spec.md" "plan.md")
    
    for file in "${files_to_check[@]}"; do
        local filepath="$folder/$file"
        [[ ! -f "$filepath" ]] && continue
        
        # Check if file starts with ---
        local first_line
        first_line=$(head -n 1 "$filepath" 2>/dev/null)
        
        if [[ "$first_line" == "---" ]]; then
            # Has frontmatter, check if it's closed
            local frontmatter_end
            frontmatter_end=$(awk 'NR>1 && /^---$/{print NR; exit}' "$filepath")
            
            if [[ -z "$frontmatter_end" ]]; then
                issues+=("$file: Unclosed YAML frontmatter (missing closing ---)")
            fi
        fi
        
        # Check for SPECKIT_TEMPLATE_SOURCE marker (indicates template was used)
        # Skip for test fixtures (path-based) or when SKIP_TEMPLATE_CHECK=1 (env var)
        local skip_template_check=false
        if [[ "$folder" == *"test-fixtures"* ]]; then
            skip_template_check=true
        fi
        if [[ "${SKIP_TEMPLATE_CHECK:-0}" == "1" ]]; then
            skip_template_check=true
        fi
        
        if [[ "$skip_template_check" == "false" ]]; then
            if ! grep -q "SPECKIT_TEMPLATE_SOURCE" "$filepath" 2>/dev/null; then
                issues+=("$file: Missing SPECKIT_TEMPLATE_SOURCE marker (may not be from template)")
            fi
        fi
    done
    
    if [[ ${#issues[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="Found ${#issues[@]} frontmatter issue(s)"
        RULE_DETAILS=("${issues[@]}")
        RULE_REMEDIATION="Ensure markdown files use templates from .opencode/skill/system-spec-kit/templates/"
    else
        RULE_MESSAGE="Frontmatter validation passed"
    fi
}
