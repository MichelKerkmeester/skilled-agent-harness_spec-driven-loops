#!/bin/bash
# Shared constants and helpers for the speed loop. Sourced by loop.sh, prepare.sh and step.sh.

LOOP=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
BWT=$(cd "$LOOP/../../../../../.." && pwd)
PKT=specs/system-speckit/054-weak-model-spec-authoring
LOOP_REL=$PKT/011-authoring-speed-research/scratch/speed-loop
SBX_ROOT=${SPEED_SANDBOX_ROOT:-/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/fcd93cd7-b3f2-45e6-b976-87fabe792df3/scratchpad/speed-loop}
# Variant name to sandbox id. It lives in this worktree, not under SBX_ROOT, so a model
# that lists its sandbox's parent folder sees only neutral ids.
MAP=$LOOP/prep/sandbox-map.tsv

# Frozen inputs of the earlier authoring benchmark (brief, hint list, anchor rule), reused
# so speed results stay comparable with its quality results. They are read from this
# worktree; no sandbox holds them.
BL=$BWT/$PKT/001-template-drift-census-and-baseline/scratch/baseline-swe-l3
# The hint list is shared by every task: a bare template hint left in a packet is residue
# whatever the task is.
HINTS=$BL/hints-l3.txt
ANCHOR_RULE=$BWT/$PKT/009-authoring-benchmark-and-closeout/scratch/tools/justified-anchors.sh

MODEL=deepseek-v4-1-flash-1017-max
TRACK=specs/zz-bench-authoring
S=.skilled/skills/system-spec-kit

# The task under test. loop.sh exports SPEED_TASK, so prepare.sh and step.sh see the task
# the loop was started with; a hand-run script defaults to quiet.
#   quiet:  the earlier benchmark's Level 3 task, whose answer the later templates use as
#           their worked example. Scored on four documents with the anchor rule; upkeep
#           counts when the new REQ id reaches tasks.md and acceptance-criteria.md.
#   minpct: a task no template, example or card names, at the level the helper picks.
#           Scored on spec, plan and tasks; the anchor rule is Level 3 only, so
#           missing_anchors is NA; upkeep counts when the new REQ id reaches spec.md and
#           tasks.md. A sandbox whose templates or card name a term in TERMS is refused.
# Per task: AUTHOR_BRIEF, UPKEEP_BRIEF, PKN (packet folder), DOC_LIST (scored documents),
# UPKEEP_DOCS (where a new REQ id must appear), ANCHORS (1 runs the anchor rule) and
# TERMS (the leak-scan terms file, empty for no scan).
NEW_TASK_DIR=$BWT/$PKT/018-benchmark-redesign-and-remeasure/scratch/briefs
set_task() {
  case $1 in
    quiet)
      AUTHOR_BRIEF=$BL/brief-1.txt; UPKEEP_BRIEF=$LOOP/upkeep-brief.txt
      PKN=001-recommend-level-quiet-flag
      DOC_LIST="spec.md plan.md tasks.md acceptance-criteria.md"
      UPKEEP_DOCS="tasks.md acceptance-criteria.md"; ANCHORS=1; TERMS=;;
    minpct)
      AUTHOR_BRIEF=$NEW_TASK_DIR/author-minpct.txt; UPKEEP_BRIEF=$NEW_TASK_DIR/upkeep-minpct.txt
      PKN=001-completeness-min-percent
      DOC_LIST="spec.md plan.md tasks.md"
      UPKEEP_DOCS="spec.md tasks.md"; ANCHORS=0; TERMS=$NEW_TASK_DIR/task-terms.txt;;
    *) return 1;;
  esac
  TASK=$1; PK=$TRACK/$PKN
}
set_task "${SPEED_TASK:-quiet}" || { echo "unknown task ${SPEED_TASK}" >&2; exit 2; }

# Files in a sandbox tree under the templates folders and the authoring card that name a
# term in TERMS: proof that no template, example or card carries the task's answer. Prints
# NA when the task has no terms file, it is empty, or the tree holds none of the scanned
# paths, so a scan that looked at nothing never reads as 0. A failed rg (missing, or exit 2)
# also prints NA: rg exits 1 for no match, and only 0 or 1 is a completed scan.
term_refs() {
  local t=$1 p paths=() out rc=0
  if [ -z "$TERMS" ] || [ ! -s "$TERMS" ]; then echo NA; return; fi
  for p in "$S/templates" "$S/references/templates" "$S/references/workflows/spec-authoring-card.md"; do
    [ -e "$t/$p" ] && paths+=("$t/$p")
  done
  [ ${#paths[@]} -gt 0 ] || { echo NA; return; }
  out=$(rg -l -uu -F -f "$TERMS" "${paths[@]}" 2>/dev/null) || rc=$?
  [ "$rc" -le 1 ] || { echo NA; return; }
  if [ -z "$out" ]; then echo 0; else printf '%s\n' "$out" | wc -l | tr -d ' '; fi
}
ADV=.skilled/skills/system-skill-advisor/runtime
VIS=.skilled/skills/sk-vision/vision-runtime
DB=$HOME/.local/share/devin/cli/sessions.db
GREP=/usr/bin/grep
ROUND_BUDGET=900

# Paths removed from every sandbox before its snapshot commit. The packet folder holds
# transcripts and copies of earlier runs of this exact task, and the report folder quotes
# them; the earlier benchmark deleted the packet folder from its disposable worktree for
# the same reason. Removing them from all variants keeps the answer key out of reach.
CONTAM_PATHS="$PKT .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline"

# node_modules folders cloned (APFS copy-on-write) into every sandbox. A clone, unlike a
# symlink, gives a dispatched model no write path back into this worktree.
NM_DIRS=".skilled/node_modules $S/node_modules $ADV/node_modules $VIS/node_modules"

# One results.tsv row per run and step, in this column order.
COLS="round variant step order rc timed_out seconds sessions tool_calls tool_calls_null validate_calls tok_in tok_cache_read tok_out refs_054 refs_054_updates contam_hits contam_hits_updates contam_weak refs_outside contaminated strict_passed leftover_hints missing_anchors out_of_scope_writes sbx_side_writes leftover_procs pre_strict pre_hints upkeep_applied t0 t1 wt_new_lines wt_diff_changed wt_nm_writes"

# Never dispatch a SWE-2 model; the operator excluded that family from this loop.
case $MODEL in swe*) echo "REFUSED: model $MODEL is a SWE model" >&2; exit 9;; esac

# pre054 is the packet start. main-no054 is the main side of the last merge into the
# authoring branch: pre054 plus 166 commits from main and none of the authoring work, so
# now054 minus main-no054 is the cost of that work alone, while now054 minus pre054 also
# carries main's drift.
variant_rev() {
  case $1 in
    pre054) echo ac2be31ec6;;
    main-no054) echo 9a80256f05;;
    now054) echo 84887f37f7;;
    refined) echo WORKTREE;;
    *) return 1;;
  esac
}

# This worktree. GIT_OPTIONAL_LOCKS=0 keeps status from taking the index lock that the
# other agents working in this tree need.
git_bwt() { GIT_OPTIONAL_LOCKS=0 GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false git -C "$BWT" "$@"; }

# A sandbox repository under SBX_ROOT, never this worktree. Hooks are disabled so the
# user's global hooks never run against a throwaway tree.
git_sbx() {
  local t=$1; shift
  GIT_OPTIONAL_LOCKS=0 GIT_CONFIG_COUNT=3 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false \
    GIT_CONFIG_KEY_1=core.hooksPath GIT_CONFIG_VALUE_1=/dev/null \
    GIT_CONFIG_KEY_2=commit.gpgsign GIT_CONFIG_VALUE_2=false \
    git -C "$t" "$@"
}

# Sandbox ids: neutral random names, so the working directory a model sees does not
# name its variant.
new_id() { printf 'w%s\n' "$(od -An -N5 -tx1 /dev/urandom | tr -d ' \n')"; }
sbx_id() { [ -f "$MAP" ] && awk -F'\t' -v r="$SBX_ROOT" -v v="$1" '$1==r && $2==v {id=$3} END {if (id) print id}' "$MAP"; }
sbx_dir() { local id; id=$(sbx_id "$1"); [ -n "$id" ] && echo "$SBX_ROOT/$id"; }
sbx_set() {
  mkdir -p "$(dirname "$MAP")"
  { [ -f "$MAP" ] && awk -F'\t' -v r="$SBX_ROOT" -v v="$1" '!($1==r && $2==v)' "$MAP"; printf '%s\t%s\t%s\n' "$SBX_ROOT" "$1" "$2"; } > "$MAP.tmp" && mv "$MAP.tmp" "$MAP"
}

# One lock per sandbox root, so two loops (or a loop and a hand-run prepare.sh) never
# rebuild or dispatch into the same sandbox. A lock whose PID is gone is stale.
LOCK=$SBX_ROOT/.lock
take_lock() {
  [ -n "$SPEED_LOOP_LOCK_HELD" ] && return 0
  mkdir -p "$SBX_ROOT"
  if ! mkdir "$LOCK" 2>/dev/null; then
    local p; p=$(cat "$LOCK/pid" 2>/dev/null)
    if [ -n "$p" ] && kill -0 "$p" 2>/dev/null; then
      echo "REFUSED: another speed loop (pid $p) holds $LOCK"; return 1
    fi
    echo "removing a stale lock left by pid ${p:-unknown}"
    rm -rf "$LOCK"; mkdir "$LOCK" || return 1
  fi
  echo $$ > "$LOCK/pid"; LOCK_MINE=1; export SPEED_LOOP_LOCK_HELD=$$
}
release_lock() { [ "$LOCK_MINE" = 1 ] && [ "$(cat "$LOCK/pid" 2>/dev/null)" = $$ ] && rm -rf "$LOCK"; LOCK_MINE=0; }

# Renders a key=value file as one TSV row in COLS order; a missing or empty key prints NA.
render_row() {
  awk -v cols="$COLS" 'BEGIN {n = split(cols, c, " ")}
    { k = $0; sub(/=.*/, "", k); x = $0; sub(/^[^=]*=/, "", x); v[k] = x }
    END { for (i = 1; i <= n; i++) { y = ((c[i] in v) && v[c[i]] != "") ? v[c[i]] : "NA"; printf "%s%s", y, (i < n ? "\t" : "\n") } }' "$1"
}
header_row() { echo "$COLS" | tr ' ' '\t'; }

# run "<command string>": prints it under --dry-run, otherwise prints and evaluates it.
DRY=${DRY:-0}
run() {
  printf '+ %s\n' "$1"
  [ "$DRY" = 1 ] && return 0
  eval "$1"
}
