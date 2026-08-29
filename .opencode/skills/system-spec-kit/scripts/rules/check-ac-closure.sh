#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-AC-CLOSURE
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: AC_CLOSURE
# Severity: error
# Description: Gates packet closure on acceptance-criteria.md at Levels 2, 3 and 3+.
#   A packet may close when every criterion is Met, Waived or Superseded.
#   Waived and Superseded rows must name an ADR that exists in decision-record.md.
#   Packets created before the rollout cutoff stay advisory.

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

_acc_lower() {
    printf '%s' "$1" | tr '[:upper:]' '[:lower:]'
}

_acc_enabled() {
    local value
    value="$(_acc_lower "${SPECKIT_AC_CLOSURE:-true}")"
    [[ "$value" == "true" || "$value" == "1" || "$value" == "yes" || "$value" == "on" ]]
}

_acc_numeric_level() {
    printf '%s' "$1" | tr -cd '0-9'
}

# Rollout cutoff. Mirrors the CANONICAL_SAVE_CUTOFF pattern: an ISO constant that
# an operator can override, compared against the packet's own Created date.
_acc_cutoff_date() {
    local raw="${SPECKIT_AC_CLOSURE_CUTOFF:-2026-08-29T00:00:00Z}"
    printf '%s' "${raw:0:10}"
}

# Packet creation date from the spec.md metadata table. An unreadable date is
# treated as pre-cutoff, so a malformed packet degrades to advisory rather than
# to a false block.
_acc_created_date() {
    local spec_file="$1"
    [[ -f "$spec_file" ]] || return 1
    local value
    value="$(awk '
        BEGIN { IGNORECASE = 1 }
        /\|[[:space:]]*\*\*Created\*\*[[:space:]]*\|/ {
            if (match($0, /[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
                print substr($0, RSTART, RLENGTH)
                exit
            }
        }
    ' "$spec_file")"
    [[ -n "$value" ]] || return 1
    printf '%s' "$value"
}

_acc_completion_claimed() {
    local folder="$1"
    local file status
    for file in "$folder/spec.md" "$folder/implementation-summary.md"; do
        [[ -f "$file" ]] || continue
        status="$(_acc_lower "$(awk '
            BEGIN { IGNORECASE = 1 }
            /\|[[:space:]]*\*\*Status\*\*[[:space:]]*\|/ { print; exit }
        ' "$file")")"
        case "$status" in
            *complete*|*completed*|*shipped*|*delivered*|*done*) return 0 ;;
        esac
    done
    return 1
}

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

# Emits one TAB-separated record per criterion row: id, status, waiver.
_acc_rows() {
    local ac_file="$1"
    awk -F'|' '
        function trim(v) { gsub(/^[[:space:]]+|[[:space:]]+$/, "", v); return v }
        /^[[:space:]]*(```|~~~)/ { in_fence = !in_fence; next }
        in_fence { next }
        /^\|/ {
            id = trim($2)
            if (id !~ /^AC-[0-9]+[0-9A-Za-z]*$/) next   # digits required: skips the AC-ID header
            printf "%s\t%s\t%s\n", id, trim($6), trim($7)
        }
    ' "$ac_file"
}

_acc_adr_present() {
    local dr_file="$1"
    local adr="$2"
    [[ -f "$dr_file" ]] || return 1
    grep -Eqi "^#{1,6}[[:space:]]*${adr}([[:space:]]|:|$)" "$dr_file"
}

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="AC_CLOSURE"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if ! _acc_enabled; then
        RULE_MESSAGE="Acceptance closure gate disabled (set SPECKIT_AC_CLOSURE=true to enable)"
        return 0
    fi

    local level_num
    level_num="$(_acc_numeric_level "$level")"
    [[ -z "$level_num" ]] && level_num=1

    if [[ "$level_num" -lt 2 ]]; then
        RULE_MESSAGE="Acceptance closure gate not active below Level 2"
        return 0
    fi

    local ac_file="$folder/acceptance-criteria.md"
    local dr_file="$folder/decision-record.md"
    local cutoff created pre_cutoff=false

    cutoff="$(_acc_cutoff_date)"
    if ! created="$(_acc_created_date "$folder/spec.md")"; then
        pre_cutoff=true
        created="unknown"
    elif [[ "$created" < "$cutoff" ]]; then
        pre_cutoff=true
    fi

    # Presence. Post-cutoff packets must carry the document; pre-cutoff packets
    # are grandfathered and reported as advisory only.
    if [[ ! -f "$ac_file" ]]; then
        if $pre_cutoff; then
            RULE_STATUS="info"
            RULE_MESSAGE="acceptance-criteria.md absent; packet created ${created} predates the ${cutoff} cutoff, so closure is advisory"
            return 0
        fi
        RULE_STATUS="fail"
        RULE_MESSAGE="acceptance-criteria.md is required at Level ${level} for packets created on or after ${cutoff} (this packet: ${created})"
        RULE_REMEDIATION="Scaffold it from templates/addons/acceptance-criteria.md.tmpl and list the criteria this packet must satisfy."
        return 0
    fi

    local unmet=() dangling=() total=0 met=0
    local id status waiver status_l

    while IFS=$'\t' read -r id status waiver; do
        [[ -z "$id" ]] && continue
        total=$((total + 1))
        status_l="$(_acc_lower "$status")"
        case "$status_l" in
            met)
                met=$((met + 1))
                ;;
            waived|superseded)
                local adr
                adr="$(printf '%s' "$waiver" | grep -Eoi 'ADR-[0-9]+' | head -1 || true)"
                if [[ -z "$adr" ]]; then
                    dangling+=("$id is ${status} but names no ADR")
                elif ! _acc_adr_present "$dr_file" "$adr"; then
                    dangling+=("$id cites ${adr}, which is not in decision-record.md")
                else
                    met=$((met + 1))
                fi
                ;;
            *)
                unmet+=("$id (${status:-blank})")
                ;;
        esac
    done < <(_acc_rows "$ac_file")

    if [[ "$total" -eq 0 ]]; then
        RULE_STATUS="info"
        RULE_MESSAGE="acceptance-criteria.md present but lists no criteria; closure gate is a no-op"
        return 0
    fi

    # A waiver that cites a missing ADR is an integrity failure at any lifecycle
    # stage: the record it points to is the whole justification.
    if [[ ${#dangling[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="AC_CLOSURE: ${#dangling[@]} waiver(s) not backed by a decision record"
        RULE_DETAILS=("${dangling[@]}")
        RULE_REMEDIATION="Add the cited ADR to decision-record.md, or set the row back to Unmet."
        return 0
    fi

    if [[ ${#unmet[@]} -eq 0 ]]; then
        RULE_MESSAGE="AC_CLOSURE: ${met}/${total} criteria met, waived or superseded; packet is closeable"
        return 0
    fi

    # Unmet criteria only block a packet that claims to be finished. Work in
    # progress is expected to carry unmet rows.
    if _acc_completion_claimed "$folder"; then
        RULE_STATUS="fail"
        RULE_MESSAGE="AC_CLOSURE: packet claims completion with ${#unmet[@]} unmet criterion(s)"
        RULE_DETAILS=("${unmet[@]}")
        RULE_REMEDIATION="Meet the criterion and cite the evidence, or waive it with an ADR in decision-record.md."
        return 0
    fi

    RULE_STATUS="info"
    RULE_MESSAGE="AC_CLOSURE: ${met}/${total} criteria settled; ${#unmet[@]} still open while the packet is in progress"
    RULE_DETAILS=("${unmet[@]}")
}
