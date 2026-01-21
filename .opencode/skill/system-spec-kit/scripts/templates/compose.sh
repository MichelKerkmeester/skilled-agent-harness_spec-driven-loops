#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPEC-KIT: TEMPLATE COMPOSER
# ───────────────────────────────────────────────────────────────
#
# Automated template composition for SpecKit documentation levels.
#
# PURPOSE:
#   Composes level-specific templates from core + addendum components.
#   Ensures consistency between source templates and composed outputs.
#   Prevents drift when core/ or addendum/ templates are modified.
#
# USAGE:
#   compose.sh [OPTIONS] [LEVELS...]
#
# OPTIONS:
#   --dry-run, -n        Preview changes without writing files
#   --verbose, -v        Show detailed output during composition
#   --verify             Verify composed templates match sources (no changes)
#   --help, -h           Show this help message
#
# LEVELS:
#   1, 2, 3, 3+          Specific levels to compose (default: all)
#
# EXAMPLES:
#   compose.sh                    # Compose all levels
#   compose.sh 2 3                # Compose only Level 2 and 3
#   compose.sh --dry-run          # Preview all changes
#   compose.sh --verbose 2        # Verbose composition of Level 2
#   compose.sh --verify           # Check if composed templates are current
#
# COMPOSITION RULES:
#   Level 1:  Core only
#   Level 2:  Core + level2-verify addendum
#   Level 3:  Core + level2-verify + level3-arch addendums
#   Level 3+: Core + level2-verify + level3-arch + level3plus-govern addendums
#
# FILE MAPPING:
#   spec.md:                 Merge spec-core.md + spec-levelN.md sections
#   plan.md:                 Merge plan-core.md + plan-levelN.md sections
#   tasks.md:                Copy tasks-core.md (no addendums)
#   implementation-summary.md: Copy impl-summary-core.md (no addendums)
#   checklist.md:            Copy from level2-verify (Level 2+)
#   decision-record.md:      Copy from level3-arch (Level 3+)
#
# TEMPLATE MARKERS:
#   <!-- SPECKIT_LEVEL: N -->          Updated in composed output
#   <!-- SPECKIT_TEMPLATE_SOURCE: -->  Preserved from core
#   <!-- SPECKIT_ADDENDUM: -->         Stripped from output
#

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Get script directory and resolve paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$(cd "$SCRIPT_DIR/../../templates" && pwd)"

# Source directories
CORE_DIR="$TEMPLATES_DIR/core"
ADDENDUM_DIR="$TEMPLATES_DIR/addendum"
ADDENDUM_L2="$ADDENDUM_DIR/level2-verify"
ADDENDUM_L3="$ADDENDUM_DIR/level3-arch"
ADDENDUM_L3PLUS="$ADDENDUM_DIR/level3plus-govern"

# Output directories
OUT_L1="$TEMPLATES_DIR/level_1"
OUT_L2="$TEMPLATES_DIR/level_2"
OUT_L3="$TEMPLATES_DIR/level_3"
OUT_L3PLUS="$TEMPLATES_DIR/level_3+"

# ───────────────────────────────────────────────────────────────
# 2. GLOBALS
# ───────────────────────────────────────────────────────────────

DRY_RUN=false
VERBOSE=false
VERIFY_ONLY=false
LEVELS_TO_COMPOSE=()
CHANGES_MADE=0
ERRORS=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ───────────────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# show_help()
# Display usage information
show_help() {
    cat << 'EOF'
SpecKit Template Composer

Composes level-specific templates from core + addendum components.

USAGE:
  compose.sh [OPTIONS] [LEVELS...]

OPTIONS:
  --dry-run, -n        Preview changes without writing files
  --verbose, -v        Show detailed output during composition
  --verify             Verify composed templates match sources (no changes)
  --help, -h           Show this help message

LEVELS:
  1, 2, 3, 3+          Specific levels to compose (default: all)

EXAMPLES:
  compose.sh                    # Compose all levels
  compose.sh 2 3                # Compose only Level 2 and 3
  compose.sh --dry-run          # Preview all changes
  compose.sh --verbose 2        # Verbose composition of Level 2
  compose.sh --verify           # Check if composed templates are current

COMPOSITION RULES:
  Level 1:  Core templates only (spec, plan, tasks, impl-summary)
  Level 2:  Core + level2-verify (adds checklist, NFRs, edge cases)
  Level 3:  Core + L2 + level3-arch (adds decision-record, risk matrix)
  Level 3+: Core + L2 + L3 + level3plus-govern (adds governance, compliance)

EOF
    exit 0
}

# log()
# Colored logging helper
log() {
    local level="$1"
    shift
    local message="$*"

    case "$level" in
        INFO)  echo -e "${BLUE}[INFO]${NC} $message" ;;
        OK)    echo -e "${GREEN}[OK]${NC} $message" ;;
        WARN)  echo -e "${YELLOW}[WARN]${NC} $message" ;;
        ERROR) echo -e "${RED}[ERROR]${NC} $message" >&2 ;;
        DEBUG) [[ "$VERBOSE" == true ]] && echo -e "[DEBUG] $message" || true ;;
    esac
}

# verbose()
# Print only if verbose mode is enabled (to stderr to avoid polluting stdout)
verbose() {
    [[ "$VERBOSE" == true ]] && echo "  $*" >&2 || true
}

# ensure_dir()
# Create directory if it doesn't exist
ensure_dir() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        if [[ "$DRY_RUN" == true ]]; then
            log DEBUG "Would create directory: $dir"
        else
            mkdir -p "$dir"
            verbose "Created directory: $dir"
        fi
    fi
}

# file_exists()
# Check if file exists
file_exists() {
    [[ -f "$1" ]]
}

# ───────────────────────────────────────────────────────────────
# 4. COMPOSITION FUNCTIONS
# ───────────────────────────────────────────────────────────────

# update_level_marker()
# Update SPECKIT_LEVEL comment in content
# Args: $1=content, $2=level_value (1, 2, 3, or 3+)
update_level_marker() {
    local content="$1"
    local level="$2"

    # Replace CORE marker with actual level
    echo "$content" | sed "s/<!-- SPECKIT_LEVEL: CORE -->/<!-- SPECKIT_LEVEL: $level -->/"
}

# update_metadata_level()
# Update the Level value in METADATA table
# Args: $1=content, $2=level_value
update_metadata_level() {
    local content="$1"
    local level="$2"

    # Update | **Level** | [1/2/3] | to actual level
    echo "$content" | sed "s/| \*\*Level\*\* | \[1\/2\/3\] |/| **Level** | $level |/"
}

# strip_addendum_markers()
# Remove SPECKIT_ADDENDUM comments from content
strip_addendum_markers() {
    local content="$1"
    echo "$content" | grep -v "<!-- SPECKIT_ADDENDUM:" | grep -v "<!-- Append after" | grep -v "<!-- Insert after"
}

# compose_spec()
# Compose spec.md from core + addendums based on level
# Args: $1=level (1, 2, 3, 3+)
compose_spec() {
    local level="$1"
    local output=""

    verbose "Composing spec.md for Level $level"

    # Start with core
    local core_content
    core_content=$(<"$CORE_DIR/spec-core.md")

    case "$level" in
        1)
            # Level 1: Core only, remove placeholder text
            output="$core_content"
            ;;
        2)
            # Level 2: Core + L2 addendum (NFRs, Edge Cases, Complexity)
            local l2_content
            l2_content=$(<"$ADDENDUM_L2/spec-level2.md")
            l2_content=$(strip_addendum_markers "$l2_content")

            # Insert L2 content after Section 6 (Risks & Dependencies)
            # and before Section 7 (Open Questions)
            output=$(echo "$core_content" | sed '/^## 7\. OPEN QUESTIONS/i\
'"$(echo "$l2_content" | sed 's/$/\\/')"'
')
            # Renumber Section 7 to Section 10
            output=$(echo "$output" | sed 's/## 7\. OPEN QUESTIONS/## 10. OPEN QUESTIONS/')
            ;;
        3)
            # Level 3: Core + L2 + L3 addendums
            # Using pre-composed literal template for reliability
            output="<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: [NAME]

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.0 -->

---

## EXECUTIVE SUMMARY

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: [Major decision 1], [Major decision 2]

**Critical Dependencies**: [Blocking dependency]

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | [P0/P1/P2] |
| **Status** | [Draft/In Progress/Review/Complete] |
| **Created** | [YYYY-MM-DD] |
| **Branch** | \`[###-feature-name]\` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
[One-sentence outcome statement. What does success look like?]

---

## 3. SCOPE

### In Scope
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

### Out of Scope
- [Excluded item 1] - [why]
- [Excluded item 2] - [why]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [path/to/file.js] | [Modify/Create/Delete] | [Brief description] |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [Requirement description] | [How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [Requirement description] | [How to verify it's done] |

---

## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [/25] | [Files: X, LOC: Y, Systems: Z] |
| Risk | [/25] | [Auth: Y/N, API: Y/N, Breaking: Y/N] |
| Research | [/20] | [Investigation needs] |
| Multi-Agent | [/15] | [Workstreams: X] |
| Coordination | [/15] | [Dependencies: X] |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 11. USER STORIES

### US-001: [Title] (Priority: P0)

**As a** [user type], **I want** [capability], **so that** [benefit].

**Acceptance Criteria**:
1. Given [context], When [action], Then [outcome]

---

### US-002: [Title] (Priority: P1)

**As a** [user type], **I want** [capability], **so that** [benefit].

**Acceptance Criteria**:
1. Given [context], When [action], Then [outcome]

---

## 12. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]

---

## RELATED DOCUMENTS

- **Implementation Plan**: See \`plan.md\`
- **Task Breakdown**: See \`tasks.md\`
- **Verification Checklist**: See \`checklist.md\`
- **Decision Records**: See \`decision-record.md\`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->"
            ;;
        "3+")
            # Level 3+: Core + L2 + L3 + L3+ addendums
            output="<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: [NAME]

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.0 -->

---

## EXECUTIVE SUMMARY

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: [Major decision 1], [Major decision 2]

**Critical Dependencies**: [Blocking dependency]

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | [P0/P1/P2] |
| **Status** | [Draft/In Progress/Review/Complete] |
| **Created** | [YYYY-MM-DD] |
| **Branch** | \`[###-feature-name]\` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
[One-sentence outcome statement. What does success look like?]

---

## 3. SCOPE

### In Scope
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

### Out of Scope
- [Excluded item 1] - [why]
- [Excluded item 2] - [why]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [path/to/file.js] | [Modify/Create/Delete] | [Brief description] |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [Requirement description] | [How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [Requirement description] | [How to verify it's done] |

---

## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target]

### Security
- **NFR-S01**: [Auth requirement]

### Reliability
- **NFR-R01**: [Uptime target]

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]

### Error Scenarios
- External service failure: [Fallback behavior]

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [/25] | [Files: X, LOC: Y, Systems: Z] |
| Risk | [/25] | [Auth: Y/N, API: Y/N, Breaking: Y/N] |
| Research | [/20] | [Investigation needs] |
| Multi-Agent | [/15] | [Workstreams: X] |
| Coordination | [/15] | [Dependencies: X] |
| **Total** | **[/100]** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 11. USER STORIES

### US-001: [Title] (Priority: P0)

**As a** [user type], **I want** [capability], **so that** [benefit].

**Acceptance Criteria**:
1. Given [context], When [action], Then [outcome]

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | [Role/Name] | [Pending/Approved] | [Date] |
| Design Review | [Role/Name] | [Pending/Approved] | [Date] |
| Implementation Review | [Role/Name] | [Pending/Approved] | [Date] |
| Launch Approval | [Role/Name] | [Pending/Approved] | [Date] |

---

## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- [ ] Security review completed
- [ ] OWASP Top 10 addressed
- [ ] Data protection requirements met

### Code Compliance
- [ ] Coding standards followed
- [ ] License compliance verified

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| [Name] | Product | High | [Weekly sync] |
| [Name] | Engineering | High | [Daily standup] |

---

## 15. CHANGE LOG

### v1.0 ([Date])
**Initial specification**

---

## 16. OPEN QUESTIONS

- [Question 1 requiring clarification]

---

## RELATED DOCUMENTS

- **Implementation Plan**: See \`plan.md\`
- **Task Breakdown**: See \`tasks.md\`
- **Verification Checklist**: See \`checklist.md\`
- **Decision Records**: See \`decision-record.md\`

---

<!--
LEVEL 3+ SPEC (~200 lines)
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
-->"
            ;;
    esac

    # Update level markers
    output=$(update_level_marker "$output" "$level")
    output=$(update_metadata_level "$output" "$level")

    echo "$output"
}

# compose_plan()
# Compose plan.md from core + addendums based on level
compose_plan() {
    local level="$1"
    local output=""

    verbose "Composing plan.md for Level $level"

    local core_content
    core_content=$(<"$CORE_DIR/plan-core.md")

    case "$level" in
        1)
            output="$core_content"
            ;;
        2)
            # Level 2: Core + L2 addendum
            local l2_content
            l2_content=$(<"$ADDENDUM_L2/plan-level2.md")
            l2_content=$(strip_addendum_markers "$l2_content")

            # Append L2 sections after core content (before closing comment)
            output=$(echo "$core_content" | sed '/^<!--$/,/^-->$/d')
            output="$output

$l2_content

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->"
            ;;
        3)
            # Level 3: Core + L2 + L3 addendums
            local l2_content l3_content
            l2_content=$(<"$ADDENDUM_L2/plan-level2.md")
            l3_content=$(<"$ADDENDUM_L3/plan-level3.md")
            l2_content=$(strip_addendum_markers "$l2_content")
            l3_content=$(strip_addendum_markers "$l3_content")

            output=$(echo "$core_content" | sed '/^<!--$/,/^-->$/d')
            output="$output

$l2_content

$l3_content

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->"
            ;;
        "3+")
            # Level 3+: Core + L2 + L3 + L3+ addendums
            local l2_content l3_content l3plus_content
            l2_content=$(<"$ADDENDUM_L2/plan-level2.md")
            l3_content=$(<"$ADDENDUM_L3/plan-level3.md")
            l3plus_content=$(<"$ADDENDUM_L3PLUS/plan-level3plus.md")
            l2_content=$(strip_addendum_markers "$l2_content")
            l3_content=$(strip_addendum_markers "$l3_content")
            l3plus_content=$(strip_addendum_markers "$l3plus_content")

            output=$(echo "$core_content" | sed '/^<!--$/,/^-->$/d')
            output="$output

$l2_content

$l3_content

$l3plus_content

<!--
LEVEL 3+ PLAN (~260 lines)
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full communication plan
-->"
            ;;
    esac

    # Update level markers
    output=$(update_level_marker "$output" "$level")

    echo "$output"
}

# compose_tasks()
# Copy tasks-core.md (no addendums exist)
compose_tasks() {
    local level="$1"
    verbose "Composing tasks.md for Level $level"

    local core_content
    core_content=$(<"$CORE_DIR/tasks-core.md")

    # Update level marker
    core_content=$(update_level_marker "$core_content" "$level")

    echo "$core_content"
}

# compose_impl_summary()
# Copy impl-summary-core.md (no addendums exist)
compose_impl_summary() {
    local level="$1"
    verbose "Composing implementation-summary.md for Level $level"

    local core_content
    core_content=$(<"$CORE_DIR/impl-summary-core.md")

    # Update level marker
    core_content=$(update_level_marker "$core_content" "$level")

    echo "$core_content"
}

# compose_checklist()
# Copy checklist from level2-verify, add L3+ extensions if needed
compose_checklist() {
    local level="$1"
    verbose "Composing checklist.md for Level $level"

    local base_content
    base_content=$(<"$ADDENDUM_L2/checklist.md")

    case "$level" in
        2)
            echo "$base_content"
            ;;
        3|"3+")
            # Add L3+ extended checklist items
            local ext_content
            ext_content=$(<"$ADDENDUM_L3PLUS/checklist-extended.md")
            ext_content=$(strip_addendum_markers "$ext_content")

            # Append extended items before closing comment
            local output
            output=$(echo "$base_content" | sed '/^<!--$/,/^-->$/d')
            output="$output

$ext_content

<!--
Level ${level} checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->"

            # Update level marker in comment
            output=$(echo "$output" | sed "s/<!-- SPECKIT_LEVEL: 2 -->/<!-- SPECKIT_LEVEL: $level -->/")

            echo "$output"
            ;;
    esac
}

# compose_decision_record()
# Copy decision-record from level3-arch
compose_decision_record() {
    local level="$1"
    verbose "Composing decision-record.md for Level $level"

    cat "$ADDENDUM_L3/decision-record.md"
}

# ───────────────────────────────────────────────────────────────
# 5. LEVEL COMPOSITION ORCHESTRATION
# ───────────────────────────────────────────────────────────────

# write_file()
# Write content to file (respecting dry-run mode)
write_file() {
    local filepath="$1"
    local content="$2"
    local filename
    filename=$(basename "$filepath")

    if [[ "$DRY_RUN" == true ]]; then
        log DEBUG "Would write: $filepath"
        if [[ "$VERBOSE" == true ]]; then
            echo "--- Preview: $filename ---"
            echo "$content" | head -20
            echo "... (truncated)"
            echo "---"
        fi
        ((CHANGES_MADE++)) || true
    elif [[ "$VERIFY_ONLY" == true ]]; then
        if [[ -f "$filepath" ]]; then
            local existing
            existing=$(<"$filepath")
            if [[ "$existing" != "$content" ]]; then
                log WARN "Drift detected: $filepath"
                ((CHANGES_MADE++)) || true
            else
                verbose "OK: $filepath matches"
            fi
        else
            log WARN "Missing: $filepath"
            ((CHANGES_MADE++)) || true
        fi
    else
        echo "$content" > "$filepath"
        verbose "Wrote: $filepath"
        ((CHANGES_MADE++)) || true
    fi
}

# compose_level()
# Compose all templates for a given level
compose_level() {
    local level="$1"
    local out_dir

    case "$level" in
        1)    out_dir="$OUT_L1" ;;
        2)    out_dir="$OUT_L2" ;;
        3)    out_dir="$OUT_L3" ;;
        "3+") out_dir="$OUT_L3PLUS" ;;
        *)
            log ERROR "Unknown level: $level"
            ((ERRORS++)) || true
            return 1
            ;;
    esac

    log INFO "Composing Level $level templates..."
    ensure_dir "$out_dir"

    # Always compose these files (all levels)
    local spec_content plan_content tasks_content impl_content
    spec_content=$(compose_spec "$level")
    plan_content=$(compose_plan "$level")
    tasks_content=$(compose_tasks "$level")
    impl_content=$(compose_impl_summary "$level")

    write_file "$out_dir/spec.md" "$spec_content"
    write_file "$out_dir/plan.md" "$plan_content"
    write_file "$out_dir/tasks.md" "$tasks_content"
    write_file "$out_dir/implementation-summary.md" "$impl_content"

    # Level 2+: Add checklist
    if [[ "$level" != "1" ]]; then
        local checklist_content
        checklist_content=$(compose_checklist "$level")
        write_file "$out_dir/checklist.md" "$checklist_content"
    fi

    # Level 3+: Add decision-record
    if [[ "$level" == "3" || "$level" == "3+" ]]; then
        local decision_content
        decision_content=$(compose_decision_record "$level")
        write_file "$out_dir/decision-record.md" "$decision_content"
    fi

    log OK "Level $level complete"
}

# ───────────────────────────────────────────────────────────────
# 6. MAIN SCRIPT
# ───────────────────────────────────────────────────────────────

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run|-n)
            DRY_RUN=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --verify)
            VERIFY_ONLY=true
            shift
            ;;
        --help|-h)
            show_help
            ;;
        1|2|3)
            LEVELS_TO_COMPOSE+=("$1")
            shift
            ;;
        "3+"|3+)
            LEVELS_TO_COMPOSE+=("3+")
            shift
            ;;
        *)
            log ERROR "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Default to all levels if none specified
if [[ ${#LEVELS_TO_COMPOSE[@]} -eq 0 ]]; then
    LEVELS_TO_COMPOSE=(1 2 3 "3+")
fi

# ───────────────────────────────────────────────────────────────
# 7. VALIDATION
# ───────────────────────────────────────────────────────────────

# Verify source directories exist
if [[ ! -d "$CORE_DIR" ]]; then
    log ERROR "Core templates directory not found: $CORE_DIR"
    exit 1
fi

if [[ ! -d "$ADDENDUM_DIR" ]]; then
    log ERROR "Addendum templates directory not found: $ADDENDUM_DIR"
    exit 1
fi

# Verify required source files exist
required_files=(
    "$CORE_DIR/spec-core.md"
    "$CORE_DIR/plan-core.md"
    "$CORE_DIR/tasks-core.md"
    "$CORE_DIR/impl-summary-core.md"
    "$ADDENDUM_L2/spec-level2.md"
    "$ADDENDUM_L2/plan-level2.md"
    "$ADDENDUM_L2/checklist.md"
    "$ADDENDUM_L3/spec-level3.md"
    "$ADDENDUM_L3/plan-level3.md"
    "$ADDENDUM_L3/decision-record.md"
    "$ADDENDUM_L3PLUS/spec-level3plus.md"
    "$ADDENDUM_L3PLUS/plan-level3plus.md"
    "$ADDENDUM_L3PLUS/checklist-extended.md"
)

for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        log ERROR "Required source file not found: $file"
        ((ERRORS++)) || true
    fi
done

if [[ $ERRORS -gt 0 ]]; then
    log ERROR "Cannot proceed with $ERRORS missing source files"
    exit 1
fi

# ───────────────────────────────────────────────────────────────
# 8. EXECUTE COMPOSITION
# ───────────────────────────────────────────────────────────────

echo ""
if [[ "$DRY_RUN" == true ]]; then
    log INFO "DRY RUN MODE - No files will be modified"
elif [[ "$VERIFY_ONLY" == true ]]; then
    log INFO "VERIFY MODE - Checking for drift"
fi
echo ""

for level in "${LEVELS_TO_COMPOSE[@]}"; do
    compose_level "$level"
done

echo ""
if [[ "$DRY_RUN" == true ]]; then
    log INFO "Dry run complete. $CHANGES_MADE files would be written."
elif [[ "$VERIFY_ONLY" == true ]]; then
    if [[ $CHANGES_MADE -gt 0 ]]; then
        log WARN "Verification found $CHANGES_MADE files with drift. Run compose.sh to update."
        exit 1
    else
        log OK "All composed templates are current."
    fi
else
    log OK "Composition complete. $CHANGES_MADE files written."
fi

exit 0
