#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-FILES
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: FILE_EXISTS
# Severity: error
# Description: Validates required files exist for documentation level
#   Level 1: spec.md, plan.md, tasks.md
#   Level 3: Level 2 + decision-record.md
#   Lifecycle-required documents: Required after implementation starts (detected by completed items)

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="FILE_EXISTS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local missing=()
    local rule_dir
    rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local helper_script="$rule_dir/../utils/template-structure.js"

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    # Phase-parent early branch: lean parents require the control trio.
    # Detailed planning and lifecycle documents live in child phase folders.
    if is_phase_parent "$folder"; then
        local phase_doc
        while IFS= read -r phase_doc; do
            [[ -z "$phase_doc" ]] && continue
            [[ ! -f "$folder/$phase_doc" ]] && missing+=("$phase_doc")
        done < <(node "$helper_script" docs "phase")
        [[ ! -f "$folder/description.json" ]] && missing+=("description.json")
        [[ ! -f "$folder/graph-metadata.json" ]] && missing+=("graph-metadata.json")

        if [[ ${#missing[@]} -eq 0 ]]; then
            RULE_STATUS="pass"
            RULE_MESSAGE="Phase parent: lean trio present"
        else
            RULE_STATUS="fail"
            RULE_MESSAGE="Phase parent: missing ${#missing[@]} required file(s)"
            RULE_DETAILS=("${missing[@]}")
            RULE_REMEDIATION="Phase parents require spec.md, description.json, and graph-metadata.json"
        fi
        return 0
    fi

    # Lifecycle-required documents are gated after implementation starts.
    # Anchored to list items so the task-notation legend table (a literal
    # backticked [x] explaining the symbol) cannot read as started work.
    local has_implementation=false
    local started_file
    for started_file in tasks.md; do
        if [[ -f "$folder/$started_file" ]] && grep -qE '^\s*[-*] \[[xX]\]' "$folder/$started_file" 2>/dev/null; then
            has_implementation=true
            break
        fi
    done

    if [[ "$has_implementation" == "true" ]]; then
        local lifecycle_doc
        while IFS= read -r lifecycle_doc; do
            [[ -z "$lifecycle_doc" ]] && continue
            [[ ! -f "$folder/$lifecycle_doc" ]] && missing+=("$lifecycle_doc (required after implementation)")
        done < <(node "$helper_script" lifecycle-docs "$level")
    fi

    local doc_name
    while IFS= read -r doc_name; do
        [[ -z "$doc_name" ]] && continue
        [[ ! -f "$folder/$doc_name" ]] && missing+=("$doc_name")
    done < <(node "$helper_script" docs "$level")

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ ${#missing[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All required files present for Level $level"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="Missing ${#missing[@]} required file(s) for Level $level"
        RULE_DETAILS=("${missing[@]}")
        local missing_list
        missing_list=$(IFS=', '; echo "${missing[*]}")
        RULE_REMEDIATION="Create missing files for Level $level: $missing_list"
    fi
}

# Exit codes:
#   0 - Success
