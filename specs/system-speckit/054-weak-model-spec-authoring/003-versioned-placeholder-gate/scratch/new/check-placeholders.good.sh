#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-PLACEHOLDERS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

_placeholder_rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../lib/status-classifier.sh
source "${_placeholder_rule_dir}/../lib/status-classifier.sh"

# Rule: PLACEHOLDER_FILLED
# Severity: error
# Description: Detects unfilled spec-doc placeholders: [YOUR_VALUE_HERE:], [NEEDS_CLARIFICATION:] / [NEEDS CLARIFICATION:],
#   and a [template:...] provenance token left in a title line. Bracketed authoring hints such as [Decision Title]
#   are soft by design and belong to spec/check-placeholders.sh, the standalone report.
# Lifecycle: a doc whose SPECKIT_TEMPLATE_SOURCE stamp is v2.3 or later ships every authoring hint as a
#   [YOUR_VALUE_HERE: ...] token. While spec.md has the Status Draft, an unfilled token in such a doc is a
#   warning. At any other status it is an error. A doc with an older stamp, or none, keeps the error it
#   always had. [NEEDS_CLARIFICATION:] is an error in every packet.
# Parity: mirrors the runtime orchestrator validatePlaceholders. Mustache {{...}} is NOT flagged
# (not canonical spec-doc placeholder syntax; legit spec-doc content uses it).
# The post-edit hook runs the broader bracket scan at spec/check-placeholders.sh
# instead; that one catches leftovers of upgrade-level, this one gates closure.

# ───────────────────────────────────────────────────────────────
# 1. HELPERS
# ───────────────────────────────────────────────────────────────

# Succeeds when the doc carries a SPECKIT_TEMPLATE_SOURCE stamp of v2.3 or later
# within its first 70 lines. A doc with an older stamp, or none, fails.
carries_token_gate_stamp() {
    local filepath="$1"
    local stamp_line major minor
    stamp_line=$(head -n 70 "$filepath" 2>/dev/null | \
        grep -m1 -E '^[[:space:]]*<!--[[:space:]]*SPECKIT_TEMPLATE_SOURCE:[^|>]*\|[[:space:]]*v[0-9]+\.[0-9]+[[:space:]]*-->' || true)
    [[ -n "$stamp_line" ]] || return 1
    major=$(printf '%s' "$stamp_line" | sed -E 's/.*\|[[:space:]]*v([0-9]+)\.([0-9]+).*/\1/')
    minor=$(printf '%s' "$stamp_line" | sed -E 's/.*\|[[:space:]]*v([0-9]+)\.([0-9]+).*/\2/')
    if (( major > 2 )) || { (( major == 2 )) && (( minor >= 3 )); }; then
        return 0
    fi
    return 1
}

# Succeeds when the Status row of spec.md holds exactly the word Draft.
spec_status_is_draft() {
    local folder="$1"
    local value
    value="$(extract_status_table_value "$folder/spec.md")"
    [[ "$(speckit_status_trim "$value")" == "draft" ]]
}

# ───────────────────────────────────────────────────────────────
# 2. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="PLACEHOLDER_FILLED"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local -a files=("spec.md" "plan.md" "tasks.md")
    [[ -f "$folder/decision-record.md" ]] && files+=("decision-record.md")
    # These three are read only when they carry the token-gate stamp, so a doc
    # with an older stamp is scanned exactly as it was before.
    files+=("acceptance-criteria.md" "implementation-summary.md" "goal.md")
    
    local -a found_placeholders=()
    local -a draft_tokens=()
    local draft_packet=false
    if spec_status_is_draft "$folder"; then
        draft_packet=true
    fi

# ───────────────────────────────────────────────────────────────
# 3. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

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

        local token_gated=false
        if carries_token_gate_stamp "$filepath"; then
            token_gated=true
        fi
        case "$file" in
            acceptance-criteria.md|implementation-summary.md|goal.md)
                [[ "$token_gated" == true ]] || continue
                ;;
        esac
        
        # Filter out fenced code blocks
        local filtered
        filtered=$(awk '
            BEGIN { in_code = 0 }
            /^```/ { in_code = !in_code; next }
            !in_code { print NR ":" $0 }
        ' "$filepath" 2>/dev/null)
        
        # Pattern 1: [YOUR_VALUE_HERE:] (skip inline backticks)
        # A token in a Draft packet is deferred to a warning when the doc carries
        # the token-gate stamp and the line holds no open question.
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                if [[ "$token_gated" == true && "$draft_packet" == true ]] && \
                   ! printf '%s' "$match" | grep -qE '\[NEEDS[_ ]CLARIFICATION:'; then
                    draft_tokens+=("$file:$linenum")
                else
                    found_placeholders+=("$file:$linenum")
                fi
            fi
        done < <(echo "$filtered" | grep -E '\[YOUR_VALUE_HERE:' 2>/dev/null | \
                 grep -v '`\[YOUR_VALUE_HERE:' | \
                 grep -v '\[YOUR_VALUE_HERE:[^]]*\]`' || true)
        
        # Pattern 2: [NEEDS_CLARIFICATION:] / [NEEDS CLARIFICATION:] (underscore + space)
        # Strict superset-parity with the canonical orchestrator: both variants flagged.
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_placeholders+=("$file:$linenum")
            fi
        done < <(echo "$filtered" | grep -E '\[NEEDS[_ ]CLARIFICATION:' 2>/dev/null | \
                 grep -v '`\[NEEDS[_ ]CLARIFICATION:' | \
                 grep -v '\[NEEDS[_ ]CLARIFICATION:[^]]*\]`' || true)

        # Pattern 3: a template's [template:...] provenance token left in a title.
        # Scoped to title lines because that is the only place a scaffold ever
        # carried it; the scaffolder strips it, so a survivor is a hand-copied
        # template or a document older than that fix.
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_placeholders+=("$file:$linenum")
            fi
        done < <(echo "$filtered" | grep -E '^[0-9]+:[[:space:]]*title:.*\[template:' 2>/dev/null || true)
    done
    
    # Deduplicate (bash 3.2 compatible)
    local -a unique_placeholders=()
    local seen_list=""
    if [[ ${#found_placeholders[@]} -gt 0 ]]; then
        for item in "${found_placeholders[@]}"; do
            if [[ "$seen_list" != *"|$item|"* ]]; then
                seen_list="$seen_list|$item|"
                unique_placeholders+=("$item")
            fi
        done
    fi

    local -a unique_draft_tokens=()
    seen_list=""
    if [[ ${#draft_tokens[@]} -gt 0 ]]; then
        for item in "${draft_tokens[@]}"; do
            if [[ "$seen_list" != *"|$item|"* ]]; then
                seen_list="$seen_list|$item|"
                unique_draft_tokens+=("$item")
            fi
        done
    fi

# ───────────────────────────────────────────────────────────────
# 4. RESULTS
# ───────────────────────────────────────────────────────────────

    local count=${#unique_placeholders[@]}
    local draft_count=${#unique_draft_tokens[@]}
    
    if [[ $count -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Found $count unfilled placeholder(s)"
        RULE_DETAILS=("${unique_placeholders[@]}")
        RULE_REMEDIATION="Replace [YOUR_VALUE_HERE:] and [NEEDS_CLARIFICATION:] / [NEEDS CLARIFICATION:] with actual values"
    elif [[ $draft_count -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="Found $draft_count unfilled value token(s) in a Draft packet"
        RULE_DETAILS=("${unique_draft_tokens[@]}")
        RULE_REMEDIATION="Replace each [YOUR_VALUE_HERE: ...] token with actual content before the status leaves Draft"
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="No unfilled placeholders found"
    fi
}

# Exit codes:
#   0 - Success
