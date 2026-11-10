#!/usr/bin/env bash
# Prints the live advisor state: the advisor processes of this repo, the Barter coder and worktree 069, the
# scenario sandbox folders under /tmp, and the live generation and lease files. Reads only.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1
GEN=.skilled/skills/.state/advisor/skill-graph-generation.json
LEASE=.skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json
echo "# state $(date -u +%Y-%m-%dT%H:%M:%SZ), HEAD $(git rev-parse --short HEAD)"
echo "advisor processes (this repo, Barter coder, worktree 069):"
ps -axo pid=,ppid=,lstart=,command= | grep -E "node .*(system-skill-advisor-launcher\.cjs|advisor-server\.js)" | grep -v grep \
  | awk '{cmd=$NF; sub(/.*Code_Environment\/Public\//, "", cmd); print "  pid=" $1, "ppid=" $2, "started=" $4, $5, $6, cmd}'
left=$(find /tmp /private/tmp -maxdepth 1 \( -name 'cp003.*' -o -name 'cp004.*' -o -name 'cli-playbook.*' \) 2>/dev/null | wc -l | tr -d ' ')
echo "scenario sandbox folders under /tmp (cp003.*, cp004.*, cli-playbook.*): $left"
python3 - "$GEN" "$LEASE" <<'PY'
import hashlib, json, sys
gen, lease = sys.argv[1], sys.argv[2]
h = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()[:16]
g = json.load(open(gen))
print(f"live generation: {h(gen)} generation={g.get('generation')} reason={g.get('reason')} updatedAt={g.get('updatedAt')}")
l = json.load(open(lease))
print(f"live lease:      {h(lease)} pid={l.get('pid')} childPid={l.get('childPid')}")
PY
