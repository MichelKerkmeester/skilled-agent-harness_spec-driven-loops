#!/bin/bash
# Counts each negative acceptance pattern of spec.md section 4 in the five copies
# of its agent, in the order .skilled, .claude, .pi, .codex, .dsh. Run it from the
# repository root. Before the build every count is above 0. After it every count is 0.
chk(){ id=$1; name=$2; pat=$3; out="$id $name:"; for f in .skilled/agents/$name.md .claude/agents/$name.md .pi/agents/$name.md .codex/agents/$name.toml .dsh/agents/$name.patch.yml; do n=$(rg -c -- "$pat" "$f"); out="$out ${n:-0}"; done; echo "$out"; }
chk REQ-001 context 'Read.{0,6}\.skilled/skills/system-spec-kit/runtime/data/trigger-index\.json'
chk REQ-002 design 'DECIDE, MEASURE, or both|measure-versus-decide'
chk REQ-004 context 'rg --no-config|--json|Exit .1. is a clean no-hit'
chk REQ-005 context 'Record #|memory ID'
chk REQ-006 context '_No sub-agents dispatched|NESTING ENFORCEMENT DETAILS'
chk REQ-008 markdown 'manual-score'
chk REQ-009 markdown '^\s*\| .memory. '
chk REQ-010 markdown 'thirteen'
