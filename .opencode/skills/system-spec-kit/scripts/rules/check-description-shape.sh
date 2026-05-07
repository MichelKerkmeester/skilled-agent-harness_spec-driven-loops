#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-DESCRIPTION-SHAPE
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: DESCRIPTION_SHAPE
# Severity: warn
# Description: Validates description.json identity, description, and level fields.

run_check() {
    local folder="$1"
    local _level="$2"
    local description_file="$folder/description.json"

    RULE_NAME="DESCRIPTION_SHAPE"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if [[ ! -f "$description_file" ]]; then
        RULE_STATUS="info"
        RULE_MESSAGE="description.json missing; shape validation skipped"
        RULE_DETAILS=("Presence is handled by GRAPH_METADATA_PRESENT")
        return 0
    fi

    local shape_output
    shape_output=$(node - "$description_file" <<'EOF' 2>&1
const fs = require("fs");
const filePath = process.argv[2];
const errors = [];

let data;
try {
  data = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (error) {
  console.log(`ERROR\tInvalid JSON: ${error.message}`);
  process.exit(0);
}

const hasString = (object, key) => typeof object?.[key] === "string" && object[key].trim() !== "";
const levelType = typeof data?.level;

if (!hasString(data, "name") && !hasString(data, "specFolder")) {
  errors.push("name must be a non-empty string; legacy specFolder fallback is also absent");
}
if (!hasString(data, "description")) {
  errors.push("description must be a non-empty string");
}
if (!(levelType === "string" || levelType === "number")) {
  errors.push("level must be a string or number");
}

for (const error of errors) console.log(`ERROR\t${error}`);
EOF
)

    local -a errors=()
    local kind message
    while IFS=$'\t' read -r kind message; do
        [[ -z "${kind:-}" ]] && continue
        case "$kind" in
            ERROR) errors+=("$message") ;;
            *) errors+=("$kind${message:+	$message}") ;;
        esac
    done <<< "$shape_output"

    if [[ ${#errors[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="description.json has ${#errors[@]} shape error(s)"
        RULE_DETAILS=("${errors[@]}")
        RULE_REMEDIATION="Refresh description.json through the canonical generation flow, or repair identity, description, and level fields."
        return 0
    fi

    RULE_STATUS="pass"
    RULE_MESSAGE="description.json shape validation passed"
}
