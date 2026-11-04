#!/usr/bin/env bash
# run-leaf.sh <leaf-dir> <skill-or-mode-dir> <whole|hub|mode>
set -u
L=$1; SK=$2; KIND=$3
T=specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools
O=$L/scratch; mkdir -p "$O"
log(){ echo "$(date -u +%H:%M:%S) $*" >> "$O/run.log"; }
python3 -I $T/leaf-scope.py "$SK" "$KIND" > "$O/scope.txt"
python3 -I $T/inbound-anchors.py "$O/scope.txt" > "$O/inbound-anchors.txt"
[ -s "$O/gate-before.txt" ] || python3 -I $T/scope-gate.py "$O/scope.txt" > "$O/gate-before.txt"
log "scope $(wc -l < "$O/scope.txt") files; $(tail -1 "$O/gate-before.txt")"
HDR="GATE 3 IS PRE-RESOLVED. You are a non-interactive dispatched worker (AI_SESSION_CHILD=1). The spec folder is $L and your write authority is bound as stated below. Do not ask the documentation question or any other question; nobody is at a prompt."
# 1. Luna audit, in chunks of at most 8 files (skipped on resume when findings exist).
if [ ! -s "$O/findings.md" ]; then
split -l 8 "$O/scope.txt" "$O/chunk-"
n=0; : > "$O/findings.md"
for c in "$O"/chunk-*; do n=$((n+1))
  P="$HDR

ROLE: read-only auditor of Markdown documentation in the Skilled framework repository (current directory). You change nothing.
$(cat $T/rubric.md)

FILES TO AUDIT (read each one in full):
$(cat "$c")

INBOUND REFERENCES (frozen: see the last rubric rule):
$(grep -F -f "$c" "$O/inbound-anchors.txt" || echo none)

OUTPUT: Markdown only, no preamble. One '### <path>' section per file in the list. Under it, one bullet per defect:
- [P1|P2] <path>:<line> | <rubric number> | <what is wrong> | <exact change: literal replacement text, or a precise move such as 'move lines 40-52 to after line 18'>
P1 = misleads or renders wrong; P2 = polish. A file with nothing to fix gets the single bullet '- clean'. Cite real line numbers. Do not report taste without a rubric number."
  AI_SESSION_CHILD=1 codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" -s read-only -o "$O/findings-$n.md" "$P" </dev/null > "$O/audit-$n.log" 2>&1
  log "audit chunk $n exit=$? bytes=$(wc -c < "$O/findings-$n.md" 2>/dev/null || echo 0)"
  cat "$O/findings-$n.md" >> "$O/findings.md" 2>/dev/null; echo >> "$O/findings.md"
done
rm -f "$O"/chunk-*
fi
fix(){ # $1 = instruction file, $2 = tag
  P="$HDR

PERSONA: @markdown, a LEAF documentation agent. Load sk-doc first. Never dispatch another agent.
$(cat $T/rubric.md)

TASK: apply every finding in $1 to the files it names. Skip a finding only when applying it would change a claim, break a link or contradict the rubric; list each skip with its reason at the end.

ALLOWED WRITE PATHS (only these):
$(cat "$O/scope.txt")

INBOUND REFERENCES (frozen: see the last rubric rule):
$(cat "$O/inbound-anchors.txt")

BANNED: touching any other file; git add/commit/stash/checkout/reset; writing a spec path, phase, task or finding id into a file; em or en dashes in text you write.

VERIFY, paste the output: python3 -I $T/scope-gate.py $O/scope.txt
End with STATUS=OK FILES=<n> or STATUS=FAIL ERROR=<reason>."
  AI_SESSION_CHILD=1 PI_OFFLINE=1 pi -p --offline --model llmgateway/deepseek-v4.1-flash-1017 --thinking high "$P" </dev/null > "$O/fix-$2.log" 2>&1
  log "fix $2 exit=$? $(grep -o 'STATUS=[A-Z]*' "$O/fix-$2.log" | tail -1)"
}
review(){ # $1 = tag
  git diff -- $(cat "$O/scope.txt") > "$O/diff-$1.patch"
  P="$HDR

ROLE: read-only reviewer. You change nothing.
$(cat $T/rubric.md)

Read the findings in $O/findings.md and the diff in $O/diff-$1.patch (also read the changed files in full where needed).
Check: every finding applied or its skip justified; no claim, rule, example, code or JSON block changed meaning; nothing lost; every inbound reference in $O/inbound-anchors.txt still holds (heading text unchanged, H2 order and numbers unchanged for files with numbered references); the files now meet the rubric.
OUTPUT: first line exactly 'VERDICT: PASS' or 'VERDICT: FIX'. For FIX, then one bullet per required change in the findings format, with exact replacement text."
  AI_SESSION_CHILD=1 codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" -s read-only -o "$O/review-$1.md" "$P" </dev/null > "$O/review-$1.log" 2>&1
  log "review $1 $(head -1 "$O/review-$1.md" 2>/dev/null)"
}
# 2. Fix and review rounds until Luna passes the diff, at most 3 rounds.
r=$(ls "$O"/review-*.md 2>/dev/null | wc -l | tr -d ' ')
if grep -q '^- \[P' "$O/findings.md"; then
  if [ "$r" = 0 ]; then fix "$O/findings.md" 1; review 1; r=1; fi
  while [ "$r" -lt 3 ] && head -1 "$O/review-$r.md" | grep -q 'FIX'; do
    fix "$O/review-$r.md" $((r+1)); r=$((r+1)); review $r
  done
  head -1 "$O/review-$r.md" | grep -q 'PASS' || log "UNRESOLVED after $r rounds"
else log "no findings"; fi
python3 -I $T/scope-gate.py "$O/scope.txt" > "$O/gate-after.txt"
log "done; $(tail -1 "$O/gate-after.txt")"
