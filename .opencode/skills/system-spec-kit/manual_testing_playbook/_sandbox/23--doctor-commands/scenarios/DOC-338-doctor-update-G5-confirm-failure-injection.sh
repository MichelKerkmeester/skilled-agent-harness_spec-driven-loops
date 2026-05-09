#!/usr/bin/env bash
# COMPONENT: DOC-338 Doctor Update G5 Confirm Failure Injection
# Wraps the canonical scenario command and common evidence assertions.

set -euo pipefail

if [[ -t 1 ]]; then
    GREEN='\033[0;32m'
    NC='\033[0m'
else
    GREEN='' NC=''
fi

SCENARIO_ID="DOC-338"
SCENARIO_MD="338-doctor-update-G5-confirm-failure-injection.md"
FIXTURE_NAME="v3.4.0.0-state"
HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../harness" && pwd)"
PLAYBOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)/23--doctor-commands"

source "${HARNESS_DIR}/reset-state.sh"
source "${HARNESS_DIR}/capture-evidence.sh"
source "${HARNESS_DIR}/assert-signals.sh"

run_scenario() {
    reset_state "$FIXTURE_NAME"
    export SPECKIT_FAIL_STEP="${SPECKIT_FAIL_STEP:-causal-edges-init}"
    capture_evidence "$SCENARIO_ID" /doctor:update || true
    unset SPECKIT_FAIL_STEP
    assert_signals "$SCENARIO_ID" "${PLAYBOOK_DIR}/${SCENARIO_MD}"
    printf '%b%s complete%b\n' "$GREEN" "$SCENARIO_ID" "$NC"
}

run_scenario "$@"
