#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VALIDATOR="${ROOT_DIR}/scripts/validate-html-output.sh"
FIXTURES_DIR="${ROOT_DIR}/scripts/tests/fixtures"

if [[ ! -x "${VALIDATOR}" ]]; then
  echo "Validator not executable: ${VALIDATOR}"
  exit 2
fi

FAILURES=0

run_case() {
  local file="$1"
  local expected="$2"
  local path="${FIXTURES_DIR}/${file}"

  if [[ ! -f "${path}" ]]; then
    echo "missing fixture: ${path}"
    FAILURES=$((FAILURES + 1))
    return
  fi

  set +e
  "${VALIDATOR}" "${path}" >/tmp/ve-validator-test.log 2>&1
  local code=$?
  set -e

  if [[ "${code}" -eq "${expected}" ]]; then
    echo "ok ${file} exit=${code}"
  else
    echo "FAIL ${file} expected=${expected} actual=${code}"
    sed 's/^/  /' /tmp/ve-validator-test.log
    FAILURES=$((FAILURES + 1))
  fi
}

run_case "minimal-pass.html" 0
run_case "missing-color-scheme-meta.html" 2
run_case "missing-reduced-motion.html" 2
run_case "mermaid-without-hardening.html" 2
run_case "canvas-without-fallback.html" 2
run_case "missing-contrast-media.html" 1
run_case "speckit-artifact-pass.html" 0
run_case "speckit-artifact-missing-meta.html" 2
run_case "speckit-traceability-missing-crossrefs.html" 2

rm -f /tmp/ve-validator-test.log

if [[ ${FAILURES} -gt 0 ]]; then
  echo "validator fixture tests failed (${FAILURES})"
  exit 2
fi

echo "validator fixture tests passed"
exit 0
