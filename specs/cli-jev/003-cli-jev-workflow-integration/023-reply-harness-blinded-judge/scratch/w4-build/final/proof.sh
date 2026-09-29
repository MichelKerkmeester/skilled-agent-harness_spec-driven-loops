#!/usr/bin/env bash
# Proof plan P1 to P3 and P6 on the committed runs, with logging stub binaries first on PATH.
# usage: proof.sh <outdir>   (outdir outside the repository)
set -uo pipefail
ROOT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
cd "$ROOT" || exit 90
O="$1"; rm -rf "$O"; mkdir -p "$O/bin"
STUB=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w4-023/stub/stub.js
cp "$STUB" "$O/bin/cli-deem"; cp "$STUB" "$O/bin/jev"; chmod 755 "$O/bin/cli-deem" "$O/bin/jev"
H=.skilled/skills/sk-communication/benchmark/reply-harness
R=specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs
ARGS=(--masked "$R/blind" --masked "$R/sonnet/blind" --masked "$R/attempt-1/blind"
  --replies "$R/before-replies" --replies "$R/after-replies"
  --replies "$R/sonnet/before-replies" --replies "$R/sonnet/after-replies"
  --replies "$R/attempt-1/before-replies" --replies "$R/attempt-1/after-replies")
export PATH="$O/bin:$PATH" JEV_PROVIDER=
git status --porcelain > "$O/porcelain-before.txt"

STUB_LOG="$O/p1-stub.log" node "$H/judge-agreement.mjs" "${ARGS[@]}" > "$O/p1.out" 2> "$O/p1.err"
echo "p1 rc=$?" >> "$O/rc.txt"
STUB_LOG="$O/p2-stub.log" STUB_HEALTH=stub node "$H/judge-agreement.mjs" "${ARGS[@]}" --deem --out "$O/p2-out" > "$O/p2.out" 2> "$O/p2.err"
echo "p2 rc=$?" >> "$O/rc.txt"
STUB_LOG="$O/p3-stub.log" STUB_AUTH_STATUS_EXIT=3 node "$H/judge-agreement.mjs" "${ARGS[@]}" --jev --out "$O/p3-out" > "$O/p3.out" 2> "$O/p3.err"
echo "p3 rc=$?" >> "$O/rc.txt"

git status --porcelain > "$O/porcelain-after.txt"
grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization' "$H/judge-agreement.mjs" > "$O/p6-grep.txt"
echo "p6-grep rc=$?" >> "$O/rc.txt"
echo "p1 stub log lines: $(cat "$O/p1-stub.log" 2>/dev/null | wc -l | tr -d ' ')" >> "$O/rc.txt"
n=$(wc -l < "$O/p1.out" | tr -d ' ')
head -n "$n" "$O/p2.out" | cmp -s - "$O/p1.out" && echo "p2 prefix identical to p1: yes" >> "$O/rc.txt" || echo "p2 prefix identical to p1: NO" >> "$O/rc.txt"
head -n "$n" "$O/p3.out" | cmp -s - "$O/p1.out" && echo "p3 prefix identical to p1: yes" >> "$O/rc.txt" || echo "p3 prefix identical to p1: NO" >> "$O/rc.txt"
echo "p2 tail: $(tail -n +$((n + 1)) "$O/p2.out" | tr '\n' '|')" >> "$O/rc.txt"
echo "p3 tail: $(tail -n +$((n + 1)) "$O/p3.out" | tr '\n' '|')" >> "$O/rc.txt"
cmp -s "$O/porcelain-before.txt" "$O/porcelain-after.txt" && echo "porcelain identical: yes" >> "$O/rc.txt" || echo "porcelain identical: NO" >> "$O/rc.txt"
cat "$O/rc.txt"
