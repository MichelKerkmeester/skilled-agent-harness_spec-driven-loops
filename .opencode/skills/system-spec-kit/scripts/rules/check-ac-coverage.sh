#!/usr/bin/env bash

set -euo pipefail

_ac_lower() {
    printf '%s' "$1" | tr '[:upper:]' '[:lower:]'
}

_ac_enabled() {
    local value
    value="$(_ac_lower "${SPECKIT_AC_COVERAGE:-false}")"
    [[ "$value" == "true" || "$value" == "1" || "$value" == "yes" || "$value" == "on" ]]
}

_ac_numeric_level() {
    printf '%s' "$1" | tr -cd '0-9'
}

_ac_clamped_floor() {
    local raw="${SPECKIT_AC_COVERAGE_FLOOR:-0.9}"
    awk -v raw="$raw" 'BEGIN {
        value = raw + 0
        if (raw !~ /^[-+]?[0-9]*\.?[0-9]+$/) value = 0.9
        if (value < 0) value = 0
        if (value > 1) value = 1
        printf "%.6f", value
    }'
}

_ac_floor_was_clamped() {
    local raw="${SPECKIT_AC_COVERAGE_FLOOR:-0.9}"
    awk -v raw="$raw" 'BEGIN {
        if (raw !~ /^[-+]?[0-9]*\.?[0-9]+$/) exit 0
        value = raw + 0
        exit(value < 0 || value > 1 ? 0 : 1)
    }'
}

_ac_required_count() {
    local total="$1"
    local floor="$2"
    awk -v total="$total" -v floor="$floor" 'BEGIN {
        required = total * floor
        rounded = int(required)
        if (required > rounded) rounded += 1
        print rounded
    }'
}

_ac_lifecycle_active() {
    local folder="$1"
    local level_num="$2"
    local summary_file="$folder/implementation-summary.md"
    local checklist_file="$folder/checklist.md"

    [[ "$level_num" -lt 2 ]] && return 1
    [[ -f "$checklist_file" ]] || return 1
    [[ -f "$summary_file" ]] || return 1

    local status_line status
    status_line="$(awk 'BEGIN { IGNORECASE = 1 } /\|[[:space:]]*\*\*Status\*\*[[:space:]]*\|/ { print; exit }' "$summary_file")"
    status="$(_ac_lower "$status_line")"
    [[ "$status" == *"in-progress"* || "$status" == *"in progress"* || "$status" == *"implemented"* || "$status" == *"complete"* || "$status" == *"completed"* || "$status" == *"done"* || "$status" == *"shipped"* || "$status" == *"delivered"* ]]
}

_ac_count_story_criteria() {
    local spec_file="$1"
    awk '
        /^[[:space:]]*(```|~~~)/ { in_fence = !in_fence; next }
        in_fence { next }
        {
            line = $0
            if (line ~ /^[[:space:]]*([0-9]+\.|-)[[:space:]]*(Given|When|Then)[[:space:],]/) count++
            else if (line ~ /Given .*When .*Then/) count++
        }
        END { print count + 0 }
    ' "$spec_file"
}

_ac_count_requirement_table() {
    local spec_file="$1"
    awk -F'|' '
        function trim(value) { gsub(/^[[:space:]]+|[[:space:]]+$/, "", value); return value }
        function lower(value) { return tolower(value) }
        /^[[:space:]]*(```|~~~)/ { in_fence = !in_fence; next }
        in_fence { next }
        {
            row = $0
            if (row ~ /^\|/ && lower(row) ~ /acceptance criteria/) {
                in_table = 1
                next
            }
            if (in_table && row !~ /^\|/) {
                in_table = 0
                next
            }
            if (!in_table || row ~ /^\|[[:space:]-|:]+$/) next
            criterion = trim($4)
            normalized = lower(criterion)
            if (criterion != "" && normalized != "n/a" && normalized != "na" && normalized !~ /^\[how to verify/) count++
        }
        END { print count + 0 }
    ' "$spec_file"
}

_ac_count_total() {
    local folder="$1"
    local level_num="$2"
    local spec_file="$folder/spec.md"
    local story_count=0

    [[ -f "$spec_file" ]] || { echo 0; return 0; }

    if [[ "$level_num" -ge 3 ]]; then
        story_count="$(_ac_count_story_criteria "$spec_file")"
        if [[ "$story_count" -gt 0 ]]; then
            echo "$story_count"
            return 0
        fi
    fi

    _ac_count_requirement_table "$spec_file"
}

_ac_analyze_traceability() {
    local checklist_file="$1"
    awk -F'|' '
        function trim(value) { gsub(/^[[:space:]]+|[[:space:]]+$/, "", value); return value }
        function lower(value) { return tolower(value) }
        function has_file_line(value) { return value ~ /(^|[[:space:](])[^[:space:]|()]+:[0-9]+([[:space:]).,;]|$)/ }
        BEGIN { rows = 0; covered = 0; malformed = 0 }
        /^[[:space:]]*(```|~~~)/ { in_fence = !in_fence; next }
        in_fence { next }
        /^\|/ {
            ac_id = trim($2)
            class = trim($3)
            evidence = trim($4)
            ac_l = lower(ac_id)
            class_l = lower(class)
            evidence_l = lower(evidence)
            if (ac_l == "" || ac_l ~ /^-+$/ || ac_l ~ /^ac-id$/) next
            if (ac_l !~ /^ac[-_ ]?[[:alnum:]]+/) next

            rows++
            if (class_l ~ /not-covered|not covered/) next

            if (class_l ~ /manual/ && class_l ~ /automation/ && class_l ~ /infeasible/ && evidence_l != "" && evidence_l != "-" && evidence_l != "n/a") {
                covered++
                next
            }

            if ((class_l ~ /tested/ || class_l ~ /partial/) && has_file_line(evidence)) {
                covered++
                next
            }

            if (evidence_l != "" && evidence_l != "-" && evidence_l != "n/a" && !has_file_line(evidence)) {
                malformed++
                if (length(malformed_ids) > 0) malformed_ids = malformed_ids ", " ac_id
                else malformed_ids = ac_id
            }
        }
        END { printf "%d\t%d\t%d\t%s\n", rows, covered, malformed, malformed_ids }
    ' "$checklist_file"
}

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="AC_COVERAGE"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if ! _ac_enabled; then
        RULE_MESSAGE="Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)"
        return 0
    fi

    local level_num
    level_num="$(_ac_numeric_level "$level")"
    [[ -z "$level_num" ]] && level_num=1

    if ! _ac_lifecycle_active "$folder" "$level_num"; then
        RULE_MESSAGE="Acceptance coverage gate not active for this level or lifecycle state"
        return 0
    fi

    local total
    total="$(_ac_count_total "$folder" "$level_num")"
    if [[ "$total" -eq 0 ]]; then
        RULE_MESSAGE="No acceptance criteria found at the canonical location; coverage gate is a no-op"
        return 0
    fi

    local checklist_file="$folder/checklist.md"
    local analysis rows covered malformed malformed_ids
    analysis="$(_ac_analyze_traceability "$checklist_file")"
    IFS=$'\t' read -r rows covered malformed malformed_ids <<< "$analysis"

    if [[ "$rows" -gt "$total" ]]; then
        total="$rows"
    fi

    local floor required
    floor="$(_ac_clamped_floor)"
    required="$(_ac_required_count "$total" "$floor")"

    if _ac_floor_was_clamped; then
        RULE_DETAILS+=("SPECKIT_AC_COVERAGE_FLOOR was outside [0,1]; using $floor")
    fi
    if [[ "${malformed:-0}" -gt 0 ]]; then
        RULE_DETAILS+=("Malformed evidence citation(s): ${malformed_ids:-unknown}")
    fi

    if [[ "$covered" -ge "$required" ]]; then
        RULE_MESSAGE="AC_COVERAGE advisory: ${covered}/${total} ACs have evidence; floor ${required}/${total}"
        return 0
    fi

    RULE_MESSAGE="AC_COVERAGE WARNING: ${covered}/${total} ACs have evidence; floor ${required}/${total}. Add evidence or mark Manual-infeasible."
    RULE_REMEDIATION="Add file:line evidence to traceability rows, or mark Manual-infeasible with a rationale when automation is not feasible."
}
