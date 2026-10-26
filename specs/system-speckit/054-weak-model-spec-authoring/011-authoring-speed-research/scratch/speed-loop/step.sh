#!/bin/bash
# usage: step.sh <variant> <round> <author|upkeep> <results dir> <timeout seconds> <launch order> [--dry-run] [--last]
# One timed step of one variant: snapshot the sandbox, wait at the shared start barrier,
# dispatch the brief inside the sandbox, audit the Devin session, score the packet with the
# frozen quality guards, and write <results dir>/<variant>/r<round>/<step>.kv, which loop.sh
# renders as one results.tsv row. Every exit, early ones included, leaves a .kv file.
# --last removes the packet afterwards so the sandbox is clean for the next round.
# The brief, packet, scored documents and upkeep check come from the task in SPEED_TASK,
# which loop.sh exports (lib.sh set_task).
. "$(dirname "$0")/lib.sh"
V=$1; R=$2; STEP=$3; OUT=$4; TO=$5; ORD=$6; LAST=0
for a in "$7" "$8"; do case $a in --dry-run) DRY=1;; --last) LAST=1;; esac; done
D=$(sbx_dir "$V"); [ -n "$D" ] || D="$SBX_ROOT/<id of $V, assigned by prepare.sh>"
T=$D/tree; O=$OUT/$V/r$R; P=$O/$STEP; KV=$P.kv; GO=$OUT/go-r$R-$STEP
case $STEP in author) BRIEF=$AUTHOR_BRIEF;; upkeep) BRIEF=$UPKEEP_BRIEF;; *) echo "bad step $STEP"; exit 2;; esac

kv() { [ "$DRY" = 1 ] || printf '%s=%s\n' "$1" "$2" >> "$KV"; }
ready() { [ "$DRY" = 1 ] || touch "$P.ready"; }
# An early exit still writes a row (rc ABORT or SKIP), and still reaches the barrier so
# the other variants are not held back.
stop() { kv rc "$1"; ready; echo "$1 $V r$R $STEP: $2"; exit 0; }

if [ "$DRY" != 1 ]; then
  mkdir -p "$O" && : > "$KV"
fi
kv round "$R"; kv variant "$V"; kv step "$STEP"; kv order "$ORD"
run "cp '$BRIEF' '$P.brief' && cmp -s '$BRIEF' '$P.brief'" || stop ABORT "brief copy differs"
run "cd '$T'" || stop ABORT "no sandbox for $V; run prepare.sh $V"
if [ "$STEP" = author ]; then
  if [ "$DRY" != 1 ] && { [ -e "$T/$TRACK" ] || [ -e "$D/DIRTY" ]; }; then
    stop ABORT "sandbox holds a packet or is marked dirty; rerun prepare.sh $V"
  fi
else
  if [ "$DRY" != 1 ]; then
    # The author step's result is the upkeep step's starting state.
    kv pre_strict "$(sed -n 's/^strict_passed=//p' "$O/author.kv" 2>/dev/null)"
    kv pre_hints "$(sed -n 's/^leftover_hints=//p' "$O/author.kv" 2>/dev/null)"
    if [ ! -d "$T/$PK" ]; then
      [ "$LAST" = 1 ] && rm -rf "${T:?}/$TRACK"
      stop SKIP "the author step left no packet"
    fi
  fi
  run "$GREP -oE 'REQ-[0-9]+' '$T/$PK/spec.md' | sort -u > '$P.req-before'"
fi
run "git_sbx '$T' status --porcelain --untracked-files=all > '$P.sbx-before' && touch '$P.mark'"

# Start barrier: every variant takes its snapshots first, then all start together.
if [ "$DRY" = 1 ]; then
  echo "+ touch '$P.ready'; wait for '$GO'"
else
  ready
  n=0; while [ ! -e "$GO" ] && [ $n -lt 3000 ]; do sleep 0.2; n=$((n + 1)); done
fi

# The timed span is the dispatch alone. The child runs in its own process group (its
# PGID is written to .pgid, so an interrupted loop can kill it), and the whole group is
# killed once it returns or times out. Print mode cannot show Devin's workspace-trust prompt
# and refuses an untrusted directory at exit 1, and every sandbox is a new directory, so
# the trust check is skipped per dispatch rather than by trusting each sandbox in config.
# Newer trees self-heal stale package builds at session start. A sandbox does not prebuild
# every package, so that rebuild would land inside the timed step and write build output;
# trees without the hook ignore the switch, so every variant runs under the same conditions.
run "date +%s > '$P.t0'"
run "AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 SPECKIT_DIST_AUTO_REBUILD=0 perl -e 'setpgrp(0,0); alarm shift; exec @ARGV' $TO devin -p --model $MODEL --permission-mode dangerous --respect-workspace-trust=false -- \"\$(cat '$P.brief')\" </dev/null > '$P.out' 2> '$P.err' & DPID=\$!; echo \$DPID > '$P.pgid'; wait \$DPID; echo \$? > '$P.rc'; date +%s > '$P.t1'; pkill -9 -g \$DPID 2>/dev/null; true"

# Leftovers: any process outside this loop's own process group whose working directory
# or command line is inside the sandbox, such as a detached hook follower.
leftovers() {
  local own pid pg
  own=$(ps -o pgid= -p $$ | tr -d ' ')
  { pgrep -f "$T"; lsof -d cwd -Fpn 2>/dev/null | awk -v t="$T" '/^p/ {p = substr($0, 2)} /^n/ {if (index(substr($0, 2), t) == 1) print p}'; } | sort -u |
    while read -r pid; do
      [ "$pid" = $$ ] && continue
      pg=$(ps -o pgid= -p "$pid" 2>/dev/null | tr -d ' ')
      [ -z "$pg" ] || [ "$pg" = "$own" ] && continue
      echo "$pid $(ps -o command= -p "$pid" 2>/dev/null)"
    done
}
if [ "$DRY" = 1 ]; then
  echo "+ list leftover processes in '$T' to '$P.procs' and kill them"
else
  leftovers > "$P.procs"
  awk '{print $1}' "$P.procs" | xargs kill -9 2>/dev/null
fi
run "git_sbx '$T' status --porcelain --untracked-files=all > '$P.sbx-after'"
# Gitignored writes are invisible to git status, so every file changed during the step
# outside the packet track and .git is listed too.
run "find '$T' \\( -path '$T/.git' -o -path '$T/$TRACK' \\) -prune -o \\( -type f -o -type l \\) -newer '$P.mark' -print > '$P.side-writes'"
run "python3 '$LOOP/audit.py' '$DB' '$T' \$(cat '$P.t0') \$(cat '$P.t1') '$P' > '$P.audit'"

# Quality guards, scored as the earlier authoring benchmark scored them.
run "bash $S/runtime/cli/spec/validate.sh $PK --strict > '$P.validate' 2>&1; true"
run "rm -rf '$P-packet' && { [ -d '$T/$TRACK' ] && cp -R '$T/$TRACK' '$P-packet' || true; }"
# The anchor rule scores a Level 3 packet only; a task without it records NA.
[ "$ANCHORS" = 1 ] && run "bash '$ANCHOR_RULE' '$P-packet/$PKN' '$BWT' > '$P.anchors'"
[ "$STEP" = upkeep ] && run "$GREP -oE 'REQ-[0-9]+' '$T/$PK/spec.md' 2>/dev/null | sort -u > '$P.req-after'"
if [ "$LAST" = 1 ]; then
  run "rm -rf '$T/$TRACK'"
fi
[ "$DRY" = 1 ] && exit 0

S_T0=$(cat "$P.t0"); S_T1=$(cat "$P.t1"); RC=$(cat "$P.rc")
SECS=$((S_T1 - S_T0))
# A capped run is killed by SIGALRM (rc 142); a run that ends at the cap any other way
# is still a capped run.
TIMED_OUT=0; { [ "$RC" = 142 ] || [ "$SECS" -ge "$TO" ]; } && TIMED_OUT=1
if [ -d "$P-packet" ]; then
  C=$P-packet/$PKN
  DOCS=; for doc in $DOC_LIST; do DOCS="$DOCS $C/$doc"; done
  STRICT=$($GREP -c 'RESULT: PASSED' "$P.validate")
  BARE=$($GREP -F -o -f "$HINTS" $DOCS 2>/dev/null | wc -l | tr -d ' ')
  TOKEN=$(rg -o --no-filename '\[YOUR_VALUE_HERE: [^]]*\]' $DOCS 2>/dev/null | wc -l | tr -d ' ')
  HINTS_LEFT=$((BARE + TOKEN))
  MISSING=NA; [ "$ANCHORS" = 1 ] && MISSING=$(sed -E 's/^counted=([0-9]+).*/\1/' "$P.anchors")
else
  STRICT=0; HINTS_LEFT=NA; MISSING=NA
fi
[ "$LAST" = 1 ] && [ -d "$P-packet" ] && [ -e "$T/$TRACK" ] && echo "WARN: packet removal failed in $V"
OOS=$(diff "$P.sbx-before" "$P.sbx-after" | $GREP '^>' | $GREP -v 'zz-bench-authoring' | wc -l | tr -d ' ')
SIDE=$(wc -l < "$P.side-writes" | tr -d ' ')
PROCS=$(wc -l < "$P.procs" | tr -d ' ')
# Visible out-of-scope writes, or any gitignored write into a build output or
# node_modules, would change later rounds, so the sandbox is re-prepared before reuse.
# The .dist-freshness-*.json stamps are left out: the first validate.sh of a step writes
# them in every variant alike, and counting them would abort every later round's author step.
if [ "$OOS" != 0 ] || $GREP -vE '/\.dist-freshness-[^/]*\.json$' "$P.side-writes" | $GREP -qE '/(dist|node_modules)/'; then touch "$D/DIRTY"; fi
APPLIED=NA
if [ "$STEP" = upkeep ]; then
  # Applied: some new REQ id appears in every document the task's upkeep check names.
  APPLIED=0
  for id in $(comm -13 "$P.req-before" "$P.req-after"); do
    hit=1
    for doc in $UPKEEP_DOCS; do $GREP -q "$id" "$P-packet/$PKN/$doc" 2>/dev/null || hit=0; done
    [ "$hit" = 1 ] && APPLIED=1
  done
fi
kv rc "$RC"; kv timed_out "$TIMED_OUT"; kv seconds "$SECS"
cat "$P.audit" >> "$KV"
kv strict_passed "$STRICT"; kv leftover_hints "$HINTS_LEFT"; kv missing_anchors "$MISSING"
kv out_of_scope_writes "$OOS"; kv sbx_side_writes "$SIDE"; kv leftover_procs "$PROCS"
kv upkeep_applied "$APPLIED"; kv t0 "$S_T0"; kv t1 "$S_T1"
echo "$V r$R $STEP rc=$RC seconds=$SECS strict=$STRICT hints=$HINTS_LEFT anchors=$MISSING oos=$OOS side=$SIDE procs=$PROCS applied=$APPLIED $(tr '\n' ' ' < "$P.audit")"
