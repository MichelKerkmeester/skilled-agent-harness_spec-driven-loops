#!/usr/bin/env bash
# COMPONENT: DOC-345 Version Migration 3.3.0.0 to 3.4.1.0
# Wraps the canonical scenario command and common evidence assertions.

set -euo pipefail

if [[ -t 1 ]]; then
    GREEN='\033[0;32m'
    NC='\033[0m'
else
    GREEN='' NC=''
fi

SCENARIO_ID="DOC-345"
SCENARIO_MD="345-version-migration-3.3.0.0-to-3.4.1.0.md"
FIXTURE_NAME="v3.3.0.0-state"
HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../harness" && pwd)"
PLAYBOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)/23--doctor-commands"

source "${HARNESS_DIR}/reset-state.sh"
source "${HARNESS_DIR}/capture-evidence.sh"
source "${HARNESS_DIR}/assert-signals.sh"

run_scenario() {
    reset_state "$FIXTURE_NAME"
    export SPECKIT_SOURCE_VERSION="${SPECKIT_SOURCE_VERSION:-3.3.0.0}"
    capture_evidence "$SCENARIO_ID" /doctor:update --migrate || true
    unset SPECKIT_SOURCE_VERSION
    assert_signals "$SCENARIO_ID" "${PLAYBOOK_DIR}/${SCENARIO_MD}"
    printf '%b%s complete%b\n' "$GREEN" "$SCENARIO_ID" "$NC"
}

run_scenario "$@"
