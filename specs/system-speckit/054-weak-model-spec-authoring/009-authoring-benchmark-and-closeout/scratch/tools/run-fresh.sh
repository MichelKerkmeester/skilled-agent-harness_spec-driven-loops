#!/bin/bash
# usage: run-fresh.sh <N> dispatch|measure
# Runs the frozen Level 3 brief on cli-devin deepseek-v4-1-flash-1017-max inside the disposable worktree FWT,
# keeps every evidence file in the build worktree under scratch/amend3/fresh, and scores the packet with the anchor rule script.
export GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false
BWT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/217-weak-model-spec-authoring
FWT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/223-deepseek-final
SCR=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/fcd93cd7-b3f2-45e6-b976-87fabe792df3/scratchpad
PKT=specs/system-speckit/054-weak-model-spec-authoring
P9=$BWT/$PKT/009-authoring-benchmark-and-closeout
BL=$BWT/$PKT/001-template-drift-census-and-baseline/scratch/baseline-swe-l3
B=$P9/scratch/amend3/fresh; RN=$B/runs; BR=$B/briefs; mkdir -p "$RN" "$BR"
S=.skilled/skills/system-spec-kit
PK=specs/zz-bench-authoring/001-recommend-level-quiet-flag
OUTPKT="$SCR/bench-packets/deepseek-final3-l3"
DB=$HOME/.local/share/devin/cli/sessions.db
GREP=/usr/bin/grep
N=$1; MODE=$2
cd "$FWT" || exit 1
if [ "$MODE" = dispatch ]; then
  if [ -e specs/zz-bench-authoring ]; then echo "ABORT: specs/zz-bench-authoring exists before run $N"; exit 2; fi
  K=$(ls "$RN" 2>/dev/null | $GREP -c "^T005-$N\.t0$")
  if [ "$K" != 0 ]; then
    A="$RN/attempts/T005-$N-$(date +%s)"; mkdir -p "$A"
    for f in "$RN/T005-$N".*; do mv "$f" "$A/"; done
    for f in "$B/status-before-$N.txt" "$B/status-after-$N.txt" "$B"/diff-hash-*-$N.txt "$B/status-all-before-$N.txt" "$B/status-all-after-$N.txt"; do [ -e "$f" ] && mv "$f" "$A/"; done
  fi
  git status --porcelain > "$B/status-before-$N.txt"
  git status --porcelain --untracked-files=all > "$B/status-all-before-$N.txt"
  git diff e13115c7da5a74f5dff811bf340a90708532fd35 -- .skilled | shasum -a 256 | cut -d' ' -f1 > "$B/diff-hash-before-$N.txt"
  cp "$BL/brief-1.txt" "$BR/T005-$N.txt"
  cmp "$BL/brief-1.txt" "$BR/T005-$N.txt" || { echo "BRIEF_COPY_DIFFERS"; exit 4; }
  date +%s > "$RN/T005-$N.t0"
  AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 perl -e 'alarm shift; exec @ARGV' 2700 devin -p --model deepseek-v4-1-flash-1017-max --permission-mode dangerous -- "$(cat "$BR/T005-$N.txt")" </dev/null > "$RN/T005-$N.txt" 2> "$RN/T005-$N.err"
  RC=$?
  date +%s > "$RN/T005-$N.t1"
  echo "$RC" > "$RN/T005-$N.rc"
  git status --porcelain > "$B/status-after-$N.txt"
  git status --porcelain --untracked-files=all > "$B/status-all-after-$N.txt"
  git diff e13115c7da5a74f5dff811bf340a90708532fd35 -- .skilled | shasum -a 256 | cut -d' ' -f1 > "$B/diff-hash-after-$N.txt"
  T0=$(cat "$RN/T005-$N.t0"); T1=$(cat "$RN/T005-$N.t1")
  sqlite3 -readonly "$DB" "select id from sessions where working_directory='$FWT' and created_at between $T0 and $((T1 + 60)) order by created_at;" > "$RN/T005-$N.session"
  NS=$(wc -l < "$RN/T005-$N.session" | tr -d ' ')
  echo "dispatch done N=$N rc=$RC seconds=$((T1 - T0)) sessions=$NS"
  if [ "$NS" = 1 ]; then
    SID=$(cat "$RN/T005-$N.session")
    NC=$(sqlite3 -readonly "$DB" "select count(*) from tool_call_state where session_id='$SID';")
    sqlite3 -readonly "$DB" "select tool_call_json from tool_call_state where session_id='$SID';" > "$RN/T005-$N.calls"
    sqlite3 -readonly "$DB" "select tool_call_update_json from tool_call_state where session_id='$SID';" > "$RN/T005-$N.updates"
    {
      echo "session $SID tool_calls $NC"
      for p in baseline-swe baseline-deepseek bench-evidence bench-packets hints- anchors- 009-authoring-benchmark-and-closeout /private/tmp authoring-baseline model-eval; do
        echo "$p call_json=$($GREP -o -F -- "$p" "$RN/T005-$N.calls" | wc -l | tr -d ' ') update_json=$($GREP -o -F -- "$p" "$RN/T005-$N.updates" | wc -l | tr -d ' ')"
      done
    } > "$RN/T005-$N.audit"
    python3 - "$RN/T005-$N" <<'PY' > "$RN/T005-$N.hits"
import sys,re
b=sys.argv[1]
pats=["baseline-swe","baseline-deepseek","bench-evidence","bench-packets","hints-","anchors-","009-authoring-benchmark-and-closeout","/private/tmp","authoring-baseline","model-eval"]
for col in ("calls","updates"):
    for i,l in enumerate(open(f"{b}.{col}",errors="replace")):
        for p in pats:
            for m in re.finditer(re.escape(p),l):
                print(f"{col}[{i}] {p}: ..."+l[max(0,m.start()-100):m.end()+100].replace("\n"," ")+"...")
PY
  else
    echo "audit not available: sessions=$NS" > "$RN/T005-$N.audit"
  fi
  cat "$RN/T005-$N.audit"
  echo "hit lines: $(wc -l < "$RN/T005-$N.hits" 2>/dev/null)"
  exit 0
fi
if [ "$MODE" = measure ]; then
  HL3="$BL/hints-l3.txt"; AL3="$BL/anchors-l3.txt"
  T0=$(cat "$RN/T005-$N.t0"); T1=$(cat "$RN/T005-$N.t1"); RC=$(cat "$RN/T005-$N.rc")
  M1=$(bash $S/runtime/cli/spec/validate.sh $PK --strict 2>&1 | $GREP -c 'RESULT: PASSED')
  DOCS="$PK/spec.md $PK/plan.md $PK/tasks.md $PK/acceptance-criteria.md"
  M2_BARE=$($GREP -F -o -f "$HL3" $DOCS 2>/dev/null | wc -l | tr -d ' ')
  M2_TOKEN=$(rg -o --no-filename '\[YOUR_VALUE_HERE: [^]]*\]' $DOCS 2>/dev/null | wc -l | tr -d ' ')
  M2=$((M2_BARE + M2_TOKEN))
  M3_RAW=0; while read f n; do have=$(rg -c '<!-- ANCHOR:' $PK/$f.md 2>/dev/null || echo 0); [ "$have" -lt "$n" ] && M3_RAW=$((M3_RAW + n - have)); done < "$AL3"
  M4=$(diff "$B/status-before-$N.txt" "$B/status-after-$N.txt" | $GREP '^>' | $GREP -v 'zz-bench-authoring' | wc -l | tr -d ' ')
  M4_ALL=$(diff "$B/status-all-before-$N.txt" "$B/status-all-after-$N.txt" | $GREP '^>' | $GREP -v 'zz-bench-authoring' | wc -l | tr -d ' ')
  HASH_CHANGED=0; [ "$(cat "$B/diff-hash-before-$N.txt")" != "$(cat "$B/diff-hash-after-$N.txt")" ] && HASH_CHANGED=1
  M5=$(( T1 - T0 ))
  if [ -d specs/zz-bench-authoring ]; then
    mkdir -p "$OUTPKT" && rm -rf "$OUTPKT/packet-$N" && cp -R specs/zz-bench-authoring "$OUTPKT/packet-$N" && diff -r specs/zz-bench-authoring "$OUTPKT/packet-$N" > /dev/null || { echo "HALT H8: packet copy failed for run $N"; exit 5; }
    rm -r specs/zz-bench-authoring
  else
    echo "no packet folder was created by run $N"; exit 6
  fi
  RULE=$(bash $P9/scratch/tools/justified-anchors.sh "$OUTPKT/packet-$N/001-recommend-level-quiet-flag" "$BWT")
  M3=$(echo "$RULE" | sed -E 's/^counted=([0-9]+).*/\1/')
  echo "$RULE" > "$B/rule-$N.txt"
  echo "{\"run\":$N,\"strict_passed\":$M1,\"leftover_hints\":$M2,\"missing_anchors\":$M3,\"out_of_scope_writes\":$M4,\"seconds\":$M5}" >> "$B/runs.jsonl"
  jq -s '{runs: .}' "$B/runs.jsonl" > "$B/baseline.json"
  echo "{\"run\":$N,\"rc\":$RC,\"m2_bare\":$M2_BARE,\"m2_token\":$M2_TOKEN,\"m3_raw_shortfall\":$M3_RAW,\"m4_untracked_all\":$M4_ALL,\"diff_hash_changed\":$HASH_CHANGED,\"rule\":\"$RULE\"}" >> "$B/runs-meta.jsonl"
  echo "run $N measured rc=$RC M1=$M1 M2=$M2 (bare=$M2_BARE token=$M2_TOKEN) M3_counted=$M3 M3_raw=$M3_RAW M4=$M4 M4_all=$M4_ALL hash_changed=$HASH_CHANGED M5=$M5 rule: $RULE"
  test ! -e specs/zz-bench-authoring && echo TRACK_GONE
  exit 0
fi
