#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-STATUS-CROSS-DOC-CONSISTENCY
# ───────────────────────────────────────────────────────────────
# Enforcing-by-default: flags spec.md and implementation-summary.md
# Status fields that classify to different buckets. Graduated to enforcing
# only after a real tree-wide census showed the tree was clean enough to
# trust by default: 128 real mismatches found and reconciled, leaving 2
# individually-explained residuals rather than a forced false zero. Set
# SPECKIT_STATUS_CROSS_DOC_ENFORCE=false to fall back to advisory-only.

set -euo pipefail

_status_rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../lib/status-classifier.sh
source "${_status_rule_dir}/../lib/status-classifier.sh"
# shellcheck source=../lib/parse-bool-flag.sh
source "${_status_rule_dir}/../lib/parse-bool-flag.sh"

run_check() {
    local folder="$1"
    local _level="${2:-}"
    : "$_level"

    RULE_NAME="STATUS_CROSS_DOC_CONSISTENCY"
    RULE_STATUS="pass"
    RULE_MESSAGE="spec.md and implementation-summary.md statuses classify consistently"
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local spec_file="$folder/spec.md"
    local implementation_file="$folder/implementation-summary.md"
    if [[ ! -f "$spec_file" || ! -f "$implementation_file" ]]; then
        RULE_MESSAGE="status cross-doc check not applicable; spec.md or implementation-summary.md is absent"
        return 0
    fi

    local spec_status implementation_status spec_bucket implementation_bucket
    spec_status="$(extract_status_table_value "$spec_file")"
    implementation_status="$(extract_status_table_value "$implementation_file")"
    spec_bucket="$(classify_status "$spec_status")"
    implementation_bucket="$(classify_status "$implementation_status")"

    if [[ "$spec_bucket" == "unknown" || "$implementation_bucket" == "unknown" ]]; then
        RULE_MESSAGE="status cross-doc check not applicable; one status is missing or unclassified"
        RULE_DETAILS=("spec.md Status=${spec_status:-<missing>} classified=$spec_bucket" "implementation-summary.md Status=${implementation_status:-<missing>} classified=$implementation_bucket")
        return 0
    fi

    if [[ "$spec_bucket" == "$implementation_bucket" ]]; then
        RULE_MESSAGE="spec.md Status '$spec_status' and implementation-summary.md Status '$implementation_status' both classify as $spec_bucket"
        return 0
    fi

    RULE_DETAILS=("spec.md Status=$spec_status classified=$spec_bucket" "implementation-summary.md Status=$implementation_status classified=$implementation_bucket")
    if speckit_flag_enabled "${SPECKIT_STATUS_CROSS_DOC_ENFORCE:-true}"; then
        RULE_STATUS="warn"
        RULE_MESSAGE="spec.md and implementation-summary.md statuses disagree"
        RULE_REMEDIATION="Update the stale status field so both documents describe the same delivery state."
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="status cross-doc ADVISORY — spec.md is $spec_bucket but implementation-summary.md is $implementation_bucket (set SPECKIT_STATUS_CROSS_DOC_ENFORCE=true to re-enable enforcement)"
        RULE_REMEDIATION="Advisory only while enforcement is explicitly disabled."
    fi
}
