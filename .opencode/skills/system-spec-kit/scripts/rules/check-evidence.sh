#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-EVIDENCE
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: EVIDENCE_CITED
# Severity: warning
# Description: Checks that completed P0/P1 checklist and task items cite
#              substantive evidence, not only evidence-shaped labels.
#
# A second checkbox on the same line is no longer treated
# as evidence. Only explicit semantic markers count.
# Priority parsing is now sourced from
# scripts/lib/check-priority-helper.sh so this rule shares its regex
# with check-priority-tags.sh.

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

# Source the shared priority helper. BASH_SOURCE-relative path
# keeps the resolution stable when this rule is invoked from validate.sh.
_check_evidence_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../lib/check-priority-helper.sh
source "${_check_evidence_dir}/../lib/check-priority-helper.sh"

evidence_item_has_substance() {
    local item_text="$1"
    local normalized lower remainder marker_type
    normalized="$(printf '%s' "$item_text" | tr '\n' ' ' | sed -E 's/^[[:space:]]*-[[:space:]]\[[xX]\][[:space:]]*//; s/\[[Pp][0-2]\][[:space:]]*//g; s/[[:space:]]+/ /g; s/^[[:space:]]+|[[:space:]]+$//g')"
    lower="$(printf '%s' "$normalized" | tr '[:upper:]' '[:lower:]')"
    remainder="$lower"
    remainder="$(printf '%s' "$remainder" | sed -E 's/.*\[(evidence|deferred):[[:space:]]*([^]]*)\].*/\2/; s/^[[:space:]]+|[[:space:]]+$//g')"
    # Which bracket kind matched (evidence/deferred/none) — the same greedy
    # "last bracket in the line wins" match as the remainder extraction above.
    marker_type="$(printf '%s' "$lower" | grep -Eo '\[(evidence|deferred):' | tail -1 | sed -E 's/^\[|:$//g')"

    case "$remainder" in
        ""|done|verified|tested|confirmed|passed|pass|yes|n/a|na|ok|okay|tbd)
            return 1
            ;;
    esac

    [[ ${#normalized} -ge 32 ]] || return 1

    # A non-trivial [DEFERRED: ...] reason is a documented disposition, not a
    # proof of completed work — it does not need to look evidence-shaped
    # (filename, backtick, fraction/percent, test-tool keyword) to count.
    # Trivial deferrals (empty/placeholder) are already caught by the case
    # statement above; anything that survives that is treated as sufficient.
    if [[ "$marker_type" == "deferred" ]]; then
        return 0
    fi

    if [[ "$normalized" =~ [A-Za-z0-9_.-]+\.(ts|tsx|js|mjs|cjs|sh|md|json|jsonc|yml|yaml|py):[0-9]+ ]]; then
        return 0
    fi
    if [[ "$normalized" =~ \`[^\`]{4,}\` ]]; then
        return 0
    fi
    if [[ "$normalized" =~ [0-9]+/[0-9]+ || "$normalized" =~ [0-9]+% ]]; then
        return 0
    fi
    if [[ "$lower" =~ (vitest|pytest|npm[[:space:]]+run|validate\.sh|tsc|typecheck|build|lint|shellcheck|node[[:space:]]+--check|exit[[:space:]]+code|test[[:space:]]+files?|tests?[[:space:]]+[0-9]+[[:space:]]+passed|passed[[:space:]]*\([0-9]+\)) ]]; then
        return 0
    fi
    if [[ "$lower" == *"diff review"* ]]; then
        return 0
    fi
    if [[ "$normalized" =~ T[0-9]{3} && "$lower" == *"passing"* ]]; then
        return 0
    fi
    return 1
}

check_completed_item_evidence() {
    local source_label="$1"
    local start_line="$2"
    local item_priority="$3"
    local item_text="$4"

    [[ -z "$item_text" ]] && return 0
    [[ "$item_priority" == "P2" ]] && return 0

    local normalized_item
    normalized_item="$(printf '%s' "$item_text" | tr '\n' ' ' | sed -E 's/^[[:space:]]*-[[:space:]]\[[xX]\][[:space:]]*//; s/[[:space:]]+/ /g; s/^[[:space:]]+|[[:space:]]+$//g')"
    if [[ "$source_label" == "tasks.md" && ! "$normalized_item" =~ ^T[0-9]{3}([[:space:]]|$) ]]; then
        return 0
    fi

    if ! evidence_item_has_substance "$item_text"; then
        ((missing_count++)) || true
        local display_task priority_label
        display_task="$normalized_item"
        if [[ ${#display_task} -gt 70 ]]; then
            display_task="${display_task:0:67}..."
        fi
        priority_label="${item_priority:-UNSPECIFIED}"
        RULE_DETAILS+=("${source_label}:${priority_label}:${start_line}: ${display_task}")
    fi
}

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="EVIDENCE_CITED"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local -a evidence_files=()

    [[ -f "$folder/checklist.md" ]] && evidence_files+=("checklist.md")
    [[ -f "$folder/tasks.md" ]] && evidence_files+=("tasks.md")

    if [[ ${#evidence_files[@]} -eq 0 ]]; then
        RULE_STATUS="skip"
        RULE_MESSAGE="No checklist.md or tasks.md"
        return 0
    fi

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local missing_count=0
    local file_name
    for file_name in "${evidence_files[@]}"; do
        local current_priority=""
        local line_num=0
        local active_item=""
        local active_line=0
        local active_priority=""
        local active_completed=false
        local path="$folder/$file_name"

        while IFS= read -r line || [[ -n "$line" ]]; do
            ((line_num++)) || true

            if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[xX[:space:]-]\] ]]; then
                if [[ "$active_completed" == true ]]; then
                    check_completed_item_evidence "$file_name" "$active_line" "$active_priority" "$active_item"
                fi
                active_item=""
                active_line=0
                active_priority=""
                active_completed=false
            fi

            local _detected_priority=""
            if detect_priority_section_header "$line" _detected_priority; then
                current_priority="$_detected_priority"
                continue
            fi

            if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[xX]\] ]]; then
                local _inline_priority=""
                if detect_priority_inline_tag "$line" _inline_priority; then
                    active_priority="$_inline_priority"
                elif [[ -n "$current_priority" ]]; then
                    active_priority="$current_priority"
                fi
                active_item="$line"
                active_line=$line_num
                active_completed=true
                continue
            fi

            if [[ "$active_completed" == true ]]; then
                active_item+=$'\n'
                active_item+="$line"
            fi
        done < "$path"

        if [[ "$active_completed" == true ]]; then
            check_completed_item_evidence "$file_name" "$active_line" "$active_priority" "$active_item"
        fi
    done

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ $missing_count -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All completed P0/P1 checklist/task items have substantive evidence"
    else
        RULE_STATUS="warn"
        RULE_MESSAGE="Found ${missing_count} completed item(s) without evidence"
        RULE_REMEDIATION="Add evidence with a concrete file:line, command/output, numeric result, or named test/tool to completed P0/P1 checklist/task items."
    fi
}

# Exit codes:
#   0 - Success
