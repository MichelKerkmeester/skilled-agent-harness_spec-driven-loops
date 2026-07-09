#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-METADATA-DISK-CONSISTENCY
# ───────────────────────────────────────────────────────────────
# Advisory-by-default: flags a description.json/graph-metadata.json
# path mismatch against the folder's on-disk path. Set
# SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE=true to fail --strict.

set -euo pipefail

_metadata_rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run_check() {
    local folder="$1"
    local _level="${2:-}"
    : "$_level"

    RULE_NAME="METADATA_DISK_PATH_CONSISTENCY"
    RULE_STATUS="pass"
    RULE_MESSAGE="Generated metadata paths match the on-disk folder path"
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local description_file="$folder/description.json"
    local graph_file="$folder/graph-metadata.json"
    if [[ ! -f "$description_file" && ! -f "$graph_file" ]]; then
        RULE_MESSAGE="no generated metadata present; disk-path check not applicable"
        return 0
    fi

    local report=""
    local rc=0
    report=$(node "${_metadata_rule_dir}/check-metadata-disk-consistency-helper.cjs" "$folder" 2>/dev/null) || rc=$?

    if [[ "$rc" -ne 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="metadata disk-path check could not run"
        RULE_DETAILS=("${report:-node helper failed}")
        RULE_REMEDIATION="Restore readable generated metadata and rerun validation."
        return 0
    fi

    local mismatch_count actual_path details
    mismatch_count=$(printf '%s' "$report" | node -e 'const fs=require("fs"); const data=JSON.parse(fs.readFileSync(0,"utf8")); console.log((data.mismatches || []).length);' 2>/dev/null || printf '0')
    actual_path=$(printf '%s' "$report" | node -e 'const fs=require("fs"); const data=JSON.parse(fs.readFileSync(0,"utf8")); console.log(data.actualPacketId || "unknown");' 2>/dev/null || printf 'unknown')
    if [[ "$mismatch_count" -eq 0 ]]; then
        RULE_MESSAGE="Generated metadata paths match on-disk folder: $actual_path"
        return 0
    fi

    while IFS= read -r details; do
        [[ -n "$details" ]] && RULE_DETAILS+=("$details")
    done < <(printf '%s' "$report" | node -e 'const fs=require("fs"); const data=JSON.parse(fs.readFileSync(0,"utf8")); for (const item of data.mismatches || []) console.log(item);' 2>/dev/null || true)

    if [[ "${SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE:-false}" == "true" ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="Generated metadata path drift detected against on-disk folder: $actual_path"
        RULE_REMEDIATION="Refresh description.json and graph-metadata.json from the canonical save path so stored ids match the real folder."
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="metadata disk-path ADVISORY — $mismatch_count mismatch(es) against on-disk folder: $actual_path (set SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE=true to enforce)"
        RULE_REMEDIATION="Advisory only — does not fail validation until enforcement is enabled."
    fi
}
