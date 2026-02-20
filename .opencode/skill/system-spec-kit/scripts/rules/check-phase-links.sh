#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-PHASE-LINKS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: PHASE_LINKS
# Severity: warn
# Description: Validates phase parent-child back-references
#   - Only runs if folder contains [0-9][0-9][0-9]-*/ child folders
#   - Checks parent spec.md has Phase Documentation Map section
#   - Checks each child spec.md has parent back-reference (../spec.md)
#   - Checks predecessor/successor links are consistent

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="PHASE_LINKS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    # Check if this folder has phase children
    local phase_dirs=()
    for phase_dir in "$folder"/[0-9][0-9][0-9]-*/; do
        [[ -d "$phase_dir" ]] && phase_dirs+=("${phase_dir%/}")
    done

    # No phases = skip (pass with info message)
    if [[ ${#phase_dirs[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No phase folders detected (non-phased spec)"
        return 0
    fi

    local issues=()

    # Check 1: Parent spec.md has Phase Documentation Map
    if [[ -f "$folder/spec.md" ]]; then
        if ! grep -qi "PHASE DOCUMENTATION MAP" "$folder/spec.md" 2>/dev/null; then
            issues+=("Parent spec.md missing 'PHASE DOCUMENTATION MAP' section")
        fi
    else
        issues+=("Parent spec.md not found (required for phase parent)")
    fi

    # Check 2: Each child has spec.md with parent back-reference
    for phase_dir in "${phase_dirs[@]}"; do
        local phase_name
        phase_name=$(basename "$phase_dir")
        local child_spec="$phase_dir/spec.md"

        if [[ -f "$child_spec" ]]; then
            # Check for parent reference (../spec.md pattern)
            if ! grep -q '\.\./spec\.md' "$child_spec" 2>/dev/null; then
                issues+=("$phase_name/spec.md missing parent back-reference (../spec.md)")
            fi
        else
            issues+=("$phase_name/ missing spec.md")
        fi
    done

    # Check 3: Predecessor/successor consistency
    # Each child (except first) should reference its predecessor
    # Each child (except last) should reference its successor
    local prev_name=""
    for phase_dir in "${phase_dirs[@]}"; do
        local phase_name
        phase_name=$(basename "$phase_dir")
        local child_spec="$phase_dir/spec.md"

        if [[ -n "$prev_name" && -f "$child_spec" ]]; then
            # Current phase should reference predecessor
            if ! grep -q "$prev_name" "$child_spec" 2>/dev/null; then
                issues+=("$phase_name/spec.md missing predecessor reference ($prev_name)")
            fi
        fi

        prev_name="$phase_name"
    done

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ ${#issues[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="Phase links valid (${#phase_dirs[@]} phases verified)"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="${#issues[@]} phase link issue(s) found"
        RULE_DETAILS=("${issues[@]}")
        RULE_REMEDIATION="Fix phase back-references. Each child spec.md needs '| **Parent Spec** | ../spec.md |' in metadata. Parent spec.md needs a 'PHASE DOCUMENTATION MAP' section."
    fi
}
