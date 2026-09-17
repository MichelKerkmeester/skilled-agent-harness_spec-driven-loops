#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-AC-CLOSURE
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: AC_CLOSURE
# Severity: error
# Description: Gates packet closure on acceptance-criteria.md at Levels 2, 3 and 3+.
#   A packet may close when every criterion is Met, Waived or Superseded.
#   Waived and Superseded rows must name a decision record that exists.
#   Packets created before the rollout cutoff stay advisory on every branch.

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

_acc_lower() {
    printf '%s' "$1" | tr '[:upper:]' '[:lower:]'
}

_acc_numeric_level() {
    printf '%s' "$1" | tr -cd '0-9'
}

# An unrecognised flag value enables the gate rather than disabling it: a
# typo in an opt-out must not silently switch a closure gate off.
_ACC_FLAG_NOTE=""
_acc_enabled() {
    local raw="${SPECKIT_AC_CLOSURE:-true}"
    case "$(_acc_lower "$raw")" in
        true|1|yes|on) return 0 ;;
        false|0|no|off) return 1 ;;
        *)
            _ACC_FLAG_NOTE="SPECKIT_AC_CLOSURE='$raw' is not a boolean; the gate stayed enabled"
            return 0
            ;;
    esac
}

# Rollout boundary, overridable by operators. A malformed override falls back to
# the default instead of being compared as a string, which would grandfather
# every packet in the repository.
_ACC_CUTOFF_DEFAULT="2026-08-30"
_ACC_CUTOFF_NOTE=""
_acc_cutoff_date() {
    local raw="${SPECKIT_AC_CLOSURE_CUTOFF:-$_ACC_CUTOFF_DEFAULT}"
    local candidate="${raw:0:10}"
    if [[ "$candidate" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        printf '%s' "$candidate"
        return 0
    fi
    _ACC_CUTOFF_NOTE="SPECKIT_AC_CLOSURE_CUTOFF='$raw' is not an ISO date; using $_ACC_CUTOFF_DEFAULT"
    printf '%s' "$_ACC_CUTOFF_DEFAULT"
}

# Packet creation date from the spec.md metadata table. Matching is lowered
# explicitly because the awk on this platform does not honour IGNORECASE.
_acc_created_date() {
    local spec_file="$1"
    [[ -f "$spec_file" ]] || return 1
    local value
    value="$(awk '
        { line = tolower($0) }
        line ~ /\|[[:space:]]*\*{0,2}created\*{0,2}[[:space:]]*\|/ {
            if (match($0, /[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
                print substr($0, RSTART, RLENGTH)
                exit
            }
        }
    ' "$spec_file")"
    [[ -n "$value" ]] || return 1
    printf '%s' "$value"
}

# Reads the Status CELL, never the whole row: a line-wide substring match reads
# "Not Complete" and "Blocked - nothing done yet" as completion claims.
_acc_completion_claimed() {
    local folder="$1"
    local file status
    for file in "$folder/spec.md" "$folder/implementation-summary.md"; do
        [[ -f "$file" ]] || continue
        status="$(awk -F'|' '
            function norm(v) {
                gsub(/^[[:space:]]+|[[:space:]]+$/, "", v)
                gsub(/\*\*|`|\.$/, "", v)
                gsub(/^[[:space:]]+|[[:space:]]+$/, "", v)
                return tolower(v)
            }
            /^[[:space:]]*\|/ {
                if (norm($2) == "status") { print norm($3); exit }
            }
        ' "$file")"
        case "$status" in
            complete|completed|done|shipped|delivered|closed) return 0 ;;
        esac
    done
    return 1
}

# ───────────────────────────────────────────────────────────────
# 2. TABLE PARSING
# ───────────────────────────────────────────────────────────────

# Emits TAB-separated records. Columns are located by header name rather than by
# position, so an escaped pipe or an extra column cannot shift the Status cell.
# A row that looks like a criterion but does not parse is reported, never
# skipped: a silently dropped row empties the table and closes the packet.
_acc_rows() {
    local ac_file="$1"
    awk '
        function norm(v) {
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", v)
            gsub(/\*\*|`/, "", v)
            gsub(/\.$/, "", v)
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", v)
            return v
        }
        function lower(v) { return tolower(v) }
        function looks_like_ac(v) { return lower(v) ~ /^ac[-_ ]?[0-9a-z.]/ }
        BEGIN { fence = 0; in_table = 0; c_id = 0; c_status = 0; c_waiver = 0 }
        /^[[:space:]]*(```|~~~)/ { fence = 1 - fence; next }
        fence { next }
        {
            raw = $0
            if (raw !~ /^[[:space:]]*\|/) { in_table = 0; next }
            gsub(/\\\|/, "\001", raw)
            n = split(raw, cell, "|")
            for (i = 1; i <= n; i++) { gsub(/\001/, "|", cell[i]) }

            # header row: bind columns by name
            found_id = 0
            for (i = 1; i <= n; i++) if (lower(norm(cell[i])) == "ac-id") { found_id = i; break }
            if (found_id) {
                in_table = 1; c_id = found_id; c_status = 0; c_waiver = 0
                for (i = 1; i <= n; i++) {
                    h = lower(norm(cell[i]))
                    if (h == "status") c_status = i
                    else if (h == "waiver") c_waiver = i
                }
                if (!c_status) printf "MALFORMED\t(header)\tno Status column in the criteria table\n"
                next
            }
            if (raw ~ /^[[:space:]]*\|[[:space:]:*-]+\|?[[:space:]:|*-]*$/) next

            first = norm(cell[2])
            if (!in_table) {
                if (looks_like_ac(first))
                    printf "MALFORMED\t%s\tcriterion row outside any table with an AC-ID header\n", first
                next
            }
            id = norm(cell[c_id])
            if (id == "") next
            if (!looks_like_ac(id)) next
            if (toupper(id) !~ /^AC-[0-9]+[0-9A-Za-z]*$/) {
                printf "MALFORMED\t%s\tAC id is not of the form AC-NNN\n", id
                next
            }
            st = c_status ? norm(cell[c_status]) : ""
            wv = c_waiver ? norm(cell[c_waiver]) : ""
            printf "%s\t%s\t%s\n", toupper(id), st, wv
        }
        END { if (fence) printf "MALFORMED\t(document)\tunbalanced code fence hides part of the document\n" }
    ' "$ac_file"
}

# Decision records declare an ADR as a heading, a bold list item or a table row.
# Fenced blocks are skipped so a template example cannot satisfy a waiver.
_acc_declared_adrs() {
    local dr_file="$1"
    [[ -f "$dr_file" ]] || return 0
    awk '
        BEGIN { fence = 0 }
        /^[[:space:]]*(```|~~~)/ { fence = 1 - fence; next }
        fence { next }
        {
            line = $0
            if (line ~ /^[[:space:]]*#{1,6}[[:space:]]*\*{0,2}[Aa][Dd][Rr]-[0-9]+/ ||
                line ~ /^[[:space:]]*[-*][[:space:]]*\*{0,2}[Aa][Dd][Rr]-[0-9]+/ ||
                line ~ /^[[:space:]]*\|[[:space:]]*\*{0,2}[Aa][Dd][Rr]-[0-9]+/) {
                if (match(line, /[Aa][Dd][Rr]-[0-9]+/)) print toupper(substr(line, RSTART, RLENGTH))
            }
        }
    ' "$dr_file"
}

# Zero padding is not significant: a waiver and the record it cites may write
# the same number differently.
_acc_adr_key() {
    printf 'ADR-%s' "$(printf '%s' "${1#*-}" | sed 's/^0*//;s/^$/0/')"
}

# ───────────────────────────────────────────────────────────────
# 3. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="AC_CLOSURE"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    _ACC_FLAG_NOTE=""
    _ACC_CUTOFF_NOTE=""

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
    elif [[ ! "$created" > "$cutoff" ]]; then
        # On the cutoff date itself the packet is still grandfathered: the
        # boundary day belongs to the world that existed before the gate.
        pre_cutoff=true
    fi

    [[ -n "$_ACC_FLAG_NOTE" ]] && RULE_DETAILS+=("$_ACC_FLAG_NOTE")
    [[ -n "$_ACC_CUTOFF_NOTE" ]] && RULE_DETAILS+=("$_ACC_CUTOFF_NOTE")

    # Grandfathered packets are advisory on EVERY branch, not just presence.
    local verdict="fail"
    $pre_cutoff && verdict="info"

    if [[ ! -f "$ac_file" ]]; then
        if $pre_cutoff; then
            RULE_STATUS="info"
            RULE_MESSAGE="acceptance-criteria.md absent; packet created ${created} is at or before the ${cutoff} cutoff, so closure is advisory"
            return 0
        fi
        RULE_STATUS="fail"
        RULE_MESSAGE="acceptance-criteria.md is required at Level ${level} for packets created after ${cutoff} (this packet: ${created})"
        RULE_REMEDIATION="Scaffold it from templates/addons/acceptance-criteria.md.tmpl and list the criteria this packet must satisfy."
        return 0
    fi

    local declared_adrs=""
    local adr
    while IFS= read -r adr; do
        [[ -z "$adr" ]] && continue
        declared_adrs="$declared_adrs $(_acc_adr_key "$adr")"
    done < <(_acc_declared_adrs "$dr_file")

    local unmet=() dangling=() malformed=() seen_ids="" dupes=()
    local total=0 met=0
    local id status waiver status_l key cited missing

    while IFS=$'\t' read -r id status waiver; do
        [[ -z "$id" ]] && continue
        if [[ "$id" == "MALFORMED" ]]; then
            malformed+=("${status}: ${waiver}")
            continue
        fi
        case " $seen_ids " in
            *" $id "*) dupes+=("$id") ;;
            *) seen_ids="$seen_ids $id" ;;
        esac
        total=$((total + 1))
        status_l="$(_acc_lower "$status")"
        case "$status_l" in
            met)
                met=$((met + 1))
                ;;
            waived|superseded)
                cited="$(printf '%s' "$waiver" | grep -Eoi 'ADR-[0-9]+' || true)"
                if [[ -z "$cited" ]]; then
                    dangling+=("$id is ${status} but names no decision record")
                    continue
                fi
                missing=""
                while IFS= read -r adr; do
                    [[ -z "$adr" ]] && continue
                    key="$(_acc_adr_key "$(_acc_lower "$adr" | tr '[:lower:]' '[:upper:]')")"
                    case " $declared_adrs " in
                        *" $key "*) ;;
                        *) missing="$missing ${adr}" ;;
                    esac
                done <<< "$cited"
                if [[ -n "$missing" ]]; then
                    dangling+=("$id cites${missing}, not declared in decision-record.md")
                else
                    met=$((met + 1))
                fi
                ;;
            *)
                unmet+=("$id (${status:-blank})")
                ;;
        esac
    done < <(_acc_rows "$ac_file")

    # A row that could not be parsed is never treated as absent: an emptied
    # table would otherwise report a closeable packet.
    if [[ ${#malformed[@]} -gt 0 ]]; then
        RULE_STATUS="$verdict"
        RULE_MESSAGE="AC_CLOSURE: ${#malformed[@]} criterion row(s) could not be parsed"
        RULE_DETAILS+=("${malformed[@]}")
        RULE_REMEDIATION="Use the template's table shape: an AC-ID header row, one AC-NNN per row, and balanced code fences."
        return 0
    fi

    if [[ "$total" -eq 0 ]]; then
        RULE_STATUS="info"
        RULE_MESSAGE="acceptance-criteria.md present but lists no criteria; closure gate is a no-op"
        return 0
    fi

    if [[ ${#dupes[@]} -gt 0 ]]; then
        RULE_STATUS="$verdict"
        RULE_MESSAGE="AC_CLOSURE: duplicate criterion id(s) make the tally ambiguous"
        RULE_DETAILS+=("${dupes[@]}")
        RULE_REMEDIATION="Give every criterion a unique AC id; supersede rather than reuse."
        return 0
    fi

    if [[ ${#dangling[@]} -gt 0 ]]; then
        RULE_STATUS="$verdict"
        RULE_MESSAGE="AC_CLOSURE: ${#dangling[@]} waiver(s) not backed by a decision record"
        RULE_DETAILS+=("${dangling[@]}")
        RULE_REMEDIATION="Add the cited decision record, or set the row back to Unmet."
        return 0
    fi

    if [[ ${#unmet[@]} -eq 0 ]]; then
        RULE_MESSAGE="AC_CLOSURE: ${met}/${total} criteria met, waived or superseded; packet is closeable"
        return 0
    fi

    # Unmet criteria block a finished packet. Work in progress is expected to
    # carry open criteria.
    if _acc_completion_claimed "$folder"; then
        RULE_STATUS="$verdict"
        RULE_MESSAGE="AC_CLOSURE: packet claims completion with ${#unmet[@]} unmet criterion(s)"
        RULE_DETAILS+=("${unmet[@]}")
        RULE_REMEDIATION="Meet the criterion and cite the evidence, or waive it through a decision record."
        return 0
    fi

    RULE_STATUS="info"
    RULE_MESSAGE="AC_CLOSURE: ${met}/${total} criteria settled; ${#unmet[@]} still open while the packet is in progress"
    RULE_DETAILS+=("${unmet[@]}")
}
