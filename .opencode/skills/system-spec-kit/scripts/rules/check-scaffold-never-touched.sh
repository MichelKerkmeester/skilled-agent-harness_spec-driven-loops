#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# RULE: CHECK-SCAFFOLD-NEVER-TOUCHED
# -----------------------------------------------------------------------------

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

_scaffold_rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../lib/status-classifier.sh
source "${_scaffold_rule_dir}/../lib/status-classifier.sh"

# Rule: SCAFFOLD_NEVER_TOUCHED
# Severity: error
# Description: Detects scaffold-origin docs whose folder claims Complete status.

# -----------------------------------------------------------------------------
# 1. INITIALIZATION
# -----------------------------------------------------------------------------

run_check() {
    local folder="$1"
    local level="$2"
    : "$level"

    RULE_NAME="SCAFFOLD_NEVER_TOUCHED"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local spec_file="$folder/spec.md"
    local status_value=""
    local spec_complete=false
    local -a files=("plan.md" "tasks.md" "implementation-summary.md")
    [[ -f "$folder/checklist.md" ]] && files+=("checklist.md")
    local -a found_markers=()

# -----------------------------------------------------------------------------
# 2. VALIDATION LOGIC
# -----------------------------------------------------------------------------

    status_value="$(extract_status_table_value "$spec_file")"

    if [[ "$(classify_status "$status_value")" == "complete" ]]; then
        spec_complete=true
    fi

    if [[ "$spec_complete" != true ]]; then
        RULE_STATUS="pass"
        if [[ -n "$status_value" ]]; then
            RULE_MESSAGE="Spec status is '$status_value', not Complete; scaffold markers are allowed"
        else
            RULE_MESSAGE="Spec status does not claim Complete; scaffold markers are allowed"
        fi
        return
    fi

    for file in "${files[@]}"; do
        local filepath="$folder/$file"
        [[ ! -f "$filepath" ]] && continue

        # Skip: scratch/, memory/, templates/
        if [[ "$filepath" == *"/scratch/"* ]] || \
           [[ "$filepath" == *"/memory/"* ]] || \
           [[ "$filepath" == *"/templates/"* ]]; then
            continue
        fi

        if type -t should_skip_path &>/dev/null; then
            if should_skip_path "$filepath"; then
                continue
            fi
        fi

        local frontmatter
        frontmatter=$(awk '
            NR == 1 && $0 == "---" { in_frontmatter = 1; next }
            in_frontmatter && $0 == "---" { exit }
            in_frontmatter { print NR ":" $0 }
        ' "$filepath" 2>/dev/null || true)

        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_markers+=("$file:$linenum: title contains [template:")
            fi
        done < <(printf '%s\n' "$frontmatter" | grep -E '^[0-9]+:[[:space:]]*title:[^#]*\[template:' 2>/dev/null || true)

        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_markers+=("$file:$linenum: packet_pointer starts with \"scaffold/\"")
            fi
        done < <(printf '%s\n' "$frontmatter" | grep -E "^[0-9]+:[[:space:]]*packet_pointer:[[:space:]]*['\"]?scaffold/" 2>/dev/null || true)

        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_markers+=("$file:$linenum: last_updated_by is \"template-author\"")
            fi
        done < <(printf '%s\n' "$frontmatter" | grep -E "^[0-9]+:[[:space:]]*last_updated_by:[[:space:]]*['\"]?template-author['\"]?[[:space:]]*(#.*)?$" 2>/dev/null || true)
    done

    # Deduplicate (bash 3.2 compatible)
    local -a unique_markers=()
    local seen_list=""
    if [[ ${#found_markers[@]} -gt 0 ]]; then
        for item in "${found_markers[@]}"; do
            if [[ "$seen_list" != *"|$item|"* ]]; then
                seen_list="$seen_list|$item|"
                unique_markers+=("$item")
            fi
        done
    fi

# -----------------------------------------------------------------------------
# 3. RESULTS
# -----------------------------------------------------------------------------

    local count=${#unique_markers[@]}

    if [[ $count -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No scaffold-signature markers found in required docs for Complete spec"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="Found $count scaffold-signature marker(s) in Complete spec folder"
        RULE_DETAILS=("${unique_markers[@]}")
        RULE_REMEDIATION="Replace scaffold-origin frontmatter in plan.md, tasks.md, implementation-summary.md, and checklist.md before claiming Status: Complete."
    fi
}

# Exit codes:
#   0 - Success
