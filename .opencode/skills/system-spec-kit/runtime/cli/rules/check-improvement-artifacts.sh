#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-IMPROVEMENT-ARTIFACTS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: IMPROVEMENT_ARTIFACTS
# Severity: warn
# Description: When a validated packet carries an improvement/ folder, every
# *-config.json directly inside it must parse as JSON and carry the top-level
# fields every config written by the deep-loop improvement runtimes carries.

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="IMPROVEMENT_ARTIFACTS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local improvement_dir="$folder/improvement"
    if [[ ! -d "$improvement_dir" ]]; then
        RULE_STATUS="skip"
        RULE_MESSAGE="No improvement/ folder in this packet"
        return 0
    fi

    # Field set derived from real generated configs: the fields every
    # generation of the improvement runtimes has written, including the
    # oldest archived packets. Values are not judged — presence only —
    # because several fields are legitimately empty strings at creation.
    local required_fields=(
        target
        targetKind
        maxIterations
        maxCandidatesPerIteration
        executionMode
        proposalOnly
        promotionEnabled
        baselineRequired
        specFolder
        createdAt
        status
        lineage
        paths
        scoring
        fileProtection
    )

    local config_file
    local checked=0
    local failed=0
    shopt -s nullglob
    for config_file in "$improvement_dir"/*-config.json; do
        checked=$((checked + 1))
        if ! node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$config_file" >/dev/null 2>&1; then
            failed=$((failed + 1))
            RULE_STATUS="fail"
            RULE_DETAILS+=("$config_file does not parse as JSON")
            continue
        fi
        local missing
        missing=$(REQUIRED_FIELDS="${required_fields[*]}" node -e '
const fs = require("fs");
const doc = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const required = process.env.REQUIRED_FIELDS.split(" ");
process.stdout.write(required.filter((key) => !(key in doc)).join(","));
' "$config_file")
        if [[ -n "$missing" ]]; then
            failed=$((failed + 1))
            RULE_STATUS="fail"
            RULE_DETAILS+=("$config_file is missing required fields: $missing")
        fi
    done
    shopt -u nullglob

    if [[ "$checked" -eq 0 ]]; then
        RULE_STATUS="skip"
        RULE_MESSAGE="improvement/ folder carries no *-config.json artifacts"
        return 0
    fi

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ "$failed" -eq 0 ]]; then
        RULE_MESSAGE="$checked improvement/ config JSON file(s) parse and carry the required fields"
    else
        RULE_MESSAGE="$failed of $checked improvement/ config JSON file(s) failed the shape check"
        RULE_REMEDIATION="Regenerate the improvement/ artifacts with their owning deep-loop command; required config fields must not be hand-edited away."
    fi
    return 0
}
