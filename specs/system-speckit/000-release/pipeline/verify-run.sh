#!/usr/bin/env bash
# For each changelog feature, dispatch TWO independent cli-devin verifiers
# (deepseek-v4-flash-max + glm-5-2-max) that investigate the real repo and return
# a verdict on whether the claim is accurate. Read-only: agents emit JSON on
# stdout, the parent writes files. Resumable. Usage: verify-run.sh [CONCURRENCY] [LIMIT]
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"
FEATS="$SPEC/003-deep-research-synthesis/verify/features.jsonl"
VDIR="$WORK/verify/verdicts"; RAWV="$WORK/verify/raw"; PROMV="$WORK/verify/prompts"
mkdir -p "$VDIR" "$RAWV" "$PROMV"
CONC="${1:-4}"; LIMIT="${2:-0}"
MODELS="deepseek-v4-flash-max glm-5-2-max"

verify_one(){  # args: <id> <model>
  local id="$1" model="$2"
  local vf="$VDIR/$id-$model.json"
  [ -s "$vf" ] && python3 -c "import json;json.load(open('$vf'))" 2>/dev/null && { echo "SKIP $id-$model"; return 0; }
  local line; line=$(grep -F "\"id\": \"$id\"" "$FEATS")
  [ -z "$line" ] && { echo "MISS $id"; return 0; }
  local sec track title body
  sec=$(printf '%s' "$line" | python3 -c "import json,sys;print(json.load(sys.stdin)['section'])")
  track=$(printf '%s' "$line" | python3 -c "import json,sys;print(json.load(sys.stdin)['track'])")
  title=$(printf '%s' "$line" | python3 -c "import json,sys;print(json.load(sys.stdin)['title'])")
  body=$(printf '%s' "$line" | python3 -c "import json,sys;print(json.load(sys.stdin)['body'])")
  local pf="$PROMV/$id-$model.prompt" raw="$RAWV/$id-$model.raw"
  cat > "$pf" <<EOF
You are an independent fact-checker for the OpenCode Spec-Kit v4.0.0.0 changelog. Investigate the ACTUAL repository (this working directory) to verify one changelog claim. Use Read, Grep, and Bash (git) — read only. DO NOT modify, create, or delete any files.

Release window: git commits from tag v3.6.0.0 to HEAD.
This claim is in changelog section "$sec", backed by work under specs/$track/ .

CLAIM — a "#### $title" entry:
---
$body
---

Investigate: read the backing spec folders under specs/$track/ (implementation-summary.md, spec.md) and, where useful, the actual skill code and \`git log v3.6.0.0..HEAD -- specs/$track\`. Check every factual assertion: are the named features, numbers, renames, removals and "breaking" flags actually supported? Is anything overstated, wrong, or materially missing?

Reply with ONLY a fenced json block, nothing else:
\`\`\`json
{"id":"$id","model":"$model","verdict":"CONFIRMED|MINOR_ISSUES|OVERSTATED|WRONG|UNVERIFIABLE","confidence":0.0,"evidence":"key files/commits checked and what they show (<=3 sentences)","issues":"specific inaccuracies/overstatements, or empty string","suggested_fix":"corrected wording if needed, or empty string"}
\`\`\`
EOF
  # Run inside the disposable HEAD-snapshot worktree: agents read freely (dangerous
  # mode auto-approves read tools), any stray write is contained there and discarded.
  ( cd "$WT" && timeout 420 devin -p --model "$model" --permission-mode dangerous --respect-workspace-trust false -- "$(cat "$pf")" </dev/null ) >"$raw" 2>>"$WORK/verify/dispatch.err"
  python3 - "$raw" "$vf" "$id" "$model" <<'PY'
import json,sys,re
raw,vf,fid,model=sys.argv[1:5]
t=open(raw,encoding='utf-8',errors='replace').read()
cands=[]
m=re.search(r'```json\s*(\{.*?\})\s*```',t,re.S)
if m: cands.append(m.group(1))
cands+=re.findall(r'\{[^{}]*"verdict"[^{}]*\}',t,re.S)
if not cands:
    s=t.find('{'); e=t.rfind('}')
    if s!=-1 and e>s: cands.append(t[s:e+1])
for c in cands:
    try:
        o=json.loads(c)
        if isinstance(o,dict) and o.get('verdict'):
            o.setdefault('id',fid); o.setdefault('model',model)
            json.dump(o,open(vf,'w'),ensure_ascii=False); sys.exit(0)
    except Exception: pass
sys.exit(3)
PY
  [ -s "$vf" ] && echo "OK $id-$model ($(python3 -c "import json;print(json.load(open('$vf'))['verdict'])" 2>/dev/null))" || echo "FAIL $id-$model"
}
# disposable read-only sandbox worktree (clean HEAD snapshot; contains any stray write)
WT="$WORK/verify/sandbox-wt"
if [ ! -d "$WT/.git" ] && [ ! -f "$WT/.git" ]; then
  git -C "$REPO" worktree add --detach "$WT" HEAD >/dev/null 2>&1 || { echo "FATAL: could not create sandbox worktree"; exit 1; }
fi
echo "sandbox worktree: $WT"
export -f verify_one; export SPEC WORK VDIR RAWV PROMV FEATS WT

# job list: <id> <model>
jobs="$WORK/verify/jobs.txt"; : > "$jobs"
i=0
while IFS= read -r line; do
  [ -z "$line" ] && continue
  i=$((i+1)); { [ "$LIMIT" -gt 0 ] 2>/dev/null && [ "$i" -gt "$LIMIT" ]; } && break
  id=$(printf '%s' "$line" | python3 -c "import json,sys;print(json.load(sys.stdin)['id'])")
  for m in $MODELS; do echo "$id $m" >> "$jobs"; done
done < "$FEATS"
total=$(wc -l < "$jobs" | tr -d ' ')
echo "=== verify: $total dispatches, concurrency $CONC ==="
xargs -P"$CONC" -L1 bash -c 'verify_one "$1" "$2"' _ < "$jobs"
echo "=== verdicts: $(ls "$VDIR"/*.json 2>/dev/null | wc -l | tr -d ' ')/$total ==="
# tear down the sandbox worktree on full runs (kept between LIMIT proofs for reuse)
if [ "${LIMIT:-0}" = "0" ]; then git -C "$REPO" worktree remove --force "$WT" 2>/dev/null && echo "sandbox worktree removed"; fi
