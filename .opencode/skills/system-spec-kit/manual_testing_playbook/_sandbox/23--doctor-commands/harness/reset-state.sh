#!/usr/bin/env bash
# COMPONENT: Doctor Sandbox State Reset
# Restores a named fixture into the disposable sandbox workspace.
# Exit Codes:
#   0 - Reset completed or reset skip was recorded for scenario classification
#   1 - Requested fixture archive is invalid or cannot be restored

set -euo pipefail

RESET_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SANDBOX_DIR="$(cd "${RESET_SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${SANDBOX_DIR}/../../../../../.." && pwd)"
FIXTURE_DIR="${SANDBOX_DIR}/fixtures"
STATE_DIR="${FIXTURE_DIR}/states"
MANIFEST="${FIXTURE_DIR}/manifest.json"
WORKSPACE_ROOT="${SPECKIT_WORKSPACE_ROOT:-$REPO_ROOT}"

if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' NC=''
fi

reset_log() {
    printf '%s\n' "$1"
}

reset_warn() {
    printf '%bWARN:%b %s\n' "$YELLOW" "$NC" "$1" >&2
}

reset_error() {
    printf '%bERROR:%b %s\n' "$RED" "$NC" "$1" >&2
}

require_sandbox_reset() {
    if [[ "${SPECKIT_SANDBOX:-}" = "1" || "${SPECKIT_ALLOW_HOST_RESET:-}" = "1" ]]; then
        return 0
    fi
    reset_warn "state reset skipped outside sandbox; set SPECKIT_SANDBOX=1 or SPECKIT_ALLOW_HOST_RESET=1 to restore fixtures"
    return 125
}

reset_state() {
    local fixture_name="$1"
    local archive="${STATE_DIR}/${fixture_name}.tar.gz"

    export SPECKIT_ACTIVE_FIXTURE="$fixture_name"

    unset SPECKIT_RESET_STATE_SKIPPED SPECKIT_RESET_STATE_SKIP_REASON

    if ! require_sandbox_reset; then
        export SPECKIT_RESET_STATE_SKIPPED=1
        export SPECKIT_RESET_STATE_SKIP_REASON="sandbox guard pre-condition not met"
        printf '[sandbox-guard] SKIPPING - guard pre-condition not met\n' >&2
        return 125
    fi

    mkdir -p "$STATE_DIR"

    if [[ ! -f "$archive" ]]; then
        reset_warn "fixture archive missing: ${archive}; scenario will rely on current workspace state"
        return 0
    fi

    local strip_components=0
    if [[ -f "$MANIFEST" ]] && command -v jq >/dev/null 2>&1; then
        strip_components="$(jq -r --arg name "$fixture_name" '.fixtures[$name].extract_strip_components // 0' "$MANIFEST")"
        [[ "$strip_components" =~ ^[0-9]+$ ]] || strip_components=0
    fi

    reset_log "RESET ${fixture_name}: restoring into ${WORKSPACE_ROOT} (strip-components=${strip_components})"
    if [[ "$strip_components" -gt 0 ]]; then
        tar -xzf "$archive" -C "$WORKSPACE_ROOT" --strip-components="$strip_components"
    else
        tar -xzf "$archive" -C "$WORKSPACE_ROOT"
    fi
    printf '%bOK:%b restored fixture %s\n' "$GREEN" "$NC" "$fixture_name"
    return 0
}

if [[ "${BASH_SOURCE[0]}" = "$0" ]]; then
    if [[ "$#" -ne 1 ]]; then
        reset_error "usage: reset-state.sh <fixture-name>"
        exit 1
    fi
    reset_state "$1"
fi
