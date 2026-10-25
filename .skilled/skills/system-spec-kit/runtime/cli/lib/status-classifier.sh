#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Status Classifier
# ───────────────────────────────────────────────────────────────
# Normalizes and buckets a spec-doc Status field into complete /
# in-progress / planned / unknown. Shared by the status cross-doc
# consistency rule and the scaffold-never-touched rule.
# Source this file: source "$(dirname "$0")/../lib/status-classifier.sh"

set -euo pipefail

speckit_status_trim() {
    local value="$1"
    value="${value//$'\r'/}"
    value="${value//\*\*/}"
    value="${value//\`/}"
    value="${value#\"}"
    value="${value%\"}"
    value="${value#\'}"
    value="${value%\'}"
    value="$(printf '%s' "$value" | tr '[:upper:]' '[:lower:]')"
    value="$(printf '%s' "$value" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g; s/[[:space:].,;:!]+$//g; s/[[:space:]]+/ /g')"
    printf '%s' "$value"
}

classify_status() {
    local raw="${1:-}"
    local normalized
    normalized="$(speckit_status_trim "$raw")"

    if [[ -z "$normalized" ]]; then
        printf '%s\n' "unknown"
        return 0
    fi

    # Cross-reference: strict-pass-freshness.ts's classifyStatus() (runtime/cli/sweep/strict-pass-freshness.ts)
    # keeps a byte-equivalent complete/in-progress/planned word list. Update both when adding a status word.
    if [[ "$normalized" =~ (^|[^[:alnum:]])(complete|completed|done|shipped|delivered|finished|closed)([^[:alnum:]]|$) ]]; then
        printf '%s\n' "complete"
        return 0
    fi

    # "implemented"/"implementing" also count as complete, but NOT when part of the
    # "not implemented" / "not yet implemented" phrasing the planned bucket below
    # already owns (real Status values use both forms) — checked separately from the
    # word list above so this exclusion cannot suppress the other complete-bucket words.
    if [[ "$normalized" =~ (^|[^[:alnum:]])(implemented|implementing)([^[:alnum:]]|$) ]] && \
       [[ ! "$normalized" =~ (^|[^[:alnum:]])not[[:space:]]+(yet[[:space:]]+)?(implemented|implementing)([^[:alnum:]]|$) ]]; then
        printf '%s\n' "complete"
        return 0
    fi

    # Negative phrases take precedence over words such as "started".
    if [[ "$normalized" =~ (^|[^[:alnum:]])(planned|planning|draft|pending|not started|not yet|not implemented|todo|queued)([^[:alnum:]]|$) ]]; then
        printf '%s\n' "planned"
        return 0
    fi

    # Cross-reference: strict-pass-freshness.ts's classifyStatus() keeps the equivalent list.
    if [[ "$normalized" =~ (^|[^[:alnum:]])(in progress|in-progress|active|started|working|partial|ongoing)([^[:alnum:]]|$) ]]; then
        printf '%s\n' "in-progress"
        return 0
    fi

    printf '%s\n' "unknown"
}

# Succeeds when the doc carries a SPECKIT_TEMPLATE_SOURCE stamp of v2.3 or later
# within its first 70 lines. The checks added with that template version apply
# only to such docs, so a doc with an older stamp, or none, keeps its verdict.
speckit_carries_token_gate_stamp() {
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

extract_status_table_value() {
    local file_path="$1"
    [[ -f "$file_path" ]] || return 0
    # A v2.3 doc may carry more than one metadata table, and a Complete row in a
    # later one is still a completion claim, so that row wins over earlier ones.
    if speckit_carries_token_gate_stamp "$file_path"; then
        local value first="" seen_first=false
        while IFS= read -r value; do
            if [[ "$seen_first" != true ]]; then
                first="$value"
                seen_first=true
            fi
            if [[ "$(classify_status "$value")" == "complete" ]]; then
                printf '%s\n' "$value"
                return 0
            fi
        done < <(awk -F'|' '
            function trim(s) { gsub(/^[ \t]+|[ \t]+$/, "", s); return s }
            function clean(s) { gsub(/\*\*/, "", s); gsub(/`/, "", s); return trim(s) }
            /^[ \t]*\|/ && NF >= 3 && tolower(clean($2)) == "status" { print clean($3) }
        ' "$file_path" 2>/dev/null || true)
        [[ "$seen_first" == true ]] && printf '%s\n' "$first"
        return 0
    fi
    awk -F'|' '
        function trim(s) { gsub(/^[ \t]+|[ \t]+$/, "", s); return s }
        function clean(s) { gsub(/\*\*/, "", s); gsub(/`/, "", s); return trim(s) }
        /^[ \t]*\|/ && NF >= 3 {
            field = tolower(clean($2))
            if (field == "status") {
                print clean($3)
                exit
            }
        }
    ' "$file_path" 2>/dev/null || true
}
