#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Run all sk-code drift guards as one gate.
# ───────────────────────────────────────────────────────────────
#
# sk-code's three drift guards are disjoint and were runnable only one at a
# time: the alignment-drift verifier (language integrity + dead-route check),
# the stack-folder verifier (language reference folders resolve), and the
# router-sync suite (machine router vs filesystem/prose, plus the compiled
# destination <-> leaf-manifest <-> RESOURCE_MAP bijection). This is the single
# entry point that runs all three in sequence, prints a PASS/FAIL line per
# guard, and exits non-zero if any one fails, so a completion gate never has to
# remember three separate commands.
#
# Offline and deterministic: no network, no model dispatch, no state carried
# between runs. Paths resolve from this script's own location, so it runs from
# any working directory.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CODE_OPENCODE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
SK_CODE_DIR="$(cd "${CODE_OPENCODE_DIR}/.." && pwd)"
SKILLS_DIR="$(cd "${SK_CODE_DIR}/.." && pwd)"

DRIFT_VERIFIER="${CODE_OPENCODE_DIR}/assets/scripts/verify_alignment_drift.py"
STACK_VERIFIER="${CODE_OPENCODE_DIR}/assets/scripts/verify_stack_folders.py"
VITEST_DIR="${SKILLS_DIR}/system-deep-loop/deep-improvement/scripts"
VITEST_FILE="skill-benchmark/tests/sk-code-router-sync.vitest.ts"

failures=0

run_guard() {
  local name="$1"
  shift
  echo "── ${name}"
  if "$@"; then
    echo "PASS: ${name}"
  else
    echo "FAIL: ${name}"
    failures=$((failures + 1))
  fi
  echo ""
}

run_guard "alignment-drift  (verify_alignment_drift.py --check-router)" \
  python3 "${DRIFT_VERIFIER}" --root "${SK_CODE_DIR}" --check-router

run_guard "stack-folders    (verify_stack_folders.py)" \
  python3 "${STACK_VERIFIER}"

# The router-sync suite resolves its own config from VITEST_DIR, so run it there
# in a subshell to contain the directory change (rather than via run_guard).
echo "── router-sync      (sk-code-router-sync.vitest.ts)"
if ( cd "${VITEST_DIR}" && npx vitest run "${VITEST_FILE}" ); then
  echo "PASS: router-sync      (sk-code-router-sync.vitest.ts)"
else
  echo "FAIL: router-sync      (sk-code-router-sync.vitest.ts)"
  failures=$((failures + 1))
fi
echo ""

if [ "${failures}" -ne 0 ]; then
  echo "run-all-drift-guards: ${failures} guard(s) FAILED"
  exit 1
fi

echo "run-all-drift-guards: all 3 guards PASSED"
exit 0
