#!/usr/bin/env bash

set -euo pipefail

_ac_lower() {
    printf '%s' "$1" | tr '[:upper:]' '[:lower:]'
}

_ac_enabled() {
    local value
    value="$(_ac_lower "${SPECKIT_AC_COVERAGE:-true}")"
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

    [[ "$level_num" -lt 2 ]] && return 1
    # Either source can carry the evidence; requiring the legacy one would leave
    # a canonical packet unmeasured.
    if [[ ! -f "$folder/acceptance-criteria.md" ]]; then
        _ac_traceability_file "$folder" >/dev/null || return 1
    fi
    [[ -f "$summary_file" ]] || return 1

    local status_line status
    status_line="$(awk 'BEGIN { IGNORECASE = 1 } /\|[[:space:]]*\*\*Status\*\*[[:space:]]*\|/ { print; exit }' "$summary_file")"
    status="$(_ac_lower "$status_line")"
    [[ "$status" == *"in-progress"* || "$status" == *"in progress"* || "$status" == *"implemented"* || "$status" == *"complete"* || "$status" == *"completed"* || "$status" == *"done"* || "$status" == *"shipped"* || "$status" == *"delivered"* ]]
}

# The merged tasks document is the current home for verification traceability.
# A standalone checklist.md is a pre-merge artifact, so it is the fallback and
# never the preference: a packet carrying both is a new packet with a stale file.
_ac_traceability_file() {
    local folder="$1"
    if [[ -f "$folder/tasks.md" ]] && grep -q '<!-- ANCHOR:protocol -->' "$folder/tasks.md" 2>/dev/null; then
        printf '%s\n' "$folder/tasks.md"
        return 0
    fi
    if [[ -f "$folder/checklist.md" ]]; then
        printf '%s\n' "$folder/checklist.md"
        return 0
    fi
    return 1
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

_ac_count_canonical_rows() {
    local ac_file="$1"
    awk -F'|' '
        function norm(v) {
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", v)
            gsub(/\*\*|`/, "", v)
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", v)
            return toupper(v)
        }
        /^[[:space:]]*(```|~~~)/ { in_fence = !in_fence; next }
        in_fence { next }
        /^\|/ {
            # Bold and backticked ids are the same criterion; the AC-ID header is
            # excluded because it carries no digits.
            id = norm($2)
            if (id ~ /^AC-[0-9]+[0-9A-Za-z]*$/) count++
        }
        END { print count + 0 }
    ' "$ac_file"
}

_ac_count_total() {
    local folder="$1"
    local level_num="$2"
    local spec_file="$folder/spec.md"
    local ac_file="$folder/acceptance-criteria.md"
    local story_count=0

    # acceptance-criteria.md is the canonical home. spec.md is only consulted for
    # packets predating the acceptance-criteria rollout.
    if [[ -f "$ac_file" ]]; then
        _ac_count_canonical_rows "$ac_file"
        return 0
    fi

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

# Reads evidence from the canonical criteria table, which is also where the
# total comes from. Counting the denominator in one document and the numerator
# in another guarantees an undercount for every packet that has both.
# Columns are bound by header name so an added column cannot shift the read.
# A waived or superseded criterion needs no file:line: the decision record it
# names is what carries it, and AC_CLOSURE is what verifies that record exists.
_ac_analyze_canonical() {
    local ac_file="$1"
    awk '
        function norm(v) {
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", v)
            gsub(/\*\*/, "", v)
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", v)
            return v
        }
        function lower(v) { return tolower(v) }
        function has_file_line(v) { return v ~ /(^|[[:space:](`])[^[:space:]|()`]+:[0-9]+([[:space:]).,;`]|$)/ }
        BEGIN { fence = 0; in_table = 0; c_id = 0; c_ev = 0; c_status = 0; rows = 0; covered = 0; malformed = 0 }
        /^[[:space:]]*(```|~~~)/ { fence = 1 - fence; next }
        fence { next }
        {
            raw = $0
            if (raw !~ /^[[:space:]]*\|/) { in_table = 0; next }
            gsub(/\\\|/, "\001", raw)
            n = split(raw, cell, "|")
            for (i = 1; i <= n; i++) { gsub(/\001/, "|", cell[i]) }

            found_id = 0
            for (i = 1; i <= n; i++) if (lower(norm(cell[i])) == "ac-id") { found_id = i; break }
            if (found_id) {
                in_table = 1; c_id = found_id; c_ev = 0; c_status = 0
                for (i = 1; i <= n; i++) {
                    h = lower(norm(cell[i]))
                    if (h == "verification") c_ev = i
                    else if (h == "status") c_status = i
                }
                next
            }
            if (!in_table) next
            if (raw ~ /^[[:space:]]*\|[[:space:]:*-]+\|?[[:space:]:|*-]*$/) next

            id = norm(cell[c_id])
            gsub(/`/, "", id)
            if (toupper(id) !~ /^AC-[0-9]+[0-9A-Za-z]*$/) next
            rows++

            status = c_status ? lower(norm(cell[c_status])) : ""
            if (status ~ /waived|superseded/) { covered++; next }

            evidence = c_ev ? norm(cell[c_ev]) : ""
            ev_l = lower(evidence)
            if (ev_l == "" || ev_l == "-" || ev_l == "n/a") next
            if (has_file_line(evidence)) { covered++; next }

            malformed++
            if (length(malformed_ids) > 0) malformed_ids = malformed_ids ", " toupper(id)
            else malformed_ids = toupper(id)
        }
        END { printf "%d\t%d\t%d\t%s\n", rows, covered, malformed, malformed_ids }
    ' "$ac_file"
}

_ac_analyze_traceability() {
    local checklist_file="$1"
    local merged_tasks="${2:-false}"
    awk -F'|' -v merged_tasks="$merged_tasks" '
        function trim(value) { gsub(/^[[:space:]]+|[[:space:]]+$/, "", value); return value }
        function lower(value) { return tolower(value) }
        function has_file_line(value) { return value ~ /(^|[[:space:](])[^[:space:]|()]+:[0-9]+([[:space:]).,;]|$)/ }
        BEGIN { rows = 0; covered = 0; malformed = 0; in_verification = (merged_tasks != "true") }
        merged_tasks == "true" && /<!-- ANCHOR:protocol -->/ { in_verification = 1; next }
        merged_tasks == "true" && /<!-- \/ANCHOR:(summary|sign-off) -->/ { in_verification = 0; next }
        merged_tasks == "true" && !in_verification { next }
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

    local analysis rows covered malformed malformed_ids
    local ac_file="$folder/acceptance-criteria.md"
    if [[ -f "$ac_file" ]]; then
        analysis="$(_ac_analyze_canonical "$ac_file")"
    else
        local checklist_file
        local merged_tasks=false
        if ! checklist_file="$(_ac_traceability_file "$folder")"; then
            RULE_MESSAGE="Acceptance coverage gate not active: no verification checklist source found"
            return 0
        fi
        if [[ "$checklist_file" == "$folder/tasks.md" ]]; then
            merged_tasks=true
        fi
        analysis="$(_ac_analyze_traceability "$checklist_file" "$merged_tasks")"
    fi
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

    if [[ -f "$ac_file" ]]; then
        RULE_MESSAGE="AC_COVERAGE advisory (under floor): ${covered}/${total} ACs have evidence; floor ${required}/${total}. Cite file:line in the Verification cell, or retire the criterion through a decision record."
        RULE_REMEDIATION="In acceptance-criteria.md, give each criterion's Verification cell a file:line citation. A criterion whose Status is Waived or Superseded needs no citation; its decision record carries it."
        return 0
    fi

    RULE_MESSAGE="AC_COVERAGE advisory (under floor): ${covered}/${total} ACs have evidence; floor ${required}/${total}. Add evidence or mark Manual-infeasible."
    RULE_REMEDIATION="Add file:line evidence to traceability rows, or mark Manual-infeasible with a rationale when automation is not feasible."
}
