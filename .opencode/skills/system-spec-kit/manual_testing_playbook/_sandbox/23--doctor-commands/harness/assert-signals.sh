#!/usr/bin/env bash
# COMPONENT: Doctor Sandbox Signal Assertions
# Grep-based assertion layer for scenario Expected and Pass / Fail sections.
# Exit Codes:
#   0 - PASS or SKIP/UNAUTOMATABLE classification recorded
#   1 - FAIL classification recorded

set -euo pipefail

ASSERT_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSERT_SANDBOX_DIR="$(cd "${ASSERT_SCRIPT_DIR}/.." && pwd)"
ASSERT_REPO_ROOT="$(cd "${ASSERT_SANDBOX_DIR}/../../../../../.." && pwd)"
ASSERT_EVIDENCE_ROOT="${SPECKIT_EVIDENCE_ROOT:-${ASSERT_SANDBOX_DIR}/evidence}"

if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' NC=''
fi

assert_log() {
    printf '%s\n' "$1"
}

assert_error() {
    printf '%bERROR:%b %s\n' "$RED" "$NC" "$1" >&2
}

extract_section() {
    local source_md="$1"
    local start_heading="$2"
    local output_path="$3"
    awk -v heading="$start_heading" '
        $0 == heading { in_section=1; print; next }
        in_section && /^### / { exit }
        in_section { print }
    ' "$source_md" > "$output_path"
}

record_verdict() {
    local evidence_dir="$1"
    local verdict="$2"
    local reason="$3"
    printf '%s\n' "$verdict" > "${evidence_dir}/verdict.txt"
    printf '%s\n' "$reason" > "${evidence_dir}/verdict-reason.txt"
    printf '| %s | %s |\n' "$verdict" "$reason" > "${evidence_dir}/verdict.md"
}

grep_expected_terms() {
    local evidence_dir="$1"
    local combined_log="$2"
    local terms_path="${evidence_dir}/expected-grep-terms.txt"
    local missing_path="${evidence_dir}/missing-expected-terms.txt"
    local term=""
    local checked=0
    local missing=0

    {
        grep -Eo '`[^`]+`' "${evidence_dir}/expected-section.md" "${evidence_dir}/pass-fail-section.md" 2>/dev/null | sed 's/^.*:`//; s/`$//' || true
        grep -Eo '/doctor:[A-Za-z0-9:._ -]+' "${evidence_dir}/expected-section.md" "${evidence_dir}/pass-fail-section.md" 2>/dev/null || true
        grep -Eo 'STATUS=[A-Z_]+' "${evidence_dir}/expected-section.md" "${evidence_dir}/pass-fail-section.md" 2>/dev/null || true
    } | sed 's/[[:space:]]*$//' | sort -u > "$terms_path"

    : > "$missing_path"
    while IFS= read -r term; do
        [[ -n "$term" ]] || continue
        checked=$((checked + 1))
        if ! grep -Fq "$term" "$combined_log"; then
            printf '%s\n' "$term" >> "$missing_path"
            missing=$((missing + 1))
        fi
    done < "$terms_path"

    printf '%s\n' "$checked" > "${evidence_dir}/expected-term-count.txt"
    printf '%s\n' "$missing" > "${evidence_dir}/missing-term-count.txt"

    [[ "$missing" -eq 0 ]]
}

assert_signals() {
    local scenario_id="$1"
    local scenario_md="$2"
    local evidence_dir="${ASSERT_EVIDENCE_ROOT}/${scenario_id}"
    local combined_log="${evidence_dir}/combined.log"
    local exit_code_path="${evidence_dir}/exit-code.txt"
    local exit_code="1"

    if [[ ! -f "$scenario_md" ]]; then
        assert_error "scenario markdown not found: ${scenario_md}"
        return 1
    fi

    mkdir -p "$evidence_dir"
    extract_section "$scenario_md" "### Expected" "${evidence_dir}/expected-section.md"
    extract_section "$scenario_md" "### Pass / Fail" "${evidence_dir}/pass-fail-section.md"

    if [[ -f "$exit_code_path" ]]; then
        exit_code="$(cat "$exit_code_path")"
    fi

    if [[ ! -f "$combined_log" ]]; then
        record_verdict "$evidence_dir" "FAIL" "combined command log missing"
        return 1
    fi

    if [[ "$exit_code" = "125" ]]; then
        record_verdict "$evidence_dir" "SKIP" "real doctor command runtime unavailable"
        assert_log "${scenario_id}: SKIP"
        return 0
    fi

    if grep -Eiq 'STATUS=UNAUTOMATABLE|UNAUTOMATABLE' "$combined_log"; then
        record_verdict "$evidence_dir" "UNAUTOMATABLE" "runtime reported unautomatable"
        assert_log "${scenario_id}: UNAUTOMATABLE"
        return 0
    fi

    if grep -Eiq 'STATUS=SKIP|SKIP' "$combined_log"; then
        record_verdict "$evidence_dir" "SKIP" "runtime reported skip"
        assert_log "${scenario_id}: SKIP"
        return 0
    fi

    if [[ "$exit_code" != "0" ]]; then
        record_verdict "$evidence_dir" "FAIL" "command exited ${exit_code}"
        assert_log "${scenario_id}: FAIL"
        return 1
    fi

    if ! grep_expected_terms "$evidence_dir" "$combined_log"; then
        record_verdict "$evidence_dir" "FAIL" "one or more Expected/Pass-Fail grep terms missing"
        assert_log "${scenario_id}: FAIL"
        return 1
    fi

    record_verdict "$evidence_dir" "PASS" "exit 0 and expected grep signals were present"
    printf '%b%s: PASS%b\n' "$GREEN" "$scenario_id" "$NC"
    return 0
}

if [[ "${BASH_SOURCE[0]}" = "$0" ]]; then
    if [[ "$#" -ne 2 ]]; then
        assert_error "usage: assert-signals.sh <scenario-id> <scenario-md>"
        exit 1
    fi
    assert_signals "$1" "$2"
fi
