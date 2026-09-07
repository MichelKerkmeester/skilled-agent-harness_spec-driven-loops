#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-LINKS
# ───────────────────────────────────────────────────────────────
# Validates wikilinks across skill markdown files. A standalone scan run on
# demand: it has no validator-registry row, so validate.sh never sources it.
#
# Exit Codes (standalone mode):
#   0 - All wikilinks resolve
#   1 - Missing skill directory or broken wikilinks found

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
BOLD='\033[1m'
NC='\033[0m'

if [[ ! -t 1 ]]; then
    RED='' GREEN='' BOLD='' NC=''
fi

DEFAULT_SKILL_DIR=".opencode/skills"

scan_wikilinks() {
    local skill_dir="$1"
    local output_file="$2"
    local has_errors=0

    local file=""
    local dir=""
    local links=""
    local inner=""
    local target=""
    local skill_subdir=""

    while IFS= read -r file; do
        dir=$(dirname "$file")

        # Strip fenced code blocks and inline code before extracting wikilinks. A backslash-escaped
        # backtick is not a code-span delimiter, so a wikilink behind escaped backticks stays checked
        # (no false negative); double-backtick spans are stripped before single-backtick spans.
        links=$(perl -0777 -pe 's/```[\s\S]*?```//g; s/(?<!\\)``[\s\S]*?``//g; s/(?<!\\)`[^`]+`//g' "$file" | perl -ne 'while (/\[\[(.*?)\]\]/g) { print "$1\n" }')
        [[ -z "$links" ]] && continue

        while IFS= read -r inner; do
            [[ -z "$inner" ]] && continue

            # Ignore shell-test and route-pattern false positives.
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

            target=$(echo "$inner" | cut -d'|' -f1)
            [[ "$target" != *.md ]] && target="${target}.md"

            # Resolve references within the local skill first.
            skill_subdir=$(echo "$file" | sed -n "s|^\(${skill_dir}/[^/]*\)/.*|\1|p")

            if [[ ! -f "$dir/$target" ]] && [[ ! -f "$skill_dir/$target" ]] && \
               { [[ -z "$skill_subdir" ]] || [[ ! -f "$skill_subdir/$target" ]]; }; then
                echo "File: $file - Broken link: [[$inner]] (Target not found: $target)" >> "$output_file" >&2
                has_errors=1
            fi
        done <<< "$links"
    done < <(find "$skill_dir" \( -type d -name "node_modules" -o -type d -name "assets" \) -prune -o -name "*.md" -type f -print)

    return "$has_errors"
}

main() {
    local skill_dir="${1:-$DEFAULT_SKILL_DIR}"

    if [[ ! -d "$skill_dir" ]]; then
        printf "${RED}ERROR:${NC} Skill directory not found at %s\n" "$skill_dir" >&2
        exit 1
    fi

    local temp_file
    temp_file=$(mktemp)
    trap 'rm -f "$temp_file"' EXIT

    if scan_wikilinks "$skill_dir" "$temp_file"; then
        printf "${GREEN}✅ All wikilinks are valid.${NC}\n"
        exit 0
    fi

    printf "${RED}❌ Broken wikilinks found:${NC}\n"
    cat "$temp_file"
    exit 1
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    main "$@"
fi

# Exit codes:
#   0 - Success
#   1 - General error
