#!/usr/bin/env bash
# COMPONENT: Doctor Sandbox Evidence Capture
# Captures command transcripts, exit code, file deltas, and snapshot artifacts.
# Exit Codes:
#   0 - Evidence captured
#   1 - Invalid arguments or filesystem failure
#   125 - Real doctor-command runtime is unavailable

set -euo pipefail

CAPTURE_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CAPTURE_SANDBOX_DIR="$(cd "${CAPTURE_SCRIPT_DIR}/.." && pwd)"
CAPTURE_REPO_ROOT="$(cd "${CAPTURE_SANDBOX_DIR}/../../../../../.." && pwd)"
EVIDENCE_ROOT="${SPECKIT_EVIDENCE_ROOT:-${CAPTURE_SANDBOX_DIR}/evidence}"

if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' NC=''
fi

capture_log() {
    printf '%s\n' "$1"
}

capture_warn() {
    printf '%bWARN:%b %s\n' "$YELLOW" "$NC" "$1" >&2
}

capture_error() {
    printf '%bERROR:%b %s\n' "$RED" "$NC" "$1" >&2
}

quote_command() {
    local rendered=""
    local part=""
    for part in "$@"; do
        if [[ -n "$rendered" ]]; then
            rendered="${rendered} ${part}"
        else
            rendered="$part"
        fi
    done
    printf '%s\n' "$rendered"
}

write_file_manifest() {
    local output_path="$1"
    cd "$CAPTURE_REPO_ROOT"
    {
        find .opencode/skills/system-spec-kit/mcp_server/database -type f -maxdepth 1 2>/dev/null
        find .opencode/skills/mcp-coco-index/mcp_server/database -type f -maxdepth 2 2>/dev/null
    } | sort | while IFS= read -r file_path; do
        if [[ -f "$file_path" ]]; then
            if command -v sha256sum >/dev/null 2>&1; then
                sha256sum "$file_path"
            else
                shasum -a 256 "$file_path"
            fi
        fi
    done > "$output_path"
}

write_snapshot_list() {
    local output_path="$1"
    cd "$CAPTURE_REPO_ROOT"
    find .opencode/skills -type f \( \
        -name '*.pre-doctor-update.*.bak' \
        -o -name '*.pre-doctor-memory.*.bak' \
        -o -name '*.pre-doctor-cocoindex.*.bak' \
        -o -name '*.pre-doctor-deep-loop.*.bak' \
        -o -name '*.pre-doctor-causal-graph.*.bak' \
    \) 2>/dev/null | sort > "$output_path"
}

run_doctor_command() {
    local command_text="$1"

    if [[ -n "${SPECKIT_DOCTOR_RUNNER:-}" ]]; then
        "$SPECKIT_DOCTOR_RUNNER" "$command_text"
        return $?
    fi

    if command -v opencode >/dev/null 2>&1; then
        opencode run "$command_text"
        return $?
    fi

    if command -v codex >/dev/null 2>&1; then
        codex exec "$command_text"
        return $?
    fi

    capture_warn "no doctor command runtime found for: ${command_text}"
    printf 'STATUS=SKIP reason="no doctor command runtime found"\n'
    return 125
}

capture_evidence() {
    local scenario_id="$1"
    shift
    local evidence_dir="${EVIDENCE_ROOT}/${scenario_id}"
    local command_text=""
    local exit_code=0

    if [[ "$#" -lt 1 ]]; then
        capture_error "usage: capture_evidence <scenario-id> <doctor-command> [args...]"
        return 1
    fi

    command_text="$(quote_command "$@")"
    mkdir -p "$evidence_dir"

    printf '%s\n' "$command_text" > "${evidence_dir}/command.txt"
    printf '%s\n' "${SPECKIT_ACTIVE_FIXTURE:-unknown}" > "${evidence_dir}/fixture.txt"
    date -u '+%Y-%m-%dT%H:%M:%SZ' > "${evidence_dir}/started-at.txt"
    write_file_manifest "${evidence_dir}/files-before.sha256"
    write_snapshot_list "${evidence_dir}/snapshots-before.txt"

    set +e
    run_doctor_command "$command_text" > "${evidence_dir}/stdout.log" 2> "${evidence_dir}/stderr.log"
    exit_code=$?
    set -e

    printf '%s\n' "$exit_code" > "${evidence_dir}/exit-code.txt"
    date -u '+%Y-%m-%dT%H:%M:%SZ' > "${evidence_dir}/finished-at.txt"
    write_file_manifest "${evidence_dir}/files-after.sha256"
    write_snapshot_list "${evidence_dir}/snapshots-after.txt"

    diff -u "${evidence_dir}/files-before.sha256" "${evidence_dir}/files-after.sha256" > "${evidence_dir}/file-deltas.diff" 2>/dev/null || true
    diff -u "${evidence_dir}/snapshots-before.txt" "${evidence_dir}/snapshots-after.txt" > "${evidence_dir}/snapshot-deltas.diff" 2>/dev/null || true

    cat "${evidence_dir}/stdout.log" "${evidence_dir}/stderr.log" > "${evidence_dir}/combined.log"
    capture_log "EVIDENCE ${scenario_id}: ${evidence_dir}"
    return "$exit_code"
}

if [[ "${BASH_SOURCE[0]}" = "$0" ]]; then
    if [[ "$#" -lt 2 ]]; then
        capture_error "usage: capture-evidence.sh <scenario-id> <doctor-command> [args...]"
        exit 1
    fi
    capture_evidence "$@"
fi
