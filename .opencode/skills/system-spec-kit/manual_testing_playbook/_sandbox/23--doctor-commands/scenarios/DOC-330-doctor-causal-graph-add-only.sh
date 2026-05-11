#!/usr/bin/env bash
# COMPONENT: DOC-330 Doctor Causal Graph Add Only
# Wraps the canonical scenario command and common evidence assertions.

set -euo pipefail

if [[ -t 1 ]]; then
    GREEN='\033[0;32m'
    NC='\033[0m'
else
    GREEN='' NC=''
fi

SCENARIO_ID="DOC-330"
SCENARIO_MD="330-doctor-causal-graph-add-only.md"
FIXTURE_NAME="partial-state"
HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../harness" && pwd)"
PLAYBOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)/23--doctor-commands"

source "${HARNESS_DIR}/reset-state.sh"
source "${HARNESS_DIR}/capture-evidence.sh"
source "${HARNESS_DIR}/assert-signals.sh"

run_scenario() {
    reset_state "$FIXTURE_NAME"
    capture_evidence "$SCENARIO_ID" /doctor causal-graph --confidence-threshold=0.7 || true
    assert_signals "$SCENARIO_ID" "${PLAYBOOK_DIR}/${SCENARIO_MD}"
    printf '%b%s complete%b\n' "$GREEN" "$SCENARIO_ID" "$NC"
}

run_scenario "$@"
