#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-PRIORITY-TAGS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: PRIORITY_TAGS
# Severity: warning
# Description: Validates verification items have priority context (P0/P1/P2 headers or inline tags).
#              Only runs for Level 2+ (when a merged or legacy checklist exists)

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="PRIORITY_TAGS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    # Strip non-numeric suffix (e.g. "3+" → "3") for arithmetic comparisons.
    local numeric_level="${level//[^0-9]/}"
    if [[ "$numeric_level" -lt 2 ]]; then
        RULE_STATUS="skip"
        RULE_MESSAGE="Skipped (Level 1 - no checklist required)"
        return
    fi
    
    local checklist="$folder/checklist.md"
    local source_name="checklist.md"
    local merged_tasks=false

    if [[ ! -f "$checklist" ]]; then
        checklist="$folder/tasks.md"
        source_name="tasks.md"
        if [[ ! -f "$checklist" ]] || ! grep -q '<!-- ANCHOR:protocol -->' "$checklist" 2>/dev/null; then
            RULE_STATUS="skip"
            RULE_MESSAGE="Skipped (merged verification section and checklist.md not found)"
            return
        fi
        merged_tasks=true
    fi

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local current_priority=""
    local items_without_priority=0
    local line_number=0
    local in_verification=false
    local verification_end_marker='<!-- /ANCHOR:summary -->'
    if [[ "$merged_tasks" == "true" ]] && grep -q '<!-- /ANCHOR:sign-off -->' "$checklist" 2>/dev/null; then
        verification_end_marker='<!-- /ANCHOR:sign-off -->'
    fi
    
    while IFS= read -r line || [[ -n "$line" ]]; do
        ((line_number++)) || true

        if [[ "$merged_tasks" == "true" ]]; then
            if [[ "$line" == *"<!-- ANCHOR:protocol -->"* ]]; then
                in_verification=true
            elif [[ "$line" == *"$verification_end_marker"* ]]; then
                in_verification=false
                continue
            elif [[ "$in_verification" != "true" ]]; then
                continue
            fi
        fi
        
        # Priority section headers: ## P0, ## P0 - Blockers, ### P0:, etc.
        if [[ "$line" =~ ^#{1,3}[[:space:]]+(P[012])([[:space:]]|$|:|-) ]]; then
            current_priority="${BASH_REMATCH[1]}"
            continue
        fi
        
        # Checklist items: - [ ] or - [x]
        if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[[:space:]xX]\] ]]; then
            # Validate format: must have space after ] and description
            if [[ ! "$line" =~ ^[[:space:]]*-[[:space:]]\[[[:space:]xX]\][[:space:]]+.+ ]]; then
                RULE_DETAILS+=("$source_name:$line_number: Invalid format (missing space or description)")
                ((items_without_priority++)) || true
                continue
            fi
            
            local has_priority=false
            [[ -n "$current_priority" ]] && has_priority=true
            # Inline: [P0], [P1], [P2] or **P0**, **P1**, **P2**
            [[ "$line" =~ \[P[012]\] ]] && has_priority=true
            [[ "$line" =~ \*\*P[012]\*\* ]] && has_priority=true
            
            if [[ "$has_priority" == "false" ]]; then
                local desc="${line#*] }"
                desc="${desc:0:50}"
                [[ ${#desc} -eq 50 ]] && desc="${desc}..."
                RULE_DETAILS+=("$source_name:$line_number: $desc")
                ((items_without_priority++)) || true
            fi
        fi
    done < "$checklist"

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ $items_without_priority -eq 0 ]]; then
        RULE_STATUS="pass"
        if [[ "$merged_tasks" == "true" ]]; then
            RULE_MESSAGE="All verification items have priority context"
        else
            RULE_MESSAGE="All checklist items have priority context"
        fi
    else
        RULE_STATUS="warn"
        if [[ "$merged_tasks" == "true" ]]; then
            RULE_MESSAGE="Found $items_without_priority verification item(s) without priority context"
        else
            RULE_MESSAGE="Found $items_without_priority checklist item(s) without priority context"
        fi
        RULE_REMEDIATION="Move items under P0/P1/P2 headers or add inline [P0]/[P1]/[P2] tags"
    fi
}

# Exit codes:
#   0 - Success
