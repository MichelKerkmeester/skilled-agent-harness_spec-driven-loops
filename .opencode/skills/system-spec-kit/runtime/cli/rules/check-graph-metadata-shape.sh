#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-GRAPH-METADATA-SHAPE
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: GRAPH_METADATA_SHAPE
# Severity: warn
# Description: Validates graph-metadata.json shape and phase-parent child pointers.

run_check() {
    local folder="$1"
    local _level="$2"
    local graph_file="$folder/graph-metadata.json"

    RULE_NAME="GRAPH_METADATA_SHAPE"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if [[ ! -f "$graph_file" ]]; then
        RULE_STATUS="info"
        RULE_MESSAGE="graph-metadata.json missing; shape validation skipped"
        RULE_DETAILS=("Presence is handled by GRAPH_METADATA_PRESENT")
        return 0
    fi

    local shape_output
    shape_output=$(node - "$graph_file" <<'EOF' 2>&1
const fs = require("fs");
const filePath = process.argv[2];
const errors = [];
const warnings = [];

let data;
try {
  data = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (error) {
  console.log(`ERROR\tInvalid JSON: ${error.message}`);
  process.exit(0);
}

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const hasString = (object, key) => typeof object?.[key] === "string" && object[key].trim() !== "";
const hasNumber = (object, key) => typeof object?.[key] === "number" && Number.isFinite(object[key]);

if (isObject(data.packet)) {
  if (!hasString(data.packet, "id")) errors.push("packet.id must be a non-empty string");
  if ("track" in data.packet && typeof data.packet.track !== "string") errors.push("packet.track must be a string when present");
  if (!hasNumber(data.packet, "level")) errors.push("packet.level must be a finite number");
} else if (!hasString(data, "packet_id")) {
  errors.push("packet object with id/level is missing, and legacy packet_id fallback is absent");
}

if (!isObject(data.derived)) {
  errors.push("derived object is missing");
} else {
  if (!hasString(data.derived, "last_known_status") && !hasString(data.derived, "status")) {
    warnings.push("derived.last_known_status is missing, and legacy derived.status fallback is absent");
  }
}

for (const error of errors) console.log(`ERROR\t${error}`);
for (const warning of warnings) console.log(`WARN\t${warning}`);
EOF
)

    local -a errors=()
    local -a warnings=()
    local kind message
    while IFS=$'\t' read -r kind message; do
        [[ -z "${kind:-}" ]] && continue
        case "$kind" in
            ERROR) errors+=("$message") ;;
            WARN) warnings+=("$message") ;;
            *) errors+=("$kind${message:+	$message}") ;;
        esac
    done <<< "$shape_output"

    if is_phase_parent "$folder"; then
        local last_active_child_id
        last_active_child_id=$(node - "$graph_file" <<'EOF' 2>/dev/null || true
const fs = require("fs");
const filePath = process.argv[2];
try {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const value = data?.derived?.last_active_child_id;
  if (typeof value === "string" && value.trim()) process.stdout.write(value.trim());
} catch (_error) {}
EOF
)
        # Accept a full packet_id (e.g. track/parent/004-child) by also testing
        # the final path component, so callers that store the full id don't
        # produce a spurious warning when the bare child dir exists.
        local last_active_child_basename="${last_active_child_id##*/}"
        if [[ -n "$last_active_child_id" && ! -d "$folder/$last_active_child_id" && ! -d "$folder/$last_active_child_basename" ]]; then
            warnings+=("derived.last_active_child_id '$last_active_child_id' does not match a real child folder")
        fi
    fi

    if [[ ${#errors[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="graph-metadata.json has ${#errors[@]} shape error(s)"
        RULE_DETAILS=("${errors[@]}")
        if [[ ${#warnings[@]} -gt 0 ]]; then
            RULE_DETAILS+=("${warnings[@]}")
        fi
        RULE_REMEDIATION="Refresh graph-metadata.json through the canonical save/backfill flow, or repair packet and derived metadata fields."
        return 0
    fi

    if [[ ${#warnings[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="graph-metadata.json has ${#warnings[@]} shape warning(s)"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="Refresh graph-metadata.json so derived status and phase-parent pointers match the current contract."
        return 0
    fi

    RULE_STATUS="pass"
    RULE_MESSAGE="graph-metadata.json shape validation passed"
}
