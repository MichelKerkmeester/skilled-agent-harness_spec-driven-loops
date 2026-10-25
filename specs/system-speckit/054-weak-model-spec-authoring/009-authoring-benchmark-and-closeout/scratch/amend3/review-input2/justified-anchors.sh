#!/bin/bash
# usage: justified-anchors.sh <packet-dir> [worktree-root]
# Scores one authored packet under the anchor rule of parent criterion 5.
# A frozen anchor missing from a packet document counts, unless it is an optional
# Level 3 tasks.md anchor in the frozen contract and its fill-note condition holds.
#   arch-verify       excused when spec.md, plan.md and decision-record.md hold no ADR-<n>
#   perf-verify       excused when spec.md holds no NFR-P<n>
#   deploy-ready, compliance-verify, sign-off   excused by task definition
#   docs-verify       never excused
# Any missing anchor in spec.md, plan.md or acceptance-criteria.md counts, and so does a required tasks.md anchor.
# Output: counted=<n> excused=<list> counted_list=<list>
D=${1:?packet dir}
ROOT=${2:-$(cd "$(dirname "$0")/../../../../../.." && pwd)}
P1=$ROOT/specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline
P9=$ROOT/specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout
FROZEN=$P1/scratch/baseline-swe-l3/anchors-l3.txt
CONTRACT=$P9/scratch/closeout/contract-3-tasks.json
GREP=/usr/bin/grep
OPT=$(jq -r ".optionalAnchors[]" "$CONTRACT" | tr "\n" " ")
REQ=$(jq -r ".requiredAnchors[]" "$CONTRACT" | tr "\n" " ")
has_adr=no; cat "$D/spec.md" "$D/plan.md" "$D/decision-record.md" 2>/dev/null | $GREP -qE 'ADR-[0-9]+' && has_adr=yes
has_nfr=no; $GREP -qE 'NFR-P[0-9]+' "$D/spec.md" 2>/dev/null && has_nfr=yes
counted=0; excused=""; clist=""
while read -r doc want; do
  [ "$doc" = tasks ] && continue
  have=$($GREP -c '<!-- ANCHOR:' "$D/$doc.md" 2>/dev/null); have=${have:-0}
  if [ "$have" -lt "$want" ]; then s=$((want - have)); counted=$((counted + s)); clist="$clist $doc(-$s)"; fi
done < "$FROZEN"
for a in $REQ $OPT; do
  $GREP -q "<!-- ANCHOR:$a -->" "$D/tasks.md" 2>/dev/null && continue
  ok=no
  case $a in
    arch-verify) [ "$has_adr" = no ] && ok=yes;;
    perf-verify) [ "$has_nfr" = no ] && ok=yes;;
    deploy-ready|compliance-verify|sign-off) ok=yes;;
  esac
  case " $OPT " in *" $a "*) ;; *) ok=no;; esac
  if [ $ok = yes ]; then excused="$excused $a"; else counted=$((counted + 1)); clist="$clist $a"; fi
done
echo "counted=$counted excused=[${excused# }] counted_list=[${clist# }]"
