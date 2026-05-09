#!/usr/bin/env bash
# COMPONENT: DOC-323 Doctor Memory Fresh Install
# Wraps the canonical scenario command and common evidence assertions.

set -euo pipefail

if [[ -t 1 ]]; then
    GREEN='\033[0;32m'
    NC='\033[0m'
else
    GREEN='' NC=''
fi

SCENARIO_ID="DOC-323"
SCENARIO_MD="323-doctor-memory-fresh-install.md"
FIXTURE_NAME="empty-state"
HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../harness" && pwd)"
PLAYBOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)/23--doctor-commands"

source "${HARNESS_DIR}/reset-state.sh"
source "${HARNESS_DIR}/capture-evidence.sh"
source "${HARNESS_DIR}/assert-signals.sh"

run_scenario() {
    reset_state "$FIXTURE_NAME"
    capture_evidence "$SCENARIO_ID" /doctor:memory --incremental=true || true
    assert_signals "$SCENARIO_ID" "${PLAYBOOK_DIR}/${SCENARIO_MD}"
    printf '%b%s complete%b\n' "$GREEN" "$SCENARIO_ID" "$NC"
}

run_scenario "$@"
