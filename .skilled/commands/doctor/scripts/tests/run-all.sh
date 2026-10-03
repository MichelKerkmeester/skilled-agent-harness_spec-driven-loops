#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: DOCTOR SCRIPT TEST RUNNER
# ───────────────────────────────────────────────────────────────
# Runs every automated test for the doctor scripts in one pass, so CI and a
# developer run the same set and no suite exists that nothing executes.
#
# Suites, by naming convention in this folder:
#   *.test.cjs   node:test suites, one per Node script
#   test_*.py    unittest suites, one per Python script
#   *.test.sh    bash suites, one per shell script
# plus route-validate.sh --self-test and the skill-graph freshness panel,
# whose vitest suite lives in the advisor runtime that owns its database code.
#
# Usage: bash .skilled/commands/doctor/scripts/tests/run-all.sh
#
# Exit codes:
#   0  every suite passed
#   1  at least one suite failed
#   2  a required tool is missing (node, python3, or the advisor runtime's vitest)

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. PATHS
# ───────────────────────────────────────────────────────────────

TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
SCRIPTS_DIR="$(cd "$TESTS_DIR/.." && pwd -P)"
REPO_ROOT="$(cd "$SCRIPTS_DIR/../../../.." && pwd -P)"
ADVISOR_RUNTIME="$REPO_ROOT/.skilled/skills/system-skill-advisor/runtime"
FRESHNESS_SUITE="tests/doctor/skill-graph-freshness-panel.vitest.ts"

# ───────────────────────────────────────────────────────────────
# 2. HELPERS
# ───────────────────────────────────────────────────────────────

failed_suites=()
passed_count=0

require_tool() {
    local tool="$1"
    local hint="$2"
    if ! command -v "$tool" >/dev/null 2>&1; then
        printf '[run-all] ERROR: %s not found. %s\n' "$tool" "$hint" >&2
        exit 2
    fi
}

run_suite() {
    local label="$1"
    shift
    printf '\n[run-all] ── %s\n' "$label"
    if "$@"; then
        passed_count=$((passed_count + 1))
        printf '[run-all] PASS: %s\n' "$label"
    else
        failed_suites+=("$label")
        printf '[run-all] FAIL: %s\n' "$label"
    fi
}

# shellcheck disable=SC2329  # invoked indirectly, as a run_suite argument
run_freshness_panel() {
    (cd "$ADVISOR_RUNTIME" && ./node_modules/.bin/vitest run "$FRESHNESS_SUITE")
}

# ───────────────────────────────────────────────────────────────
# 3. MAIN
# ───────────────────────────────────────────────────────────────

require_tool node "Install Node.js 20 or later."
require_tool python3 "Install Python 3."
if [[ ! -x "$ADVISOR_RUNTIME/node_modules/.bin/vitest" ]]; then
    printf '[run-all] ERROR: the advisor runtime has no vitest. Run: npm --prefix %s ci\n' \
        "$ADVISOR_RUNTIME" >&2
    exit 2
fi

shopt -s nullglob
node_suites=("$TESTS_DIR"/*.test.cjs)
shell_suites=("$TESTS_DIR"/*.test.sh)
python_suites=("$TESTS_DIR"/test_*.py)
shopt -u nullglob

if [[ ${#node_suites[@]} -gt 0 ]]; then
    run_suite "node:test (${#node_suites[@]} files)" node --test "${node_suites[@]}"
fi
if [[ ${#python_suites[@]} -gt 0 ]]; then
    run_suite "unittest (${#python_suites[@]} files)" \
        python3 -m unittest discover -s "$TESTS_DIR" -p 'test_*.py'
fi
# bash 3.2 treats an empty array expansion as unbound under set -u, hence the guard.
if [[ ${#shell_suites[@]} -gt 0 ]]; then
    for suite in "${shell_suites[@]}"; do
        run_suite "$(basename "$suite")" bash "$suite"
    done
fi
run_suite "route-validate.sh --self-test" bash "$SCRIPTS_DIR/route-validate.sh" --self-test
run_suite "skill-graph freshness panel (vitest)" run_freshness_panel

printf '\n[run-all] %d suite(s) passed, %d failed\n' "$passed_count" "${#failed_suites[@]}"
if [[ ${#failed_suites[@]} -gt 0 ]]; then
    printf '[run-all] failed: %s\n' "${failed_suites[@]}"
    exit 1
fi
exit 0
