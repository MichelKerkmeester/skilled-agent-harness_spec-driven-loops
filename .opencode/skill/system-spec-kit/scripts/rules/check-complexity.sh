#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-COMPLEXITY
# ───────────────────────────────────────────────────────────────

# Rule: COMPLEXITY_MATCH
# Severity: warn
# Description: Validates that declared complexity level matches actual content.
#   Checks if spec content is appropriate for the declared level.

# ───────────────────────────────────────────────────────────────
# 1. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Extract level from spec.md metadata
_complexity_get_declared_level() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    if [[ -f "$spec_file" ]]; then
        local level_line
        level_line=$(grep -E "^\- \*\*Level\*\*:" "$spec_file" 2>/dev/null || true)
        if [[ -n "$level_line" ]]; then
            echo "$level_line" | head -1 | sed 's/.*Level.*: *//' | tr -d '[:space:]' | sed 's/\[.*\]//' | head -c 2
        fi
    fi
}

# Count user stories in spec.md
_complexity_count_user_stories() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    if [[ -f "$spec_file" ]]; then
        grep -c "^### User Story" "$spec_file" 2>/dev/null || echo "0"
    else
        echo "0"
    fi
}

# Count phases in plan.md
_complexity_count_phases() {
    local folder="$1"
    local plan_file="$folder/plan.md"
    if [[ -f "$plan_file" ]]; then
        grep -c "^### Phase" "$plan_file" 2>/dev/null || echo "0"
    else
        echo "0"
    fi
}

# Count tasks in tasks.md
_complexity_count_tasks() {
    local folder="$1"
    local tasks_file="$folder/tasks.md"
    if [[ -f "$tasks_file" ]]; then
        grep -cE "^- \[ \] T[0-9]|^- \[ \] TASK-" "$tasks_file" 2>/dev/null || echo "0"
    else
        echo "0"
    fi
}

# Check for AI protocol presence
_complexity_has_ai_protocol() {
    local folder="$1"
    local tasks_file="$folder/tasks.md"
    local plan_file="$folder/plan.md"

    if [[ -f "$tasks_file" ]] && grep -q "AI EXECUTION" "$tasks_file" 2>/dev/null; then
        return 0
    fi
    if [[ -f "$plan_file" ]] && grep -q "AI EXECUTION" "$plan_file" 2>/dev/null; then
        return 0
    fi
    return 1
}

# ───────────────────────────────────────────────────────────────
# 2. MAIN RUN_CHECK FUNCTION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="COMPLEXITY_MATCH"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local warnings=()

    # Get declared level from spec.md
    local declared_level
    declared_level=$(_complexity_get_declared_level "$folder")
    if [[ -z "$declared_level" ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No declared level found in spec.md (using inferred level)"
        return 0
    fi

    # Get content counts
    local story_count phase_count task_count
    story_count=$(_complexity_count_user_stories "$folder")
    phase_count=$(_complexity_count_phases "$folder")
    task_count=$(_complexity_count_tasks "$folder")

    # Define expected ranges per level
    local min_stories max_stories min_phases max_phases min_tasks max_tasks
    case "$declared_level" in
        1)
            min_stories=1; max_stories=2
            min_phases=2; max_phases=3
            min_tasks=5; max_tasks=15
            ;;
        2)
            min_stories=2; max_stories=4
            min_phases=3; max_phases=5
            min_tasks=15; max_tasks=50
            ;;
        3|3+)
            min_stories=4; max_stories=15
            min_phases=5; max_phases=12
            min_tasks=50; max_tasks=200
            ;;
        *)
            # Unknown level - skip checks
            RULE_STATUS="pass"
            RULE_MESSAGE="Unknown level '$declared_level' - skipping complexity checks"
            return 0
            ;;
    esac

    # Check user story count
    if [[ "$story_count" -lt "$min_stories" ]]; then
        warnings+=("User stories ($story_count) below minimum ($min_stories) for Level $declared_level")
    fi
    if [[ "$story_count" -gt "$max_stories" ]]; then
        warnings+=("User stories ($story_count) above maximum ($max_stories) for Level $declared_level")
    fi

    # Check phase count
    if [[ "$phase_count" -lt "$min_phases" ]]; then
        warnings+=("Phases ($phase_count) below minimum ($min_phases) for Level $declared_level")
    fi
    if [[ "$phase_count" -gt "$max_phases" ]]; then
        warnings+=("Phases ($phase_count) above maximum ($max_phases) for Level $declared_level")
    fi

    # Check task count
    if [[ "$task_count" -lt "$min_tasks" ]]; then
        warnings+=("Tasks ($task_count) below minimum ($min_tasks) for Level $declared_level")
    fi
    if [[ "$task_count" -gt "$max_tasks" ]]; then
        warnings+=("Tasks ($task_count) above maximum ($max_tasks) for Level $declared_level")
    fi

    # Check AI protocol for Level 3+
    if [[ "$declared_level" = "3" ]] || [[ "$declared_level" = "3+" ]]; then
        if ! _complexity_has_ai_protocol "$folder"; then
            warnings+=("Level $declared_level should include AI Execution Protocol")
        fi
    fi

    # ───────────────────────────────────────────────────────────────
    # 3. RESULTS
    # ───────────────────────────────────────────────────────────────

    if [[ ${#warnings[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="Complexity level consistent with content (Level $declared_level)"
    else
        RULE_STATUS="warn"
        RULE_MESSAGE="Content metrics may not match declared Level $declared_level"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="Review declared level or adjust content to match expectations"
    fi

    return 0
}
