#!/usr/bin/env bash
# COMPONENT: Doctor Sandbox Scenario Runner
# Runs DOC-323..DOC-347 wrappers and emits a Markdown verdict rollup.
# Exit Codes:
#   0 - Dry-run succeeded or all executable scenarios passed/skipped truthfully
#   1 - One or more scenarios failed or harness validation failed

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SANDBOX_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
SCENARIO_DIR="${SANDBOX_DIR}/scenarios"
PLAYBOOK_DIR="$(cd "${SANDBOX_DIR}/../.." && pwd)/23--doctor-commands"
EVIDENCE_ROOT="${SPECKIT_EVIDENCE_ROOT:-${SANDBOX_DIR}/evidence}"

source "${SCRIPT_DIR}/reset-state.sh"
source "${SCRIPT_DIR}/capture-evidence.sh"
source "${SCRIPT_DIR}/assert-signals.sh"

if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' BLUE='' NC=''
fi

DRY_RUN=false
SINGLE_SCENARIO=""
ROLLUP_ROWS=""
PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0
UNAUTOMATABLE_COUNT=0

show_help() {
    cat <<'EOF'
Doctor command sandbox harness

USAGE:
  run-all.sh [--dry-run] [--scenario DOC-NNN]

OPTIONS:
  --dry-run           Validate paths and shell syntax without invoking Docker or doctor commands.
  --scenario DOC-NNN  Run a single scenario wrapper.
  -h, --help          Show this help.
EOF
}

parse_args() {
    while [[ "$#" -gt 0 ]]; do
        case "$1" in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --scenario)
                SINGLE_SCENARIO="${2:-}"
                if [[ -z "$SINGLE_SCENARIO" ]]; then
                    printf 'ERROR: --scenario requires DOC-NNN\n' >&2
                    return 1
                fi
                shift 2
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                printf 'ERROR: unknown option: %s\n' "$1" >&2
                return 1
                ;;
        esac
    done
}

lint_shell_scripts() {
    local pass=0
    local fail=0
    local script=""
    for script in $(find "$SANDBOX_DIR" -name '*.sh' -type f | sort); do
        if bash -n "$script" >/dev/null 2>&1; then
            pass=$((pass + 1))
        else
            fail=$((fail + 1))
            printf 'LINT FAIL: %s\n' "$script" >&2
        fi
    done
    printf 'shell lint: pass=%s fail=%s\n' "$pass" "$fail"
    [[ "$fail" -eq 0 ]]
}

validate_scenario_paths() {
    local fail=0
    local scenario=""
    local md_name=""
    local md_path=""
    for scenario in "$SCENARIO_DIR"/DOC-*.sh; do
        [[ -f "$scenario" ]] || continue
        md_name="$(grep '^SCENARIO_MD=' "$scenario" | sed 's/^SCENARIO_MD="//; s/"$//')"
        md_path="${PLAYBOOK_DIR}/${md_name}"
        if [[ ! -f "$md_path" ]]; then
            printf 'PATH FAIL: %s -> %s\n' "$scenario" "$md_path" >&2
            fail=$((fail + 1))
        fi
        if ! grep -Fq 'source "${HARNESS_DIR}/reset-state.sh"' "$scenario"; then
            printf 'SOURCE FAIL(reset): %s\n' "$scenario" >&2
            fail=$((fail + 1))
        fi
        if ! grep -Fq 'source "${HARNESS_DIR}/capture-evidence.sh"' "$scenario"; then
            printf 'SOURCE FAIL(capture): %s\n' "$scenario" >&2
            fail=$((fail + 1))
        fi
        if ! grep -Fq 'source "${HARNESS_DIR}/assert-signals.sh"' "$scenario"; then
            printf 'SOURCE FAIL(assert): %s\n' "$scenario" >&2
            fail=$((fail + 1))
        fi
    done
    [[ "$fail" -eq 0 ]]
}

add_rollup_row() {
    local scenario_id="$1"
    local verdict="$2"
    local reason="$3"
    ROLLUP_ROWS="${ROLLUP_ROWS}| ${scenario_id} | ${verdict} | ${reason} |
"
    case "$verdict" in
        PASS) PASS_COUNT=$((PASS_COUNT + 1)) ;;
        FAIL) FAIL_COUNT=$((FAIL_COUNT + 1)) ;;
        SKIP) SKIP_COUNT=$((SKIP_COUNT + 1)) ;;
        UNAUTOMATABLE) UNAUTOMATABLE_COUNT=$((UNAUTOMATABLE_COUNT + 1)) ;;
        *) FAIL_COUNT=$((FAIL_COUNT + 1)) ;;
    esac
}

read_verdict() {
    local scenario_id="$1"
    local evidence_dir="${EVIDENCE_ROOT}/${scenario_id}"
    local verdict="FAIL"
    local reason="verdict missing"
    if [[ -f "${evidence_dir}/verdict.txt" ]]; then
        verdict="$(cat "${evidence_dir}/verdict.txt")"
    fi
    if [[ -f "${evidence_dir}/verdict-reason.txt" ]]; then
        reason="$(cat "${evidence_dir}/verdict-reason.txt")"
    fi
    add_rollup_row "$scenario_id" "$verdict" "$reason"
}

emit_rollup() {
    printf '\n## Doctor Command Sandbox Rollup\n\n'
    printf '| Scenario | Verdict | Rationale |\n'
    printf '| --- | --- | --- |\n'
    printf '%s' "$ROLLUP_ROWS"
    printf '\nSummary: PASS=%s FAIL=%s SKIP=%s UNAUTOMATABLE=%s\n' "$PASS_COUNT" "$FAIL_COUNT" "$SKIP_COUNT" "$UNAUTOMATABLE_COUNT"
}

run_dry_run() {
    printf '%bDRY RUN%b doctor sandbox validation\n' "$BLUE" "$NC"
    lint_shell_scripts
    validate_scenario_paths
    printf 'scenario wrappers: %s\n' "$(find "$SCENARIO_DIR" -maxdepth 1 -type f -name 'DOC-*.sh' | wc -l | tr -d ' ')"
    printf 'playbook markdown: %s\n' "$(find "$PLAYBOOK_DIR" -maxdepth 1 -type f -name '3*.md' | wc -l | tr -d ' ')"
    printf '%bOK%b dry-run completed without invoking docker or doctor commands\n' "$GREEN" "$NC"
}

run_scenarios() {
    local scenario=""
    local scenario_id=""
    local run_failed=0
    mkdir -p "$EVIDENCE_ROOT"
    for scenario in "$SCENARIO_DIR"/DOC-*.sh; do
        [[ -f "$scenario" ]] || continue
        scenario_id="$(basename "$scenario" | sed 's/-.*$//')"
        if [[ -n "$SINGLE_SCENARIO" && "$scenario_id" != "$SINGLE_SCENARIO" ]]; then
            continue
        fi
        printf '\n%bRUN%b %s\n' "$BLUE" "$NC" "$scenario_id"
        if bash "$scenario"; then
            :
        else
            run_failed=1
        fi
        read_verdict "$scenario_id"
    done
    emit_rollup
    [[ "$run_failed" -eq 0 && "$FAIL_COUNT" -eq 0 ]]
}

main() {
    parse_args "$@"
    if [[ "$DRY_RUN" = true ]]; then
        run_dry_run
        return 0
    fi
    run_scenarios
}

main "$@"
