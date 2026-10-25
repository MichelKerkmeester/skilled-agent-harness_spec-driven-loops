#!/usr/bin/env bash
# Compares the primary checkout status with the baseline saved before the run.
# A difference under a path this run could write is a halt. Any other
# difference is another session's activity and is listed, not removed.
set -u
ROOT="$(git rev-parse --show-toplevel)"
PHASE="$ROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
BASE="$PHASE/scratch/status-main-start.txt"
git -c core.fsmonitor=false --no-optional-locks -C "$MAIN" status --porcelain --untracked-files=all > "$PHASE/scratch/primary-status-now.txt"
diff "$BASE" "$PHASE/scratch/primary-status-now.txt" > "$PHASE/scratch/primary-status-diff.txt" || true
grep '^[<>]' "$PHASE/scratch/primary-status-diff.txt" | sed 's/^\([<>]\) .. /\1 /' > "$PHASE/scratch/primary-status-changes.txt" || true
WATCH='^[<>] (specs/zz-|\.skilled/skills/system-spec-kit/|specs/system-speckit/054-weak-model-spec-authoring/|\.worktrees/)'
grep -E "$WATCH" "$PHASE/scratch/primary-status-changes.txt" > "$PHASE/scratch/primary-status-watched.txt" || true
echo "baseline_lines=$(wc -l < "$BASE" | tr -d ' ') now_lines=$(wc -l < "$PHASE/scratch/primary-status-now.txt" | tr -d ' ') changed_lines=$(wc -l < "$PHASE/scratch/primary-status-changes.txt" | tr -d ' ')"
if [ -s "$PHASE/scratch/primary-status-watched.txt" ]; then
  cp "$PHASE/scratch/primary-status-watched.txt" "$PHASE/scratch/primary-status.txt"
  echo "WATCHED_PATH_CHANGED"; cat "$PHASE/scratch/primary-status-watched.txt"
else
  echo PRIMARY_CLEAN > "$PHASE/scratch/primary-status.txt"
  echo PRIMARY_CLEAN
fi
echo "--- other-session changes:"; cat "$PHASE/scratch/primary-status-changes.txt"
