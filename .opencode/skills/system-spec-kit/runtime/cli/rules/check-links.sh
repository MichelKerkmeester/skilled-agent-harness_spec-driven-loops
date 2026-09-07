#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-LINKS
# ───────────────────────────────────────────────────────────────
# Validates wikilinks across skill markdown files. Two entry points share one
# scan: validate.sh sources run_check() through the registry row LINKS_VALID,
# and main() runs the same scan by hand over any skill tree.
#
# The registry rule always scans the system-spec-kit skill that owns this
# script, never the packet being validated: a packet's own documents carry no
# wikilinks by contract, and the rule exists so a broken reference inside the
# skill's own references and workflows fails the skill's validations, not a
# stranger's. Other skills' link health belongs to the standalone run.
#
# Exit Codes (standalone mode):
#   0 - All wikilinks resolve
#   1 - Missing skill directory or broken wikilinks found

set -euo pipefail

_links_rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_links_skill_root="$(cd "${_links_rule_dir}/../../.." && pwd)"

DEFAULT_SKILL_DIR=".opencode/skills"

# Prints one "file<TAB>link" line per wikilink found under the tree, in a single
# pass over every markdown file. Fenced blocks and code spans are stripped
# before extraction; a backslash-escaped backtick is not a span delimiter, so a
# wikilink behind escaped backticks stays checked.
extract_wikilinks() {
    local skill_dir="$1"
    find "$skill_dir" \( -type d -name "node_modules" -o -type d -name "assets" \) -prune -o -name "*.md" -type f -print0 \
        | perl -0 -ne '
            chomp;
            my $file = $_;
            local $/;
            open(my $fh, "<", $file) or next;
            my $text = <$fh>;
            close $fh;
            $text =~ s/```[\s\S]*?```//g;
            $text =~ s/(?<!\\)``[\s\S]*?``//g;
            $text =~ s/(?<!\\)`[^`]+`//g;
            while ($text =~ /\[\[(.*?)\]\]/g) { print "$file\t$1\n"; }
        '
}

# Appends "File: <file> - Broken link: [[inner]] (Target not found: target)"
# to the output file for every wikilink whose target resolves nowhere.
scan_wikilinks() {
    local skill_dir="$1"
    local output_file="$2"
    local has_errors=0

    local file=""
    local dir=""
    local inner=""
    local target=""
    local skill_subdir=""

    while IFS=$'\t' read -r file inner; do
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

        dir=$(dirname "$file")
        target=${inner%%|*}
        [[ "$target" != *.md ]] && target="${target}.md"

        # Resolve references within the local skill first.
        skill_subdir=$(echo "$file" | sed -n "s|^\(${skill_dir}/[^/]*\)/.*|\1|p")

        if [[ ! -f "$dir/$target" ]] && [[ ! -f "$skill_dir/$target" ]] && \
           { [[ -z "$skill_subdir" ]] || [[ ! -f "$skill_subdir/$target" ]]; }; then
            echo "File: $file - Broken link: [[$inner]] (Target not found: $target)" >> "$output_file"
            has_errors=1
        fi
    done < <(extract_wikilinks "$skill_dir")

    return "$has_errors"
}

# Registry entry point. The folder and level arguments are accepted for the
# orchestrator's contract and ignored: the scan target is fixed to this skill.
run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="LINKS_VALID"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local temp_file
    temp_file=$(mktemp)

    if scan_wikilinks "$_links_skill_root" "$temp_file"; then
        RULE_MESSAGE="All wikilinks under the system-spec-kit skill resolve"
        rm -f "$temp_file"
        return 0
    fi

    local line
    while IFS= read -r line; do
        RULE_DETAILS+=("${line#File: }")
    done < "$temp_file"
    rm -f "$temp_file"

    RULE_STATUS="fail"
    RULE_MESSAGE="Found ${#RULE_DETAILS[@]} broken wikilink(s) under the system-spec-kit skill"
    RULE_REMEDIATION="Point each [[wikilink]] at a file that exists, or write the name as inline code when it names something outside the repository"
    return 0
}

main() {
    local skill_dir="${1:-$DEFAULT_SKILL_DIR}"

    local red='\033[0;31m' green='\033[0;32m' nc='\033[0m'
    if [[ ! -t 1 ]]; then
        red='' green='' nc=''
    fi

    if [[ ! -d "$skill_dir" ]]; then
        printf "${red}ERROR:${nc} Skill directory not found at %s\n" "$skill_dir" >&2
        exit 1
    fi

    local temp_file
    temp_file=$(mktemp)
    trap 'rm -f "$temp_file"' EXIT

    if scan_wikilinks "$skill_dir" "$temp_file"; then
        printf "${green}✅ All wikilinks are valid.${nc}\n"
        exit 0
    fi

    printf "${red}❌ Broken wikilinks found:${nc}\n"
    cat "$temp_file"
    exit 1
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    main "$@"
fi
