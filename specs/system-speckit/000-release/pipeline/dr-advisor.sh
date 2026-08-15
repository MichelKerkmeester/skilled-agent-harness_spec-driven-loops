#!/usr/bin/env bash
# Claude-driven deep-research on the advisor state-containment issue. Two cli-devin
# lineages (grok-4-6-xhigh, deepseek-v4-pro-max), 5 progressive iterations each,
# read-only (agent investigates in a disposable HEAD worktree, emits JSON; parent writes).
set -uo pipefail
REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SF="$REPO/specs/system-speckit/000-release/003-deep-research-synthesis/advisor-state-containment"
RES="$SF/research"; RAW="$RES/raw"; mkdir -p "$RES/iterations" "$RAW"
WT="$RES/.sandbox-wt"
git -C "$REPO" worktree prune 2>/dev/null; rm -rf "$WT"
git -C "$REPO" worktree add --detach "$WT" HEAD >/dev/null 2>&1 || { echo "FATAL: worktree"; exit 1; }

ISSUE='The skill-advisor (and other runtime writers) leak nested .opencode / .advisor-state directories INTO specs/ instead of keeping advisor state at the repo root. Live symptom (HEAD): 23 nested .opencode dirs under specs/, plus .advisor-state under specs/hooks/008-pi-caching-like-reasonix/..., specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/, and specs/system-deep-loop/z_archive/026-goal-opencode-plugin/... . The packet meant to fix this, specs/system-skill-advisor/017-advisor-audit-and-state-containment, is Draft at 0% completion.'

FOCUS_1='Reproduce and confirm: enumerate the stray .opencode/.advisor-state dirs under specs/, confirm they are advisor-written (not user/tooling), and identify the distinct packets/paths affected.'
FOCUS_2='Trace the code: find the advisor workspace/state-directory resolver (system-skill-advisor mcp-server + hooks) and show EXACTLY where and why it can resolve a state path inside a specs/ subtree instead of the repo root. Cite file:line.'
FOCUS_3='Enumerate every runtime writer that can leak state (advisor daemon, launcher, hooks, plugins) and the conditions that trigger a nested write; note any guard that exists and why it is insufficient.'
FOCUS_4='Determine what actually shipped vs the 017 Draft: git log v3.6.0.0..HEAD for advisor state-containment; is there partial containment code, or is it entirely unbuilt? Distinguish v3.6-era work ("Advisor State Stays Out of Specs") from anything in-window.'
FOCUS_5='Design the correct fix (resolver refuses to land inside any specs/ subtree; writers redirect to repo root; cleanup of the already-leaked dirs) and a concrete verification that proves no new stray dir is written. Note risk/blast-radius.'

run_lineage(){  # args: model label
  local model="$1" label="$2"; local dir="$RES/iterations/$label"; mkdir -p "$dir"
  local acc=""
  for i in 1 2 3 4 5; do
    local focusvar="FOCUS_$i"; local focus="${!focusvar}"
    local out="$dir/iteration-$i.md" raw="$RAW/$label-$i.txt"
    [ -s "$out" ] && { acc="$acc"$'\n'"$(sed -n '1,40p' "$out")"; echo "SKIP $label-$i"; continue; }
    local pf="$RAW/$label-$i.prompt"
    cat > "$pf" <<EOF
You are deep-research iteration $i (of 5) for lineage "$label", investigating one issue in this repository. Use Read, Grep and Bash (git) — read only, DO NOT modify any files. Ground every claim in file:line or command output.

ISSUE
$ISSUE

FINDINGS SO FAR (prior iterations of this lineage; build on them, do not repeat):
${acc:-（none yet — this is iteration 1）}

ITERATION $i FOCUS
$focus

Reply with ONLY a fenced json block:
\`\`\`json
{"iteration":$i,"lineage":"$label","focus_summary":"<one line>","findings":["<grounded finding with file:line or command evidence>", "..."],"answered":["<question this iteration resolved>"],"open_questions":["<still open>"],"confidence":0.0}
\`\`\`
EOF
    ( cd "$WT" && timeout 600 devin -p --model "$model" --permission-mode dangerous --respect-workspace-trust false -- "$(cat "$pf")" </dev/null ) >"$raw" 2>>"$RES/dispatch.err"
    python3 - "$raw" "$out" "$i" "$label" <<'PY'
import json,sys,re
raw,out,it,lin=sys.argv[1:5]
t=open(raw,encoding='utf-8',errors='replace').read()
obj=None
m=re.search(r'```json\s*(\{.*?\})\s*```',t,re.S)
for c in ([m.group(1)] if m else [])+re.findall(r'\{[^{}]*"findings"[^{}]*\}',t,re.S):
    try:
        o=json.loads(c)
        if o.get('findings'): obj=o; break
    except Exception: pass
if obj is None:
    open(out,'w').write(f"# {lin} iteration {it} — PARSE FAIL\n\n"+t[:2000]); sys.exit(0)
md=[f"# {lin} — iteration {it}: {obj.get('focus_summary','')}",""]
md+=["## Findings"]+[f"- {x}" for x in obj.get('findings',[])]
if obj.get('answered'): md+=["","## Answered"]+[f"- {x}" for x in obj['answered']]
if obj.get('open_questions'): md+=["","## Open"]+[f"- {x}" for x in obj['open_questions']]
open(out,'w',encoding='utf-8').write("\n".join(md)+"\n")
PY
    acc="$acc"$'\n'"$(sed -n '1,40p' "$out")"
    echo "OK $label-$i"
  done
}

echo "=== dr-advisor: 2 lineages x 5 iters (cli-devin) ==="
run_lineage grok-4-6-xhigh grok-4-6-xhigh &
run_lineage deepseek-v4-pro-max deepseek-v4-pro-max &
wait
git -C "$REPO" worktree remove --force "$WT" 2>/dev/null
echo "=== done: $(find "$RES/iterations" -name 'iteration-*.md' | wc -l | tr -d ' ') iteration files ==="
