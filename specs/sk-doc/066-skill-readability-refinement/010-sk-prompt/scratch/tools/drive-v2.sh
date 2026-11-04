#!/usr/bin/env bash
# One leaf: skip once a stop is flagged, run the leaf, then flag a stop when any executor step failed.
# Codex logs echo the docs they read, so a quota phrase anywhere in a log proves nothing; only a failed step counts.
T=specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools
STOP=specs/sk-doc/066-skill-readability-refinement/scratch/STOP
leaf=$1; skill=$2; kind=$3; [ "${4:-}" = repair ] && export FORCE_REVIEW=1
[ -e "$STOP" ] && { echo "SKIP $leaf (stop flagged)"; exit 0; }
bash $T/run-leaf-v2.sh "$leaf" "$skill" "$kind"
R="$leaf/scratch/run.log"
failed=$(grep -E 'audit chunk [0-9]+ exit=[^0]|bytes= *0$|fix [0-9]+ exit=[0-9]+ *$|fix [0-9]+ exit=[0-9]+ STATUS=FAIL|review [0-9]+ *$' "$R")
if [ -n "$failed" ]; then
  why=$(for f in "$leaf"/scratch/audit-*.log "$leaf"/scratch/fix-*.log "$leaf"/scratch/review-*.log; do tail -20 "$f" 2>/dev/null; done | grep -i -m1 -E 'quota|rate.?limit|usage limit|insufficient.?(credit|balance|funds)|429')
  mkdir -p "$(dirname "$STOP")"; echo "$leaf | ${failed//$'\n'/ ; } | ${why:-no quota message}" >> "$STOP"; echo "STEPFAIL $leaf ${why:+QUOTA}"
fi
echo "LEAF-END $leaf $(tail -1 "$R")"
