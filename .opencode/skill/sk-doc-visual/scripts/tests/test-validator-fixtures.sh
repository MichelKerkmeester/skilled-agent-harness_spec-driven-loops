#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: DOC VISUAL VALIDATOR FIXTURE TESTS
# ───────────────────────────────────────────────────────────────
# Run fixture-based exit-code checks for validate-html-output.sh.
#
# Usage: ./scripts/tests/test-validator-fixtures.sh
#
# Exit Codes:
#   0 - All fixture checks passed
#   2 - One or more fixture checks failed

set -euo pipefail


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_DIR
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly ROOT_DIR
VALIDATOR="${ROOT_DIR}/scripts/validate-html-output.sh"
readonly VALIDATOR
FIXTURES_DIR="${ROOT_DIR}/scripts/tests/fixtures"
readonly FIXTURES_DIR

FAILURES=0
LOG_FILE=""


# ───────────────────────────────────────────────────────────────
# 2. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

cleanup_temp_files() {
  if [[ -n "${LOG_FILE}" && -f "${LOG_FILE}" ]]; then
    rm -f "${LOG_FILE}"
  fi
}

run_case() {
  local fixture_file="$1"
  local expected_exit="$2"
  local fixture_path="${FIXTURES_DIR}/${fixture_file}"
  local actual_exit=0

  if [[ ! -f "${fixture_path}" ]]; then
    printf 'missing fixture: %s\n' "${fixture_path}" >&2
    FAILURES=$((FAILURES + 1))
    return
  fi

  set +e
  "${VALIDATOR}" "${fixture_path}" >"${LOG_FILE}" 2>&1
  actual_exit=$?
  set -e

  if [[ "${actual_exit}" -eq "${expected_exit}" ]]; then
    printf 'ok %s exit=%s\n' "${fixture_file}" "${actual_exit}"
  else
    printf 'FAIL %s expected=%s actual=%s\n' "${fixture_file}" "${expected_exit}" "${actual_exit}" >&2
    sed 's/^/  /' "${LOG_FILE}" >&2
    FAILURES=$((FAILURES + 1))
  fi
}


# ───────────────────────────────────────────────────────────────
# 3. MAIN
# ───────────────────────────────────────────────────────────────

main() {
  if [[ ! -x "${VALIDATOR}" ]]; then
    printf 'Validator not executable: %s\n' "${VALIDATOR}" >&2
    return 2
  fi

  LOG_FILE="$(mktemp "${TMPDIR:-/tmp}/ve-validator-test.XXXXXX.log")"
  trap cleanup_temp_files EXIT

  run_case "minimal-pass.html" 0
  run_case "missing-color-scheme-meta.html" 2
  run_case "missing-reduced-motion.html" 2
  run_case "mermaid-without-hardening.html" 2
  run_case "canvas-without-fallback.html" 2
  run_case "missing-contrast-media.html" 1
  run_case "speckit-artifact-pass.html" 0
  run_case "speckit-artifact-missing-meta.html" 2
  run_case "speckit-traceability-missing-crossrefs.html" 2

  if [[ ${FAILURES} -gt 0 ]]; then
    printf 'validator fixture tests failed (%s)\n' "${FAILURES}" >&2
    return 2
  fi

  printf 'validator fixture tests passed\n'
  return 0
}

main "$@"
