#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Create Spec Folder
# ───────────────────────────────────────────────────────────────
# Creates spec folder with templates based on documentation level.
#
# TEMPLATE ARCHITECTURE (v2.0 - CORE + ADDENDUM):
#   Templates/
#   ├── level-1/        # Core only (~270 LOC total)
#   ├── level-2/        # Core + Verification (~390 LOC)
#   ├── level-3/        # Core + Verification + Architecture (~540 LOC)
#   └── level_3+/       # All addendums (~640 LOC)
#
# LEVEL SCALING (Value-based, not just length):
#   L1: Essential what/why/how - spec, plan, tasks; summary follows lifecycle
#   L2: +Quality gates, verification - merged into tasks.md
#   L3: +Architecture guidance - decision-record.md is on-demand
#   L3+: +Enterprise governance - extended content
#
# Also creates scratch/ directories.

set -euo pipefail

# Source shared libraries
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../lib/shell-common.sh"
source "${SCRIPT_DIR}/../lib/git-branch.sh"
source "${SCRIPT_DIR}/../lib/template-utils.sh"

JSON_MODE=false
SHORT_NAME=""
BRANCH_NUMBER=""
DOC_LEVEL=1  # Default to Level 1 (Baseline)

# Phase children inherit the requested level. They used to be fixed at 1
# regardless, which quietly decided more than a number: the tasks template gates
# its verification section on level 2 and above, so every child was scaffolded
# without one and the coverage rule had no traceability source to read. In phase
# mode DOC_LEVEL carries the parent's own marker rather than a level, so that
# case falls back to the baseline.
child_doc_level() {
    # Resolve the level a phase child should be scaffolded at.
    # Args:
    #   none - reads DOC_LEVEL from the caller's environment
    # Returns:
    #   Prints the requested level, or 1 when DOC_LEVEL names a mode rather than a level

    case "$DOC_LEVEL" in
        1|2|3|3+) printf '%s' "$DOC_LEVEL" ;;
        *) printf '1' ;;
    esac
}
WITH_LAZY_ADDONS=false  # Opt in to the level-agnostic add-on documents
WITH_GOAL=false         # Opt in to the durable-directive document
SKIP_BRANCH=true   # Default: stay on the current branch (opt in with --branch). The owner's workflow commits directly to main; auto-branching is unwanted friction.
TRACK=""           # Optional track segment: places the folder under specs/<track>/ with per-track numbering
SUBFOLDER_MODE=false  # Enable versioned sub-folder creation
SUBFOLDER_BASE=""     # Base folder for sub-folder mode
SUBFOLDER_TOPIC=""    # Topic name for the sub-folder
TEMPLATE_STYLE="minimal"  # Only minimal templates supported
PHASE_MODE=false        # Enable phase decomposition mode
PHASE_COUNT=3           # Number of child phases to create
PHASE_COUNT_EXPLICIT=false
PHASE_NAMES=""          # Comma-separated phase names (optional)
PHASE_PARENT=""         # Existing parent spec folder path (phase append mode)
EXPLICIT_PATH=""        # Hidden test harness path override
EXPLICIT_NAME=""        # Hidden test harness name override

# Initialize variables used in JSON output (prevents "unbound variable" errors with set -u)
DETECTED_LEVEL=""
DETECTED_SCORE=""
DETECTED_CONF=""
EXPAND_TEMPLATES=false

ARGS=()
i=1
while [[ $i -le $# ]]; do
    arg="${!i}"
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --level)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --level requires a value (1, 2, or 3)' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --level requires a value (1, 2, or 3)' >&2
                exit 1
            fi
            if [[ ! "$next_arg" =~ ^(1|2|3|3\+|phase-parent|review|research)$ ]]; then
                echo 'Error: --level must be 1, 2, 3, 3+, phase-parent, review or research' >&2
                exit 1
            fi
            if [[ "$next_arg" == "phase-parent" ]]; then
                DOC_LEVEL="phase"
            else
                DOC_LEVEL="$next_arg"
            fi
            ;;
        --path)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --path requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --path requires a value' >&2
                exit 1
            fi
            EXPLICIT_PATH="$next_arg"
            SKIP_BRANCH=true
            ;;
        --name)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --name requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --name requires a value' >&2
                exit 1
            fi
            EXPLICIT_NAME="$next_arg"
            ;;
        --skip-branch)
            SKIP_BRANCH=true
            ;;
        --branch)
            SKIP_BRANCH=false
            ;;
        --track)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --track requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --track requires a value' >&2
                exit 1
            fi
            TRACK="$next_arg"
            ;;
        --with-lazy-addons)
            WITH_LAZY_ADDONS=true
            ;;
        --with-goal)
            WITH_GOAL=true
            ;;
        --subfolder)
            SUBFOLDER_MODE=true
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --subfolder requires a base folder path' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --subfolder requires a base folder path' >&2
                exit 1
            fi
            SUBFOLDER_BASE="$next_arg"
            ;;
        --topic)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --topic requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --topic requires a value' >&2
                exit 1
            fi
            SUBFOLDER_TOPIC="$next_arg"
            ;;
        --phase)
            PHASE_MODE=true
            ;;
        --phases)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --phases requires a positive integer' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --phases requires a positive integer' >&2
                exit 1
            fi
            if ! [[ "$next_arg" =~ ^[1-9][0-9]*$ ]]; then
                echo 'Error: --phases must be a positive integer (got: '"$next_arg"')' >&2
                exit 1
            fi
            PHASE_COUNT="$next_arg"
            PHASE_COUNT_EXPLICIT=true
            ;;
        --phase-names)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --phase-names requires a comma-separated list' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --phase-names requires a comma-separated list' >&2
                exit 1
            fi
            PHASE_NAMES="$next_arg"
            ;;
        --parent)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --parent requires an existing spec folder path' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --parent requires an existing spec folder path' >&2
                exit 1
            fi
            PHASE_PARENT="$next_arg"
            ;;
        --phase-parent)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --phase-parent requires an existing spec folder path' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --phase-parent requires an existing spec folder path' >&2
                exit 1
            fi
            PHASE_PARENT="$next_arg"
            ;;
        --short-name)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            # Peek ahead: if next arg starts with --, current option has no value — use default
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            SHORT_NAME="$next_arg"
            ;;
        --number)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --number requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --number requires a value' >&2
                exit 1
            fi
            BRANCH_NUMBER="$next_arg"
            ;;
        --help|-h)
            echo "Usage: $0 [options] <feature_description>"
            echo ""
            echo "Creates a new spec folder with templates based on documentation level."
            echo ""
            echo "Options:"
            echo "  --json              Output in JSON format"
            echo "  --level N           Documentation level: 1, 2, 3, or 3+ (extended)"
            echo "                      1=baseline, 2=verification, 3=full, 3+=extended"
            echo "                      Default: 1"
            echo "                      Creates spec-sections/ with modular documentation"
            echo "  --with-lazy-addons  Add before-after.md, timeline.md, roadmap.md, and decision-record.md"
            echo "                      (off by default; all are valid at every level)"
            echo "  --with-goal         Add goal.md, the durable directive an operator sets as the session objective"
            echo "                      (off by default; valid at every level. With --phase it writes child goals only,"
            echo "                      and --level phase-parent writes a parent goal. Author or amend goals with /create:goal)"
            echo "  --subfolder <path>  Create versioned sub-folder in existing spec folder"
            echo "                      Auto-increments version (001, 002, etc.)"
            echo "  --topic <name>      Topic name for sub-folder (used with --subfolder)"
            echo "                      If not provided, uses feature_description"
            echo "  --phase             Create phased spec (parent + child folders)"
            echo "                      Mutually exclusive with --subfolder"
            echo "  --phases <N>        Number of initial child phases (default: 3)"
            echo "  --phase-names <list>  Comma-separated names for child phases"
            echo "  --parent <path>     Add phases to existing parent spec folder (with --phase)"
            echo "  --phase-parent <path>  Alias for --parent in phase mode (supports nested specs/ paths)"
            echo "                      Bind a new phase's goal with /create:goal <parent> phase-add"
            echo "                      Example: --phase-names \"foundation,implementation,integration\""
            echo "  --short-name <name> Provide a custom short name (2-4 words) for the branch"
            echo "  --number N          Specify branch number manually (overrides auto-detection)"
            echo "  --skip-branch       Create spec folder only, don't create git branch"
            echo "  --help, -h          Show this help message"
            echo ""
            echo "Documentation Levels (CORE + ADDENDUM architecture v2.0):"
            echo ""
            echo "  Level 1 (Core ~270 LOC):     Essential what/why/how"
            echo "    Files: spec.md, plan.md, tasks.md"
            echo "    Lifecycle: implementation-summary.md after implementation starts"
            echo ""
            echo "  Level 2 (Core + Verify):     +Quality gates, verification"
            echo "    Adds: verification/testing sections in tasks.md, NFRs, edge cases, effort estimation"
            echo ""
            echo "  Level 3 (Core + Verify + Arch): +Architecture guidance"
            echo "    Adds: executive summary, risk matrix, ADR guidance"
            echo ""
            echo "  Level 3+ (All addendums):    +Enterprise governance"
            echo "    Adds: approval workflow, compliance, stakeholder matrix, AI protocols"
            echo ""
            echo "Template Composition:"
            echo "  Core templates (~270 LOC) are shared across all levels."
            echo "  Higher levels ADD value, not just length."
            echo "  Templates located in: .skilled/skills/system-spec-kit/templates/"
            echo ""
            echo "All levels include: scratch/ (working files; NOT git-ignored, add a scratch/.gitignore for anything you do not want committed)"
            echo ""
            echo "Examples:"
            echo "  $0 'Add user authentication system' --short-name 'user-auth'"
            echo "  $0 'Implement complex OAuth2 flow' --level 2"
            echo "  $0 'Major architecture redesign' --level 3 --number 50"
            echo ""
            echo "Sub-folder Versioning Examples:"
            echo "  $0 --subfolder specs/005-context-capture 'Initial implementation'"
            echo "  $0 --subfolder specs/005-context-capture --topic 'refactor' 'Phase 2 refactoring'"
            echo ""
            echo "  Creates: specs/005-context-capture/001-initial-implementation/"
            echo "           specs/005-context-capture/002-refactor/"
            echo ""
            echo "Phase Mode Examples:"
            echo "  $0 --phase 'Large platform migration'"
            echo "  $0 --phase --phases 3 'OAuth2 implementation'"
            echo "  $0 --phase --phases 3 --phase-names 'foundation,implementation,integration' 'OAuth2 flow'"
            echo "  $0 --phase --parent specs/042-oauth2-flow --phases 2 --phase-names 'stabilization,rollout' 'OAuth2 flow'"
            echo '  $0 --phase --phase-parent specs/system-spec-kit/023-esm/011-fusion --phase-names "research,implementation" "Graph improvements"'
            echo ""
            echo "  Creates: specs/042-oauth2-flow/"
            echo "           specs/042-oauth2-flow/001-foundation/"
            echo "           specs/042-oauth2-flow/002-implementation/"
            echo "           specs/042-oauth2-flow/003-integration/"
            exit 0
            ;;
        *)
            ARGS+=("$arg")
            ;;
    esac
    i=$((i + 1))
done

FEATURE_DESCRIPTION="${ARGS[*]:-$EXPLICIT_NAME}"
if [[ -z "$FEATURE_DESCRIPTION" ]]; then
    echo "Usage: $0 [--json] [--short-name <name>] [--number N] <feature_description>" >&2
    exit 1
fi

# Mutual exclusivity check: --phase and --subfolder cannot be combined
if [[ "$PHASE_MODE" = true ]] && [[ "$SUBFOLDER_MODE" = true ]]; then
    echo "Error: --phase and --subfolder are mutually exclusive" >&2
    exit 1
fi

# --parent/--phase-parent are only valid in phase mode
if [[ -n "$PHASE_PARENT" ]] && [[ "$PHASE_MODE" != true ]]; then
    echo "Error: --parent and --phase-parent can only be used with --phase" >&2
    exit 1
fi

# ───────────────────────────────────────────────────────────────
# 1. HELPER FUNCTIONS (shared functions sourced from lib/)
# ───────────────────────────────────────────────────────────────

slugify_token() {
    local input="$1"
    echo "$input" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}

escape_template_value() {
    local value="$1"
    value="${value//\\/\\\\}"
    value="${value//\"/\\\"}"
    printf '%s' "$value"
}

# The core templates ship placeholder phrases that name no topic, so new packets
# may not be found by what they are about. Replace only each exact trigger block
# with a phrase that includes the packet slug and document kind.
seed_template_document() {
    local file_path="$1"
    local slug_phrase="$2"
    local suffix="$3"
    shift 3
    [[ -f "$file_path" ]] || return 0

    local phrase
    for phrase in "$@"; do
        if ! grep -qF "  - \"$phrase\"" "$file_path"; then
            return 0
        fi
    done

    local template_default_block
    printf -v template_default_block '  - "%s"\n' "$@"
    local replacement="  - \"${slug_phrase} ${suffix}\""
    TRIGGER_DEFAULT_BLOCK="$template_default_block" TRIGGER_REPLACEMENT="$replacement" perl -0pi -e '
        my $block = qq{$ENV{TRIGGER_DEFAULT_BLOCK}};
        s/\Q$block\E/$ENV{TRIGGER_REPLACEMENT}\n/;
    ' "$file_path"
}

replace_template_default_trigger_phrases() {
    local folder_path="$1"
    local packet_name="$2"
    local description="$3"
    local spec_file="$folder_path/spec.md"
    local acceptance_criteria_file="$folder_path/acceptance-criteria.md"
    local plan_file="$folder_path/plan.md"
    local tasks_file="$folder_path/tasks.md"
    local implementation_summary_file="$folder_path/implementation-summary.md"
    local -a template_default_phrases=(
        "feature specification"
        "problem statement"
        "requirements and scope"
        "success criteria"
    )
    local -a ac_template_default_phrases=(
        "acceptance criteria"
        "closure gate"
        "ac traceability"
        "waiver adr"
    )
    local -a plan_template_default_phrases=(
        "implementation plan"
        "technical approach"
        "architecture decisions"
        "testing strategy"
    )
    local -a tasks_template_default_phrases=(
        "task breakdown"
        "implementation tasks"
        "verification checklist"
        "task dependencies"
    )
    local -a implementation_summary_template_default_phrases=(
        "implementation summary"
        "what shipped"
        "validation evidence"
        "continuation notes"
    )
    local -a decision_record_template_default_phrases=(
        "decision record"
        "architecture decision"
        "decision rationale"
    )
    local -a phase_parent_spec_template_default_phrases=(
        "[Trigger phrase 1]"
        "[Trigger phrase 2]"
    )
    local -a review_spec_template_default_phrases=(
        "review record"
        "review report"
        "audit findings"
    )
    local -a research_spec_template_default_phrases=(
        "research record"
        "research question"
        "research findings"
        "investigation notes"
    )
    local -a resource_map_template_default_phrases=(
        "resource map"
        "path catalog"
        "files touched"
        "paths analyzed"
        "paths updated"
        "paths created"
    )
    local -a handover_template_default_phrases=(
        "session handover"
        "continuation context"
        "resume prompt"
        "open threads"
    )
    local -a debug_delegation_template_default_phrases=(
        "debug delegation"
        "debug delegation report"
        "delegated debugging"
    )
    local -a research_template_default_phrases=(
        "research findings"
        "evidence and citations"
        "open questions"
        "research synthesis"
    )
    local -a before_after_template_default_phrases=(
        "before after"
        "change comparison"
        "change record"
        "migration comparison"
    )
    local -a timeline_template_default_phrases=(
        "packet timeline"
        "event chronology"
        "event history"
        "milestone dates"
    )
    local -a roadmap_template_default_phrases=(
        "roadmap plan"
        "forward plan"
        "now next later"
        "strategic milestones"
    )
    local -a review_report_template_default_phrases=(
        "review report"
        "review findings"
        "remediation workstreams"
        "review verdict"
    )
    local -a goal_template_default_phrases=(
        "packet goal"
        "durable directive"
        "completion criteria"
        "goal binding"
    )

    # A seeded phrase that ends on a function word reads as a fragment, so the
    # shared stop list trims the trailing words. The cleanup tool carries the
    # same list, and a test pins the two together.
    local -a description_stop_words=(
        a an the and or but nor of to in on at by for from with into onto via per
        than that this these those which who whom whose what when where while if
        then so as is are was were be been being it its not no also both each
    )
    local phrase
    local slug_phrase="${packet_name#[0-9][0-9][0-9]-}"
    slug_phrase="${slug_phrase//-/ }"

    if [[ -f "$spec_file" ]]; then
        if grep -qF 'SPECKIT_TEMPLATE_SOURCE: phase-parent-spec' "$spec_file"; then
            seed_template_document "$spec_file" "$slug_phrase" "phase parent spec" "${phase_parent_spec_template_default_phrases[@]}"
        elif grep -qF 'SPECKIT_TEMPLATE_SOURCE: review-record' "$spec_file"; then
            seed_template_document "$spec_file" "$slug_phrase" "review spec" "${review_spec_template_default_phrases[@]}"
        elif grep -qF 'SPECKIT_TEMPLATE_SOURCE: research-record' "$spec_file"; then
            seed_template_document "$spec_file" "$slug_phrase" "research spec" "${research_spec_template_default_phrases[@]}"
        fi

        local spec_has_default_block=true
        for phrase in "${template_default_phrases[@]}"; do
            if ! grep -qF "  - \"$phrase\"" "$spec_file"; then
                spec_has_default_block=false
                break
            fi
        done

        if [[ "$spec_has_default_block" == true ]]; then
            local template_default_block
            printf -v template_default_block '  - "%s"\n' "${template_default_phrases[@]}"

            local description_phrase
            description_phrase="$(printf '%s' "$description" \
                | tr '[:upper:]' '[:lower:]' \
                | tr -c 'a-z0-9' ' ' \
                | awk '{ for (i = 1; i <= NF && i <= 8; i++) printf "%s%s", (i > 1 ? " " : ""), $i }')"
            # Drop trailing function words so the seeded phrase reads as a topic.
            local last_word
            local stop_word
            local last_word_is_stop
            while [[ -n "$description_phrase" ]]; do
                last_word="${description_phrase##* }"
                last_word_is_stop=false
                for stop_word in "${description_stop_words[@]}"; do
                    if [[ "$last_word" == "$stop_word" ]]; then
                        last_word_is_stop=true
                        break
                    fi
                done
                if [[ "$last_word_is_stop" != true ]]; then
                    break
                fi
                if [[ "$description_phrase" == "$last_word" ]]; then
                    description_phrase=""
                else
                    description_phrase="${description_phrase% *}"
                fi
            done
            if [[ -z "$description_phrase" || "$description_phrase" == "$slug_phrase" ]]; then
                description_phrase=""
            fi

            local replacement="  - \"${slug_phrase}\""
            if [[ -n "$description_phrase" ]]; then
                replacement="${replacement}"$'\n'"  - \"${description_phrase}\""
            fi

            TRIGGER_DEFAULT_BLOCK="$template_default_block" TRIGGER_REPLACEMENT="$replacement" perl -0pi -e '
                my $block = qq{$ENV{TRIGGER_DEFAULT_BLOCK}};
                s/\Q$block\E/$ENV{TRIGGER_REPLACEMENT}\n/;
            ' "$spec_file"
        fi
    fi

    if [[ -f "$acceptance_criteria_file" ]]; then
        local ac_has_default_block=true
        for phrase in "${ac_template_default_phrases[@]}"; do
            if ! grep -qF "  - \"$phrase\"" "$acceptance_criteria_file"; then
                ac_has_default_block=false
                break
            fi
        done

        if [[ "$ac_has_default_block" == true ]]; then
            local ac_template_default_block
            printf -v ac_template_default_block '  - "%s"\n' "${ac_template_default_phrases[@]}"
            local ac_replacement="  - \"${slug_phrase} acceptance criteria\""

            TRIGGER_DEFAULT_BLOCK="$ac_template_default_block" TRIGGER_REPLACEMENT="$ac_replacement" perl -0pi -e '
                my $block = qq{$ENV{TRIGGER_DEFAULT_BLOCK}};
                s/\Q$block\E/$ENV{TRIGGER_REPLACEMENT}\n/;
            ' "$acceptance_criteria_file"
        fi
    fi

    if [[ -f "$plan_file" ]]; then
        local plan_has_default_block=true
        for phrase in "${plan_template_default_phrases[@]}"; do
            if ! grep -qF "  - \"$phrase\"" "$plan_file"; then
                plan_has_default_block=false
                break
            fi
        done

        if [[ "$plan_has_default_block" == true ]]; then
            local plan_template_default_block
            printf -v plan_template_default_block '  - "%s"\n' "${plan_template_default_phrases[@]}"
            local plan_replacement="  - \"${slug_phrase} plan\""

            TRIGGER_DEFAULT_BLOCK="$plan_template_default_block" TRIGGER_REPLACEMENT="$plan_replacement" perl -0pi -e '
                my $block = qq{$ENV{TRIGGER_DEFAULT_BLOCK}};
                s/\Q$block\E/$ENV{TRIGGER_REPLACEMENT}\n/;
            ' "$plan_file"
        fi
    fi

    if [[ -f "$tasks_file" ]]; then
        local tasks_has_default_block=true
        for phrase in "${tasks_template_default_phrases[@]}"; do
            if ! grep -qF "  - \"$phrase\"" "$tasks_file"; then
                tasks_has_default_block=false
                break
            fi
        done

        if [[ "$tasks_has_default_block" == true ]]; then
            local tasks_template_default_block
            printf -v tasks_template_default_block '  - "%s"\n' "${tasks_template_default_phrases[@]}"
            local tasks_replacement="  - \"${slug_phrase} tasks\""

            TRIGGER_DEFAULT_BLOCK="$tasks_template_default_block" TRIGGER_REPLACEMENT="$tasks_replacement" perl -0pi -e '
                my $block = qq{$ENV{TRIGGER_DEFAULT_BLOCK}};
                s/\Q$block\E/$ENV{TRIGGER_REPLACEMENT}\n/;
            ' "$tasks_file"
        fi
    fi

    if [[ -f "$implementation_summary_file" ]]; then
        local implementation_summary_has_default_block=true
        for phrase in "${implementation_summary_template_default_phrases[@]}"; do
            if ! grep -qF "  - \"$phrase\"" "$implementation_summary_file"; then
                implementation_summary_has_default_block=false
                break
            fi
        done

        if [[ "$implementation_summary_has_default_block" == true ]]; then
            local implementation_summary_template_default_block
            printf -v implementation_summary_template_default_block '  - "%s"\n' "${implementation_summary_template_default_phrases[@]}"
            local implementation_summary_replacement="  - \"${slug_phrase} implementation summary\""

            TRIGGER_DEFAULT_BLOCK="$implementation_summary_template_default_block" TRIGGER_REPLACEMENT="$implementation_summary_replacement" perl -0pi -e '
                my $block = qq{$ENV{TRIGGER_DEFAULT_BLOCK}};
                s/\Q$block\E/$ENV{TRIGGER_REPLACEMENT}\n/;
            ' "$implementation_summary_file"
        fi
    fi

    seed_template_document "$folder_path/decision-record.md" "$slug_phrase" "decision record" "${decision_record_template_default_phrases[@]}"
    seed_template_document "$folder_path/resource-map.md" "$slug_phrase" "resource map" "${resource_map_template_default_phrases[@]}"
    seed_template_document "$folder_path/handover.md" "$slug_phrase" "handover" "${handover_template_default_phrases[@]}"
    seed_template_document "$folder_path/debug-delegation.md" "$slug_phrase" "debug delegation" "${debug_delegation_template_default_phrases[@]}"
    seed_template_document "$folder_path/research/research.md" "$slug_phrase" "research" "${research_template_default_phrases[@]}"
    seed_template_document "$folder_path/before-after.md" "$slug_phrase" "before after" "${before_after_template_default_phrases[@]}"
    seed_template_document "$folder_path/timeline.md" "$slug_phrase" "timeline" "${timeline_template_default_phrases[@]}"
    seed_template_document "$folder_path/roadmap.md" "$slug_phrase" "roadmap" "${roadmap_template_default_phrases[@]}"
    seed_template_document "$folder_path/review/review-report.md" "$slug_phrase" "review report" "${review_report_template_default_phrases[@]}"
    seed_template_document "$folder_path/goal.md" "$slug_phrase" "goal" "${goal_template_default_phrases[@]}"

    return 0
}

requested_lazy_addon_docs() {
    local contract_json="$1"
    node - "$contract_json" <<'NODE'
const contract = JSON.parse(process.argv[2]);
const requested = ['before-after.md', 'timeline.md', 'roadmap.md', 'decision-record.md'];
const lazyDocs = contract.lazyAddonDocs || [];
const invalid = requested.filter((doc) => !lazyDocs.includes(doc));
if (invalid.length > 0) {
  console.error(`Internal template contract omitted lazy documents: ${invalid.join(', ')}`);
  process.exit(3);
}
process.stdout.write(`${requested.join('\n')}\n`);
NODE
}

contract_lists_optional_addon() {
    local contract_json="$1"
    local doc_name="$2"
    node - "$contract_json" "$doc_name" <<'NODE'
const contract = JSON.parse(process.argv[2]);
const docs = contract.optionalAddonDocs || [];
process.exit(docs.includes(process.argv[3]) ? 0 : 1);
NODE
}

requested_lazy_addon_doc() {
    local contract_json="$1"
    local doc_name="$2"
    node - "$contract_json" "$doc_name" <<'NODE'
const contract = JSON.parse(process.argv[2]);
const lazyDocs = contract.lazyAddonDocs || [];
if (!lazyDocs.includes(process.argv[3])) {
  console.error(`Internal template contract omitted lazy document: ${process.argv[3]}`);
  process.exit(3);
}
process.stdout.write(`${process.argv[3]}\n`);
NODE
}

scaffold_lifecycle_required_docs() {
    local contract_json="$1"
    node - "$contract_json" <<'NODE'
const contract = JSON.parse(process.argv[2]);
const docs = contract.lifecycleRequiredDocs?.afterImplementationStarts || [];
const docRe = /^(?:[A-Za-z0-9][A-Za-z0-9_-]*\/)?[A-Za-z0-9][A-Za-z0-9_-]*\.md$/u;
for (const doc of docs) {
  if (typeof doc !== 'string' || !docRe.test(doc) || doc.includes('..')) {
    console.error('Internal template contract included an invalid lifecycle document name');
    process.exit(3);
  }
  process.stdout.write(`${doc}\n`);
}
NODE
}

scaffold_contract_docs() {
    local contract_json="$1"
    local required_docs
    if ! required_docs="$(level_contract_docs_from_json "$contract_json")"; then
        return 1
    fi
    printf '%s\n' "$required_docs"
    scaffold_lifecycle_required_docs "$contract_json"
    # The closure gate needs this document at every level whose contract lists
    # it as an optional add-on. Without it the scaffolder would emit packets that
    # fail validation the moment they are created.
    if contract_lists_optional_addon "$contract_json" "acceptance-criteria.md"; then
        printf '%s\n' "acceptance-criteria.md"
    fi
    if $WITH_LAZY_ADDONS; then
        requested_lazy_addon_docs "$contract_json"
    fi
    if $WITH_GOAL; then
        requested_lazy_addon_doc "$contract_json" "goal.md"
    fi
}

create_versioned_subfolder() {
    local base_folder="$1"
    local topic="$2"
    
    # Validate base folder exists
    if [[ ! -d "$base_folder" ]]; then
        echo "Error: Base folder does not exist: $base_folder" >&2
        exit 1
    fi
    
    # Find next version number by scanning existing sub-folders
    local max_version=0
    for dir in "$base_folder"/[0-9][0-9][0-9]-*/; do
        if [[ -d "$dir" ]]; then
            local dirname="${dir%/}"      # Remove trailing slash
            dirname="${dirname##*/}"       # Get basename
            local num="${dirname%%-*}"     # Extract number prefix
            num=$((10#$num))               # Remove leading zeros (force base-10)
            if [[ $num -gt $max_version ]]; then
                max_version=$num
            fi
        fi
    done
    
    local next_version=$((max_version + 1))
    local version_str
    version_str=$(printf "%03d" "$next_version")
    local subfolder_name="${version_str}-${topic}"
    local subfolder_path="$base_folder/$subfolder_name"
    
    # Create sub-folder scratch/ workspace.
    mkdir -p "$subfolder_path/scratch"
    touch "$subfolder_path/scratch/.gitkeep"
    create_graph_metadata_file "$subfolder_path" "${FEATURE_DESCRIPTION:-$topic}" "planned"
    
    echo "$subfolder_path"
}

# Resolve an existing directory to a canonical physical path.
resolve_existing_dir() {
    local dir_path="$1"
    if [[ ! -d "$dir_path" ]]; then
        return 1
    fi
    (cd "$dir_path" >/dev/null 2>&1 && pwd -P)
}

create_graph_metadata_file() {
    local folder_path="$1"
    local summary="${2:-}"
    local status="${3:-planned}"
    local graph_path="$folder_path/graph-metadata.json"

    if [[ -f "$graph_path" ]]; then
        return 0
    fi

    local relative_spec="${folder_path#$SPECS_DIR/}"
    if [[ "$relative_spec" == "$folder_path" ]]; then
        relative_spec="${folder_path#${REPO_ROOT}/.opencode/specs/}"
    fi
    relative_spec="${relative_spec#./}"

    local parent_name
    parent_name="$(basename "$(dirname "$folder_path")")"
    local parent_id="null"
    if [[ "$parent_name" =~ ^[0-9]{3}(?:[-_].+)?$ ]]; then
        local parent_rel
        parent_rel="$(dirname "$relative_spec")"
        parent_id="\"${parent_rel}\""
    fi

    local now_iso
    now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    local summary_text="$summary"
    if [[ -z "$summary_text" ]]; then
        summary_text="${FEATURE_DESCRIPTION:-Spec folder graph metadata scaffold}"
    fi
    summary_text="${summary_text//\\/\\\\}"
    summary_text="${summary_text//\"/\\\"}"
    summary_text="${summary_text//$'\n'/\\n}"
    summary_text="${summary_text//$'\r'/\\r}"
    summary_text="${summary_text//$'\t'/\\t}"

    local source_docs_json='["spec.md","plan.md","tasks.md"]'
    local key_files_json='["spec.md","plan.md","tasks.md"]'
    if [[ -f "$folder_path/spec.md" && ! -f "$folder_path/plan.md" && ! -f "$folder_path/tasks.md" ]]; then
        source_docs_json='["spec.md"]'
        key_files_json='["spec.md"]'
    elif [[ -f "$folder_path/decision-record.md" ]]; then
        source_docs_json='["spec.md","plan.md","tasks.md","decision-record.md"]'
        key_files_json='["spec.md","plan.md","tasks.md","decision-record.md"]'
    fi

    cat > "$graph_path" <<EOF
{
  "schema_version": 1,
  "packet_id": "${relative_spec}",
  "spec_folder": "${relative_spec}",
  "parent_id": ${parent_id},
  "children_ids": [],
  "manual": {
    "depends_on": [],
    "supersedes": [],
    "related_to": []
  },
    "derived": {
    "trigger_phrases": [],
    "key_topics": [],
    "importance_tier": "important",
    "status": "${status}",
    "key_files": ${key_files_json},
    "entities": [],
    "causal_summary": "${summary_text}",
    "created_at": "${now_iso}",
    "last_save_at": "${now_iso}",
    "save_lineage": "graph_only",
    "last_accessed_at": null,
    "source_docs": ${source_docs_json}
  }
}
EOF
}

ensure_template_source_near_top() {
    local file_path="$1"

    local marker
    marker=$(grep -m1 "SPECKIT_TEMPLATE_SOURCE:" "$file_path" 2>/dev/null || true)
    [[ -z "$marker" ]] && return 0
    marker="${marker#<!-- }"
    marker="${marker% -->}"
    marker="${marker#\# }"

    marker="<!-- ${marker} -->"

    local tmp_file
    tmp_file=$(mktemp "${file_path}.tmp.XXXXXX")
    awk -v marker="$marker" '
        /SPECKIT_TEMPLATE_SOURCE:/ {
            next
        }
        $0 == "---" {
            print
            dash_count += 1
            if (!inserted && dash_count == 2) {
                print marker
                inserted = 1
            }
            next
        }
        { print }
    ' "$file_path" > "$tmp_file"
    mv "$tmp_file" "$file_path"
}

finalize_scaffold_templates() {
    local folder_path="$1"
    local packet_pointer="$2"
    local feature_name="$3"
    local doc_level="${4:-$DOC_LEVEL}"
    local safe_packet_pointer
    safe_packet_pointer="$(slugify_token "$packet_pointer")"
    [[ -n "$safe_packet_pointer" ]] || safe_packet_pointer="$packet_pointer"
    local escaped_feature_name
    escaped_feature_name="$(escape_template_value "$feature_name")"
    local today now_iso
    today="$(date -u +"%Y-%m-%d")"
    now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

    # Contract documents may sit one directory down (research/research.md,
    # review/review-report.md); they carry the same placeholders as root docs.
    local md_file
    for md_file in "$folder_path"/*.md "$folder_path"/*/*.md; do
        [[ -f "$md_file" ]] || continue
        [[ "$md_file" == "$folder_path/scratch/"* ]] && continue
        PACKET_POINTER="scaffold/$safe_packet_pointer" RAW_PACKET_POINTER="$packet_pointer" FEATURE_NAME="$escaped_feature_name" TODAY="$today" NOW_ISO="$now_iso" DOC_LEVEL="$doc_level" perl -0pi -e '
            s{\[NAME\]}{$ENV{FEATURE_NAME}}g;
            s{\[YOUR_VALUE_HERE: feature-name\]}{$ENV{FEATURE_NAME}}g;
            s{\[YOUR_VALUE_HERE: YYYY-MM-DD\]}{$ENV{TODAY}}g;
            s/\[###-feature-name\]/$ENV{PACKET_POINTER}/g;
            s/000-feature-name/$ENV{PACKET_POINTER}/g;
            s/packet_pointer: "[^"]+"/packet_pointer: "$ENV{PACKET_POINTER}"/g;
            s/system-spec-kit\/templates\/level-1/$ENV{PACKET_POINTER}/g;
            s/system-spec-kit\/templates\/level-2/$ENV{PACKET_POINTER}/g;
            s/system-spec-kit\/templates\/level-3\+/$ENV{PACKET_POINTER}/g;
            s/system-spec-kit\/templates\/level-3/$ENV{PACKET_POINTER}/g;
            s/\| \*\*Spec Folder\*\* \| scaffold\/([^|]+) \|/| **Spec Folder** | $ENV{RAW_PACKET_POINTER} |/g;
            s/\| \*\*Level\*\* \| \[1\/2\/3\/3\+\] \|/| **Level** | $ENV{DOC_LEVEL} |/g;
            s/\[YYYY-MM-DD\]/$ENV{TODAY}/g;
            s/last_updated_at: "[^"]+"/last_updated_at: "$ENV{NOW_ISO}"/g;
            s{\[YOUR_VALUE_HERE: packet-id\]}{$ENV{RAW_PACKET_POINTER}}g;
            s/\[Feature Name\]/$ENV{FEATURE_NAME}/g;
            s/ \[template:[^\]]+\]//g;
            s/session_id: "template-session"/"session_id: \"scaffold-$ENV{RAW_PACKET_POINTER}\""/eg;
        ' "$md_file"
        ensure_template_source_near_top "$md_file"
    done
}

# A checkout without a build or an install lacks the generators behind
# description.json and the derived graph metadata. The scaffold still succeeds
# without them, so each skip names the missing file and how to get it.
report_missing_generator() {
    local skipped="$1"
    local missing="$2"
    local remedy="$3"
    local target="${4:-}"
    echo "  Warning: ${skipped} skipped${target:+ for ${target}}: ${missing} is missing. ${remedy}" >&2
}

readonly BUILD_REMEDY="Run npm run build under runtime to compile it."
readonly INSTALL_REMEDY="Run npm install at the skill root, then repair-derived.cjs --folder <packet> --apply."

# Derive the graph metadata from the documents that were just written, rather
# than leaving the stub the scaffolder guessed. A scaffold that disagrees with
# its own deriver fails validation the moment it exists, which teaches an author
# that the gate is broken before they have written a line. A missing tool or a
# failed derivation warns and leaves the scaffold in place.
backfill_graph_metadata() {
    local backfill_ts="${SCRIPT_DIR}/../graph/backfill-graph-metadata.ts"
    local tsx_loader="${SCRIPT_DIR}/../../../node_modules/tsx/dist/loader.mjs"
    if [[ ! -f "$tsx_loader" ]]; then
        report_missing_generator "graph metadata derivation" "$tsx_loader" "$INSTALL_REMEDY"
        return 0
    fi
    if [[ ! -f "$backfill_ts" ]]; then
        report_missing_generator "graph metadata derivation" "$backfill_ts" "Restore it from the repository."
        return 0
    fi
    local folder_path
    for folder_path in "$@"; do
        [[ -n "$folder_path" ]] || continue
        node --import "$tsx_loader" "$backfill_ts" "$folder_path" >/dev/null 2>&1 \
            || echo "  Warning: graph metadata derivation skipped for ${folder_path##*/}" >&2
    done
}

# A track root declares its packets in children_ids, and the pre-push gate
# blocks a commit whose list disagrees with the packets it holds. Declaring the
# new packet here keeps the two in step from the moment the packet exists. A
# track with no graph-metadata.json declares nothing, so there is nothing to do.
refresh_track_root() {
    local specs_root="$1"
    local track="$2"
    local refresh_script="$SCRIPT_DIR/refresh-track-roots.mjs"
    [[ -n "$track" && "$track" != */* && -f "$specs_root/$track/graph-metadata.json" ]] || return 0
    if [[ ! -f "$refresh_script" ]]; then
        report_missing_generator "track root refresh" "$refresh_script" "Restore it from the repository."
        return 0
    fi
    # The writer reports on stdout; stdout belongs to the --json payload.
    if ! node "$refresh_script" --specs "$specs_root" --track "$track" --apply >&2; then
        echo "  Warning: ${track}/graph-metadata.json was not refreshed; its children_ids may not list the new packet. Rerun refresh-track-roots.mjs --track ${track} --apply." >&2
    fi
}

# The presence rule counts a phase parent's description.json as required, so a
# parent that cannot get one stops here, loudly, instead of passing and failing
# validation the moment it exists. Both --phase and --level phase-parent call it.
require_parent_description_generator() {
    local desc_script="$1"
    local folder="$2"
    if [[ ! -f "$desc_script" ]]; then
        echo "Error: phase parent needs the compiled description generator ($desc_script); run npm run build under runtime, then rerun. The folder $folder is partially scaffolded." >&2
        exit 1
    fi
}

scaffold_phase_parent_validation_child() {
    local parent_path="$1"
    local feature_name="$2"
    local child_name="001-validation-phase-PROVIDE-DESCRIPTIVE-SLUG"
    echo "[speckit] Warning: scaffolding validation child with placeholder name '$child_name'. Replace via --phase-names <literal-slug> for production use." >&2
    local child_path="$parent_path/$child_name"
    local child_contract template_name

    local parent_spec="$parent_path/spec.md"
    if [[ -f "$parent_spec" ]] && ! grep -q '^_memory:' "$parent_spec" 2>/dev/null; then
        local parent_base parent_tmp now_iso
        parent_base="$(basename "$parent_path")"
        now_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
        parent_tmp="$(mktemp "${parent_spec}.tmp.XXXXXX")"
        awk -v pointer="scaffold/${parent_base}" -v session_pointer="$parent_base" -v now="$now_iso" '
            BEGIN { fence = 0 }
            $0 == "---" {
                fence++
                if (fence == 2 && !inserted) {
                    print "_memory:"
                    print "  continuity:"
                    print "    packet_pointer: \"" pointer "\""
                    print "    last_updated_at: \"" now "\""
                    print "    last_updated_by: \"scaffold\""
                    print "    recent_action: \"Initialize phase parent\""
                    print "    next_safe_action: \"Replace scaffold content\""
                    print "    blockers: []"
                    print "    key_files: []"
                    print "    session_dedup:"
                    print "      fingerprint: \"sha256:0000000000000000000000000000000000000000000000000000000000000000\""
                    print "      session_id: \"scaffold-" session_pointer "\""
                    print "      parent_session_id: null"
                    print "    completion_pct: 0"
                    print "    open_questions: []"
                    print "    answered_questions: []"
                    inserted = 1
                }
            }
            { print }
        ' "$parent_spec" > "$parent_tmp"
        mv "$parent_tmp" "$parent_spec"
    fi

    if [[ -f "$parent_spec" ]] && ! grep -q '^## .*REQUIREMENTS' "$parent_spec" 2>/dev/null; then
        cat >> "$parent_spec" <<EOF

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks child phase folders for ${feature_name}.
<!-- /ANCHOR:requirements -->
EOF
    fi

    mkdir -p "$child_path" "$child_path/scratch"
    touch "$child_path/scratch/.gitkeep"

    local child_level
    child_level="$(child_doc_level)"
    child_contract="$(resolve_level_contract "$child_level")"
    if ! child_contract_docs="$(scaffold_contract_docs "$child_contract")"; then
        echo "Error: failed to resolve Level 1 template documents" >&2
        exit 1
    fi
    while IFS= read -r template_name; do
        [[ -z "$template_name" ]] && continue
        if ! copy_template "$template_name" "$child_path" "$child_level" "$TEMPLATES_BASE" >/dev/null; then
            echo "Error: copy_template failed for $template_name (level $child_level)" >&2
            exit 1
        fi
    done <<< "$child_contract_docs"

    finalize_scaffold_templates "$child_path" "$child_name" "Phase one for $feature_name" "1"
    replace_template_default_trigger_phrases "$child_path" "$child_name" "Phase one for $feature_name"
    if [[ -f "$child_path/spec.md" ]] && ! grep -q '\.\./spec\.md' "$child_path/spec.md" 2>/dev/null; then
        printf '\n<!-- Parent Spec: ../spec.md -->\n' >> "$child_path/spec.md"
    fi

    create_graph_metadata_file "$child_path" "Phase one for $feature_name" "planned"

    local desc_script
    desc_script="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
    if [[ -f "$desc_script" ]]; then
        node "$desc_script" "$child_path" "$parent_path" \
            --description "Phase one for $feature_name" --level "$child_level" >/dev/null 2>&1 \
            || echo "  Warning: description.json generation failed for $child_name" >&2
    fi

    CREATED_FILES+=("$child_name/")
}

# Containment check with path boundary semantics.
is_path_within() {
    local candidate="$1"
    local base="$2"
    [[ "$candidate" == "$base" || "$candidate" == "$base"/* ]]
}

validate_spec_folder_basename() {
    local folder_name="$1"
    if [[ ! "$folder_name" =~ ^[0-9]{3}-[A-Za-z0-9._-]+$ ]]; then
        echo "Error: Spec folder must match NNN-name pattern (got: $folder_name)" >&2
        exit 1
    fi
}

# Resolve and validate a spec folder path against approved roots.
resolve_and_validate_spec_path() {
    local raw_path="$1"
    local label="${2:-spec folder}"
    local skip_basename_validation="${3:-false}"
    local candidate resolved

    if [[ "$raw_path" = /* ]]; then
        candidate="$raw_path"
    else
        candidate="$REPO_ROOT/$raw_path"
    fi

    if [[ ! -d "$candidate" ]]; then
        echo "Error: ${label} does not exist: $raw_path" >&2
        exit 1
    fi

    if ! resolved="$(resolve_existing_dir "$candidate")"; then
        echo "Error: Unable to resolve ${label}: $raw_path" >&2
        exit 1
    fi

    local allowed found=false
    for allowed in "$REPO_ROOT/specs" "$REPO_ROOT/.opencode/specs"; do
        if [[ -d "$allowed" ]]; then
            local allowed_resolved
            if allowed_resolved="$(resolve_existing_dir "$allowed")"; then
                if is_path_within "$resolved" "$allowed_resolved"; then
                    found=true
                    break
                fi
            fi
        fi
    done

    if [[ "$found" != "true" ]]; then
        echo "Error: ${label} must be under specs/ or .opencode/specs/" >&2
        echo "Resolved path: $resolved" >&2
        exit 1
    fi

    if [[ "$skip_basename_validation" != "true" ]]; then
        validate_spec_folder_basename "$(basename "$resolved")"
    fi
    printf '%s\n' "$resolved"
}

reject_explicit_path_outside_repo() {
    local raw_path="$1"
    cat >&2 <<EOF
Error: --path '$raw_path' would write outside the repository.
Use a path relative to the repo root, or an absolute path under /tmp/ for testing.
EOF
    exit 1
}

# Resolve an explicit create target before mkdir. Repo-relative targets must stay
# inside the repository; /tmp is allowed for test fixtures.
resolve_and_validate_create_target() {
    local raw_path="$1"
    local candidate parent resolved_parent resolved_target tmp_resolved

    if [[ "$raw_path" == *"/.."* || "$raw_path" == "../"* || "$raw_path" == ".." || "$raw_path" == *"/../"* ]]; then
        reject_explicit_path_outside_repo "$raw_path"
    fi

    if [[ "$raw_path" = /* ]]; then
        candidate="$raw_path"
    else
        candidate="$REPO_ROOT/$raw_path"
    fi

    parent="$(dirname "$candidate")"
    if [[ ! -d "$parent" ]]; then
        echo "Error: --path parent directory does not exist: $parent" >&2
        exit 1
    fi

    if ! resolved_parent="$(cd "$parent" >/dev/null 2>&1 && pwd -P)"; then
        echo "Error: Unable to resolve --path parent directory: $parent" >&2
        exit 1
    fi
    resolved_target="$resolved_parent/$(basename "$candidate")"

    for tmp_resolved in /tmp "${TMPDIR:-}"; do
        [[ -n "$tmp_resolved" ]] || continue
        if tmp_resolved="$(cd "$tmp_resolved" >/dev/null 2>&1 && pwd -P)" && is_path_within "$resolved_target" "$tmp_resolved"; then
            printf '%s\n' "$resolved_target"
            return 0
        fi
    done

    if ! is_path_within "$resolved_target" "$REPO_ROOT"; then
        reject_explicit_path_outside_repo "$raw_path"
    fi

    printf '%s\n' "$resolved_target"
}

# ───────────────────────────────────────────────────────────────
# 2. REPOSITORY DETECTION


# ───────────────────────────────────────────────────────────────

# Note: SCRIPT_DIR already set above during library sourcing

if git rev-parse --show-toplevel >/dev/null 2>&1; then
    REPO_ROOT=$(git rev-parse --show-toplevel)
    HAS_GIT=true
else
    REPO_ROOT="$(find_repo_root "$SCRIPT_DIR")"
    if [[ -z "$REPO_ROOT" ]]; then
        echo "Error: Could not determine repository root. Please run this script from within the repository." >&2
        exit 1
    fi
    HAS_GIT=false
fi

cd "$REPO_ROOT"

# New packets always go to the canonical specs/ root. The legacy .opencode/specs
# link is gone, so writing there leaves a packet in a tree nothing reads.
SPECS_DIR="$REPO_ROOT/specs"
if [[ -n "$TRACK" ]]; then
    SPECS_DIR="$SPECS_DIR/$TRACK"
fi
mkdir -p "$SPECS_DIR"

# ───────────────────────────────────────────────────────────────
# 3. SUBFOLDER MODE


# ───────────────────────────────────────────────────────────────

if [[ "$SUBFOLDER_MODE" = true ]]; then
    RESOLVED_BASE="$(resolve_and_validate_spec_path "$SUBFOLDER_BASE" "Base folder")"
    
    # Determine topic name
    if [[ -n "$SUBFOLDER_TOPIC" ]]; then
        TOPIC_NAME=$(slugify_token "$SUBFOLDER_TOPIC")
    else
        # Generate from feature description
        TOPIC_NAME=$(slugify_token "$FEATURE_DESCRIPTION")
    fi
    if [[ -z "$TOPIC_NAME" ]]; then
        echo "Error: --topic must contain at least one alphanumeric character after slugification" >&2
        exit 1
    fi

    SUBFOLDER_PATH=$(create_versioned_subfolder "$RESOLVED_BASE" "$TOPIC_NAME")
    SUBFOLDER_NAME=$(basename "$SUBFOLDER_PATH")
    
    # Copy templates based on documentation level from the resolver contract
    TEMPLATES_BASE="${SPECKIT_TEMPLATES_BASE:-$REPO_ROOT/.skilled/skills/system-spec-kit/templates}"
    LEVEL_CONTRACT="$(resolve_level_contract "$DOC_LEVEL")"
    CREATED_FILES=()

    if ! level_contract_docs="$(scaffold_contract_docs "$LEVEL_CONTRACT")"; then
        echo "Error: failed to resolve Level $DOC_LEVEL template documents" >&2
        exit 1
    fi
    while IFS= read -r template_name; do
        [[ -z "$template_name" ]] && continue
        if ! created_path=$(copy_template "$template_name" "$SUBFOLDER_PATH" "$DOC_LEVEL" "$TEMPLATES_BASE"); then
            echo "Error: copy_template failed for $template_name (level $DOC_LEVEL)" >&2
            exit 1
        fi
        CREATED_FILES+=("$created_path")
    done <<< "$level_contract_docs"
    finalize_scaffold_templates "$SUBFOLDER_PATH" "$SUBFOLDER_NAME" "$FEATURE_DESCRIPTION"
    replace_template_default_trigger_phrases "$SUBFOLDER_PATH" "$SUBFOLDER_NAME" "$FEATURE_DESCRIPTION"

    if $JSON_MODE; then
        files_json=""
        for created_file in "${CREATED_FILES[@]}"; do
            [[ -n "$files_json" ]] && files_json="${files_json},"
            files_json="${files_json}\"$(_json_escape "$created_file")\""
        done
        # P1-03 FIX: Escape JSON values to prevent injection
        printf '{"SUBFOLDER_PATH":"%s","SUBFOLDER_NAME":"%s","BASE_FOLDER":"%s","DOC_LEVEL":"%s","CREATED_FILES":[%s]}\n' \
            "$(_json_escape "$SUBFOLDER_PATH")" "$(_json_escape "$SUBFOLDER_NAME")" "$(_json_escape "$RESOLVED_BASE")" "$DOC_LEVEL" "$files_json"
    else
        echo ""
        echo "───────────────────────────────────────────────────────────────────"
        echo "  SpecKit: Versioned Sub-folder Created Successfully"
        echo "───────────────────────────────────────────────────────────────────"
        echo ""
        echo "  BASE_FOLDER:    $(basename "$RESOLVED_BASE")/"
        echo "  SUBFOLDER:      $SUBFOLDER_NAME/"
        echo "  DOC_LEVEL:      Level $DOC_LEVEL"
        echo "  FULL_PATH:      $SUBFOLDER_PATH"
        echo ""
        echo "  Created Structure:"
        echo "  └── $(basename "$RESOLVED_BASE")/"
        echo "      └── $SUBFOLDER_NAME/"
        for file in "${CREATED_FILES[@]}"; do
            echo "          ├── $file"
        done
        echo "          └── scratch/          (working files; NOT git-ignored)"
        echo "              └── .gitkeep"
        echo ""
        echo "───────────────────────────────────────────────────────────────────"
    fi

    # Full post-create validation is opt-in; it is too expensive for default scaffolds.
    if [[ "${SPECKIT_POST_VALIDATE:-}" == "1" ]]; then
        if ! bash "$SCRIPT_DIR/validate.sh" "$SUBFOLDER_PATH" --quiet; then
            echo "Error: post-create validation failed for $SUBFOLDER_PATH" >&2
            exit 1
        fi
    fi

    exit 0
fi

# ───────────────────────────────────────────────────────────────
# 3b. SHARED: Branch Name Generation & Git Branch Creation
# ───────────────────────────────────────────────────────────────
# A new top-level packet is the cheapest moment to notice a recent sibling that
# already covers the same artifact: joining it, or a series parent, beats a
# standalone packet that needs a retrofit. Phase children and sub-folders never
# reach this function. Everything goes to stderr so a --json payload on stdout
# stays parseable, and no failure here may stop the scaffold.
list_recent_track_packets() {
    [[ -d "$SPECS_DIR" ]] || return 0
    command -v node >/dev/null 2>&1 || return 0
    local specs_label="$SPECS_DIR"
    specs_label="${specs_label#"$REPO_ROOT"/}"
    node -e '
const fs = require("fs");
const path = require("path");
const specsDir = process.argv[1];
const specsLabel = process.argv[2];
const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
const rows = [];
// Packet metadata is untrusted text: without stripping, control characters let a
// stored name or description move the cursor and rewrite what the terminal shows.
const controlChars = /[\u0000-\u001f\u007f-\u009f]/g;
for (const name of fs.readdirSync(specsDir)) {
  if (!/^[0-9]{3}-/.test(name)) continue;
  const folder = path.join(specsDir, name);
  let createdAt;
  let description = "";
  try {
    const metadata = JSON.parse(fs.readFileSync(path.join(folder, "graph-metadata.json"), "utf8"));
    createdAt = metadata && metadata.derived && metadata.derived.created_at;
    const identity = JSON.parse(fs.readFileSync(path.join(folder, "description.json"), "utf8"));
    if (identity && typeof identity.description === "string") description = identity.description;
  } catch {
    continue;
  }
  if (typeof createdAt !== "string" || createdAt === "") continue;
  const timestamp = Date.parse(createdAt);
  if (Number.isNaN(timestamp) || timestamp < cutoff) continue;
  rows.push({ name, timestamp, date: createdAt.slice(0, 10), description: description.replace(/\s+/g, " ").replace(controlChars, "").slice(0, 100) });
}
rows.sort((a, b) => b.timestamp - a.timestamp);
if (rows.length === 0) process.exit(0);
const lines = ["[speckit] Recent packets in " + specsLabel + ", last 14 days:"];
for (const row of rows.slice(0, 10)) lines.push("  " + row.name.replace(controlChars, "") + "  " + row.date + "  " + row.description);
lines.push("[speckit] If the new work is a different change to the same artifact as one of these, join or create a series parent instead of a new packet: references/structure/phase-definitions.md, section 2.");
process.stderr.write(lines.join("\n") + "\n");
' "$SPECS_DIR" "$specs_label" || return 0
}

# Extracted to avoid duplication between phase mode and normal mode.
# Sets: BRANCH_SUFFIX, BRANCH_NUMBER, FEATURE_NUM, BRANCH_NAME
# Creates git branch unless SKIP_BRANCH=true or no git.
resolve_branch_name() {
    list_recent_track_packets
    if [[ -n "$SHORT_NAME" ]]; then
        BRANCH_SUFFIX=$(slugify_token "$SHORT_NAME")
    else
        BRANCH_SUFFIX=$(generate_branch_name "$FEATURE_DESCRIPTION")
    fi

    if [[ -z "$BRANCH_NUMBER" ]]; then
        # Number after the highest packet folder in the root being written to,
        # whatever its name, so two packets in one root never share a number.
        local highest=0
        if [[ -d "$SPECS_DIR" ]]; then
            for dir in "$SPECS_DIR"/*; do
                [[ -d "$dir" ]] || continue
                local dirname
                dirname=$(basename "$dir")
                local number
                number=$(echo "$dirname" | grep -o '^[0-9]\+' || echo "0")
                number=$((10#$number))
                if [[ "$number" -gt "$highest" ]]; then highest=$number; fi
            done
        fi
        # Without a track, a packet's branch shares the root's numbering, so a
        # numbered branch counts too. A track numbers from its folder alone.
        if [[ "$HAS_GIT" = true && -z "$TRACK" ]]; then
            local branch_highest
            branch_highest=$(highest_branch_number)
            if [[ "$branch_highest" -gt "$highest" ]]; then highest=$branch_highest; fi
        fi
        BRANCH_NUMBER=$((highest + 1))
    fi

    FEATURE_NUM=$(printf "%03d" "$((10#$BRANCH_NUMBER))")
    BRANCH_NAME="${FEATURE_NUM}-${BRANCH_SUFFIX}"

    # GitHub enforces 244-byte branch name limit
    local max_branch_length=244
    if [[ ${#BRANCH_NAME} -gt $max_branch_length ]]; then
        local max_suffix_length=$((max_branch_length - 4))
        local truncated_suffix
        truncated_suffix=$(echo "$BRANCH_SUFFIX" | cut -c1-$max_suffix_length | sed 's/-$//')
        >&2 echo "[speckit] Warning: Branch name exceeded GitHub's 244-byte limit"
        >&2 echo "[speckit] Original: $BRANCH_NAME (${#BRANCH_NAME} bytes)"
        BRANCH_NAME="${FEATURE_NUM}-${truncated_suffix}"
        >&2 echo "[speckit] Truncated to: $BRANCH_NAME (${#BRANCH_NAME} bytes)"
    fi
}

create_git_branch() {
    if [[ "$SKIP_BRANCH" = true ]]; then
        >&2 echo "[speckit] Skipping branch creation (--skip-branch)"
    elif [[ "$HAS_GIT" = true ]]; then
        if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME" 2>/dev/null; then
            >&2 echo "[speckit] Warning: Branch '$BRANCH_NAME' already exists, switching to it"
            git checkout "$BRANCH_NAME"
        else
            git checkout -b "$BRANCH_NAME"
        fi
    else
        >&2 echo "[speckit] Warning: Git repository not detected; skipped branch creation for $BRANCH_NAME"
    fi
}

# ───────────────────────────────────────────────────────────────
# 3c. PHASE MODE
# ───────────────────────────────────────────────────────────────

if [[ "$PHASE_MODE" = true ]]; then
    # Phase mode creates: parent spec folder + N child phase folders
    # Parent gets the lean phase-parent trio
    # Each child gets level 1 templates + parent back-reference injection

    TEMPLATES_BASE="${SPECKIT_TEMPLATES_BASE:-$REPO_ROOT/.skilled/skills/system-spec-kit/templates}"
    readonly LEAN_PHASE_PARENT_TEMPLATE="$TEMPLATES_BASE/packet-types/phase-parent.spec.md.tmpl"
    readonly INLINE_GATE_RENDERER="$REPO_ROOT/.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh"

    # Trap for temp file cleanup on error exit
    PHASE_TMP_FILES=()
    PHASE_LOCK_DIR=""
    _phase_cleanup() {
        for _f in "${PHASE_TMP_FILES[@]-}"; do rm -f "$_f"; done
        if [[ -n "$PHASE_LOCK_DIR" && -d "$PHASE_LOCK_DIR" ]]; then
            rm -rf "$PHASE_LOCK_DIR"
        fi
    }
    trap _phase_cleanup EXIT

    acquire_phase_scaffold_lock() {
        local parent_dir="$1"
        local attempts=0
        PHASE_LOCK_DIR="$parent_dir/.speckit-scaffold.lock"
        while ! mkdir "$PHASE_LOCK_DIR" 2>/dev/null; do
            attempts=$((attempts + 1))
            if [[ $attempts -ge 300 ]]; then
                echo "Error: timed out waiting for phase scaffold lock: $PHASE_LOCK_DIR" >&2
                exit 1
            fi
            sleep 0.1
        done
        printf '%s\n' "$$" > "$PHASE_LOCK_DIR/pid"
    }

    if [[ ! -f "$LEAN_PHASE_PARENT_TEMPLATE" ]]; then
        echo "Error: Lean phase parent template not found at $LEAN_PHASE_PARENT_TEMPLATE" >&2
        exit 1
    fi

    # ── Parse PHASE_NAMES into array ──
    PHASE_NAME_ARRAY=()
    if [[ -n "$PHASE_NAMES" ]]; then
        IFS=',' read -ra _raw_names <<< "$PHASE_NAMES"
        for _name in "${_raw_names[@]}"; do
            # Trim whitespace and slugify
            _trimmed=$(echo "$_name" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            _slugified=$(slugify_token "$_trimmed")
            if [[ -z "$_slugified" ]]; then
                echo "Error: --phase-names entries must include alphanumeric text (invalid entry: '$_name')" >&2
                exit 1
            fi
            PHASE_NAME_ARRAY+=("$_slugified")
        done
        # If --phase-names provided, override PHASE_COUNT with actual count
        if [[ "$PHASE_COUNT_EXPLICIT" = true ]] && [[ "$PHASE_COUNT" -ne ${#PHASE_NAME_ARRAY[@]} ]]; then
            >&2 echo "[speckit] Warning: --phases $PHASE_COUNT overridden by --phase-names (${#PHASE_NAME_ARRAY[@]} names provided)"
        fi
        PHASE_COUNT=${#PHASE_NAME_ARRAY[@]}
    fi

    PHASE_PARENT_RESOLVED=""
    APPEND_TO_EXISTING_PARENT=false
    EXISTING_PHASE_COUNT=0
    LAST_EXISTING_PHASE=""
    PARENT_CREATED_FILES=()

    # Optional append mode: add phases to an existing parent folder.
    if [[ -n "$PHASE_PARENT" ]]; then
        PHASE_PARENT_RESOLVED="$(resolve_and_validate_spec_path "$PHASE_PARENT" "--parent folder" "true")"

        if [[ ! -f "$PHASE_PARENT_RESOLVED/spec.md" ]]; then
            echo "Error: --parent folder must contain spec.md: $PHASE_PARENT" >&2
            exit 1
        fi

        APPEND_TO_EXISTING_PARENT=true
        FEATURE_DIR="$PHASE_PARENT_RESOLVED"
        BRANCH_NAME="$(basename "$FEATURE_DIR")"
        FEATURE_NUM="${BRANCH_NAME%%-*}"
        if [[ -z "$FEATURE_NUM" ]] || [[ ! "$FEATURE_NUM" =~ ^[0-9]+$ ]]; then
            FEATURE_NUM="000"
        fi

        create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"
    else
        if [[ -n "$EXPLICIT_PATH" ]]; then
            FEATURE_DIR="$(resolve_and_validate_create_target "$EXPLICIT_PATH")"
            BRANCH_NAME="$(basename "$FEATURE_DIR")"
            FEATURE_NUM="${BRANCH_NAME%%-*}"
            if [[ -z "$FEATURE_NUM" ]] || [[ ! "$FEATURE_NUM" =~ ^[0-9]+$ ]]; then
                FEATURE_NUM="000"
            fi
        else
            # ── Branch name generation (shared function) ──
            resolve_branch_name
            create_git_branch
            FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"
        fi

        # ── Create parent spec folder ──
        mkdir -p "$FEATURE_DIR"
    fi

    acquire_phase_scaffold_lock "$FEATURE_DIR"

    # ── Build child folder name list ──
    PHASE_START_INDEX=1
    if [[ "$APPEND_TO_EXISTING_PARENT" = true ]]; then
        for dir in "$FEATURE_DIR"/[0-9][0-9][0-9]-*/; do
            if [[ -d "$dir" ]]; then
                _dirname="${dir%/}"
                _dirname="${_dirname##*/}"
                _num="${_dirname%%-*}"
                _num=$((10#${_num}))
                if [[ $_num -gt $EXISTING_PHASE_COUNT ]]; then
                    EXISTING_PHASE_COUNT=$_num
                    LAST_EXISTING_PHASE="$_dirname"
                fi
            fi
        done
        PHASE_START_INDEX=$((EXISTING_PHASE_COUNT + 1))
    fi

    TOTAL_PHASES=$((EXISTING_PHASE_COUNT + PHASE_COUNT))

    CHILD_FOLDERS=()
    for (( _i=1; _i<=PHASE_COUNT; _i++ )); do
        _phase_number=$((PHASE_START_INDEX + _i - 1))
        _child_num=$(printf "%03d" "$_phase_number")
        if [[ ${#PHASE_NAME_ARRAY[@]} -ge $_i ]]; then
            _child_slug="${PHASE_NAME_ARRAY[$((_i - 1))]}"
        else
            _child_slug="phase-${_phase_number}-PROVIDE-DESCRIPTIVE-SLUG"
            echo "[speckit] Warning: Falling back to generic phase name '$_child_slug'. Provide --phase-names with literal slugs describing the concrete work." >&2
        fi
        CHILD_FOLDERS+=("${_child_num}-${_child_slug}")
    done

    # ── Build Phase Documentation Map rows for this invocation ──
    PARENT_SPEC="$FEATURE_DIR/spec.md"
    PHASE_ROWS=""
    for (( _i=1; _i<=PHASE_COUNT; _i++ )); do
        _folder="${CHILD_FOLDERS[$((_i - 1))]}"
        _phase_number=$((PHASE_START_INDEX + _i - 1))
        if [[ -n "$PHASE_ROWS" ]]; then
            PHASE_ROWS="${PHASE_ROWS}"$'\n'
        fi
        PHASE_ROWS="${PHASE_ROWS}| ${_phase_number} | ${_folder}/ | [Phase ${_phase_number} scope] | Pending |"
    done

    HANDOFF_ROWS=""
    if [[ -n "$LAST_EXISTING_PHASE" ]]; then
        _first_new="${CHILD_FOLDERS[0]}"
        HANDOFF_ROWS="| ${LAST_EXISTING_PHASE} | ${_first_new} | [Criteria TBD] | [Verification TBD] |"
    fi
    for (( _i=1; _i<=PHASE_COUNT; _i++ )); do
        if [[ $_i -lt $PHASE_COUNT ]]; then
            _from="${CHILD_FOLDERS[$((_i - 1))]}"
            _to="${CHILD_FOLDERS[$_i]}"
            if [[ -n "$HANDOFF_ROWS" ]]; then
                HANDOFF_ROWS="${HANDOFF_ROWS}"$'\n'
            fi
            HANDOFF_ROWS="${HANDOFF_ROWS}| ${_from} | ${_to} | [Criteria TBD] | [Verification TBD] |"
        fi
    done

    if [[ "$APPEND_TO_EXISTING_PARENT" != true ]]; then
        _tmp_parent_spec=$(mktemp)
        PHASE_TMP_FILES+=("$_tmp_parent_spec")
        _tmp_parent_template=$(mktemp)
        PHASE_TMP_FILES+=("$_tmp_parent_template")
        "$INLINE_GATE_RENDERER" --level phase "$LEAN_PHASE_PARENT_TEMPLATE" > "$_tmp_parent_template"
        _feature_slug="$(basename "$FEATURE_DIR")"
        _phase_parent_packet_pointer="scaffold/$(slugify_token "$_feature_slug")"
        _today="$(date -u +"%Y-%m-%d")"
        _phase_parent_problem="This phased decomposition tracks ${FEATURE_DESCRIPTION} across independently executable child phase folders."
        _phase_parent_purpose="Keep parent documentation lean while child phases own detailed plans, tasks, verification, and continuity."
        _scope_rows="- Root purpose and child phase manifest for ${FEATURE_DESCRIPTION}"$'\n'"- Per-phase implementation details in child folders"
        _file_row="| [Per-child files] | Modify/Create | Child phases | Detailed file scope lives in each child phase |"
        _feature_description_escaped="$(escape_template_value "$FEATURE_DESCRIPTION")"

        while IFS= read -r _line; do
            case "$_line" in
                *"<!-- [PHASE_ROW]"*)
                    printf '%s\n' "$PHASE_ROWS"
                    ;;
                *"<!-- [HANDOFF_ROW]"*)
                    if [[ -n "$HANDOFF_ROWS" ]]; then
                        printf '%s\n' "$HANDOFF_ROWS"
                    else
                        printf '%s\n' "| (single phase - no handoffs) | | | |"
                    fi
                    ;;
                *)
                    _line="${_line//\[YOUR_VALUE_HERE: feature-name\]/$_feature_description_escaped}"
                    _line="${_line//\[YOUR_VALUE_HERE: one-line description\]/Phase parent for ${_feature_description_escaped}}"
                    _line="${_line//\[YOUR_VALUE_HERE: trigger phrase 1\]/$_feature_slug}"
                    _line="${_line//\[YOUR_VALUE_HERE: trigger phrase 2\]/phase parent}"
                    _line="${_line//\[YOUR_VALUE_HERE: YYYY-MM-DD\]/$_today}"
                    _line="${_line//\[YOUR_VALUE_HERE: packet-id\]/$_phase_parent_packet_pointer}"
                    _line="${_line//\[YOUR_VALUE_HERE: predecessor-packet\]/None}"
                    _line="${_line//\[YOUR_VALUE_HERE: successor-packet, or \"None\"\]/None}"
                    _line="${_line//\[YOUR_VALUE_HERE: one-paragraph problem statement — what needs solving and why\]/$_phase_parent_problem}"
                    _line="${_line//\[YOUR_VALUE_HERE: one-paragraph purpose — what this phased decomposition achieves\]/$_phase_parent_purpose}"
                    if [[ "$_line" == *"[YOUR_VALUE_HERE: bullet list of what this phase decomposition covers]"* ]]; then
                        printf '%s\n' "$_scope_rows"
                    elif [[ "$_line" == *"[YOUR_VALUE_HERE: bullet list of what is explicitly excluded]"* ]]; then
                        printf '%s\n' "- Detailed per-phase implementation plans at the parent level"
                    elif [[ "$_line" == *"[YOUR_VALUE_HERE: summary table of files touched across all phases"* ]]; then
                        printf '%s\n' "Summary of aggregate file scope. Per-phase detail lives in child plans."
                    elif [[ "$_line" == *"| [YOUR_VALUE_HERE: path] |"* ]]; then
                        printf '%s\n' "$_file_row"
                    elif [[ "$_line" == *"[YOUR_VALUE_HERE: open question 1]"* ]]; then
                        printf '%s\n' "- Which child phase should execute first?"
                    elif [[ "$_line" == *"[YOUR_VALUE_HERE: open question 2]"* ]]; then
                        printf '%s\n' "- What handoff criteria must each child satisfy?"
                    else
                        printf '%s\n' "$_line"
                    fi
                    ;;
            esac
        done < "$_tmp_parent_template" > "$_tmp_parent_spec"

        mv "$_tmp_parent_spec" "$PARENT_SPEC"
        ensure_template_source_near_top "$PARENT_SPEC"
        replace_template_default_trigger_phrases "$FEATURE_DIR" "$_feature_slug" "$FEATURE_DESCRIPTION"
        PARENT_CREATED_FILES+=("spec.md")
        create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"
    fi

    # ── Append Phase Documentation Map into existing parent spec.md ──
    if [[ -f "$PARENT_SPEC" ]]; then
        PHASE_MAP_EXISTS=false
        if grep -q "<!-- ANCHOR:phase-map -->" "$PARENT_SPEC"; then
            PHASE_MAP_EXISTS=true
        fi

        if [[ "$APPEND_TO_EXISTING_PARENT" = true ]] && [[ "$PHASE_MAP_EXISTS" = true ]]; then
            >&2 echo "[speckit] Existing PHASE DOCUMENTATION MAP found; appending new phase rows and handoffs"
            _tmp_parent_spec=$(mktemp)
            PHASE_TMP_FILES+=("$_tmp_parent_spec")
            _tmp_phase_rows=$(mktemp)
            PHASE_TMP_FILES+=("$_tmp_phase_rows")
            _tmp_handoff_rows=$(mktemp)
            PHASE_TMP_FILES+=("$_tmp_handoff_rows")
            printf '%s\n' "$PHASE_ROWS" > "$_tmp_phase_rows"
            printf '%s\n' "$HANDOFF_ROWS" > "$_tmp_handoff_rows"

            _handoff_has_rows=false
            [[ -n "$HANDOFF_ROWS" ]] && _handoff_has_rows=true

            # New rows go where each table ends, at its first line that is not a
            # row. A blank line ends a markdown table, so rows placed before the
            # next heading instead would render outside it. A row marker left
            # by an earlier scaffold is dropped once the rows take its place.
            awk -v phase_rows_file="$_tmp_phase_rows" -v handoff_rows_file="$_tmp_handoff_rows" -v handoff_has_rows="$_handoff_has_rows" '
                function print_rows(path, row) {
                    while ((getline row < path) > 0) {
                        print row;
                    }
                    close(path);
                }
                BEGIN {
                    in_phase=0;
                    table="";
                    inserted_phase=0;
                    inserted_handoff=0;
                }
                /<!-- ANCHOR:phase-map -->/ {
                    in_phase=1;
                }
                in_phase && /^\| Phase \| Folder \|/ {
                    table="phase";
                }
                in_phase && /^\| From \| To \|/ {
                    table="handoff";
                }
                table != "" && !/^\|/ {
                    if (table == "phase" && !inserted_phase) {
                        print_rows(phase_rows_file);
                        inserted_phase=1;
                    }
                    if (table == "handoff" && !inserted_handoff) {
                        if (handoff_has_rows == "true") {
                            print_rows(handoff_rows_file);
                        }
                        inserted_handoff=1;
                    }
                    table="";
                    if ($0 ~ /^<!-- \[(PHASE|HANDOFF)_ROW\]/) {
                        next;
                    }
                }
                table == "handoff" && handoff_has_rows == "true" && $0 ~ /^\| \(single phase - no handoffs\) \| \| \| \|$/ {
                    next;
                }
                in_phase && /<!-- \/ANCHOR:phase-map -->/ {
                    in_phase=0;
                }
                { print }
            ' "$PARENT_SPEC" > "$_tmp_parent_spec"

            mv "$_tmp_parent_spec" "$PARENT_SPEC"
        elif [[ "$APPEND_TO_EXISTING_PARENT" = true ]]; then
            _tmp_phase_section=$(mktemp)
            PHASE_TMP_FILES+=("$_tmp_phase_section")

            {
                cat <<'EOF'
<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
EOF
                printf '%s\n' "$PHASE_ROWS"
                cat <<'EOF'

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
EOF
                if [[ -n "$HANDOFF_ROWS" ]]; then
                    printf '%s\n' "$HANDOFF_ROWS"
                else
                    printf '%s\n' "| (single phase - no handoffs) | | | |"
                fi
                printf '%s\n' "<!-- /ANCHOR:phase-map -->"
            } > "$_tmp_phase_section"

            # Append phase section to parent spec.md
            printf '\n' >> "$PARENT_SPEC"
            cat "$_tmp_phase_section" >> "$PARENT_SPEC"
            rm -f "$_tmp_phase_section"
        fi
    fi

    # ── Generate description.json for parent ──
    # NOTE: Description generation is manually tested. Automated coverage tracked as known gap (F10).
    # Key invariants: parent and child both use $(dirname FEATURE_DIR) as base. Failure is non-fatal.
    # Append mode (APPEND_TO_EXISTING_PARENT=true) MUST NOT reach this call: FEATURE_DIR
    # is bound to the EXISTING parent's own folder, so regenerating here would overwrite
    # that parent's real specFolder/description/keywords/parentChain with this append
    # request's own child-phase text. Only genuine new-parent creation writes here.
    _DESC_SCRIPT="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
    if [[ "$APPEND_TO_EXISTING_PARENT" != true ]]; then
      require_parent_description_generator "$_DESC_SCRIPT" "$FEATURE_DIR"
      # The generator reports on stdout; stdout belongs to the --json payload.
      if node "$_DESC_SCRIPT" "$FEATURE_DIR" "$(dirname "$FEATURE_DIR")" \
        --description "$FEATURE_DESCRIPTION" --level "phase" >&2; then
        CREATED_FILES+=("description.json")
      else
        echo "Error: description.json generation failed for the phase parent $FEATURE_DIR" >&2
        exit 1
      fi
    fi

    # ── Create child phase folders ──
    _child_paths=()
    CHILD_DOC_LEVEL="$(child_doc_level)"
    CHILD_LEVEL_CONTRACT="$(resolve_level_contract "$CHILD_DOC_LEVEL")"
    CHILDREN_INFO=()   # For JSON output

    for (( _i=1; _i<=PHASE_COUNT; _i++ )); do
        _child_folder="${CHILD_FOLDERS[$((_i - 1))]}"
        _child_path="$FEATURE_DIR/$_child_folder"
        _child_created_files=()
        # An appended child follows the parent's existing phases, so the text that
        # names it carries its phase number, not its position in this invocation.
        _phase_number=$((PHASE_START_INDEX + _i - 1))

        # Create child directory structure
        mkdir -p "$_child_path" "$_child_path/scratch"
        touch "$_child_path/scratch/.gitkeep"
        create_graph_metadata_file "$_child_path" "Phase ${_phase_number}: ${_child_folder#*-}" "planned"
        _child_paths+=("$_child_path")

        # Copy Level 1 templates to child folder
        if ! child_level_contract_docs="$(scaffold_contract_docs "$CHILD_LEVEL_CONTRACT")"; then
            echo "Error: failed to resolve Level $CHILD_DOC_LEVEL template documents" >&2
            exit 1
        fi
        while IFS= read -r template_name; do
            [[ -z "$template_name" ]] && continue
            if ! created_path=$(copy_template "$template_name" "$_child_path" "$CHILD_DOC_LEVEL" "$TEMPLATES_BASE"); then
                echo "Error: copy_template failed for $template_name (level $CHILD_DOC_LEVEL)" >&2
                exit 1
            fi
            _child_created_files+=("$created_path")
        done <<< "$child_level_contract_docs"

        # Generate description.json for child phase
        if [[ -f "$_DESC_SCRIPT" ]]; then
          _phase_name="${_child_folder#*-}"  # strip numeric prefix
          # Use parent of FEATURE_DIR as base so parentChain includes the parent folder
          if node "$_DESC_SCRIPT" "$_child_path" "$(dirname "$FEATURE_DIR")" \
            --description "Phase ${_phase_number}: ${_phase_name}" --level "$CHILD_DOC_LEVEL" >&2; then
            _child_created_files+=("description.json")
          else
            echo "  Warning: description.json generation skipped for phase ${_phase_number}" >&2
          fi
        else
          report_missing_generator "description.json" "$_DESC_SCRIPT" "$BUILD_REMEDY" "phase ${_phase_number}"
        fi

        # Inject parent back-reference into child spec.md
        _child_spec="$_child_path/spec.md"
        if [[ -f "$_child_spec" ]]; then
            finalize_scaffold_templates "$_child_path" "$_child_folder" "Phase ${_phase_number}: ${_child_folder#*-}"
            replace_template_default_trigger_phrases "$_child_path" "$_child_folder" "Phase ${_phase_number}: ${_child_folder#*-}"

            # Determine predecessor and successor
            if [[ $_i -eq 1 ]]; then
                if [[ -n "$LAST_EXISTING_PHASE" ]]; then
                    _predecessor="$LAST_EXISTING_PHASE"
                else
                    _predecessor="None"
                fi
            else
                _predecessor="${CHILD_FOLDERS[$((_i - 2))]}"
            fi
            if [[ $_i -eq $PHASE_COUNT ]]; then
                _successor="None"
            else
                _successor="${CHILD_FOLDERS[$_i]}"
            fi

            _phase_number=$((PHASE_START_INDEX + _i - 1))
            _phase_name="${_child_folder#*-}"
            _child_metadata_rows="| **Parent Spec** | ../spec.md |
| **Phase** | ${_phase_number} of ${TOTAL_PHASES} |
| **Predecessor** | ${_predecessor} |
| **Successor** | ${_successor} |
| **Handoff Criteria** | [To be defined during planning] |"
            _child_phase_context="<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase ${_phase_number}** of the ${FEATURE_DESCRIPTION} specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->"

            PHASE_CHILD_ROWS="$_child_metadata_rows" PHASE_CHILD_CONTEXT="$_child_phase_context" perl -0pi -e '
                if (index($_, "<!-- ANCHOR:phase-context -->") == -1) {
                    s/(<!-- \/ANCHOR:metadata -->)/$ENV{PHASE_CHILD_ROWS} . "\n" . $1 . "\n\n---\n\n" . $ENV{PHASE_CHILD_CONTEXT}/e;
                }
            ' "$_child_spec"
        fi

        # Collect child info for output
        _child_files_str=$(printf '%s,' "${_child_created_files[@]}" | sed 's/,$//')
        CHILDREN_INFO+=("${_child_folder}|${_child_files_str}")
    done

    refresh_track_root "$REPO_ROOT/specs" "$TRACK"

    # ── Output ──
    SPEC_FILE="$FEATURE_DIR/spec.md"
    export SPECIFY_FEATURE="$BRANCH_NAME"

    if $JSON_MODE; then
        # Build children JSON array
        children_json=""
        for _info in "${CHILDREN_INFO[@]}"; do
            _folder="${_info%%|*}"
            _files="${_info#*|}"
            # Build files array
            _files_json=""
            IFS=',' read -ra _file_arr <<< "$_files"
            for _f in "${_file_arr[@]}"; do
                [[ -z "$_f" ]] && continue
                if [[ -n "$_files_json" ]]; then _files_json="${_files_json},"; fi
                _files_json="${_files_json}\"$(_json_escape "$_f")\""
            done
            if [[ -n "$children_json" ]]; then children_json="${children_json},"; fi
            children_json="${children_json}{\"FOLDER\":\"$(_json_escape "$_folder")\",\"FILES\":[${_files_json}]}"
        done

        # Build parent files JSON
        parent_files_json=""
        for _pf in "${PARENT_CREATED_FILES[@]-}"; do
            [[ -n "$parent_files_json" ]] && parent_files_json="${parent_files_json},"
            parent_files_json="${parent_files_json}\"$(_json_escape "$_pf")\""
        done

        printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","DOC_LEVEL":"%s","PHASE_MODE":true,"PHASE_COUNT":%d,"PARENT_FILES":[%s],"CHILDREN":[%s]}\n' \
            "$(_json_escape "$BRANCH_NAME")" "$(_json_escape "$SPEC_FILE")" "$FEATURE_NUM" "$DOC_LEVEL" "$PHASE_COUNT" "$parent_files_json" "$children_json"
    else
        echo ""
        echo "───────────────────────────────────────────────────────────────────"
        echo "  SpecKit: Phase Spec Created Successfully"
        echo "───────────────────────────────────────────────────────────────────"
        echo ""
        echo "  BRANCH_NAME:  $BRANCH_NAME"
        echo "  FEATURE_NUM:  $FEATURE_NUM"
        echo "  DOC_LEVEL:    Level $DOC_LEVEL (parent)"
        echo "  PHASE_COUNT:  $PHASE_COUNT (new, $TOTAL_PHASES total)"
        echo "  SPEC_FOLDER:  $FEATURE_DIR"
        if [[ "$APPEND_TO_EXISTING_PARENT" = true ]]; then
            echo "  MODE:         Append phases to existing parent"
        fi
        echo ""
        echo "  Created Structure:"
        echo "  └── $BRANCH_NAME/"
        for file in "${PARENT_CREATED_FILES[@]-}"; do
            echo "      ├── $file"
        done
        for (( _ci=1; _ci<=PHASE_COUNT; _ci++ )); do
            _cf="${CHILD_FOLDERS[$((_ci - 1))]}"
            _info="${CHILDREN_INFO[$((_ci - 1))]}"
            _files="${_info#*|}"
            echo "      ├── $_cf/"
            IFS=',' read -ra _file_arr <<< "$_files"
            for _f in "${_file_arr[@]}"; do
                [[ -z "$_f" ]] && continue
                echo "      │   ├── $_f"
            done
            echo "      │   └── scratch/"
            echo "      │       └── .gitkeep"
        done
        echo "      └── scratch/          (working files; NOT git-ignored)"
        echo "          └── .gitkeep"
        echo ""
        echo "  Phase Documentation Map injected into parent spec.md"
        echo "  Parent back-references injected into each child spec.md"
        echo ""
        echo "  Next steps:"
        echo "    1. Define phase scopes in parent spec.md Phase Documentation Map"
        echo "    2. Fill out each child spec.md with phase-specific requirements"
        echo "    3. Use /speckit:plan on each phase folder for detailed planning"
        echo "    4. Author the parent goal and bind each phase goal with /create:goal <parent> phase-parent"
        echo ""
        echo "───────────────────────────────────────────────────────────────────"
    fi

    # Derive before the opt-in post-create check so the validator reads metadata
    # that matches the documents that were just written.
    backfill_graph_metadata "$FEATURE_DIR" "${_child_paths[@]-}"

    # Full post-create validation is opt-in; it is too expensive for default scaffolds.
    if [[ "${SPECKIT_POST_VALIDATE:-}" == "1" ]]; then
        if ! bash "$SCRIPT_DIR/validate.sh" "$FEATURE_DIR" --quiet; then
            echo "Error: post-create validation failed for $FEATURE_DIR" >&2
            exit 1
        fi
    fi

    exit 0
fi

# ───────────────────────────────────────────────────────────────
# 4. BRANCH NAME GENERATION (shared function)
# ───────────────────────────────────────────────────────────────

if [[ -n "$EXPLICIT_PATH" ]]; then
    FEATURE_DIR="$(resolve_and_validate_create_target "$EXPLICIT_PATH")"
    BRANCH_NAME="$(basename "$FEATURE_DIR")"
    FEATURE_NUM="${BRANCH_NAME%%-*}"
    if [[ -z "$FEATURE_NUM" ]] || [[ ! "$FEATURE_NUM" =~ ^[0-9]+$ ]]; then
        FEATURE_NUM="000"
    fi
else
    resolve_branch_name
    create_git_branch
fi

# ───────────────────────────────────────────────────────────────
# 5. CREATE SPEC FOLDER STRUCTURE


# ───────────────────────────────────────────────────────────────

if [[ -z "$EXPLICIT_PATH" ]]; then
    FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"
fi

TEMPLATES_BASE="${SPECKIT_TEMPLATES_BASE:-$REPO_ROOT/.skilled/skills/system-spec-kit/templates}"

LEVEL_CONTRACT="$(resolve_level_contract "$DOC_LEVEL")"
CREATED_FILES=()

# Validate templates directory exists
if [[ ! -d "$TEMPLATES_BASE" ]]; then
    echo "Error: Templates directory not found at $TEMPLATES_BASE" >&2
    exit 1
fi

mkdir -p "$FEATURE_DIR" "$FEATURE_DIR/scratch"
touch "$FEATURE_DIR/scratch/.gitkeep"

# ───────────────────────────────────────────────────────────────
# 6. COPY TEMPLATES BASED ON DOCUMENTATION LEVEL


# ───────────────────────────────────────────────────────────────

# Copy all templates from the resolver contract (using library copy_template)
if ! level_contract_docs="$(scaffold_contract_docs "$LEVEL_CONTRACT")"; then
    echo "Error: failed to resolve Level $DOC_LEVEL template documents" >&2
    exit 1
fi
batch_created_files="$(copy_templates_batch "$level_contract_docs" "$FEATURE_DIR" "$DOC_LEVEL" "$TEMPLATES_BASE")" || {
    echo "Error: batch template render failed for Level $DOC_LEVEL" >&2
    exit 3
}
while IFS= read -r created_path; do
    [[ -z "$created_path" ]] && continue
    CREATED_FILES+=("$created_path")
done <<< "$batch_created_files"
finalize_scaffold_templates "$FEATURE_DIR" "$BRANCH_NAME" "$FEATURE_DESCRIPTION"
replace_template_default_trigger_phrases "$FEATURE_DIR" "$BRANCH_NAME" "$FEATURE_DESCRIPTION"

create_graph_metadata_file "$FEATURE_DIR" "$FEATURE_DESCRIPTION" "planned"

# ───────────────────────────────────────────────────────────────
# 6.5. GENERATE PER-FOLDER description.json
# ───────────────────────────────────────────────────────────────

_DESC_SCRIPT="${SCRIPT_DIR}/../dist/spec-folder/generate-description.js"
if [[ "$DOC_LEVEL" == "phase" ]]; then
  require_parent_description_generator "$_DESC_SCRIPT" "$FEATURE_DIR"
fi
if [[ -f "$_DESC_SCRIPT" ]]; then
  # The generator reports on stdout; stdout belongs to the --json payload.
  if node "$_DESC_SCRIPT" "$FEATURE_DIR" "$(dirname "$FEATURE_DIR")" \
    --description "$FEATURE_DESCRIPTION" --level "$DOC_LEVEL" >&2; then
    CREATED_FILES+=("description.json")
  else
    echo "  Warning: description.json generation skipped" >&2
  fi
else
  report_missing_generator "description.json" "$_DESC_SCRIPT" "$BUILD_REMEDY"
fi

backfill_graph_metadata "$FEATURE_DIR"

if [[ "$DOC_LEVEL" == "phase" ]]; then
    scaffold_phase_parent_validation_child "$FEATURE_DIR" "$FEATURE_DESCRIPTION"
fi

refresh_track_root "$REPO_ROOT/specs" "$TRACK"

# Set paths for output
SPEC_FILE="$FEATURE_DIR/spec.md"

# Set the SPECIFY_FEATURE environment variable for the current session
export SPECIFY_FEATURE="$BRANCH_NAME"

# ───────────────────────────────────────────────────────────────
# 10. OUTPUT


# ───────────────────────────────────────────────────────────────

if $JSON_MODE; then
    # Build JSON array of created files
    files_json=""
    for created_file in "${CREATED_FILES[@]}"; do
        [[ -n "$files_json" ]] && files_json="${files_json},"
        files_json="${files_json}\"$(_json_escape "$created_file")\""
    done

    # Build complexity info if available
    if [[ -n "$DETECTED_LEVEL" ]]; then
        complexity_json=",\"COMPLEXITY\":{\"detected\":true,\"level\":\"$DETECTED_LEVEL\",\"score\":$DETECTED_SCORE,\"confidence\":$DETECTED_CONF}"
    else
        complexity_json=",\"COMPLEXITY\":{\"detected\":false}"
    fi

    # Build expansion info
    if [[ "$EXPAND_TEMPLATES" = true ]]; then
        expansion_json=",\"EXPANDED\":true"
    else
        expansion_json=",\"EXPANDED\":false"
    fi

    # Build description info
    if [[ -f "$FEATURE_DIR/description.json" ]]; then
        description_json=",\"HAS_DESCRIPTION\":true"
    else
        description_json=",\"HAS_DESCRIPTION\":false"
    fi

    # P1-03 FIX: Escape JSON values to prevent injection
    printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","DOC_LEVEL":"%s"%s%s%s,"CREATED_FILES":[%s]}\n' \
        "$(_json_escape "$BRANCH_NAME")" "$(_json_escape "$SPEC_FILE")" "$FEATURE_NUM" "$DOC_LEVEL" "$complexity_json" "$expansion_json" "$description_json" "$files_json"
else
    echo ""
    echo "───────────────────────────────────────────────────────────────────"
    echo "  SpecKit: Spec Folder Created Successfully"
    echo "───────────────────────────────────────────────────────────────────"
    echo ""
    echo "  BRANCH_NAME:  $BRANCH_NAME"
    echo "  FEATURE_NUM:  $FEATURE_NUM"
    echo "  DOC_LEVEL:    Level $DOC_LEVEL"
    if [[ -n "$DETECTED_LEVEL" ]]; then
        echo "  COMPLEXITY:   Level $DETECTED_LEVEL (score: $DETECTED_SCORE/100, confidence: $DETECTED_CONF%)"
    fi
    if [[ "$EXPAND_TEMPLATES" = true ]]; then
        echo "  EXPANDED:     Yes (COMPLEXITY_GATE markers processed)"
    fi
    echo "  SPEC_FOLDER:  $FEATURE_DIR"
    echo ""
    echo "  Created Structure:"
    echo "  └── $BRANCH_NAME/"
    for file in "${CREATED_FILES[@]}"; do
        echo "      ├── $file"
    done
    echo "      ├── description.json   (per-folder identity)"
    echo "      └── scratch/          (working files; NOT git-ignored)"
    echo "          └── .gitkeep"
    echo ""
    echo "  Level $DOC_LEVEL Documentation (manifest-backed Level contract):"
    case $DOC_LEVEL in
        1) echo "    ✓ Core: spec.md + plan.md + tasks.md"
           echo "    ✓ Lifecycle: implementation-summary.md (scaffolded; required after implementation starts)"
           echo "      (Essential what/why/how - ~270 LOC)" ;;
        2) echo "    ✓ Core: spec.md + plan.md + tasks.md"
           echo "    ✓ Lifecycle: implementation-summary.md (scaffolded; required after implementation starts)"
           echo "    ✓ +Verify: merged verification/testing in tasks.md, NFRs, edge cases, effort estimation"
           echo "      (Quality gates - adds ~120 LOC)" ;;
        3|"3+") echo "    ✓ Core: spec.md + plan.md + tasks.md"
           echo "    ✓ Lifecycle: implementation-summary.md (scaffolded; required after implementation starts)"
           echo "    ✓ +Verify: merged verification/testing in tasks.md, NFRs, edge cases"
           echo "    ✓ +Arch: executive summary, risk matrix, decision guidance"
           if [[ "$DOC_LEVEL" = "3+" ]]; then
               echo "    ✓ +Govern: approval workflow, compliance, AI protocols"
               echo "      (Full governance - adds ~100 LOC)"
           else
               echo "      (Architecture decisions - adds ~150 LOC)"
           fi
           ;;
    esac
    echo ""
    echo "  Next steps:"
    echo "    1. Fill out spec.md with requirements"
    echo "    2. Create implementation plan in plan.md"
    echo "    3. Break down tasks in tasks.md"
    DOC_LEVEL_NUM_FOR_OUTPUT="${DOC_LEVEL/+/}"
    if [[ "$DOC_LEVEL_NUM_FOR_OUTPUT" =~ ^[0-9]+$ ]] && [[ "$DOC_LEVEL_NUM_FOR_OUTPUT" -ge 2 ]]; then
        echo "    4. Add verification items to tasks.md"
    fi
    if $WITH_LAZY_ADDONS; then
        echo "    5. Lazy add-ons: before-after.md, timeline.md, roadmap.md, decision-record.md"
    else
        echo "    5. Add on-demand docs with --with-lazy-addons when needed"
    fi
    if $WITH_GOAL; then
        echo "    6. Fill goal.md with /create:goal"
    else
        echo "    6. Add goal.md with --with-goal or /create:goal when an operator will set this packet as a session objective"
    fi
    echo ""
    echo "───────────────────────────────────────────────────────────────────"
fi

# Full post-create validation is opt-in; it is too expensive for default scaffolds.
if [[ "${SPECKIT_POST_VALIDATE:-}" == "1" ]]; then
    if ! bash "$SCRIPT_DIR/validate.sh" "$FEATURE_DIR" --quiet; then
        echo "Error: post-create validation failed for $FEATURE_DIR" >&2
        exit 1
    fi
fi

# Exit codes:
#   0 - Success
#   1 - --level requires a value (1, 2, or 3)
