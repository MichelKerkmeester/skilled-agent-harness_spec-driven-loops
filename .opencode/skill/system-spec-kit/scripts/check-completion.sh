#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPEC-KIT: CHECK COMPLETION
# ───────────────────────────────────────────────────────────────
#
# Gate 6 Enforcement: Verify Checklist Completion
# Exit: 0=complete, 1=incomplete, 2=error

set -eo pipefail

SCRIPT_NAME="check-completion.sh"
FOLDER_PATH=""
JSON_MODE=false
STRICT_MODE=false
QUIET_MODE=false

TOTAL_ITEMS=0
COMPLETED_ITEMS=0
P0_TOTAL=0
P0_COMPLETE=0
P1_TOTAL=0
P1_COMPLETE=0
P2_TOTAL=0
P2_COMPLETE=0

if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    BOLD='\033[1m'
    NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi

show_help() {
    cat << EOF
$SCRIPT_NAME - Gate 6 Enforcement: Verify Checklist Completion

USAGE:
  ./$SCRIPT_NAME <spec-folder-path> [OPTIONS]

OPTIONS:
  --json      Output in JSON format
  --strict    Treat P2 items as required (default: P2 can be deferred)
  --quiet     Suppress output, exit code only
  --help      Show this help

EXIT CODES:
  0 = All required items complete (P0 + P1, or all if --strict)
  1 = Incomplete items found
  2 = Error (file not found, invalid path, etc.)

PRIORITY ENFORCEMENT:
  [P0] Critical  - HARD BLOCKER, must be complete
  [P1] High      - Required, must complete OR get user approval
  [P2] Medium    - Can defer with documented reason (unless --strict)

EXAMPLES:
  ./$SCRIPT_NAME specs/007-feature/
  ./$SCRIPT_NAME specs/007-feature/ --json
  ./$SCRIPT_NAME specs/007-feature/ --strict
EOF
    exit 0
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --help|-h) show_help ;;
            --json) JSON_MODE=true; shift ;;
            --strict) STRICT_MODE=true; shift ;;
            --quiet|-q) QUIET_MODE=true; shift ;;
            -*)
                echo "ERROR: Unknown option '$1'" >&2
                exit 2
                ;;
            *)
                if [[ -z "$FOLDER_PATH" ]]; then
                    FOLDER_PATH="$1"
                else
                    echo "ERROR: Multiple paths provided" >&2
                    exit 2
                fi
                shift
                ;;
        esac
    done

    if [[ -z "$FOLDER_PATH" ]]; then
        echo "ERROR: Spec folder path required" >&2
        echo "Usage: ./$SCRIPT_NAME <spec-folder-path>" >&2
        exit 2
    fi

    FOLDER_PATH="${FOLDER_PATH%/}"

    if [[ ! -d "$FOLDER_PATH" ]]; then
        echo "ERROR: Folder not found: $FOLDER_PATH" >&2
        exit 2
    fi
}

count_checklist_items() {
    local checklist_file="$1"

    while IFS= read -r line; do
        if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[([[:space:]]|x|X)\][[:space:]] ]]; then
            ((TOTAL_ITEMS++)) || true

            if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[xX]\] ]]; then
                ((COMPLETED_ITEMS++)) || true
            fi

            if [[ "$line" =~ \[P0\] ]]; then
                ((P0_TOTAL++)) || true
                if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[xX]\] ]]; then
                    ((P0_COMPLETE++)) || true
                fi
            elif [[ "$line" =~ \[P1\] ]]; then
                ((P1_TOTAL++)) || true
                if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[xX]\] ]]; then
                    ((P1_COMPLETE++)) || true
                fi
            elif [[ "$line" =~ \[P2\] ]]; then
                ((P2_TOTAL++)) || true
                if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[xX]\] ]]; then
                    ((P2_COMPLETE++)) || true
                fi
            fi
        fi
    done < "$checklist_file"
}

calculate_status() {
    local p0_pass=true
    local p1_pass=true
    local p2_pass=true

    if [[ $P0_TOTAL -gt 0 && $P0_COMPLETE -lt $P0_TOTAL ]]; then
        p0_pass=false
    fi

    if [[ $P1_TOTAL -gt 0 && $P1_COMPLETE -lt $P1_TOTAL ]]; then
        p1_pass=false
    fi

    if $STRICT_MODE; then
        if [[ $P2_TOTAL -gt 0 && $P2_COMPLETE -lt $P2_TOTAL ]]; then
            p2_pass=false
        fi
    fi

    if ! $p0_pass; then
        echo "P0_INCOMPLETE"
    elif ! $p1_pass; then
        echo "P1_INCOMPLETE"
    elif $STRICT_MODE && ! $p2_pass; then
        echo "P2_INCOMPLETE"
    else
        echo "COMPLETE"
    fi
}

output_json() {
    local status="$1"
    local passed="false"
    [[ "$status" == "COMPLETE" ]] && passed="true"

    cat << EOF
{
  "folder": "$FOLDER_PATH",
  "status": "$status",
  "passed": $passed,
  "strict": $STRICT_MODE,
  "summary": {
    "total": $TOTAL_ITEMS,
    "completed": $COMPLETED_ITEMS,
    "percentage": $(( TOTAL_ITEMS > 0 ? (COMPLETED_ITEMS * 100 / TOTAL_ITEMS) : 0 ))
  },
  "priorities": {
    "p0": { "total": $P0_TOTAL, "completed": $P0_COMPLETE },
    "p1": { "total": $P1_TOTAL, "completed": $P1_COMPLETE },
    "p2": { "total": $P2_TOTAL, "completed": $P2_COMPLETE }
  }
}
EOF
}

output_text() {
    local status="$1"
    local percentage=$(( TOTAL_ITEMS > 0 ? (COMPLETED_ITEMS * 100 / TOTAL_ITEMS) : 0 ))

    echo -e "\n${BLUE}───────────────────────────────────────────────────────────────${NC}"
    echo -e "${BLUE}  Checklist Completion Check${NC}"
    echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}\n"

    echo -e "  ${BOLD}Folder:${NC} $FOLDER_PATH"
    echo -e "  ${BOLD}Mode:${NC}   $(if $STRICT_MODE; then echo "Strict (P2 required)"; else echo "Standard (P2 deferrable)"; fi)"

    echo -e "\n${BLUE}───────────────────────────────────────────────────────────────${NC}\n"

    echo -e "  ${BOLD}Priority Breakdown:${NC}"
    
    if [[ $P0_TOTAL -gt 0 ]]; then
        if [[ $P0_COMPLETE -eq $P0_TOTAL ]]; then
            echo -e "    ${GREEN}✓${NC} [P0] Critical: $P0_COMPLETE/$P0_TOTAL complete"
        else
            echo -e "    ${RED}✗${NC} [P0] Critical: $P0_COMPLETE/$P0_TOTAL complete ${RED}(BLOCKING)${NC}"
        fi
    fi

    if [[ $P1_TOTAL -gt 0 ]]; then
        if [[ $P1_COMPLETE -eq $P1_TOTAL ]]; then
            echo -e "    ${GREEN}✓${NC} [P1] High: $P1_COMPLETE/$P1_TOTAL complete"
        else
            echo -e "    ${RED}✗${NC} [P1] High: $P1_COMPLETE/$P1_TOTAL complete ${RED}(REQUIRED)${NC}"
        fi
    fi

    if [[ $P2_TOTAL -gt 0 ]]; then
        if [[ $P2_COMPLETE -eq $P2_TOTAL ]]; then
            echo -e "    ${GREEN}✓${NC} [P2] Medium: $P2_COMPLETE/$P2_TOTAL complete"
        else
            if $STRICT_MODE; then
                echo -e "    ${RED}✗${NC} [P2] Medium: $P2_COMPLETE/$P2_TOTAL complete ${RED}(REQUIRED in strict)${NC}"
            else
                echo -e "    ${YELLOW}⚠${NC} [P2] Medium: $P2_COMPLETE/$P2_TOTAL complete ${YELLOW}(deferrable)${NC}"
            fi
        fi
    fi

    echo -e "\n${BLUE}───────────────────────────────────────────────────────────────${NC}\n"

    echo -e "  ${BOLD}Summary:${NC} $COMPLETED_ITEMS/$TOTAL_ITEMS items ($percentage%)"
    echo ""

    case "$status" in
        COMPLETE)
            echo -e "  ${GREEN}${BOLD}RESULT: READY FOR COMPLETION${NC}"
            echo -e "  All required items verified. You may claim completion."
            ;;
        P0_INCOMPLETE)
            echo -e "  ${RED}${BOLD}RESULT: BLOCKED${NC}"
            echo -e "  P0 (Critical) items incomplete. Cannot claim completion."
            ;;
        P1_INCOMPLETE)
            echo -e "  ${RED}${BOLD}RESULT: BLOCKED${NC}"
            echo -e "  P1 (High) items incomplete. Complete or get user approval."
            ;;
        P2_INCOMPLETE)
            echo -e "  ${YELLOW}${BOLD}RESULT: BLOCKED (strict mode)${NC}"
            echo -e "  P2 items incomplete. Required in strict mode."
            ;;
    esac

    echo ""
}

main() {
    parse_args "$@"

    local checklist_file="$FOLDER_PATH/checklist.md"

    if [[ ! -f "$checklist_file" ]]; then
        if $JSON_MODE; then
            echo '{"error": "checklist.md not found", "folder": "'"$FOLDER_PATH"'"}'
        else
            echo -e "${YELLOW}⚠${NC} No checklist.md found in $FOLDER_PATH"
            echo "  This may be a Level 1 spec (checklist not required)."
            echo "  Create checklist.md for Level 2+ enforcement."
        fi
        exit 0
    fi

    count_checklist_items "$checklist_file"

    local status
    status=$(calculate_status)

    if $QUIET_MODE; then
        :
    elif $JSON_MODE; then
        output_json "$status"
    else
        output_text "$status"
    fi

    if [[ "$status" == "COMPLETE" ]]; then
        exit 0
    else
        exit 1
    fi
}

main "$@"
