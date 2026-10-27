#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-PLACEHOLDERS
# ───────────────────────────────────────────────────────────────

# Who runs this file: validate.sh does not. The validator registry still lists it,
# but the orchestrator runs a native PLACEHOLDER_FILLED and skips any registry shell
# rule whose id it runs natively, so the native rule alone decides the verdict and
# an edit to run_check here changes no validate.sh result. Three callers source it:
#   - spec/check-placeholders.sh, the post-edit scan, which calls only
#     placeholder_marker_lines, so an edit to that helper changes what the scan reports;
#   - tests/test-validation-extended.sh, whose isolated rule tests call run_check;
#   - tests/placeholder-token-gate.vitest.ts, whose parity matrix calls run_check
#     beside the orchestrator and requires the same verdict for a v2.3 doc.
# Compatible with strict mode.
set -euo pipefail

_placeholder_rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../lib/status-classifier.sh
source "${_placeholder_rule_dir}/../lib/status-classifier.sh"

# Rule: PLACEHOLDER_FILLED
# Severity: error
# Description: Detects unfilled spec-doc placeholders: [YOUR_VALUE_HERE:], [NEEDS_CLARIFICATION:] / [NEEDS CLARIFICATION:],
#   and a [template:...] provenance token left in a title line. Bracketed authoring hints such as [Decision Title]
#   are soft by design, and neither this rule nor spec/check-placeholders.sh flags them.
# Lifecycle: a doc whose SPECKIT_TEMPLATE_SOURCE stamp is v2.3 or later ships every authoring hint as a
#   [YOUR_VALUE_HERE: ...] token. While spec.md has the Status Draft, an unfilled token in such a doc is a
#   warning. At any other status it is an error. A doc with an older stamp, or none, keeps the error it
#   always had. [NEEDS_CLARIFICATION:] is an error in every packet.
# Parity: mirrors the runtime orchestrator validatePlaceholders for a doc stamped v2.3 or later,
# which the parity matrix above checks; that mirror is kept by hand and nothing in validate.sh
# enforces it. An older doc keeps the scan this rule always ran, which differs from the
# orchestrator on an indented fence, the <YOUR_VALUE_HERE: form and a [template: title.
# Mustache {{...}} is NOT flagged (not canonical spec-doc placeholder
# syntax; legit spec-doc content uses it).
# spec/check-placeholders.sh, the post-edit scan, reads its markers through
# placeholder_marker_lines below so it reports what strict validation flags.

# ───────────────────────────────────────────────────────────────
# 1. HELPERS
# ───────────────────────────────────────────────────────────────

# Prints one "line<TAB>kind" row for each line holding an unfilled marker, read
# the way the runtime orchestrator reads it. kind is "token" when every marker
# on the line is a [YOUR_VALUE_HERE: value token, "marker" when any other marker
# is present, and "title" for a [template: token left in a title line.
# Mode "v23", for a doc stamped v2.3 or later, skips fences opened by ``` or ~~~
# at any indent and inline code spans. Such a fence closes only on a run of the
# same character, at least as long as the opener, with nothing after it but
# whitespace, so a ``` line quoted inside a ~~~ block does not end the block. It reads every marker on a line and checks
# the title. Any other mode reads only the first marker on a line, skips it when
# a backtick sits right before it, and knows only ``` fences.
placeholder_marker_lines() {
    local filepath="$1"
    local mode="$2"
    awk -v mode="$mode" '
        function blank_code_spans(s,    out, i, n, j, run, k, m, close_at, end_at, pad) {
            out = ""; i = 1; n = length(s)
            while (i <= n) {
                if (substr(s, i, 1) != "`") { out = out substr(s, i, 1); i++; continue }
                j = i
                while (j <= n && substr(s, j, 1) == "`") j++
                run = j - i
                close_at = 0
                k = j
                while (k <= n) {
                    if (substr(s, k, 1) != "`") { k++; continue }
                    m = k
                    while (m <= n && substr(s, m, 1) == "`") m++
                    if (m - k == run) { close_at = k; break }
                    k = m
                }
                if (!close_at) { out = out substr(s, i, run); i = j; continue }
                end_at = close_at + run
                pad = ""
                for (k = i; k < end_at; k++) pad = pad " "
                out = out pad
                i = end_at
            }
            return out
        }
        BEGIN { in_code = 0; fence = ""; marker = "<YOUR_VALUE_HERE:|\\[YOUR_VALUE_HERE:|\\[NEEDS[_ ]CLARIFICATION:" }
        {
            # A CRLF doc keeps its carriage return in awk; drop it so a closing
            # fence matches exactly as the orchestrator, which splits on \r?\n.
            sub(/\r$/, "")
            if (mode == "v23") {
                if (fence != "") {
                    if (match($0, /^[ \t]*(```+|~~~+)[ \t]*$/)) {
                        run = $0
                        sub(/^[ \t]+/, "", run)
                        sub(/[ \t]+$/, "", run)
                        if (substr(run, 1, 1) == substr(fence, 1, 1) && length(run) >= length(fence)) fence = ""
                    }
                    next
                }
                if (match($0, /^[ \t]*(```+|~~~+)/)) {
                    fence = substr($0, RSTART, RLENGTH)
                    sub(/^[ \t]+/, "", fence)
                    next
                }
            } else if ($0 ~ /^[ \t]*```/) { in_code = !in_code; next }
            if (in_code) next
            if (mode == "v23") {
                rest = blank_code_spans($0)
                if (rest ~ /^[ \t]*title:.*\[template:/) print NR "\ttitle"
                found = 0
                hard = 0
                while (match(rest, marker)) {
                    found = 1
                    if (substr(rest, RSTART, RLENGTH) != "[YOUR_VALUE_HERE:") hard = 1
                    rest = substr(rest, RSTART + RLENGTH)
                }
                if (found) print NR "\t" (hard ? "marker" : "token")
            } else if (match($0, marker)) {
                if (RSTART > 1 && substr($0, RSTART - 1, 1) == "`") next
                print NR "\tmarker"
            }
        }
    ' "$filepath" 2>/dev/null || true
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
        if speckit_carries_token_gate_stamp "$filepath"; then
            token_gated=true
        fi
        case "$file" in
            acceptance-criteria.md|implementation-summary.md|goal.md)
                [[ "$token_gated" == true ]] || continue
                ;;
        esac

        # A v2.3 doc is read with the orchestrator's code-span, fence, every-marker
        # and title rules. A token is deferred to a warning in a Draft packet.
        if [[ "$token_gated" == true ]]; then
            local linenum kind
            while IFS=$'\t' read -r linenum kind; do
                [[ -n "$linenum" ]] || continue
                if [[ "$kind" == "token" && "$draft_packet" == true ]]; then
                    draft_tokens+=("$file:$linenum")
                else
                    found_placeholders+=("$file:$linenum")
                fi
            done < <(placeholder_marker_lines "$filepath" v23)
            continue
        fi

        # Filter out fenced code blocks
        local filtered
        filtered=$(awk '
            BEGIN { in_code = 0 }
            /^```/ { in_code = !in_code; next }
            !in_code { print NR ":" $0 }
        ' "$filepath" 2>/dev/null)
        
        # Pattern 1: [YOUR_VALUE_HERE:] (skip inline backticks)
        # Only a doc without the token-gate stamp reaches this scan, so a token
        # here is an error at every status.
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_placeholders+=("$file:$linenum")
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
