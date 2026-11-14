#!/usr/bin/env bash
# Prints the hub decision for each fixed prompt and the sk-code-ci packet's own intent pick.
# Usage: replay.sh > out.txt, from the repository root. Run before and after the edit, then diff.
set -uo pipefail
PROBES=specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/probes.txt
{ cut -f2- "$PROBES"; cat <<'P'
fix the github actions workflow so the ci job has a timeout
add paths-ignore and a concurrency group to .github/workflows/ci.yml
pin every action to a sha in the release workflow yaml
set timeout-minutes and fail-fast: false on the strategy matrix
rename a python helper function
P
} | while IFS= read -r prompt; do
  [ -n "$prompt" ] || continue
  printf '%s => ' "$prompt"
  node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "$prompt" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log(j.action+" "+(j.targets||[]).map(t=>t.workflowMode).join(","))})'
done
node -e '
const lib=require("./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs");
for (const t of ["edit .github/workflows/ci.yml to add a job","set timeout-minutes on the ci job","rename a python helper function"]) {
  const r=lib.routeSkillResources({skillRoot:".skilled/skills/sk-code/sk-code-ci",taskText:t});
  console.log("packet: "+t+" => intents="+r.intents.join(",")+" resources="+r.resources.length);
}'
