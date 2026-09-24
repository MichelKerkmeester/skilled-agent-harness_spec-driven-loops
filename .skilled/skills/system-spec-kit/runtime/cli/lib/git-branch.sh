#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Git Branch
# ───────────────────────────────────────────────────────────────
# Git branch utilities for spec-kit scripts.
# Source this file: source "$(dirname "$0")/../lib/git-branch.sh"
#
# Functions:
# Highest_branch_number()    - Highest NNN prefix among known branch refs
# Generate_branch_name()     - Create branch name from description
#
# Compatibility: Bash 3.2+ (macOS default)
# ───────────────────────────────────────────────────────────────

# Conditional strict mode — skipped when sourced to avoid breaking caller's error handling.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    set -euo pipefail
fi

# Guard against double-sourcing
[[ -n "${_GIT_BRANCH_LOADED:-}" ]] && return 0
_GIT_BRANCH_LOADED=1

# ───────────────────────────────────────────────────────────────
# Print the highest NNN prefix among local branches and the remote-tracking
# refs git already has, or 0 when there is none. Only three digits and a
# hyphen count, the shape packet branches take, so a date-shaped name such as
# 2026-09-24-hotfix does not. It reads refs only and fetches nothing, so
# numbering needs no network and never prunes a ref.
#
# Usage: highest=$(highest_branch_number)
# Returns: Prints the highest branch number to stdout
# ───────────────────────────────────────────────────────────────
highest_branch_number() {
    local highest=0
    local ref name number
    while IFS= read -r ref; do
        case "$ref" in
            refs/heads/*) name="${ref#refs/heads/}" ;;
            refs/remotes/*/*) name="${ref#refs/remotes/*/}" ;;
            *) continue ;;
        esac
        [[ "$name" =~ ^([0-9]{3})- ]] || continue
        number=$((10#${BASH_REMATCH[1]}))
        if [[ "$number" -gt "$highest" ]]; then
            highest=$number
        fi
    done < <(git for-each-ref --format='%(refname)' refs/heads refs/remotes 2>/dev/null)
    printf '%s\n' "$highest"
}

# ───────────────────────────────────────────────────────────────
# Generate a concise branch name from a feature description.
# Applies NLP-lite stop word filtering to extract meaningful words.
#
# Usage: branch_suffix=$(generate_branch_name "Add user authentication system")
# Returns: Prints hyphenated branch name (e.g., "user-authentication-system") to stdout
# ───────────────────────────────────────────────────────────────
generate_branch_name() {
    local description="$1"
    
    # Common stop words to filter out
    local stop_words="^(i|a|an|the|to|for|of|in|on|at|by|with|from|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|should|could|can|may|might|must|shall|this|that|these|those|my|your|our|their|want|need|add|get|set)$"
    
    # Convert to lowercase and split into words
    local clean_name
    clean_name=$(printf '%s\n' "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/ /g')
    
    # Filter words: remove stop words and words shorter than 3 chars (unless they're uppercase acronyms in original)
    local meaningful_words=()
    for word in $clean_name; do
        # Skip empty words
        [[ -z "$word" ]] && continue
        
        # Keep words that are NOT stop words AND (length >= 3 OR are potential acronyms)
        if ! printf '%s\n' "$word" | grep -qiE "$stop_words"; then
            if [[ ${#word} -ge 3 ]]; then
                meaningful_words+=("$word")
            else
                # Check if word appears as uppercase in original (likely acronym)
                # Use tr for bash 3.2 compatibility (macOS default) instead of ${word^^}
                local word_upper
                word_upper=$(printf '%s\n' "$word" | tr '[:lower:]' '[:upper:]')
                if printf '%s\n' "$description" | grep -qw "${word_upper}"; then
                    # Keep short words if they appear as uppercase in original (likely acronyms)
                    meaningful_words+=("$word")
                fi
            fi
        fi
    done
    
    # If we have meaningful words, use first 3-4 of them
    if [[ ${#meaningful_words[@]} -gt 0 ]]; then
        local max_words=3
        if [[ ${#meaningful_words[@]} -eq 4 ]]; then max_words=4; fi
        
        local result=""
        local count=0
        for word in "${meaningful_words[@]}"; do
            if [[ $count -ge $max_words ]]; then break; fi
            if [[ -n "$result" ]]; then result="$result-"; fi
            result="$result$word"
            count=$((count + 1))
        done
        printf '%s\n' "$result"
    else
        # Fallback to original logic if no meaningful words found
        printf '%s\n' "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | tr '-' '\n' | grep -v '^$' | head -3 | tr '\n' '-' | sed 's/-$//'
    fi
}

# Exit codes:
# 0 - Success
