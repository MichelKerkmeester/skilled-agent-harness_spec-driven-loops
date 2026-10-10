#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Run all sk-code drift guards as one gate.
# ───────────────────────────────────────────────────────────────
#
# sk-code has four drift guards: alignment-drift (language integrity and the
# dead-route check), stack-folder (language reference folders resolve),
# router-sync (the sk-code router's paths, surface map, compiled agreement and
# playbook routing) and doc-claims (paths, packet names, surface counts and load
# tiers in the sk-code prose). Each was runnable only on its own. This is the single entry
# point that runs them in sequence, prints a PASS/FAIL line per guard and exits
# non-zero if any fails, so a completion gate never has to remember separate
# commands. The note after the router-sync guard records what it covers and what
# stays in CI.
#
# Offline and deterministic: no network, no model dispatch, no state carried
# between runs. Paths resolve from this script's own location, so it runs from
# any working directory.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CODE_OPENCODE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
SK_CODE_DIR="$(cd "${CODE_OPENCODE_DIR}/.." && pwd)"
SKILLS_DIR="$(cd "${SK_CODE_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${SKILLS_DIR}/../.." && pwd)"

DRIFT_VERIFIER="${CODE_OPENCODE_DIR}/assets/scripts/verify_alignment_drift.py"
STACK_VERIFIER="${CODE_OPENCODE_DIR}/assets/scripts/verify_stack_folders.py"
ROUTER_SYNC="${CODE_OPENCODE_DIR}/assets/scripts/verify_router_sync.cjs"
DOC_CLAIMS="${CODE_OPENCODE_DIR}/assets/scripts/verify_doc_claims.cjs"

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
  python3 "${DRIFT_VERIFIER}" --root "${REPO_ROOT}" --check-router

run_guard "stack-folders    (verify_stack_folders.py)" \
  python3 "${STACK_VERIFIER}"

run_guard "router-sync      (verify_router_sync.cjs --checks 1a,1b,2,3,4)" \
  node "${ROUTER_SYNC}" --checks 1a,1b,2,3,4

# Router-sync guard (verify_router_sync.cjs): restores the four checks of the router-sync
# suite that was deleted with the skill-benchmark lane. This run covers every leg: 1a and 1b
# (router paths exist, and every reference or asset doc is routed), 2, 3 and 4. Check 1b
# allowlists only the shared workflow docs that each surface reaches through a symlink, with
# the reason beside the list in the guard. Dead paths in check 1 are also covered by the
# alignment-drift guard above (--check-router). The CI workflow
# .github/workflows/routing-registry-drift.yml still covers the compiled side of checks 3
# and 4 in warn-only mode.

run_guard "doc-claims       (verify_doc_claims.cjs)" \
  node "${DOC_CLAIMS}"

if [ "${failures}" -ne 0 ]; then
  echo "run-all-drift-guards: ${failures} guard(s) FAILED"
  exit 1
fi

echo "run-all-drift-guards: all 4 guards PASSED"
exit 0
