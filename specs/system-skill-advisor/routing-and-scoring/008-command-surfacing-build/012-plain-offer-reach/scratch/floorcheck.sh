#!/bin/bash
# Run every floor gate of this phase and write one prefixed line per output line.
# usage: floorcheck.sh <label>   (writes scratch/after-<label>.txt, or before.txt for label "before")
# Run from the repository root. Prints the file and exits 1 when a hard gate is red.
set -u
X="$1"
ROOT=$(pwd)
ADV=.skilled/skills/system-skill-advisor/runtime
SP=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch
CAP=$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs
OUT=$SP/after-$X.txt
[ "$X" = "before" ] && OUT=$SP/before.txt
TMP=$(mktemp -d "${TMPDIR:-/tmp}/floorcheck-XXXXXX")
red=0
: > "$OUT"
line() { printf '%s: %s\n' "$1" "$2" >> "$OUT"; }

(cd $ADV && npm run build > "$TMP/bld.log" 2>&1); rc=$?
line BLD "exit $rc"; [ $rc -ne 0 ] && red=1

node $CAP > "$TMP/cap.json" 2> "$TMP/cap.err"; rc=$?
[ $rc -ne 0 ] && { line CAP "exit $rc"; red=1; }
jq -c '.metrics.typed_recall_at_1, .metrics.false_offer' "$TMP/cap.json" | while read -r l; do line FLOOR "$l"; done
jq -c '.attachedMetrics.false_offer_attached, .attachedMetrics.typed' "$TMP/cap.json" | while read -r l; do line TYPED "$l"; done
jq -c '.attachedMetrics.plain.tune, .attachedMetrics.plain.holdout' "$TMP/cap.json" | while read -r l; do line PLAIN "$l"; done
[ "$(jq -r '.metrics.typed_recall_at_1.correct' "$TMP/cap.json")" -ge 24 ] || red=1
[ "$(jq -c '.metrics.false_offer' "$TMP/cap.json")" = '{"count":0,"total":35}' ] || red=1
[ "$(jq -c '.attachedMetrics.false_offer_attached' "$TMP/cap.json")" = '{"count":0,"total":35}' ] || red=1
[ "$(jq -r '.attachedMetrics.typed.combined' "$TMP/cap.json")" -ge 44 ] || red=1

EV=$(node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]')
line EVAL "$EV"
echo "$EV" | jq -e '.[0] >= 159 and .[1] >= 50 and .[2] >= 20 and .[3] <= 5' > /dev/null || red=1

(cd $ADV && npm run typecheck > "$TMP/tc.log" 2>&1); rc=$?
line TC "exit $rc"; [ $rc -ne 0 ] && red=1
python3 $ADV/tests/python/test_skill_advisor.py > "$TMP/py.log" 2>&1; rc=$?
line PY "exit $rc"; [ $rc -ne 0 ] && red=1

vt() { # name, test files...
  local name="$1"; shift
  (cd $ADV && npx vitest run "$@" > "$TMP/$name.log" 2>&1); local rc=$?
  line "$name" "$(rg '^\s*Tests ' "$TMP/$name.log" | tr -s ' ' | sed 's/^ //') exit $rc"
  [ $rc -ne 0 ] && red=1
  rg -o 'FAIL  \S+' "$TMP/$name.log" | sort -u | while read -r l; do line "$name" "$l"; done
}
vt PAR tests/parity/python-ts-parity.vitest.ts
vt RS tests/command-routing-slice.vitest.ts
vt VDS tests/doctor-routing-slice.vitest.ts

node --test .skilled/bin/tests/compiled-route-*.test.cjs > "$TMP/bint.log" 2>&1; rc=$?
line BINT "$(rg '^ℹ (pass|fail) ' "$TMP/bint.log" | tr '\n' ' ')exit $rc"; [ $rc -ne 0 ] && red=1
G=$(node .skilled/bin/compiled-route-guard.cjs --json | jq .failures)
line GUARD "$G"; [ "$G" = "0" ] || red=1
for hub in sk-doc system-deep-loop; do
  c=$(node .skilled/bin/compiled-route-manifest.cjs freshness --hub $hub --skill-root .skilled/skills/$hub | jq -r .causeCode)
  line "HUBOK-$hub" "$c"; [ "$c" = "fresh" ] || red=1
done
line SYNC "$(node .skilled/bin/compiled-route-sync.cjs --check | tail -1)"

(cd $ADV && npx vitest run > "$TMP/suite.log" 2>&1); rc=$?
rg '^\s*(Test Files|Tests) ' "$TMP/suite.log" | tr -s ' ' | sed 's/^ //' | while read -r l; do line SUITE "$l"; done
line SUITE "exit $rc"; [ $rc -ne 0 ] && red=1
rg -o 'FAIL  \S+' "$TMP/suite.log" | sort -u | while read -r l; do line SUITE "$l"; done

line RESULT "$([ $red -eq 0 ] && echo green || echo red)"
rm -rf "$TMP"
cd "$ROOT" && cat "$OUT"
exit $red
