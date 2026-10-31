#!/usr/bin/env bash
# usage: live-jev.sh <run-name>   (from the worktree root)
# One live --jev run, provider official, with the jev version and auth status read right before.
# jev holds the credential. This script reads and passes none.
set -u
W=specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build
R=$W/runs/$1
mkdir -p "$R/out"
date -u '+%Y-%m-%dT%H:%M:%SZ' > "$R/start-utc.txt"
# Hold rule, same as live-deem.sh: nothing under specs/ dirty outside a scratch/ directory at start.
git status --porcelain -- specs/ > "$R/specs-status-before.txt"
if grep -v '/scratch/' "$R/specs-status-before.txt" | grep -q .; then
  echo "live run held: $(grep -v '/scratch/' "$R/specs-status-before.txt" | tr '\n' ' ')" > "$R/held.txt"
  exit 10
fi
jev --version > "$R/jev-version.txt" 2>&1
jev auth status --provider official > /dev/null 2>&1
echo "exit=$?" > "$R/auth-before.exit"
if ! grep -q 'exit=0' "$R/auth-before.exit"; then echo "live run held: jev auth" > "$R/held.txt"; exit 12; fi
git status --porcelain > "$R/status-before.txt"
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs --jev --out "$R/out" > "$R/stdout.txt" 2> "$R/stderr.txt"
echo "exit=$?" > "$R/exit.txt"
git status --porcelain > "$R/status-after.txt"
date -u '+%Y-%m-%dT%H:%M:%SZ' > "$R/end-utc.txt"
