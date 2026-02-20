#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: check-links.sh
# ───────────────────────────────────────────────────────────────
# Validate wikilinks within markdown files.
# It checks both [[link]] and [[link|alias]] formats, ignoring code blocks.

set -euo pipefail

# Standard colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BOLD='\033[1m'
NC='\033[0m'

if [[ ! -t 1 ]]; then
    RED='' GREEN='' BOLD='' NC=''
fi

SKILL_DIR=".opencode/skill"

# Temporary file to store results
TEMP_FILE=$(mktemp)
trap 'rm -f "$TEMP_FILE"' EXIT

main() {
    if [[ ! -d "$SKILL_DIR" ]]; then
        printf "${RED}ERROR:${NC} Skill directory not found at %s\n" "$SKILL_DIR" >&2
        exit 1
    fi

    local has_errors=0
    local file=""
    local dir=""
    local links=""
    local inner=""
    local target=""

    # Using process substitution with find to avoid subshell variable scope issues
    # Find all markdown files, explicitly ignoring node_modules directories
    while IFS= read -r file; do
        dir=$(dirname "$file")
        
        # Strip fenced code blocks and inline code, then extract wikilinks (P1-5 fix)
        links=$(perl -0777 -pe 's/```[\s\S]*?```//g; s/`[^`]+`//g' "$file" | perl -ne 'while (/\[\[(.*?)\]\]/g) { print "$1\n" }')
        
        if [[ -z "$links" ]]; then
            continue
        fi
        
        # Read links line by line
        while IFS= read -r inner; do
            if [[ -z "$inner" ]]; then
                continue
            fi
            
            # Heuristics to ignore bash conditional tests and Next.js route patterns
            # e.g. [[ -f "$file" ]] or [[...slug]]
            if [[ "$inner" =~ ^\ +.* ]] || \
               [[ "$inner" =~ \ -[a-z]\  ]] || \
               [[ "$inner" =~ \ ==\  ]] || \
               [[ "$inner" =~ \ !=\  ]] || \
               [[ "$inner" =~ ^\.\.\..* ]] || \
               [[ "$inner" =~ ^\!.* ]] || \
               [[ "$inner" =~ \ \&\&\  ]] || \
               [[ "$inner" =~ \ \|\|\  ]]; then
               continue
            fi
            
            # Handle aliases: extract target from [[target|alias]]
            target=$(echo "$inner" | cut -d'|' -f1)
            
            # Auto-resolve .md extension if missing
            if [[ "$target" != *.md ]]; then
                target="${target}.md"
            fi
            
            # Determine the skill subdirectory for this file (P1-6: consistent resolution)
            local skill_subdir=""
            skill_subdir=$(echo "$file" | sed -n "s|^\(${SKILL_DIR}/[^/]*\)/.*|\1|p")

            # Check if file exists relative to:
            # 1. current file's directory
            # 2. the global SKILL_DIR
            # 3. the file's skill subdirectory (matches graph-builder resolution)
            if [[ ! -f "$dir/$target" ]] && [[ ! -f "$SKILL_DIR/$target" ]] && \
               { [[ -z "$skill_subdir" ]] || [[ ! -f "$skill_subdir/$target" ]]; }; then
                echo "File: $file - Broken link: [[$inner]] (Target not found: $target)" >> "$TEMP_FILE"
                has_errors=1
            fi
        done <<< "$links"
    done < <(find "$SKILL_DIR" \( -type d -name "node_modules" -o -type d -name "assets" \) -prune -o -name "*.md" -type f -print)

    if [[ $has_errors -eq 0 ]]; then
        printf "${GREEN}✅ All wikilinks are valid.${NC}\n"
        exit 0
    else
        printf "${RED}❌ Broken wikilinks found:${NC}\n"
        cat "$TEMP_FILE"
        exit 1
    fi
}

main "$@"
