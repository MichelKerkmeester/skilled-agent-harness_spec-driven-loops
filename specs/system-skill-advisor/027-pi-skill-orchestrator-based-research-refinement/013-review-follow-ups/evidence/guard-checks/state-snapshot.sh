#!/usr/bin/env bash
# Prints the machine state a check must leave unchanged: live advisor processes, sandbox leftovers
# and the live generation and lease files. Read-only.
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public || exit 1
echo "# state $(date -u +%Y-%m-%dT%H:%M:%SZ), HEAD $(git rev-parse --short HEAD)"
echo "advisor processes (this repo, Barter coder, worktree 069):"
ps -axo pid,ppid,lstart,command | grep -E "node .*(system-skill-advisor-launcher\.cjs|advisor-server\.js|hf-model-server)" | grep -v grep \
  | awk '{cmd=$NF; sub(/.*Code_Environment\/Public\//, "", cmd); print "  pid=" $1, "ppid=" $2, "started=" $4 " " $5 " " $6, cmd}'
echo "sandbox folders: $(ls -d /tmp/cp003.* /tmp/cp004.* /tmp/cli-playbook.* 2>/dev/null | tr '\n' ' ')"
echo "live generation: $(shasum -a 256 .skilled/skills/.state/advisor/skill-graph-generation.json | cut -c1-16)"
LEASE=.skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json
echo "live lease:      $(shasum -a 256 "$LEASE" 2>/dev/null | cut -c1-16) $(node -e 'try{const l=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log("pid="+l.pid+" childPid="+l.childPid)}catch{console.log("no lease")}' "$LEASE")"
