#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Run all sk-code drift guards as one gate.
# ───────────────────────────────────────────────────────────────
#
# sk-code's two live drift guards are disjoint and were runnable only one at a
# time: the alignment-drift verifier (language integrity + dead-route check) and
# the stack-folder verifier (language reference folders resolve). This is the
# single entry point that runs both in sequence, prints a PASS/FAIL line per
# guard and exits non-zero if either fails, so a completion gate never has to
# remember separate commands. A third guard, the router-sync suite, is retired,
# and the note after the guard calls records what it checked.
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

# Retired guard: the router-sync suite (sk-code-router-sync.vitest.ts), deleted with the
# skill-benchmark lane that hosted it. It checked four things:
#   1. every path in the machine-readable router exists on disk, every routable
#      reference or asset doc is routed, and every full path the prose maps name is routed;
#   2. the parent surface RESOURCE_MAP equals the union of the surface children's maps
#      plus the parent tier;
#   3. compiled route-gold destinations, leaf-manifest.json and the code-opencode
#      RESOURCE_MAP agree through qualifiedIdToLeaf;
#   4. every playbook routing scenario's expected_resource is emitted by the router.
# Successor, partial: the dead-path part of check 1 is the alignment-drift guard above
# (--check-router). .github/workflows/routing-registry-drift.yml covers the compiled side
# of checks 3 and 4, in CI only: its compiled-serving admission step scores compiled
# decisions against playbook routing gold through qualifiedIdToLeaf but runs --warn-only,
# and its leaf-manifest freshness step byte-checks every leaf-manifest.json. No step
# reads RESOURCE_MAP.
# Gap: orphan and prose-path coverage (check 1), parent-equals-union (check 2),
# RESOURCE_MAP-to-manifest agreement (check 3) and the surface-router side of check 4
# have no guard. Owner: sk-code.

if [ "${failures}" -ne 0 ]; then
  echo "run-all-drift-guards: ${failures} guard(s) FAILED"
  exit 1
fi

echo "run-all-drift-guards: all 2 guards PASSED"
exit 0
