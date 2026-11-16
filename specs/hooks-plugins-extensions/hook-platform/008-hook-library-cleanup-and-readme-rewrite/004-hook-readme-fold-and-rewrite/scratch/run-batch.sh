#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: HOOK README BATCH RUNNER
# ───────────────────────────────────────────────────────────────
# Run a list of worker briefs through dispatch.sh, a few at a time.
#
# Usage: run-batch.sh <snapshot name> <parallel runs> <brief name>...
# Output: one "RUN ..." line per brief from dispatch.sh, one "<brief> exit: N"
#         line per brief, then "BATCH DONE".

set -uo pipefail

SCRATCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRATCH_DIR

if [[ $# -lt 3 ]]; then
    echo "Usage: run-batch.sh <snapshot name> <parallel runs> <brief name>..." >&2
    exit 2
fi

snapshot="$1"
parallel="$2"
shift 2

bash "$SCRATCH_DIR/dispatch.sh" snap "$snapshot" || exit 1

run_one() {
    local brief="$1"
    bash "$SCRATCH_DIR/dispatch.sh" run "$SCRATCH_DIR/briefs/$brief.md"
    echo "$brief exit: $?"
}
export -f run_one
export SCRATCH_DIR

# The single quotes are deliberate: the child bash expands $1, not this shell.
# shellcheck disable=SC2016
printf '%s\n' "$@" | xargs -P "$parallel" -I {} bash -c 'run_one "$1"' _ {}
echo "BATCH DONE"
