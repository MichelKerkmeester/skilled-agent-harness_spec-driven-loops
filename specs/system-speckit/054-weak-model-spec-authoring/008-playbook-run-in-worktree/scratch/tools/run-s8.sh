#!/usr/bin/env bash
# Runs scenario 483 through the runner, keeps a copy of every attempt and the
# worker's files, and prints the comparator line. Usage: run-s8.sh <attempt>
set -u
ATT="${1:-1}"
ROOT="$(git rev-parse --show-toplevel)"
PHASE="$ROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
SC=$(awk -F'\t' '$1=="S8"{print $3}' "$PHASE/scratch/scenarios.tsv")
RUN="$PHASE/scratch/runs/483.txt"
( cd "$WT" && bash "$PHASE/scratch/tools/run-scenario.sh" "$SC" "$RUN" </dev/null )
cp "$RUN" "$PHASE/scratch/runs/483.attempt-$ATT.txt"
PTR="$WT/specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/scenario-483-out.txt"
if [ -s "$PTR" ]; then
  OUT="$(cat "$PTR")"
  mkdir -p "$PHASE/scratch/runs/483.worker-$ATT"
  for f in brief.txt reply.txt reply.err val.txt; do [ -f "$OUT/$f" ] && cp "$OUT/$f" "$PHASE/scratch/runs/483.worker-$ATT/$f"; done
fi
node "$PHASE/scratch/tools/check-run.cjs" "$PHASE/scratch/scenarios.tsv" S8 "$RUN"
