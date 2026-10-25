#!/bin/bash
# usage: run009.sh <N> dispatch|measure
# dispatch: one cli-devin swe-2-max run of the frozen Level 3 brief, with session audit.
# measure : the five metrics for run N, copy of the packet outside the worktree, then removal of the track.
source /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/fcd93cd7-b3f2-45e6-b976-87fabe792df3/scratchpad/env009.sh
cd "$WORKTREE" || exit 1
N=$1; MODE=$2
B="$SC/baseline"
P=specs/zz-bench-authoring/001-recommend-level-quiet-flag
OUTPKT="$SCR/bench-packets/swe-2-max-final-l3"
DB=$HOME/.local/share/devin/cli/sessions.db
GREP=/usr/bin/grep

if [ "$MODE" = dispatch ]; then
  if [ -e specs/zz-bench-authoring ]; then echo "ABORT: specs/zz-bench-authoring exists before run $N"; exit 2; fi
  # a prior attempt for this N that was not a real run is moved aside, never deleted
  K=$(ls "$SC/runs" 2>/dev/null | $GREP -c "^T005-$N\.t0$")
  if [ "$K" != 0 ]; then
    A="$SC/runs/attempts/T005-$N-$(date +%s)"; mkdir -p "$A"
    for f in "$SC/runs/T005-$N".*; do mv "$f" "$A/"; done
    for f in "$B/status-before-$N.txt" "$B/status-after-$N.txt" "$B"/diff-hash-*-$N.txt "$B/status-all-before-$N.txt" "$B/status-all-after-$N.txt"; do [ -e "$f" ] && mv "$f" "$A/"; done
  fi
  git -c core.fsmonitor=false status --porcelain > "$B/status-before-$N.txt"
  git -c core.fsmonitor=false status --porcelain --untracked-files=all > "$B/status-all-before-$N.txt"
  git -c core.fsmonitor=false diff -- .skilled | shasum -a 256 | cut -d' ' -f1 > "$B/diff-hash-before-$N.txt"
  cp "$BL/brief-1.txt" "$SC/briefs/T005-$N.txt"
  cmp "$BL/brief-1.txt" "$SC/briefs/T005-$N.txt" || { echo "BRIEF_COPY_DIFFERS"; exit 4; }
  date +%s > "$SC/runs/T005-$N.t0"
  AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 perl -e 'alarm shift; exec @ARGV' 2700 devin -p --model swe-2-max --permission-mode dangerous -- "$(cat "$SC/briefs/T005-$N.txt")" </dev/null > "$SC/runs/T005-$N.txt" 2> "$SC/runs/T005-$N.err"
  RC=$?
  date +%s > "$SC/runs/T005-$N.t1"
  echo "$RC" > "$SC/runs/T005-$N.rc"
  git -c core.fsmonitor=false status --porcelain > "$B/status-after-$N.txt"
  git -c core.fsmonitor=false status --porcelain --untracked-files=all > "$B/status-all-after-$N.txt"
  git -c core.fsmonitor=false diff -- .skilled | shasum -a 256 | cut -d' ' -f1 > "$B/diff-hash-after-$N.txt"
  # session audit
  T0=$(cat "$SC/runs/T005-$N.t0"); T1=$(cat "$SC/runs/T005-$N.t1")
  sqlite3 -readonly "$DB" "select id from sessions where working_directory='$WORKTREE' and created_at between $T0 and $((T1 + 60)) order by created_at;" > "$SC/runs/T005-$N.session"
  NS=$(wc -l < "$SC/runs/T005-$N.session" | tr -d ' ')
  echo "dispatch done N=$N rc=$RC seconds=$((T1 - T0)) sessions=$NS"
  if [ "$NS" = 1 ]; then
    SID=$(cat "$SC/runs/T005-$N.session")
    NC=$(sqlite3 -readonly "$DB" "select count(*) from tool_call_state where session_id='$SID';")
    sqlite3 -readonly "$DB" "select tool_call_json from tool_call_state where session_id='$SID';" > "$SC/runs/T005-$N.calls"
    sqlite3 -readonly "$DB" "select tool_call_update_json from tool_call_state where session_id='$SID';" > "$SC/runs/T005-$N.updates"
    {
      echo "session $SID tool_calls $NC"
      for p in baseline-swe 009-authoring-benchmark-and-closeout/scratch /private/tmp; do
        echo "$p call_json=$(cat "$SC/runs/T005-$N.calls" | $GREP -o -F -- "$p" | wc -l | tr -d ' ') update_json=$(cat "$SC/runs/T005-$N.updates" | $GREP -o -F -- "$p" | wc -l | tr -d ' ')"
      done
    } > "$SC/runs/T005-$N.audit"
  else
    echo "audit not available: sessions=$NS" > "$SC/runs/T005-$N.audit"
  fi
  cat "$SC/runs/T005-$N.audit"
  exit 0
fi

if [ "$MODE" = measure ]; then
  HL3="$BL/hints-l3.txt"; AL3="$BL/anchors-l3.txt"
  T0=$(cat "$SC/runs/T005-$N.t0"); T1=$(cat "$SC/runs/T005-$N.t1"); RC=$(cat "$SC/runs/T005-$N.rc")
  M1=$(bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | $GREP -c 'RESULT: PASSED')
  M2=$( { $GREP -F -o -f "$HL3" $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md 2>/dev/null; rg -o --no-filename '\[YOUR_VALUE_HERE: [^]]*\]' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md 2>/dev/null; } | wc -l | tr -d ' ')
  M2_BARE=$($GREP -F -o -f "$HL3" $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md 2>/dev/null | wc -l | tr -d ' ')
  M2_TOKEN=$(rg -o --no-filename '\[YOUR_VALUE_HERE: [^]]*\]' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md 2>/dev/null | wc -l | tr -d ' ')
  M3=0; while read f n; do have=$(rg -c '<!-- ANCHOR:' $P/$f.md 2>/dev/null || echo 0); [ "$have" -lt "$n" ] && M3=$((M3 + n - have)); done < "$AL3"
  M4=$(diff "$B/status-before-$N.txt" "$B/status-after-$N.txt" | $GREP '^>' | $GREP -v 'zz-bench-authoring' | $GREP -v '009-' | wc -l | tr -d ' ')
  M4_ALL=$(diff "$B/status-all-before-$N.txt" "$B/status-all-after-$N.txt" | $GREP '^>' | $GREP -v 'zz-bench-authoring' | $GREP -v '054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/' | wc -l | tr -d ' ')
  HASH_CHANGED=0; [ "$(cat "$B/diff-hash-before-$N.txt")" != "$(cat "$B/diff-hash-after-$N.txt")" ] && HASH_CHANGED=1
  M5=$(( T1 - T0 ))
  # copy the packet outside the worktree before removing it
  if [ -d specs/zz-bench-authoring ]; then
    mkdir -p "$OUTPKT" && rm -rf "$OUTPKT/packet-$N" && cp -R specs/zz-bench-authoring "$OUTPKT/packet-$N" && diff -r specs/zz-bench-authoring "$OUTPKT/packet-$N" > /dev/null || { echo "HALT H8: packet copy failed for run $N"; exit 5; }
    rm -r specs/zz-bench-authoring
  else
    echo "no packet folder was created by run $N"
  fi
  echo "{\"run\":$N,\"strict_passed\":$M1,\"leftover_hints\":$M2,\"missing_anchors\":$M3,\"out_of_scope_writes\":$M4,\"seconds\":$M5}" >> "$B/runs.jsonl"
  jq -s '{runs: .}' "$B/runs.jsonl" > "$B/baseline.json"
  echo "{\"run\":$N,\"rc\":$RC,\"m2_bare\":$M2_BARE,\"m2_token\":$M2_TOKEN,\"m4_untracked_all\":$M4_ALL,\"diff_hash_changed\":$HASH_CHANGED}" >> "$B/runs-meta.jsonl"
  echo "run $N measured rc=$RC M1=$M1 M2=$M2 (bare=$M2_BARE token=$M2_TOKEN) M3=$M3 M4=$M4 M4_all=$M4_ALL hash_changed=$HASH_CHANGED M5=$M5"
  test ! -e specs/zz-bench-authoring && echo TRACK_GONE
  exit 0
fi
