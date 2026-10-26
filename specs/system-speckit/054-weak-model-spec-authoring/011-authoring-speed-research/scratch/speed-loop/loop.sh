#!/bin/bash
# usage: loop.sh [--task quiet|minpct] [--variants pre054,main-no054,now054[,refined]] [--runs N] [--dry-run]
#                [--no-upkeep] [--author-timeout S] [--upkeep-timeout S] [--reuse-refined] [--fresh] [--parallel-ok]
# Measures how long cli-devin deepseek-v4-1-flash-1017-max takes to author, then maintain,
# the same packet on each variant tree. --task picks the briefs, packet and scoring (lib.sh
# set_task); quiet is the default. Each round starts every variant's step at
# the same moment, in a shuffled order, so all variants share the machine load; the upkeep
# step starts only after every author step returned. Results land in
# results/<stamp>/results.tsv, round.tsv and summary.md.
. "$(dirname "$0")/lib.sh"
VARIANTS=pre054,main-no054,now054; RUNS=2; UPKEEP=1; TO_A=480; TO_U=240; REUSE_REFINED=0; FRESH=0; PAR_OK=0
while [ $# -gt 0 ]; do
  case $1 in
    --task) set_task "$2" || { echo "unknown task $2 (quiet or minpct)"; exit 2; }; shift;;
    --variants) VARIANTS=$2; shift;;
    --runs) RUNS=$2; shift;;
    --dry-run) DRY=1;;
    --no-upkeep) UPKEEP=0;;
    --author-timeout) TO_A=$2; shift;;
    --upkeep-timeout) TO_U=$2; shift;;
    --reuse-refined) REUSE_REFINED=1;;
    --fresh) FRESH=1;;
    --parallel-ok) PAR_OK=1;;
    *) echo "unknown flag $1"; exit 2;;
  esac; shift
done
# prepare.sh and step.sh source lib.sh again; the exported task makes them pick the same one.
export SPEED_TASK=$TASK
IFS=, read -r -a VS <<< "$VARIANTS"
for v in "${VS[@]}"; do variant_rev "$v" > /dev/null || { echo "unknown variant $v"; exit 2; }; done
case $RUNS in ''|*[!0-9]*|0) echo "--runs needs a positive integer"; exit 2;; esac
# perl's alarm reads a non-number or 0 as "no timer", which would remove the only cap.
for to in "$TO_A" "$TO_U"; do
  case $to in ''|*[!0-9]*) echo "timeouts need a whole number of seconds, got '$to'"; exit 2;; esac
  [ "$to" -ge 1 ] || { echo "timeouts must be at least 1 second"; exit 2; }
done
# cli-devin allows parallel dispatches only when the operator authorizes them explicitly.
if [ "$DRY" != 1 ] && [ "${#VS[@]}" -gt 1 ] && [ "$PAR_OK" != 1 ]; then
  echo "REFUSED: a real run launches ${#VS[@]} parallel cli-devin dispatches per round in --permission-mode dangerous."
  echo "Pass --parallel-ok to authorize that explicitly."; exit 2
fi
# Every input the task names must exist before anything is prepared. A dry run only warns,
# so the commands can be read while the briefs are still being written.
for f in "$AUTHOR_BRIEF" "$UPKEEP_BRIEF" $TERMS; do
  [ -s "$f" ] && continue
  [ "$DRY" = 1 ] && { echo "WARN: task $TASK input missing or empty: $f"; continue; }
  echo "REFUSED: task $TASK input missing or empty: $f"; exit 2
done
DF=; [ "$DRY" = 1 ] && DF=--dry-run
STAMP=$(date -u +%Y%m%dT%H%M%SZ)-$$; OUT=$LOOP/results/$STAMP
STEPS=author; [ "$UPKEEP" = 1 ] && STEPS="author upkeep"
echo "== speed loop $STAMP task=$TASK packet=$PK variants=$VARIANTS runs=$RUNS steps=[$STEPS] model=$MODEL timeouts author=${TO_A}s upkeep=${TO_U}s round_budget=${ROUND_BUDGET}s dry_run=$DRY"
echo "== each round launches ${#VS[@]} parallel cli-devin dispatches (authorized by --parallel-ok=$PAR_OK)"

# Interrupts: background steps ignore SIGINT and every dispatch runs in its own process
# group, so Ctrl-C alone would leave them running. The exit trap kills every dispatch
# group that has not finished, stops the step scripts and marks their sandboxes dirty.
FINISHED=0; STARTED=0; JOBS=
on_exit() {
  if [ "$FINISHED" != 1 ] && [ "$DRY" != 1 ] && [ "$STARTED" = 1 ]; then
    echo "== interrupted: stopping running dispatches and marking sandboxes dirty"
    for j in $JOBS; do kill -TERM "$j" 2>/dev/null; done
    for f in "$OUT"/*/r*/*.pgid; do
      [ -e "$f" ] || continue
      [ -e "${f%.pgid}.t1" ] && continue
      pg=$(cat "$f"); kill -9 -- "-$pg" 2>/dev/null; kill -9 "$pg" 2>/dev/null
    done
    for v in "${VS[@]}"; do d=$(sbx_dir "$v"); [ -n "$d" ] && touch "$d/DIRTY"; done
  fi
  release_lock
}
if [ "$DRY" != 1 ]; then
  take_lock || exit 5
  trap on_exit EXIT; trap 'exit 130' INT TERM HUP
fi

# Preflight: never dispatch from inside Devin, and only with a logged-in CLI.
if [ -n "$DEVIN_PROJECT_DIR" ]; then echo "REFUSED: running inside Devin (DEVIN_PROJECT_DIR is set)"; exit 9; fi
run "command -v devin > /dev/null" || { echo "devin CLI not installed"; exit 9; }
run "devin auth status 2>&1 | $GREP -qi 'logged in'" || { echo "devin is not logged in: run devin auth login"; exit 9; }
case ",$VARIANTS," in *,refined,*)
  # main-no054 is the main side of the last merge before now054. If main was merged into
  # this branch again, refined carries main drift that main-no054 lacks.
  if [ -n "$(git_bwt rev-list --merges -n 1 84887f37f7..HEAD 2>/dev/null)" ] || ! git_bwt merge-base --is-ancestor 84887f37f7 HEAD; then
    echo "WARN: this worktree's HEAD merged other work after 84887f37f7 (or does not contain it); refined minus main-no054 then includes that drift"
  fi;;
esac

# For a task with a terms file, a sandbox is reusable only when its leak scan read 0 and ran
# after the terms file last changed; a sandbox prepared for another task is rescanned by a
# new prepare.sh.
scan_ok() { [ -z "$TERMS" ] || { $GREP -q ' task_term_refs=0 ' "$1/ready" && [ "$1/ready" -nt "$TERMS" ]; }; }
PREPPED=
for v in "${VS[@]}"; do
  d=$(sbx_dir "$v")
  # A sandbox is reused only when it is ready for this revision, not marked dirty,
  # holds no packet track and has a clean status. Refined is retaken every run unless
  # --reuse-refined, and --fresh re-prepares every variant.
  if [ "$FRESH" != 1 ] && { [ "$v" != refined ] || [ "$REUSE_REFINED" = 1 ]; } && [ -n "$d" ] && [ -f "$d/ready" ] &&
     [ ! -e "$d/DIRTY" ] && [ ! -e "$d/tree/$TRACK" ] && $GREP -q "rev=$(variant_rev "$v") " "$d/ready" && scan_ok "$d" &&
     [ -z "$(git_sbx "$d/tree" status --porcelain --untracked-files=all 2>/dev/null)" ]; then
    echo "+ reuse sandbox $v: $(cat "$d/ready")"; continue
  fi
  echo "+ bash prepare.sh $v $DF"
  bash "$LOOP/prepare.sh" "$v" $DF || exit 3
  PREPPED="$PREPPED $v "
done
# Leak gate: no dispatch while any sandbox's templates or card name a term of the task.
# A count that is not 0, NA included, refuses the whole run.
if [ -n "$TERMS" ]; then
  if [ "$DRY" = 1 ]; then
    echo "+ refuse to dispatch unless every sandbox ready file reads task_term_refs=0 (terms: $TERMS)"
  else
    for v in "${VS[@]}"; do
      d=$(sbx_dir "$v")
      n=$(sed -n 's/.* task_term_refs=\([^ ]*\) .*/\1/p' "$d/ready" 2>/dev/null)
      [ "$n" = 0 ] || { echo "REFUSED: sandbox $v reads task_term_refs=${n:-missing}; its templates or card name a term in $TERMS"; exit 4; }
    done
    echo "leak scan: task_term_refs=0 in every sandbox"
  fi
fi

# Each variant's sandbox head as the run starts, indexed like VS (bash 3.2 has no
# associative arrays). The snapshot commit has a fixed identity, date and message and no
# parent, so re-preparing the same tree gives the same head; for refined a different head
# means this worktree changed since the run started.
ready_field() { sed -n "s/.* $2=\\([^ ]*\\) .*/\\1/p" "$1/ready" 2>/dev/null; }
H0=(); for i in "${!VS[@]}"; do d=$(sbx_dir "${VS[$i]}"); H0[$i]=$([ -n "$d" ] && ready_field "$d" head); done
# Between rounds, outside every timed step: a sandbox an earlier round left dirty or
# holding a packet is rebuilt, so one side write no longer costs that variant every later
# round. The rebuild is kept only when its head matches the run start and, for a task with
# a terms file, its leak scan reads 0; otherwise the new sandbox is marked dirty and that
# variant's steps abort for the rest of the run. A refusal is final: the same tree or the
# same failure would only cost another full build every round.
REFUSED=
reprepare() {
  local r=$1 i=$2 v=${VS[$2]} d h n why=
  case "$REFUSED" in *" $v "*) return 0;; esac
  d=$(sbx_dir "$v")
  [ -n "$d" ] && { [ -e "$d/DIRTY" ] || [ -e "$d/tree/$TRACK" ]; } || return 0
  # A dry run changes no sandbox, so one the run start already plans to rebuild still looks
  # dirty here; a real run would have rebuilt it, so planning it again would overstate the work.
  [ "$DRY" = 1 ] && case "$PREPPED" in *" $v "*) return 0;; esac
  echo "+ bash prepare.sh $v $DF"
  if [ "$DRY" = 1 ]; then
    bash "$LOOP/prepare.sh" "$v" $DF
    echo "== round $r: would re-prepare $v and keep it only if head=${H0[$i]:-<head at run start>}$([ -n "$TERMS" ] && echo " and task_term_refs=0"), else mark it DIRTY"
    return 0
  fi
  if ! bash "$LOOP/prepare.sh" "$v"; then
    why="prepare.sh failed"
  else
    d=$(sbx_dir "$v"); h=$(ready_field "$d" head); n=$(ready_field "$d" task_term_refs)
    if [ -z "${H0[$i]}" ] || [ "$h" != "${H0[$i]}" ]; then
      why="head ${h:-missing} differs from the run-start head ${H0[$i]:-missing}"
    elif [ -n "$TERMS" ] && [ "$n" != 0 ]; then
      why="task_term_refs=${n:-missing}"
    fi
  fi
  if [ -n "$why" ]; then
    # A failed prepare.sh can leave the map on a removed directory; the steps then abort on
    # the missing tree, and the DIRTY file says why.
    d=$(sbx_dir "$v"); [ -n "$d" ] && mkdir -p "$d" && touch "$d/DIRTY"
    REFUSED="$REFUSED $v "
    echo "== round $r: refused to re-prepare $v ($why); its sandbox stays DIRTY and its steps abort for the rest of the run"
  else
    echo "== round $r: re-prepared $v (head unchanged)"
  fi
}

run "mkdir -p '$OUT' && header_row > '$OUT/results.tsv' && printf 'round\torder\tstart\tend\twall_seconds\tover_budget\n' > '$OUT/round.tsv'"
STARTED=1
L0=$(date +%s)
NV=${#VS[@]}
for r in $(seq 1 "$RUNS"); do
  [ "$r" -gt 1 ] && for i in "${!VS[@]}"; do reprepare "$r" "$i"; done
  R0=$(date +%s)
  # A new launch order every round, so no variant always gets the first start.
  RVS=(); while IFS= read -r x; do RVS+=("$x"); done < <(printf '%s\n' "${VS[@]}" | perl -MList::Util=shuffle -e 'print shuffle(<STDIN>)')
  echo "== round $r order: ${RVS[*]}"
  for st in $STEPS; do
    TO=$TO_A; [ "$st" = upkeep ] && TO=$TO_U
    LASTF=; { [ "$st" = upkeep ] || [ "$UPKEEP" = 0 ]; } && LASTF=--last
    W=$OUT/wt-r$r-$st
    # This worktree must not change because of a run. Other agents edit it at the same
    # time, so changes are listed for a human look: new status lines, a changed tracked
    # diff (which also catches a further edit to an already modified file), and writes
    # into its gitignored node_modules.
    run "git_bwt status --porcelain --untracked-files=all > '$W-before.txt'; git_bwt diff HEAD | shasum -a 256 > '$W-diff-before.txt'; touch '$W.mark'"
    echo "== round $r $st: launching ${RVS[*]} together"
    if [ "$DRY" = 1 ]; then
      i=0; for v in "${RVS[@]}"; do i=$((i + 1)); echo "+ (background) bash step.sh $v $r $st order=$i"; bash "$LOOP/step.sh" "$v" "$r" "$st" "$OUT" "$TO" "$i" --dry-run $LASTF | sed 's/^/    /'; done
      echo "+ wait until every step wrote its .ready file, then touch '$OUT/go-r$r-$st'"
    else
      JOBS=; i=0
      for v in "${RVS[@]}"; do
        i=$((i + 1)); mkdir -p "$OUT/$v/r$r"
        bash "$LOOP/step.sh" "$v" "$r" "$st" "$OUT" "$TO" "$i" $LASTF > "$OUT/$v/r$r/$st.log" 2>&1 &
        JOBS="$JOBS $!"
      done
      # Start barrier: wait until every step took its snapshots (or exited), then start all.
      n=0
      while [ $n -lt 1500 ]; do
        k=0; for v in "${RVS[@]}"; do [ -e "$OUT/$v/r$r/$st.ready" ] && k=$((k + 1)); done
        [ "$k" -ge "$NV" ] && break
        sleep 0.2; n=$((n + 1))
      done
      touch "$OUT/go-r$r-$st"
      wait $JOBS; JOBS=
      for v in "${RVS[@]}"; do tail -1 "$OUT/$v/r$r/$st.log"; done
    fi
    run "git_bwt status --porcelain --untracked-files=all > '$W-after.txt'; git_bwt diff HEAD | shasum -a 256 > '$W-diff-after.txt'"
    run "diff '$W-before.txt' '$W-after.txt' | $GREP '^>' | $GREP -v -F '$LOOP_REL/' > '$W-new.txt'; true"
    run "for nm in $NM_DIRS; do [ -d '$BWT/'\$nm ] && find '$BWT/'\$nm -maxdepth 3 -newer '$W.mark' -print; done > '$W-nm.txt' 2>/dev/null; true"
    if [ "$DRY" != 1 ]; then
      WT=$(wc -l < "$W-new.txt" | tr -d ' ')
      WD=0; cmp -s "$W-diff-before.txt" "$W-diff-after.txt" || WD=1
      WN=$(wc -l < "$W-nm.txt" | tr -d ' ')
      echo "worktree: $WT new status line(s) outside $LOOP_REL/, tracked diff changed=$WD, node_modules writes=$WN during round $r $st"
      for v in "${RVS[@]}"; do
        f=$OUT/$v/r$r/$st.kv
        if ! $GREP -q '^rc=' "$f" 2>/dev/null; then
          echo "MISSING ROW: $v round $r $st left no result; see $OUT/$v/r$r/$st.log"
          printf 'round=%s\nvariant=%s\nstep=%s\nrc=MISSING\n' "$r" "$v" "$st" >> "$f"
        fi
        printf 'wt_new_lines=%s\nwt_diff_changed=%s\nwt_nm_writes=%s\n' "$WT" "$WD" "$WN" >> "$f"
        render_row "$f" >> "$OUT/results.tsv"
      done
    fi
  done
  R1=$(date +%s); RW=$((R1 - R0)); OVER=0; [ "$RW" -gt "$ROUND_BUDGET" ] && OVER=1
  run "printf '%s\t%s\t%s\t%s\t%s\t%s\n' $r '$(IFS=,; echo "${RVS[*]}")' $R0 $R1 $RW $OVER >> '$OUT/round.tsv'"
  run "python3 '$LOOP/summarize.py' '$OUT/results.tsv' > '$OUT/summary.md'"
  echo "== round $r wall seconds: $RW$([ "$OVER" = 1 ] && echo " OVER BUDGET (${ROUND_BUDGET}s)")"
done
FINISHED=1
echo "== loop wall seconds: $(( $(date +%s) - L0 ))"
echo "== summary: $OUT/summary.md"
