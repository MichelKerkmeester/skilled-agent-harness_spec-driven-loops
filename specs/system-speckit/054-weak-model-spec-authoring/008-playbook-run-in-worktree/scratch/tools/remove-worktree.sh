#!/usr/bin/env bash
# Saves the worktree diff (tracked and untracked files) and status, runs the
# evidence and patch gates, and removes the disposable worktree and its branch
# only when every condition holds. Rollback: recreate the worktree from the base
# ref with worktree-naming.sh create, then apply scratch/fixes/fix.patch.
set -u
ROOT="$(git rev-parse --show-toplevel)"
PHASE="$ROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
G="git -c core.fsmonitor=false"
mkdir -p "$PHASE/scratch/fixes"
$G -C "$WT" clean -fd -- scratch > "$PHASE/scratch/fixes/scratch-clean.txt" 2>&1 || true
echo SCRATCH_CLEAN
{
  ROWS=$(wc -l < "$PHASE/scratch/results.tsv" | tr -d ' ')
  [ "$ROWS" = "8" ] && echo "RUNS_RECORDED 8" || echo "NO_ROWS $ROWS"
  while IFS=$'\t' read -r LABEL VERDICT ID RUN; do
    test -s "$RUN" || echo "EMPTY $LABEL"
  done < "$PHASE/scratch/results.tsv"
} > "$PHASE/scratch/worktree/evidence-before-remove.txt"
# Tracked changes, then each untracked file as a new-file diff.
$G -C "$WT" diff > "$PHASE/scratch/fixes/fix.patch"
$G -C "$WT" ls-files --others --exclude-standard | while IFS= read -r f; do
  ( cd "$WT" && $G diff --no-index -- /dev/null "$f" ) >> "$PHASE/scratch/fixes/fix.patch" || true
done
echo PATCH_SAVED
$G -C "$WT" status --porcelain --untracked-files=all > "$PHASE/scratch/fixes/status.txt" && echo STATUS_SAVED
: > "$PHASE/scratch/fixes/gate.txt"
while read -r XY PATHSPEC; do
  [ -z "${PATHSPEC:-}" ] && continue
  if grep -qF "diff --git a/$PATHSPEC b/$PATHSPEC" "$PHASE/scratch/fixes/fix.patch"; then
    printf 'PATCHED %s\n' "$PATHSPEC" >> "$PHASE/scratch/fixes/gate.txt"
  else
    printf 'UNPATCHED %s\n' "$PATHSPEC" >> "$PHASE/scratch/fixes/gate.txt"
  fi
done < "$PHASE/scratch/fixes/status.txt"
STATUS_N=$(grep -c . "$PHASE/scratch/fixes/status.txt" || true)
PATCHED_N=$(grep -c '^PATCHED ' "$PHASE/scratch/fixes/gate.txt" || true)
[ "$STATUS_N" = "$PATCHED_N" ] && echo PATCH_GATE_COVERED >> "$PHASE/scratch/fixes/gate.txt"
BEYOND=$($G -C "$RUNROOT" log --oneline "$BASE_REF..$WT_BRANCH")
{
  cat "$PHASE/scratch/worktree/evidence-before-remove.txt"
  cat "$PHASE/scratch/fixes/gate.txt"
  echo "status_entries=$STATUS_N patched=$PATCHED_N"
  if [ -n "$BEYOND" ]; then echo "BRANCH_HAS_COMMITS"; echo "$BEYOND"; fi
  if grep -qE '^(NO_ROWS|EMPTY|UNPATCHED|BRANCH_HAS_COMMITS) ' "$PHASE/scratch/worktree/evidence-before-remove.txt" "$PHASE/scratch/fixes/gate.txt" \
     || ! grep -q '^RUNS_RECORDED 8$' "$PHASE/scratch/worktree/evidence-before-remove.txt" \
     || ! grep -q '^PATCH_GATE_COVERED$' "$PHASE/scratch/fixes/gate.txt" \
     || [ -n "$BEYOND" ] || [ ! -s "$PHASE/scratch/fixes/fix.patch" ] || [ ! -s "$PHASE/scratch/fixes/status.txt" ]; then
    echo "REMOVAL_REFUSED"
    exit 1
  fi
  echo "REMOVAL_OK"
  echo "To undo: git worktree add -b <new branch> <dir> $BASE_REF, then git apply scratch/fixes/fix.patch"
  if $G -C "$RUNROOT" worktree remove "$WT" 2>&1; then
    echo "REMOVED_WITHOUT_FORCE"
  else
    UNTRACKED_N=$(grep -c '^??' "$PHASE/scratch/fixes/status.txt" || true)
    if [ "$UNTRACKED_N" = "$STATUS_N" ]; then
      echo "FORCE_NEEDED: the sole blocker is the $UNTRACKED_N untracked file(s) already captured in fix.patch"
      $G -C "$RUNROOT" worktree remove --force "$WT" 2>&1
    else
      echo "REMOVAL_REFUSED: remove failed and a tracked change exists"
      exit 1
    fi
  fi
  test ! -d "$WT" && echo WORKTREE_GONE
  $G -C "$RUNROOT" branch -d "$WT_BRANCH" 2>&1
  $G -C "$RUNROOT" branch --list "$WT_BRANCH" | grep -q . || echo BRANCH_GONE
} 2>&1 | tee "$PHASE/scratch/worktree/removal.txt"
