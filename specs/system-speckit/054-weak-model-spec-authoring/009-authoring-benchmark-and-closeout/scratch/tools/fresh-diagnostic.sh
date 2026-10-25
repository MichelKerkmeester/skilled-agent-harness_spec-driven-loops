#!/bin/bash
# usage: fresh-diagnostic.sh <bench-packets root holding deepseek-final3-l3>   (run from the worktree root)
# Diagnostic only, not a verdict: scores tasks.md against the contract-required anchors and lists every anchor each final run lacks compared with the full list.
P9=specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout
REQ=$(jq -r '.requiredAnchors[]' $P9/scratch/closeout/contract-3-tasks.json); OPT=$(jq -r '.optionalAnchors[]' $P9/scratch/closeout/contract-3-tasks.json)
ROOT=$1
score(){ f=$2/001-recommend-level-quiet-flag/tasks.md; m=0; for a in $REQ; do /usr/bin/grep -q "<!-- ANCHOR:$a -->" $f || m=$((m+1)); done; o=0; ol=""; for a in $OPT; do /usr/bin/grep -q "<!-- ANCHOR:$a -->" $f || { o=$((o+1)); ol="$ol $a"; }; done; echo "$1 required_missing=$m (of $(echo $REQ | wc -w | tr -d ' ')) optional_missing=$o$ol"; }

for n in 1 2 3; do score deepseek-final3-$n $ROOT/deepseek-final3-l3/packet-$n; done
