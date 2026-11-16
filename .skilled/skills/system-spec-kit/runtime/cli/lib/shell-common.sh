#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Shell Common
# ───────────────────────────────────────────────────────────────
# Shared shell utilities for spec-kit scripts.
# Source this file: source "$(dirname "$0")/../lib/shell-common.sh"
#
# Functions:
# _json_escape()    - Escape strings for safe JSON embedding
# Find_repo_root()  - Walk parent directories to find repository root
# Decision_record_is_writer_only() - Tell a save-written decision record from an ADR
#
# Compatibility: Bash 3.2+ (macOS default)
# ───────────────────────────────────────────────────────────────

# Conditional strict mode — skipped when sourced to avoid breaking caller's error handling.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    set -euo pipefail
fi

# Guard against double-sourcing
[[ -n "${_SHELL_COMMON_LOADED:-}" ]] && return 0
_SHELL_COMMON_LOADED=1

# ───────────────────────────────────────────────────────────────
# JSON string escape — handles special characters for safe JSON embedding
# Usage: _json_escape "string with special chars"
# Canonical version (consolidated from create.sh and validate.sh)
# ───────────────────────────────────────────────────────────────
_json_escape() {
    local str="$1"
    # Order matters: backslash first, then other escapes
    str="${str//\\/\\\\}"   # Backslash
    str="${str//\"/\\\"}"   # Double quote
    str="${str//$'\n'/\\n}" # Newline
    str="${str//$'\r'/\\r}" # Carriage return
    str="${str//$'\t'/\\t}" # Tab
    printf '%s' "$str"
}

# ───────────────────────────────────────────────────────────────
# Phase parent detection — determines whether a folder is a phase
# parent (contains at least one populated NNN-* child folder).
# Contract: ≥1 direct child matching ^[0-9]{3}-[a-z0-9][a-z0-9-]*$ AND
# ≥1 such child has spec.md OR description.json.
# Usage: is_phase_parent "/path/to/spec-folder"
# Returns: 0 if phase parent, 1 if not
# ───────────────────────────────────────────────────────────────
is_phase_parent() {
    local parent_folder="$1"
    local has_nnn_child=false
    local has_populated_child=false

    for entry in "$parent_folder"/*/; do
        [[ -d "$entry" ]] || continue
        local dirname
        dirname=$(basename "$entry")
        if [[ "$dirname" =~ ^[0-9]{3}-[a-z0-9][a-z0-9-]*$ ]]; then
            has_nnn_child=true
            if [[ -f "$entry/spec.md" ]] || [[ -f "$entry/description.json" ]]; then
                has_populated_child=true
                break
            fi
        fi
    done

    [[ "$has_nnn_child" == "true" ]] && [[ "$has_populated_child" == "true" ]]
}

# ───────────────────────────────────────────────────────────────
# Repository root detection — walks parent directories looking
# For .git or .specify markers.
# Usage: find_repo_root "/some/starting/directory"
# Returns: Prints repo root path to stdout, returns 0 on success, 1 if not found
#
# Note: For git-first detection, see also ../common.sh get_repo_root()
# Which uses `git rev-parse --show-toplevel` as primary strategy.
# ───────────────────────────────────────────────────────────────
find_repo_root() {
    local dir="${1:-}"

    [[ -n "$dir" ]] || return 1

    while [[ "$dir" != "/" ]]; do
        if [[ -d "$dir/.git" ]] || [[ -d "$dir/.specify" ]]; then
            printf '%s\n' "$dir"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    return 1
}

# ───────────────────────────────────────────────────────────────
# Writer-only decision record — the save step records operator answers
# In decision-record.md at any level, so presence alone does not signal
# Level 3. Only a record whose anchors are all the writer's own stays neutral.
# Usage: decision_record_is_writer_only "/path/to/decision-record.md"
# Returns: 0 if every anchor is operator-decisions or operator-answers-verbatim,
# 1 if the file is missing, has no anchors, or has any other anchor
# ───────────────────────────────────────────────────────────────
decision_record_is_writer_only() {
    local record="$1"
    [[ -f "$record" ]] || return 1

    local anchor_ids
    anchor_ids=$(grep -oE '<!-- */?ANCHOR:[A-Za-z0-9_-]+' "$record" 2>/dev/null | sed -E 's/.*ANCHOR://' | sort -u || true)
    [[ -n "$anchor_ids" ]] || return 1

    local anchor_id
    while IFS= read -r anchor_id; do
        case "$anchor_id" in
            operator-decisions|operator-answers-verbatim) ;;
            *) return 1 ;;
        esac
    done <<< "$anchor_ids"
    return 0
}

# Exit codes:
# 0 - Success
# 1 - General error
