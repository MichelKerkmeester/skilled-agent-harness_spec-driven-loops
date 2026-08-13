#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: SCOPE ADHERENCE
# ───────────────────────────────────────────────────────────────
# Advises when an explicitly supplied change-set exceeds the paths a packet
# declared under its spec.md "Files to Change" section.
#
# Change-set contract (opt-in; the rule is a no-op when neither is set):
#   MK_SCOPE_CHANGED_FILES  Whitespace/newline-separated list of repo-relative
#                           changed paths to audit directly.
#   MK_SCOPE_BASE           A git ref (e.g. HEAD, a branch, or a SHA). When
#                           MK_SCOPE_CHANGED_FILES is empty, the change-set is
#                           derived from `git diff --name-only <MK_SCOPE_BASE>`.
#   MK_SCOPE_CHANGED_FILES takes precedence when both are set.
#
# A packet's own canonical documents (spec.md, plan.md, tasks.md, checklist.md,
# decision-record.md, implementation-summary.md, research.md, resource-map.md,
# handover.md, description.json, graph-metadata.json) are always in-scope for
# that packet's change-set and never counted as violations, since reconciling
# them is normal packet maintenance and they are rarely self-listed under
# "Files to Change".

# Sourced by validate.sh and compatible with strict mode.
# shellcheck disable=SC2034,SC2016
set -euo pipefail

run_check() {
    local folder="$1"

    RULE_NAME="SCOPE_ADHERENCE"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local changed_text="${MK_SCOPE_CHANGED_FILES:-}"
    local scope_base="${MK_SCOPE_BASE:-}"

    if [[ -z "${changed_text//[[:space:]]/}" ]]; then
        if [[ -z "${scope_base//[[:space:]]/}" ]]; then
            RULE_MESSAGE="Scope adherence: not active (no change-set provided)"
            return 0
        fi

        if ! command -v git >/dev/null 2>&1; then
            RULE_MESSAGE="Scope adherence: skipped (git unavailable)"
            return 0
        fi

        local repo_root=""
        if ! repo_root=$(git -C "$folder" rev-parse --show-toplevel 2>/dev/null); then
            RULE_MESSAGE="Scope adherence: skipped (packet is not in a git worktree)"
            return 0
        fi
        if ! changed_text=$(git -C "$repo_root" diff --name-only "$scope_base" -- 2>/dev/null); then
            RULE_MESSAGE="Scope adherence: skipped (invalid scope base)"
            return 0
        fi
    fi

    # Split on newlines when the change-set has them (git diff --name-only output),
    # so paths that contain spaces survive; fall back to whitespace only for legacy
    # single-line space-separated input.
    local changed_files=()
    local changed_file=""
    local _split=' '
    [[ "$changed_text" == *$'\n'* ]] && _split=$'\n'
    while IFS= read -r changed_file; do
        [[ -z "$changed_file" ]] && continue
        changed_file="${changed_file#./}"
        changed_files+=("$changed_file")
    done < <(printf '%s\n' "$changed_text" | tr "$_split" '\n')

    if [[ ${#changed_files[@]} -eq 0 ]]; then
        RULE_MESSAGE="Scope adherence: not active (no change-set provided)"
        return 0
    fi

    local spec_file="$folder/spec.md"
    if [[ ! -r "$spec_file" ]]; then
        RULE_MESSAGE="Scope adherence: skipped (spec.md unavailable)"
        return 0
    fi

    local section=""
    section=$(awk '
        function heading_level(line, marker) {
            marker = line
            sub(/[^#].*/, "", marker)
            return length(marker)
        }
        BEGIN { active = 0; section_level = 0 }
        {
            if (!active && $0 ~ /^#+([[:space:]]+)Files to Change[[:space:]]*$/) {
                active = 1
                section_level = heading_level($0)
                next
            }
            if (active && $0 ~ /^#+[[:space:]]+/ && heading_level($0) <= section_level) {
                exit
            }
            if (active) print
        }
    ' "$spec_file" 2>/dev/null) || section=""

    local backtick_paths=""
    local plain_paths=""
    backtick_paths=$(printf '%s\n' "$section" | grep -oE '`[^`]+`' | sed 's/^`//; s/`$//' || true)
    plain_paths=$(printf '%s\n' "$section" | grep -oE '(\.?[[:alnum:]_-]+/)+[[:alnum:]_.{}*?,+-]+' || true)

    local declared_text=""
    declared_text=$(printf '%s\n%s\n' "$backtick_paths" "$plain_paths" | awk 'NF && !seen[$0]++') || declared_text=""

    local declared_prefixes=()
    local declared_prefix=""
    while IFS= read -r declared_prefix; do
        [[ -z "$declared_prefix" ]] && continue
        declared_prefix="${declared_prefix#./}"
        [[ "$declared_prefix" == /* ]] && continue
        [[ "$declared_prefix" == *[[:space:]]* ]] && continue
        [[ "$declared_prefix" == */* || "$declared_prefix" == *.* ]] || continue
        declared_prefix="${declared_prefix%%\{*}"
        declared_prefix="${declared_prefix%%\[*}"
        declared_prefix="${declared_prefix%%\**}"
        declared_prefix="${declared_prefix%%\?*}"
        [[ -n "$declared_prefix" ]] && declared_prefixes+=("$declared_prefix")
    done <<< "$declared_text"

    if [[ ${#declared_prefixes[@]} -eq 0 ]]; then
        RULE_MESSAGE="Scope adherence: skipped (no parseable Files to Change paths)"
        return 0
    fi

    local canonical_docs=" spec.md plan.md tasks.md checklist.md decision-record.md implementation-summary.md research.md resource-map.md handover.md description.json graph-metadata.json "
    # Resolve the packet's own folder so the canonical-doc exception below stays
    # scoped to THIS packet — a same-named file elsewhere in the tree is never
    # in-scope merely by matching a basename.
    local folder_norm="${folder#./}"; folder_norm="${folder_norm%/}"
    local pkt_dir="${folder_norm##*/}"

    local violations=()
    local matched=false
    for changed_file in "${changed_files[@]}"; do
        matched=false
        # A packet's own canonical docs are always in-scope — but only when the file
        # actually lives in this packet's folder, never merely by basename.
        local base="${changed_file##*/}"
        local parent="${changed_file%/*}"
        [[ "$parent" == "$changed_file" ]] && parent=""
        if [[ "$canonical_docs" == *" $base "* ]] \
           && { { [[ -n "$folder_norm" ]] && [[ "$parent" == "$folder_norm" ]]; } \
                || { [[ -n "$pkt_dir" ]] && [[ "$parent" == *"/$pkt_dir" ]]; } \
                || { [[ -n "$pkt_dir" ]] && [[ "$parent" == "$pkt_dir" ]]; }; }; then
            continue
        fi
        for declared_prefix in "${declared_prefixes[@]}"; do
            if [[ "$declared_prefix" == */ ]]; then
                if [[ "$changed_file" == "$declared_prefix"* || "$changed_file" == *"/$declared_prefix"* ]]; then
                    matched=true
                    break
                fi
            elif [[ "$changed_file" == "$declared_prefix" || "$changed_file" == "$declared_prefix/"* || "$changed_file" == *"/$declared_prefix" || "$changed_file" == *"/$declared_prefix/"* ]]; then
                matched=true
                break
            fi
        done
        [[ "$matched" == "true" ]] || violations+=("$changed_file")
    done

    if [[ ${#violations[@]} -eq 0 ]]; then
        RULE_MESSAGE="Scope adherence: all changed files are within declared paths"
        return 0
    fi

    RULE_STATUS="warn"
    RULE_MESSAGE="Scope adherence: ${#violations[@]} out-of-scope changed file(s)"
    RULE_DETAILS=("${violations[@]}")
    RULE_REMEDIATION="Add each path to Files to Change or revert the out-of-scope change."
    return 0
}

# Exit codes:
#   0 - Success
