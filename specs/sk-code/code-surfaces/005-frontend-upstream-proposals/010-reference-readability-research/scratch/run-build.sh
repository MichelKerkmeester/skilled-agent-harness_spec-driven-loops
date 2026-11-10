#!/usr/bin/env bash
S=specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch
n=$1
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run -m "opencode-go/deepseek-v4.1-flash#max" --format json --standalone "$(cat $S/brief-$n.md)" </dev/null > $S/dispatch-$n.json 2>$S/dispatch-$n.err
echo "$n exit=$?" >> $S/dispatch-status-b.txt
