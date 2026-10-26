#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-MEASURED-BEHAVIOR
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

_measured_rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../lib/status-classifier.sh
source "${_measured_rule_dir}/../lib/status-classifier.sh"

# Rule: MEASURED_BEHAVIOR
# Severity: warn
# Description: Warns when spec.md has no measured-behavior block, or a block that
#   holds neither a non-empty line inside a fence (the command and its verbatim
#   output) nor an `N/A:` line that gives a reason. The block is where an author
#   pastes what the current behavior actually is, so a number about it is quoted
#   rather than recalled.
# Applicability: only a spec.md whose SPECKIT_TEMPLATE_SOURCE stamp names spec-core
#   at v2.4 or later. An older stamp, another template source or no stamp at all was
#   written before the block existed, so the rule passes it as not applicable.
#   The shared speckit_template_stamp helper reads the stamp the way the
#   orchestrator's TEMPLATE_STAMP_RE does: the first stamp line in the first 70
#   lines, major and minor compared as numbers.
# This rule never reports fail, so its verdict can never become an error.

MEASURED_BEHAVIOR_MIN_MAJOR=2
MEASURED_BEHAVIOR_MIN_MINOR=4

# Prints "applies" when the spec-core stamp is at or above the minimum version,
# and "skip<TAB>reason" otherwise.
measured_behavior_applicability() {
    local spec="$1"
    local source major minor
    IFS=$'\t' read -r source major minor < <(speckit_template_stamp "$spec") || {
        printf 'skip\tspec.md carries no template stamp\n'
        return 0
    }
    if [[ ! "$source" =~ ^spec-core([[:space:]+]|$) ]]; then
        printf 'skip\tspec.md is not stamped from spec-core\n'
        return 0
    fi
    if (( 10#$major > MEASURED_BEHAVIOR_MIN_MAJOR )) \
        || { (( 10#$major == MEASURED_BEHAVIOR_MIN_MAJOR )) && (( 10#$minor >= MEASURED_BEHAVIOR_MIN_MINOR )); }; then
        printf 'applies\n'
        return 0
    fi
    printf 'skip\tspec.md is stamped v%s.%s, below v%s.%s\n' "$major" "$minor" \
        "$MEASURED_BEHAVIOR_MIN_MAJOR" "$MEASURED_BEHAVIOR_MIN_MINOR"
}

# Prints "absent", "empty" or "filled" for the measured-behavior block. A fence
# opens with ``` or ~~~ at any indent and closes on the same character. A fenced
# line counts when it holds anything but whitespace or an unfilled value token.
# An N/A: line counts outside a fence when a reason follows the colon.
measured_behavior_block_state() {
    local spec="$1"
    awk '
        BEGIN { state = "absent"; inside = 0; fence = "" }
        /^[[:space:]]*<!--[[:space:]]*ANCHOR:measured-behavior[[:space:]]*-->[[:space:]]*$/ {
            if (!inside && state == "absent") { inside = 1; state = "empty"; next }
        }
        !inside { next }
        /^[[:space:]]*<!--[[:space:]]*\/ANCHOR:measured-behavior[[:space:]]*-->[[:space:]]*$/ {
            inside = 0; exit
        }
        {
            line = $0
            sub(/\r$/, "", line)
            trimmed = line
            sub(/^[[:space:]]+/, "", trimmed)
            if (fence != "") {
                if (substr(trimmed, 1, 3) == fence) { fence = ""; next }
                body = trimmed
                sub(/[[:space:]]+$/, "", body)
                if (body != "" && body !~ /^\[YOUR_VALUE_HERE:[^]]*\]$/) state = "filled"
                next
            }
            if (substr(trimmed, 1, 3) == "```" || substr(trimmed, 1, 3) == "~~~") {
                fence = substr(trimmed, 1, 3); next
            }
            if (trimmed ~ /^N\/A:/) {
                reason = substr(trimmed, 5)
                sub(/^[[:space:]]+/, "", reason)
                sub(/[[:space:]]+$/, "", reason)
                if (reason != "" && reason !~ /^\[YOUR_VALUE_HERE:/) state = "filled"
            }
        }
        END { print state }
    ' "$spec"
}

run_check() {
    local folder="$1"
    local _level="${2:-}"

    RULE_NAME="MEASURED_BEHAVIOR"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local spec="$folder/spec.md"
    if [[ ! -f "$spec" ]]; then
        RULE_MESSAGE="Not applicable: no spec.md"
        return 0
    fi

    local applicability kind reason
    applicability=$(measured_behavior_applicability "$spec")
    IFS=$'\t' read -r kind reason <<< "$applicability"
    if [[ "$kind" != "applies" ]]; then
        RULE_MESSAGE="Not applicable: ${reason}"
        return 0
    fi

    local state
    state=$(measured_behavior_block_state "$spec")
    case "$state" in
        filled)
            RULE_MESSAGE="Measured behavior block holds command output or a reasoned N/A"
            ;;
        absent)
            RULE_STATUS="warn"
            RULE_MESSAGE="spec.md has no measured-behavior block"
            RULE_DETAILS=("spec.md: add the measured-behavior anchor with a ### Measured Behavior heading right after the problem anchor")
            RULE_REMEDIATION="Run the command that shows the current behavior and paste the command and its verbatim output into a fence inside the measured-behavior block, or write an N/A: line that gives the reason."
            ;;
        *)
            RULE_STATUS="warn"
            RULE_MESSAGE="Measured behavior block holds no command output and no N/A: line with a reason"
            RULE_DETAILS=("spec.md: the measured-behavior block is empty")
            RULE_REMEDIATION="Run the command that shows the current behavior and paste the command and its verbatim output into the fence, or write an N/A: line that gives the reason."
            ;;
    esac
}
