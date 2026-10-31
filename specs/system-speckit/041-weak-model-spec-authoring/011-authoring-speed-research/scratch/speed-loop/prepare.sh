#!/bin/bash
# usage: prepare.sh <pre054|main-no054|now054|refined> [--dry-run]
# Builds one isolated variant sandbox under SBX_ROOT/<random id>/tree:
#   1. a full copy of the variant's tree (git archive for a commit, tracked plus
#      untracked-not-ignored files for refined), never this worktree itself;
#   2. the authoring packet folder and its benchmark report removed (CONTAM_PATHS), in every
#      variant alike, so no sandbox holds earlier runs of this task;
#   3. node_modules cloned copy-on-write from this worktree;
#   4. its own system-spec-kit shared, runtime and CLI dist, skill-advisor dist and
#      sk-vision dist, so the Devin prompt hooks inject the same context in every variant;
#   5. a git repository whose object store borrows this repository's objects read-only
#      through alternates, holding one parentless commit with a neutral message and
#      author, so the model sees a clean status and a history that names no variant;
#   6. the same warm-up in every variant: one create and one strict validate on a
#      throwaway packet, so no variant pays a cold cache inside a timed step.
# Prints the preparation seconds and appends them to prep/prep-times.tsv, with the leak
# scan for the task in SPEED_TASK (default quiet, which has no terms file).
. "$(dirname "$0")/lib.sh"
V=${1:?variant}; [ "$2" = --dry-run ] && DRY=1
REV=$(variant_rev "$V") || { echo "unknown variant $V"; exit 2; }
if [ "$DRY" != 1 ]; then take_lock || exit 5; trap release_lock EXIT; fi
COMMON=$(git_bwt rev-parse --path-format=absolute --git-common-dir)
OLD=$(sbx_dir "$V")
ID=$(new_id); D=$SBX_ROOT/$ID; T=$D/tree
NEUTRAL="GIT_AUTHOR_NAME=workspace GIT_AUTHOR_EMAIL=workspace@localhost GIT_COMMITTER_NAME=workspace GIT_COMMITTER_EMAIL=workspace@localhost GIT_AUTHOR_DATE=2026-01-01T00:00:00Z GIT_COMMITTER_DATE=2026-01-01T00:00:00Z"

T0=$(date +%s)
echo "== prepare $V rev=$REV sandbox=$D"
[ -n "$OLD" ] && run "rm -rf '$OLD'"
# Sandboxes from before the neutral ids were named after their variant.
[ -d "$SBX_ROOT/$V" ] && run "rm -rf '$SBX_ROOT/$V'"
run "mkdir -p '$T'"
if [ "$REV" = WORKTREE ]; then
  run "(cd '$BWT' && git_bwt ls-files -z -co --exclude-standard --deduplicate | perl -0 -ne 'chomp; print \"\$_\\0\" if -e \$_ or -l \$_' | tar --null -T - -cf - | tar -x -C '$T')"
  BASE=$(git_bwt rev-parse HEAD)
else
  run "git_bwt archive --format=tar $REV | tar -x -C '$T'"
  BASE=$REV
fi
for p in $CONTAM_PATHS; do run "rm -rf '$T/$p'"; done
for nm in $NM_DIRS; do
  [ -d "$BWT/$nm" ] && run "[ -d '$T/${nm%/node_modules}' ] && cp -cR '$BWT/$nm' '$T/$nm'"
done
run "(cd '$T/$S' && node_modules/.bin/tsc --build) > '$D/build.log' 2>&1"
run "test -f '$T/$S/runtime/dist/lib/validation/orchestrator.js' && test -f '$T/$S/runtime/cli/dist/spec-folder/generate-description.js'" || {
  echo "PREPARE FAILED: system-spec-kit build, see $D/build.log"; exit 3; }
# The skill-advisor build feeds the Devin UserPromptSubmit hook and skill-advisor.cjs;
# the vision build feeds the sk-vision hook. A failure is recorded, not fatal.
run "(cd '$T/$ADV' && ../../system-spec-kit/node_modules/.bin/tsc -p tsconfig.build.json) > '$D/build-advisor.log' 2>&1; true"
run "(cd '$T/$VIS' && bun run scripts/build.ts) > '$D/build-vision.log' 2>&1; true"
run "git_sbx '$T' init -q && echo '$COMMON/objects' > '$T/.git/objects/info/alternates'"
run "git_sbx '$T' read-tree $BASE && git_sbx '$T' update-index -q --refresh; git_sbx '$T' add -A && TR=\$(git_sbx '$T' write-tree) && C=\$($NEUTRAL git_sbx '$T' commit-tree \$TR -m 'workspace snapshot') && git_sbx '$T' update-ref --no-deref HEAD \$C"
run "(cd '$T' && bash $S/runtime/cli/spec/create.sh --skip-branch --level 1 --track zz-warmup --short-name warmup 'Warm up' && bash $S/runtime/cli/spec/validate.sh specs/zz-warmup/001-warmup --strict; node $S/runtime/cli/lib/dist-freshness.cjs check --package system-skill-advisor/runtime --entry skill-advisor-cli; rm -rf specs/zz-warmup) > '$D/warmup.log' 2>&1; true"
run "git_sbx '$T' status --porcelain --untracked-files=all > '$D/status-baseline.txt' && test ! -s '$D/status-baseline.txt'" || {
  echo "PREPARE FAILED: sandbox status is not clean, see $D/status-baseline.txt"; head -20 "$D/status-baseline.txt"; exit 3; }
T1=$(date +%s)
SECS=$((T1 - T0))
if [ "$DRY" = 1 ]; then
  echo "dry-run prepare $V: nothing written"
  exit 0
fi
ADV_OK=missing; [ -f "$T/$ADV/dist/hooks/claude/user-prompt-submit.js" ] && [ -f "$T/$ADV/dist/runtime/skill-advisor-cli.js" ] && ADV_OK=built
VIS_OK=missing; [ -f "$T/$VIS/dist/prompt-evidence.js" ] && VIS_OK=built
# Proof the answer key is gone: files outside node_modules and .git naming the task's packet.
REFS=$(rg -l -uu -g '!**/node_modules/**' -g '!.git' recommend-level-quiet-flag "$T" 2>/dev/null | wc -l | tr -d ' ')
# Proof no template, example or card carries the current task's answer: files under the
# templates folders and the card that name a term in the task's terms file (lib.sh
# term_refs). The folder-name count above misses a template that uses the task as its
# worked example. NA when the task has no terms file; loop.sh refuses anything but 0.
TERM_REFS=$(term_refs "$T")
HEAD_C=$(git_sbx "$T" rev-parse HEAD)
NOTES="advisor_dist=$ADV_OK vision_dist=$VIS_OK quiet_flag_refs=$REFS task=$TASK task_term_refs=$TERM_REFS base=$BASE"
printf 'variant=%s rev=%s id=%s head=%s prepared_at=%s seconds=%s %s\n' "$V" "$REV" "$ID" "$HEAD_C" "$T1" "$SECS" "$NOTES" > "$D/ready"
sbx_set "$V" "$ID"
mkdir -p "$LOOP/prep"
[ -s "$LOOP/prep/prep-times.tsv" ] || printf 'variant\trev\tsandbox_head\tprepared_at_utc\tseconds\tnotes\n' > "$LOOP/prep/prep-times.tsv"
printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$V" "$REV" "$HEAD_C" "$(date -u -r "$T1" +%Y-%m-%dT%H:%M:%SZ)" "$SECS" "$NOTES" >> "$LOOP/prep/prep-times.tsv"
[ "$ADV_OK" = built ] && [ "$VIS_OK" = built ] || echo "WARN: $V hook builds incomplete ($NOTES); every variant should match"
[ "$REFS" = 0 ] || echo "WARN: $V sandbox still names the task's packet in $REFS file(s)"
[ -z "$TERMS" ] || [ "$TERM_REFS" = 0 ] || echo "WARN: $V templates or card name a term of task $TASK in $TERM_REFS file(s); loop.sh will refuse to dispatch"
echo "prepared $V seconds=$SECS $NOTES"
