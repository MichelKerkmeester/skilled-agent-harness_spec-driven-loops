#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-FRONTMATTER-VALUES
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: FRONTMATTER_VALUES
# Severity: warn
# Description: Warns when a packet document's contextType or importance_tier is
#   outside the shared list in sk-create-frontmatter's frontmatter-values.json. Aliases are legal.
#   Presence and emptiness stay FRONTMATTER_VALID's job.

run_check() {
    local folder="$1"
    local _level="$2"
    local rule_dir
    rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    RULE_NAME="FRONTMATTER_VALUES"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local -a docs=()
    local doc
    for doc in "$folder"/*.md; do
        [[ -f "$doc" ]] && docs+=("$doc")
    done
    if [[ ${#docs[@]} -eq 0 ]]; then
        RULE_MESSAGE="No packet documents to check"
        return 0
    fi

    local output
    if ! output=$(node "$rule_dir/check-frontmatter-values-helper.cjs" "${docs[@]}" 2>&1); then
        RULE_STATUS="warn"
        RULE_MESSAGE="Frontmatter value check skipped: the shared list could not be read"
        RULE_DETAILS=("$output")
        return 0
    fi

    local -a warnings=()
    local kind file message
    while IFS=$'\t' read -r kind file message; do
        [[ "${kind:-}" == "WARN" ]] || continue
        warnings+=("$(basename "$file"): $message")
    done <<< "$output"

    if [[ ${#warnings[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="${#warnings[@]} frontmatter value(s) outside the shared list"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="Replace each value with one of the canonical values named, or a listed alias, from .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json."
        return 0
    fi

    RULE_MESSAGE="Frontmatter values are in the shared list"
}
