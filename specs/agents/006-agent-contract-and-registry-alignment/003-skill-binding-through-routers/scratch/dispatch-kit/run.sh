#!/bin/bash
# usage: run.sh <label> <phase-folder> <allowed-paths-file> <brief-file> [persona=markdown]
set -u
D="$(cd "$(dirname "$0")" && pwd)"; W=/Users/michelkerkmeester/worktrees/public/377-agent-contract-and-registry-alignment
L="$1"; PH="$2"; AL="$3"; BR="$4"; PE="${5:-markdown}"
python3 - "$D" "$W" "$L" "$PH" "$AL" "$BR" "$PE" <<'P'
import sys
D,W,L,PH,AL,BR,PE=sys.argv[1:]
h=open(D+"/head.txt").read().replace("__PHASE__",PH)
t=open(D+"/tail.txt").read().replace("__ALLOWED__",open(AL).read().strip())
p=open(W+"/.claude/agents/"+PE+".md").read()
open(D+"/"+L+".prompt.txt","w").write(h+p+"\n=== END PERSONA ===\n\n=== TASK ===\n"+open(BR).read()+t)
P
cd "$W" || exit 9
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run --standalone -m 'llmgateway/deepseek-v4.1-flash-1017#max' --format json "$(cat "$D/$L.prompt.txt")" </dev/null > "$D/$L.out.json" 2> "$D/$L.err.log"
echo "exit=$? label=$L"
