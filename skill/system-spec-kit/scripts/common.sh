#!/usr/bin/env bash
#
# common.sh - SpecKit Shared Utility Functions
#
# This file is sourced by other SpecKit scripts to provide consistent
# functionality for repository detection, branch management, and path resolution.
#
# VERSION: 2.0.0
# UPDATED: 2025-12-10
#
# USAGE: source "$SCRIPT_DIR/common.sh"
#

# ============================================================================
# REPOSITORY ROOT DETECTION
# ============================================================================

# get_repo_root()
# Find the repository root directory, with fallback for non-git repositories.
# Returns: Absolute path to repository root
get_repo_root() {
    if git rev-parse --show-toplevel >/dev/null 2>&1; then
        git rev-parse --show-toplevel
    else
        # Fall back to script location for non-git repos
        local script_dir
        script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        (cd "$script_dir/../../../.." && pwd)
    fi
}

# ============================================================================
# BRANCH DETECTION
# ============================================================================

# get_current_branch()
# Determine the current feature branch/folder using multiple fallback sources.
# Priority: 1) SPECIFY_FEATURE env var, 2) git branch, 3) latest specs/ folder
# Returns: Branch/feature name string
get_current_branch() {
    # Priority 1: Environment variable (highest priority, set by create-spec-folder.sh)
    if [[ -n "${SPECIFY_FEATURE:-}" ]]; then
        echo "$SPECIFY_FEATURE"
        return
    fi

    # Priority 2: Git branch name
    if git rev-parse --abbrev-ref HEAD >/dev/null 2>&1; then
        git rev-parse --abbrev-ref HEAD
        return
    fi

    # Priority 3: Latest numbered folder in specs/ (for non-git repos)
    local repo_root
    repo_root="$(get_repo_root)"
    local specs_dir="$repo_root/specs"

    if [[ -d "$specs_dir" ]]; then
        local latest_feature=""
        local highest=0

        for dir in "$specs_dir"/*; do
            if [[ -d "$dir" ]]; then
                local dirname
                dirname="$(basename "$dir")"
                if [[ "$dirname" =~ ^([0-9]{3})- ]]; then
                    local number="${BASH_REMATCH[1]}"
                    number=$((10#$number))
                    if [[ "$number" -gt "$highest" ]]; then
                        highest="$number"
                        latest_feature="$dirname"
                    fi
                fi
            fi
        done

        if [[ -n "$latest_feature" ]]; then
            echo "$latest_feature"
            return
        fi
    fi

    # Final fallback
    echo "main"
}

# has_git()
# Check if we're in a git repository.
# Returns: Exit code 0 if git available, 1 otherwise
has_git() {
    git rev-parse --show-toplevel >/dev/null 2>&1
}

# ============================================================================
# BRANCH VALIDATION
# ============================================================================

# check_feature_branch()
# Validate that the branch follows the NNN-name naming convention.
# Args: $1 - branch name, $2 - has_git flag ("true" or "false")
# Returns: Exit code 0 if valid, 1 if invalid
check_feature_branch() {
    local branch="$1"
    local has_git_repo="${2:-false}"

    # For non-git repos, we can't enforce branch naming but still provide output
    if [[ "$has_git_repo" != "true" ]]; then
        echo "[speckit] Warning: Git repository not detected; skipped branch validation" >&2
        return 0
    fi

    if [[ ! "$branch" =~ ^[0-9]{3}- ]]; then
        echo "ERROR: Not on a feature branch. Current branch: $branch" >&2
        echo "Feature branches should be named like: 001-feature-name" >&2
        return 1
    fi

    return 0
}

# ============================================================================
# PATH RESOLUTION
# ============================================================================

# get_feature_dir()
# Build the feature directory path from repo root and branch name.
# Args: $1 - repo root, $2 - branch name
# Returns: Feature directory path
get_feature_dir() {
    echo "$1/specs/$2"
}

# find_feature_dir_by_prefix()
# Find specs/ folder by numeric prefix, allowing multiple branches per spec.
# This enables branches like 004-fix-bug and 004-add-feature to share specs/004-xxx/.
# Args: $1 - repo root, $2 - branch name
# Returns: Feature directory path (or error message to stderr)
find_feature_dir_by_prefix() {
    local repo_root="$1"
    local branch_name="$2"
    local specs_dir="$repo_root/specs"

    # Extract numeric prefix from branch (e.g., "004" from "004-whatever")
    if [[ ! "$branch_name" =~ ^([0-9]{3})- ]]; then
        # If branch doesn't have numeric prefix, fall back to exact match
        echo "$specs_dir/$branch_name"
        return
    fi

    local prefix="${BASH_REMATCH[1]}"

    # Search for directories in specs/ that start with this prefix
    local matches=()
    if [[ -d "$specs_dir" ]]; then
        for dir in "$specs_dir"/"$prefix"-*; do
            if [[ -d "$dir" ]]; then
                matches+=("$(basename "$dir")")
            fi
        done
    fi

    # Handle results
    if [[ ${#matches[@]} -eq 0 ]]; then
        # No match found - return the branch name path (will fail later with clear error)
        echo "$specs_dir/$branch_name"
    elif [[ ${#matches[@]} -eq 1 ]]; then
        # Exactly one match - perfect!
        echo "$specs_dir/${matches[0]}"
    else
        # Multiple matches - this shouldn't happen with proper naming convention
        echo "ERROR: Multiple spec directories found with prefix '$prefix': ${matches[*]}" >&2
        echo "Please ensure only one spec directory exists per numeric prefix." >&2
        echo "$specs_dir/$branch_name"  # Return something to avoid breaking the script
    fi
}

# get_feature_paths()
# Export all feature-related paths as eval-able shell variables.
# Usage: eval "$(get_feature_paths)"
# Sets: REPO_ROOT, CURRENT_BRANCH, HAS_GIT, FEATURE_DIR, FEATURE_SPEC, IMPL_PLAN, etc.
#
# SECURITY: Uses printf %q for shell-safe quoting to prevent injection attacks.
# This protects against malicious directory names or branch names containing
# shell metacharacters (quotes, $(), backticks, semicolons, etc.).
get_feature_paths() {
    local repo_root
    repo_root="$(get_repo_root)"
    local current_branch
    current_branch="$(get_current_branch)"
    local has_git_repo="false"

    if has_git; then
        has_git_repo="true"
    fi

    # Use prefix-based lookup to support multiple branches per spec
    local feature_dir
    feature_dir="$(find_feature_dir_by_prefix "$repo_root" "$current_branch")"

    # SECURITY: printf %q escapes all shell metacharacters, preventing injection
    # when this output is passed to eval. Never use simple quoting here.
    printf 'REPO_ROOT=%q\n' "$repo_root"
    printf 'CURRENT_BRANCH=%q\n' "$current_branch"
    printf 'HAS_GIT=%q\n' "$has_git_repo"
    printf 'FEATURE_DIR=%q\n' "$feature_dir"
    printf 'FEATURE_SPEC=%q\n' "$feature_dir/spec.md"
    printf 'IMPL_PLAN=%q\n' "$feature_dir/plan.md"
    printf 'TASKS=%q\n' "$feature_dir/tasks.md"
    printf 'RESEARCH=%q\n' "$feature_dir/research.md"
    printf 'DATA_MODEL=%q\n' "$feature_dir/data-model.md"
    printf 'QUICKSTART=%q\n' "$feature_dir/quickstart.md"
    printf 'CONTRACTS_DIR=%q\n' "$feature_dir/contracts"
    printf 'CHECKLISTS_DIR=%q\n' "$feature_dir/checklists"
    printf 'DECISIONS_DIR=%q\n' "$feature_dir/decisions"
    printf 'RESEARCH_SPIKES_DIR=%q\n' "$feature_dir/research-spikes"
}

# ============================================================================
# DISPLAY HELPERS
# ============================================================================

# check_file()
# Display file existence status with checkmark.
# Args: $1 - file path, $2 - display name
check_file() {
    if [[ -f "$1" ]]; then
        echo "  ✓ $2"
    else
        echo "  ✗ $2"
    fi
}

# check_dir()
# Display directory existence status with checkmark (must have contents).
# Args: $1 - directory path, $2 - display name
check_dir() {
    if [[ -d "$1" ]] && [[ -n "$(ls -A "$1" 2>/dev/null)" ]]; then
        echo "  ✓ $2"
    else
        echo "  ✗ $2"
    fi
}
