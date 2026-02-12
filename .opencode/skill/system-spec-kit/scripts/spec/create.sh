#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Create Spec Folder
# ───────────────────────────────────────────────────────────────
# Creates spec folder with templates based on documentation level.
#
# TEMPLATE ARCHITECTURE (v2.0 - CORE + ADDENDUM):
#   templates/
#   ├── level_1/        # Core only (~270 LOC total)
#   ├── level_2/        # Core + Verification (~390 LOC)
#   ├── level_3/        # Core + Verification + Architecture (~540 LOC)
#   └── level_3+/       # All addendums (~640 LOC)
#
# LEVEL SCALING (Value-based, not just length):
#   L1: Essential what/why/how - spec, plan, tasks, impl-summary
#   L2: +Quality gates, verification - checklist.md
#   L3: +Architecture decisions - decision-record.md
#   L3+: +Enterprise governance - extended content
#
# Also creates scratch/ and memory/ directories.

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
SKIP_BRANCH=false
SHARDED=false  # Enable sharded spec sections for Level 3
SUBFOLDER_MODE=false  # Enable versioned sub-folder creation
SUBFOLDER_BASE=""     # Base folder for sub-folder mode
SUBFOLDER_TOPIC=""    # Topic name for the sub-folder
TEMPLATE_STYLE="minimal"  # Only minimal templates supported

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
            if [[ ! "$next_arg" =~ ^(1|2|3|3\+)$ ]]; then
                echo 'Error: --level must be 1, 2, 3, or 3+' >&2
                exit 1
            fi
            DOC_LEVEL="$next_arg"
            ;;
        --skip-branch)
            SKIP_BRANCH=true
            ;;
        --sharded)
            SHARDED=true
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
        --short-name)
            if [[ $((i + 1)) -gt $# ]]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            # Check if the next argument is another option (starts with --)
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
            echo "  --sharded           Create sharded spec sections (Level 3 only)"
            echo "                      Creates spec-sections/ with modular documentation"
            echo "  --subfolder <path>  Create versioned sub-folder in existing spec folder"
            echo "                      Auto-increments version (001, 002, etc.)"
            echo "  --topic <name>      Topic name for sub-folder (used with --subfolder)"
            echo "                      If not provided, uses feature_description"
            echo "  --short-name <name> Provide a custom short name (2-4 words) for the branch"
            echo "  --number N          Specify branch number manually (overrides auto-detection)"
            echo "  --skip-branch       Create spec folder only, don't create git branch"
            echo "  --help, -h          Show this help message"
            echo ""
            echo "Documentation Levels (CORE + ADDENDUM architecture v2.0):"
            echo ""
            echo "  Level 1 (Core ~270 LOC):     Essential what/why/how"
            echo "    Files: spec.md, plan.md, tasks.md, implementation-summary.md"
            echo ""
            echo "  Level 2 (Core + Verify):     +Quality gates, verification"
            echo "    Adds: checklist.md, NFRs, edge cases, effort estimation"
            echo ""
            echo "  Level 3 (Core + Verify + Arch): +Architecture decisions"
            echo "    Adds: decision-record.md, executive summary, risk matrix, ADRs"
            echo ""
            echo "  Level 3+ (All addendums):    +Enterprise governance"
            echo "    Adds: approval workflow, compliance, stakeholder matrix, AI protocols"
            echo ""
            echo "Template Composition:"
            echo "  Core templates (~270 LOC) are shared across all levels."
            echo "  Higher levels ADD value, not just length."
            echo "  Templates located in: .opencode/skill/system-spec-kit/templates/"
            echo ""
            echo "All levels include: scratch/ (git-ignored) + memory/ (context preservation)"
            echo ""
            echo "Examples:"
            echo "  $0 'Add user authentication system' --short-name 'user-auth'"
            echo "  $0 'Implement complex OAuth2 flow' --level 2"
            echo "  $0 'Major architecture redesign' --level 3 --number 50"
            echo "  $0 'Large platform migration' --level 3 --sharded"
            echo ""
            echo "Sub-folder Versioning Examples:"
            echo "  $0 --subfolder specs/005-memory 'Initial implementation'"
            echo "  $0 --subfolder specs/005-memory --topic 'refactor' 'Phase 2 refactoring'"
            echo ""
            echo "  Creates: specs/005-memory/001-initial-implementation/"
            echo "           specs/005-memory/002-refactor/"
            exit 0
            ;;
        *)
            ARGS+=("$arg")
            ;;
    esac
    i=$((i + 1))
done

FEATURE_DESCRIPTION="${ARGS[*]:-}"
if [[ -z "$FEATURE_DESCRIPTION" ]]; then
    echo "Usage: $0 [--json] [--short-name <name>] [--number N] <feature_description>" >&2
    exit 1
fi

# ───────────────────────────────────────────────────────────────
# 1. HELPER FUNCTIONS (shared functions sourced from lib/)
# ───────────────────────────────────────────────────────────────

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
    local version_str=$(printf "%03d" $next_version)
    local subfolder_name="${version_str}-${topic}"
    local subfolder_path="$base_folder/$subfolder_name"
    
    # Create sub-folder structure with independent memory/ and scratch/
    mkdir -p "$subfolder_path/memory"
    mkdir -p "$subfolder_path/scratch"
    touch "$subfolder_path/memory/.gitkeep"
    touch "$subfolder_path/scratch/.gitkeep"
    
    echo "$subfolder_path"
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

SPECS_DIR="$REPO_ROOT/specs"
mkdir -p "$SPECS_DIR"

# ───────────────────────────────────────────────────────────────
# 3. SUBFOLDER MODE
# ───────────────────────────────────────────────────────────────

if [[ "$SUBFOLDER_MODE" = true ]]; then
    # Resolve base folder path (handle both absolute and relative paths)
    if [[ "$SUBFOLDER_BASE" = /* ]]; then
        RESOLVED_BASE="$SUBFOLDER_BASE"
    else
        RESOLVED_BASE="$REPO_ROOT/$SUBFOLDER_BASE"
    fi
    
    # Validate base folder exists
    if [[ ! -d "$RESOLVED_BASE" ]]; then
        echo "Error: Base folder does not exist: $SUBFOLDER_BASE" >&2
        echo "Hint: Provide a valid spec folder path, e.g., specs/005-memory" >&2
        exit 1
    fi
    
    # Determine topic name
    if [[ -n "$SUBFOLDER_TOPIC" ]]; then
        TOPIC_NAME="$SUBFOLDER_TOPIC"
    else
        # Generate from feature description
        TOPIC_NAME=$(echo "$FEATURE_DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
    fi

    SUBFOLDER_PATH=$(create_versioned_subfolder "$RESOLVED_BASE" "$TOPIC_NAME")
    SUBFOLDER_NAME=$(basename "$SUBFOLDER_PATH")
    
    # Copy templates based on documentation level from level-specific folder
    TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"
    # Normalize DOC_LEVEL for numeric comparisons (3+ becomes 3)
    DOC_LEVEL_NUM="${DOC_LEVEL/+/}"
    LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")
    CREATED_FILES=()

    # Copy all templates from the level folder
    for template_file in "$LEVEL_TEMPLATES_DIR"/*.md; do
        if [[ -f "$template_file" ]]; then
            template_name=$(basename "$template_file")
            CREATED_FILES+=("$(copy_template "$template_name" "$SUBFOLDER_PATH" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE")")
        fi
    done

    if $JSON_MODE; then
        files_json=$(printf '"%s",' "${CREATED_FILES[@]}" | sed 's/,$//')
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
        echo "          ├── scratch/          (git-ignored working files)"
        echo "          │   └── .gitkeep"
        echo "          └── memory/           (independent context)"
        echo "              └── .gitkeep"
        echo ""
        echo "  Note: Each sub-folder has independent memory/ and scratch/ directories."
        echo ""
        echo "───────────────────────────────────────────────────────────────────"
    fi
    
    exit 0
fi

# ───────────────────────────────────────────────────────────────
# 4. BRANCH NAME GENERATION
# ───────────────────────────────────────────────────────────────

if [[ -n "$SHORT_NAME" ]]; then
    BRANCH_SUFFIX=$(echo "$SHORT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
else
    BRANCH_SUFFIX=$(generate_branch_name "$FEATURE_DESCRIPTION")
fi

if [[ -z "$BRANCH_NUMBER" ]]; then
    if [[ "$HAS_GIT" = true ]]; then
        # Check existing branches on remotes
        BRANCH_NUMBER=$(check_existing_branches "$BRANCH_SUFFIX")
    else
        # Fall back to local directory check
        HIGHEST=0
        if [[ -d "$SPECS_DIR" ]]; then
            for dir in "$SPECS_DIR"/*; do
                [[ -d "$dir" ]] || continue
                # P1-02 FIX: Removed 'local' keyword — this code runs outside a function body
                dirname=$(basename "$dir")
                number=$(echo "$dirname" | grep -o '^[0-9]\+' || echo "0")
                number=$((10#$number))
                if [[ "$number" -gt "$HIGHEST" ]]; then HIGHEST=$number; fi
            done
        fi
        BRANCH_NUMBER=$((HIGHEST + 1))
    fi
fi

# Force base-10 interpretation (prevents octal issues with leading zeros)
FEATURE_NUM=$(printf "%03d" "$((10#$BRANCH_NUMBER))")
BRANCH_NAME="${FEATURE_NUM}-${BRANCH_SUFFIX}"

# GitHub enforces 244-byte branch name limit
MAX_BRANCH_LENGTH=244
if [[ ${#BRANCH_NAME} -gt $MAX_BRANCH_LENGTH ]]; then
    # Account for: feature number (3) + hyphen (1) = 4 chars
    MAX_SUFFIX_LENGTH=$((MAX_BRANCH_LENGTH - 4))
    TRUNCATED_SUFFIX=$(echo "$BRANCH_SUFFIX" | cut -c1-$MAX_SUFFIX_LENGTH | sed 's/-$//')
    ORIGINAL_BRANCH_NAME="$BRANCH_NAME"
    BRANCH_NAME="${FEATURE_NUM}-${TRUNCATED_SUFFIX}"
    
    >&2 echo "[specify] Warning: Branch name exceeded GitHub's 244-byte limit"
    >&2 echo "[specify] Original: $ORIGINAL_BRANCH_NAME (${#ORIGINAL_BRANCH_NAME} bytes)"
    >&2 echo "[specify] Truncated to: $BRANCH_NAME (${#BRANCH_NAME} bytes)"
fi

# Create git branch (unless skipped or no git)
if [[ "$SKIP_BRANCH" = true ]]; then
    >&2 echo "[speckit] Skipping branch creation (--skip-branch)"
elif [[ "$HAS_GIT" = true ]]; then
    git checkout -b "$BRANCH_NAME"
else
    >&2 echo "[speckit] Warning: Git repository not detected; skipped branch creation for $BRANCH_NAME"
fi

# ───────────────────────────────────────────────────────────────
# 5. CREATE SPEC FOLDER STRUCTURE
# ───────────────────────────────────────────────────────────────

FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"

TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"

# Normalize DOC_LEVEL for numeric comparisons (3+ becomes 3)
DOC_LEVEL_NUM="${DOC_LEVEL/+/}"
LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")
CREATED_FILES=()

# Validate templates directory exists
if [[ ! -d "$TEMPLATES_BASE" ]]; then
    echo "Error: Templates directory not found at $TEMPLATES_BASE" >&2
    exit 1
fi

# Validate level folder exists (with fallback warning)
if [[ ! -d "$LEVEL_TEMPLATES_DIR" ]]; then
    >&2 echo "[speckit] Warning: Level folder not found at $LEVEL_TEMPLATES_DIR, using base templates"
    LEVEL_TEMPLATES_DIR="$TEMPLATES_BASE"
fi

mkdir -p "$FEATURE_DIR" "$FEATURE_DIR/scratch" "$FEATURE_DIR/memory"
touch "$FEATURE_DIR/scratch/.gitkeep" "$FEATURE_DIR/memory/.gitkeep"

# ───────────────────────────────────────────────────────────────
# 6. COPY TEMPLATES BASED ON DOCUMENTATION LEVEL
# ───────────────────────────────────────────────────────────────

# Copy all templates from the level folder (using library copy_template)
for template_file in "$LEVEL_TEMPLATES_DIR"/*.md; do
    if [[ -f "$template_file" ]]; then
        template_name=$(basename "$template_file")
        CREATED_FILES+=("$(copy_template "$template_name" "$FEATURE_DIR" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE")")
    fi
done

# ───────────────────────────────────────────────────────────────
# 7. SHARDED SPEC SECTIONS (Level 3 with --sharded flag)
# ───────────────────────────────────────────────────────────────

if [[ "$SHARDED" = true ]] && [[ "${DOC_LEVEL/+/}" -ge 3 ]]; then
    # Create spec-sections directory
    mkdir -p "$FEATURE_DIR/spec-sections"
    CREATED_FILES+=("spec-sections/")

    # Resolve sharded templates directory
    SHARDED_TEMPLATES_DIR="$TEMPLATES_BASE/sharded"

    # Copy sharded index template (overwrites the standard spec.md)
    if [[ -f "$SHARDED_TEMPLATES_DIR/spec-index.md" ]]; then
        cp "$SHARDED_TEMPLATES_DIR/spec-index.md" "$FEATURE_DIR/spec.md"
    else
        >&2 echo "[speckit] Warning: Sharded template not found: $SHARDED_TEMPLATES_DIR/spec-index.md"
    fi

    # Copy section templates
    for shard in 01-overview.md 02-requirements.md 03-architecture.md 04-testing.md; do
        if [[ -f "$SHARDED_TEMPLATES_DIR/$shard" ]]; then
            cp "$SHARDED_TEMPLATES_DIR/$shard" "$FEATURE_DIR/spec-sections/$shard"
            CREATED_FILES+=("spec-sections/$shard")
        else
            >&2 echo "[speckit] Warning: Sharded template not found: $SHARDED_TEMPLATES_DIR/$shard"
            touch "$FEATURE_DIR/spec-sections/$shard"
            CREATED_FILES+=("spec-sections/$shard (empty - template not found)")
        fi
    done

elif [[ "$SHARDED" = true ]] && [[ "${DOC_LEVEL/+/}" -lt 3 ]]; then
    echo "Warning: --sharded flag is only supported with --level 3 or 3+. Ignoring --sharded." >&2
fi

# Set paths for output
SPEC_FILE="$FEATURE_DIR/spec.md"

# Set the SPECIFY_FEATURE environment variable for the current session
export SPECIFY_FEATURE="$BRANCH_NAME"

# ───────────────────────────────────────────────────────────────
# 10. OUTPUT
# ───────────────────────────────────────────────────────────────

if $JSON_MODE; then
    # Build JSON array of created files
    files_json=$(printf '"%s",' "${CREATED_FILES[@]}" | sed 's/,$//')

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

    # P1-03 FIX: Escape JSON values to prevent injection
    printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","DOC_LEVEL":"%s","SHARDED":%s%s%s,"CREATED_FILES":[%s]}\n' \
        "$(_json_escape "$BRANCH_NAME")" "$(_json_escape "$SPEC_FILE")" "$FEATURE_NUM" "$DOC_LEVEL" "$SHARDED" "$complexity_json" "$expansion_json" "$files_json"
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
    echo "      ├── scratch/          (git-ignored working files)"
    echo "      │   └── .gitkeep"
    echo "      └── memory/           (context preservation)"
    echo "          └── .gitkeep"
    echo ""
    echo "  Level $DOC_LEVEL Documentation (CORE + ADDENDUM v2.0):"
    case $DOC_LEVEL in
        1) echo "    ✓ Core: spec.md + plan.md + tasks.md + implementation-summary.md"
           echo "      (Essential what/why/how - ~270 LOC)" ;;
        2) echo "    ✓ Core: spec.md + plan.md + tasks.md + implementation-summary.md"
           echo "    ✓ +Verify: checklist.md, NFRs, edge cases, effort estimation"
           echo "      (Quality gates - adds ~120 LOC)" ;;
        3|"3+") echo "    ✓ Core: spec.md + plan.md + tasks.md + implementation-summary.md"
           echo "    ✓ +Verify: checklist.md, NFRs, edge cases"
           echo "    ✓ +Arch: decision-record.md, executive summary, risk matrix"
           if [[ "$DOC_LEVEL" = "3+" ]]; then
               echo "    ✓ +Govern: approval workflow, compliance, AI protocols"
               echo "      (Full governance - adds ~100 LOC)"
           else
               echo "      (Architecture decisions - adds ~150 LOC)"
           fi
           if [[ "$SHARDED" = true ]]; then
               echo "    ✓ Sharded: spec-sections/ (modular documentation)"
           fi ;;
    esac
    echo ""
    echo "  Next steps:"
    echo "    1. Fill out spec.md with requirements"
    echo "    2. Create implementation plan in plan.md"
    echo "    3. Break down tasks in tasks.md"
    [[ "${DOC_LEVEL/+/}" -ge 2 ]] && echo "    4. Add verification items to checklist.md"
    [[ "${DOC_LEVEL/+/}" -ge 3 ]] && echo "    5. Document decisions in decision-record.md"
    echo ""
    echo "───────────────────────────────────────────────────────────────────"
fi
