#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-GOAL-SHAPE
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: GOAL_SHAPE
# Severity: warn
# Description: Present-file shape check for a packet's goal document.
#   Absent, it reports nothing. Present, it checks that the durable directive and
#   the log are separable, that a phase parent binds its children, that every
#   child path it lists resolves inside the packet, and that the durable slice
#   fits the budget an operator can actually paste.

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

_goal_lower() { printf '%s' "$1" | tr '[:upper:]' '[:lower:]'; }

_goal_enabled() {
    local raw="${SPECKIT_GOAL_SHAPE:-true}"
    case "$(_goal_lower "$raw")" in
        false|0|no|off) return 1 ;;
        *) return 0 ;;
    esac
}

# The durable slice is what an operator pastes into a session objective, so its
# ceiling is the smallest runtime cap minus room for the wrapper they add around
# it. A phase parent needs more because its binding table grows with its children.
_goal_budget() {
    local is_parent="$1"
    if [[ "$is_parent" == "true" ]]; then
        printf '%s' "${SPECKIT_GOAL_DURABLE_MAX_PHASE:-3000}"
    else
        printf '%s' "${SPECKIT_GOAL_DURABLE_MAX:-2000}"
    fi
}

# ───────────────────────────────────────────────────────────────
# 2. PARSING
# ───────────────────────────────────────────────────────────────

# Everything from the durable heading up to the log heading. Measured whole:
# deciding which prose is "boilerplate" would drift every time the template does.
_goal_durable_chars() {
    awk '
        /^##[[:space:]]+[0-9]*\.?[[:space:]]*DURABLE DIRECTIVE/ { inb = 1 }
        /^##[[:space:]]+[0-9]*\.?[[:space:]]*LOG[[:space:]]*$/  { inb = 0 }
        inb { total += length($0) + 1 }
        END { print total + 0 }
    ' "$1"
}

_goal_has_heading() {
    grep -qE "^##[[:space:]]+[0-9]*\.?[[:space:]]*$2" "$1"
}

# Child goal paths a parent lists in its binding table.
_goal_listed_children() {
    awk -F'|' '
        function trim(v) { gsub(/^[[:space:]]+|[[:space:]]+$/, "", v); gsub(/`/, "", v); return v }
        /^[[:space:]]*(```|~~~)/ { fence = !fence; next }
        fence { next }
        /^[[:space:]]*\|/ {
            cell = trim($3)
            if (cell ~ /goal\.md$/ && cell !~ /^Goal document$/) print cell
        }
    ' "$1"
}

# ───────────────────────────────────────────────────────────────
# 3. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="GOAL_SHAPE"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if ! _goal_enabled; then
        RULE_MESSAGE="Goal shape check disabled (set SPECKIT_GOAL_SHAPE=true to enable)"
        return 0
    fi

    local goal_file="$folder/goal.md"
    if [[ ! -f "$goal_file" ]]; then
        RULE_MESSAGE="No goal document in this packet; shape check is a no-op"
        return 0
    fi

    local is_parent=false
    if [[ "$level" == "phase" ]] || is_phase_parent "$folder" 2>/dev/null; then
        is_parent=true
    fi

    local problems=()

    _goal_has_heading "$goal_file" "DURABLE DIRECTIVE" \
        || problems+=("no durable-directive heading, so the directive cannot be told from the log")
    _goal_has_heading "$goal_file" "LOG" \
        || problems+=("no log heading, so the volatile section has no boundary")
    _goal_has_heading "$goal_file" "COMPLETION CRITERIA" \
        || problems+=("no completion-criteria heading; nothing states when the packet is done")

    if $is_parent; then
        if _goal_has_heading "$goal_file" "BINDING"; then
            local child
            while IFS= read -r child; do
                [[ -z "$child" ]] && continue
                [[ -f "$folder/$child" ]] || problems+=("binding lists ${child}, which does not exist in this packet")
            done < <(_goal_listed_children "$goal_file")
        else
            problems+=("a phase parent with no binding block; its children's goals are unreachable")
        fi
    fi

    local durable budget
    durable="$(_goal_durable_chars "$goal_file")"
    budget="$(_goal_budget "$is_parent")"
    if [[ "$durable" -gt "$budget" ]]; then
        problems+=("durable slice is ${durable} characters against a ${budget} budget; an operator cannot paste it whole")
    fi

    if [[ ${#problems[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="GOAL_SHAPE: ${#problems[@]} issue(s) in the goal document"
        RULE_DETAILS=("${problems[@]}")
        RULE_REMEDIATION="Keep the durable directive short enough to paste, bind every child that exists, and leave the log below its heading."
        return 0
    fi

    RULE_MESSAGE="GOAL_SHAPE: durable slice ${durable}/${budget} characters; shape intact"
}
