#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK PLACEHOLDERS
# ───────────────────────────────────────────────────────────────
# Scan every authored Markdown file in a spec folder for unfilled placeholder markers.
# Bash 3.2+ compatible (macOS and Linux).
#
# Draft value tokens in v2.3+ documents are warnings; every other marker fails.

set -euo pipefail

# shellcheck source=../rules/check-placeholders.sh
source "$(cd "$(dirname "${BASH_SOURCE[0]}")/../rules" && pwd)/check-placeholders.sh"

VERSION="1.0.0"

# Colors (disabled for non-TTY)
if [[ -t 1 ]]; then
    RED='\033[0;31m' GREEN='\033[0;32m' YELLOW='\033[1;33m' BOLD='\033[1m' NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' BOLD='' NC=''
fi

# ─── Usage ────────────────────────────────────────────────────
usage() {
    cat <<EOF
Usage: $(basename "$0") <spec-folder> [OPTIONS]

Scan a spec folder for unfilled placeholder markers.

Arguments:
  <spec-folder>    Path to spec folder (e.g., specs/042-feature/)

Options:
  --json           Output results in JSON format
  --verbose        Show each match with file and line number
  --help, -h       Show this help message

Exit codes:
  0  No failures, with or without Draft token warnings (PASS or WARN)
  1  One or more failing placeholder markers found (FAIL)
  2  Invalid arguments or folder not found

Examples:
  $(basename "$0") specs/042-feature/
  $(basename "$0") specs/042-feature/ --verbose
  $(basename "$0") specs/042-feature/ --json
EOF
}

# ─── Args ─────────────────────────────────────────────────────
FOLDER_PATH=""
JSON_MODE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)     JSON_MODE=true; shift ;;
        --verbose)  VERBOSE=true; shift ;;
        --help|-h)  usage; exit 0 ;;
        -*)         echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
        *)
            if [[ -z "$FOLDER_PATH" ]]; then
                FOLDER_PATH="$1"
            else
                echo "Error: unexpected argument '$1'" >&2
                usage >&2
                exit 2
            fi
            shift
            ;;
    esac
done

if [[ -z "$FOLDER_PATH" ]]; then
    echo "Error: spec folder path required" >&2
    usage >&2
    exit 2
fi

# Normalize trailing slash
FOLDER_PATH="${FOLDER_PATH%/}"

if [[ ! -d "$FOLDER_PATH" ]]; then
    echo "Error: folder not found: $FOLDER_PATH" >&2
    exit 2
fi

# ─── Placeholder markers ─────────────────────────────────────
FAILURES=0
WARNINGS=0
FAIL_MATCHES=()
WARN_MATCHES=()
DRAFT_PACKET=false
if spec_status_is_draft "$FOLDER_PATH"; then
    DRAFT_PACKET=true
fi

while IFS= read -r file; do
    case "$file" in
        */.backup-*) continue ;;
        */memory/*) continue ;;
        */scratch/*) continue ;;
        */research/*) continue ;;
        */review/*) continue ;;
    esac

    mode="legacy"
    if speckit_carries_token_gate_stamp "$file"; then
        mode="v23"
    fi

    while IFS=$'\t' read -r line_num kind; do
        [[ -n "$line_num" && "$kind" != "title" ]] || continue
        match_text=$(sed -n "${line_num}p" "$file" | sed -E 's/^[[:space:]]+//' | cut -c1-120)
        if [[ "$DRAFT_PACKET" == "true" && "$mode" == "v23" && "$kind" == "token" ]]; then
            WARNINGS=$((WARNINGS + 1))
            if [[ "$VERBOSE" == "true" ]]; then
                WARN_MATCHES+=("warn ${file}:${line_num}: ${match_text}")
            fi
        else
            FAILURES=$((FAILURES + 1))
            if [[ "$VERBOSE" == "true" ]]; then
                FAIL_MATCHES+=("${file}:${line_num}: ${match_text}")
            fi
        fi
    done < <(placeholder_marker_lines "$file" "$mode")
done < <(find "$FOLDER_PATH" -name "*.md" -type f 2>/dev/null | sort)

if [[ "$FAILURES" -gt 0 ]]; then
    RESULT="FAIL"
    COLOR="$RED"
    EXIT_CODE=1
    MESSAGE="$FAILURES placeholder pattern(s) found"
elif [[ "$WARNINGS" -gt 0 ]]; then
    RESULT="WARN"
    COLOR="$YELLOW"
    EXIT_CODE=0
    MESSAGE="$WARNINGS unfilled value token(s) in a Draft packet"
else
    RESULT="PASS"
    COLOR="$GREEN"
    EXIT_CODE=0
    MESSAGE="Zero placeholder patterns found"
fi
TOTAL=$((FAILURES + WARNINGS))

if [[ "$JSON_MODE" == "true" ]]; then
    printf '{"status":"%s","placeholders":%d,"warnings":%d,"folder":"%s","message":"%s"}\n' \
        "$RESULT" "$TOTAL" "$WARNINGS" "$FOLDER_PATH" "$MESSAGE"
else
    printf '%b%s%b — %s in %s\n' "$COLOR" "$RESULT" "$NC" "$MESSAGE" "$FOLDER_PATH"
    if [[ "$VERBOSE" == "true" ]]; then
        if [[ ${#FAIL_MATCHES[@]} -gt 0 ]]; then
            printf '  %s\n' "${FAIL_MATCHES[@]}"
        fi
        if [[ ${#WARN_MATCHES[@]} -gt 0 ]]; then
            printf '  %s\n' "${WARN_MATCHES[@]}"
        fi
    fi
fi

exit "$EXIT_CODE"
