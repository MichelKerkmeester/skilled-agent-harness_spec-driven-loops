#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-LEVEL-MATCH
# ───────────────────────────────────────────────────────────────

# Rule: LEVEL_MATCH
# Severity: error
# Description: Validates that the declared level is consistent across all
#   spec folder files, and required files exist for the declared level.

# ───────────────────────────────────────────────────────────────
# 1. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Extract level from a file's metadata section
_level_extract_from_file() {
    local file="$1"
    if [[ -f "$file" ]]; then
        # Look for various level declaration patterns
        local level level_line
        level_line=$(grep -E "^\- \*\*Level\*\*:" "$file" 2>/dev/null || true)
        if [[ -n "$level_line" ]]; then
            level=$(echo "$level_line" | head -1 | sed 's/.*Level.*: *//' | tr -d '[:space:]' | sed 's/\[.*\]//' | head -c 2)
            if [[ -n "$level" ]]; then
                echo "$level"
                return 0
            fi
        fi

        # Alternative: look for Level in checklist type
        level_line=$(grep -E "Level [0-9]" "$file" 2>/dev/null || true)
        if [[ -n "$level_line" ]]; then
            level=$(echo "$level_line" | head -1 | grep -oE "Level [0-9]+" | sed 's/Level //' | head -c 2)
            if [[ -n "$level" ]]; then
                echo "$level"
                return 0
            fi
        fi
    fi
    echo ""
}

# Check if file should declare level
_level_should_have() {
    local file="$1"
    local basename
    basename=$(basename "$file")

    # These files should have level declarations
    case "$basename" in
        spec.md|plan.md|checklist.md)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# ───────────────────────────────────────────────────────────────
# 2. MAIN RUN_CHECK FUNCTION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="LEVEL_MATCH"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local warnings=()
    local errors=()

    # Get primary level from spec.md
    local primary_level=""
    if [[ -f "$folder/spec.md" ]]; then
        primary_level=$(_level_extract_from_file "$folder/spec.md")
    fi

    if [[ -z "$primary_level" ]]; then
        # Use inferred level if spec.md doesn't declare one
        primary_level="$level"
    fi

    # Check each relevant file for level consistency
    for file in "$folder"/*.md; do
        if [[ -f "$file" ]]; then
            if _level_should_have "$file"; then
                local file_level
                file_level=$(_level_extract_from_file "$file")
                local basename
                basename=$(basename "$file")

                if [[ -n "$file_level" ]]; then
                    if [[ "$file_level" != "$primary_level" ]]; then
                        errors+=("$basename declares Level $file_level, but spec.md declares Level $primary_level")
                    fi
                else
                    warnings+=("$basename does not declare a level (expected Level $primary_level)")
                fi
            fi
        fi
    done

    # Validate file presence based on level
    # Level 1 requires: spec.md, plan.md, tasks.md
    local required_files=("spec.md" "plan.md" "tasks.md")

    # Level 2 adds: checklist.md
    if [[ "$primary_level" = "2" ]] || [[ "$primary_level" = "3" ]] || [[ "$primary_level" = "3+" ]]; then
        required_files+=("checklist.md")
    fi

    # Level 3 adds: decision-record.md
    if [[ "$primary_level" = "3" ]] || [[ "$primary_level" = "3+" ]]; then
        required_files+=("decision-record.md")
    fi

    for req_file in "${required_files[@]}"; do
        if [[ ! -f "$folder/$req_file" ]]; then
            errors+=("Required file missing for Level $primary_level: $req_file")
        fi
    done

    # Check for files that suggest higher level
    if [[ "$primary_level" = "1" ]]; then
        if [[ -f "$folder/decision-record.md" ]]; then
            warnings+=("decision-record.md present but Level 1 declared - consider upgrading level")
        fi
    fi

    # ───────────────────────────────────────────────────────────────
    # 3. RESULTS
    # ───────────────────────────────────────────────────────────────

    if [[ ${#errors[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Level consistency errors"
        RULE_DETAILS=("${errors[@]}" "${warnings[@]}")
        RULE_REMEDIATION="Ensure all files declare consistent level and required files exist"
    elif [[ ${#warnings[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="Level consistency warnings"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="Add level declarations to files or review level assignment"
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="Level consistent across all files (Level $primary_level)"
    fi

    return 0
}
