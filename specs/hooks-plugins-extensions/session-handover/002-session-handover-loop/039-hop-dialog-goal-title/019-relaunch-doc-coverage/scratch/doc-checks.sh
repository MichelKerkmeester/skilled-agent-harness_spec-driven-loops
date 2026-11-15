#!/usr/bin/env bash
# Assert the document state this packet's acceptance criteria describe.
# Usage: doc-checks.sh [root]  (root defaults to the repository root)
set -uo pipefail

root="${1:-.}"
playbook="$root/.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md"
catalog="$root/.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md"
handoff="$root/.skilled/commands/speckit/handoff.md"
child004="$root/specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice"
child013="$root/specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin"

total=0
failed=0
pass() { printf 'PASS %s\n' "$1"; }
fail() { printf 'FAIL %s\n' "$1"; failed=$((failed + 1)); }
absent() {
  total=$((total + 1))
  if rg -q "$1" "$2"; then fail "$3"; else pass "$3"; fi
}
present() {
  total=$((total + 1))
  if rg -q "$1" "$2"; then pass "$3"; else fail "$3"; fi
}

absent 'The check links that helper' "$playbook" 'the playbook copies the helper and does not link it'
absent 'turns the field off' "$handoff" 'the goal switch sentence names both fields'
present 'The check copies that helper' "$playbook" 'the playbook states the copy'
present 'wrapper-changed' "$playbook" 'the playbook names the wrapper-changed log line'
present 'goal_ended' "$playbook" 'the playbook names the ended-goal mark'
present 'no transcript path' "$playbook" 'the playbook names the missing-transcript notice'
present 'wrapper-changed' "$catalog" 'the catalog names the wrapper-changed log line'
present 'deferredAt' "$catalog" 'the catalog names the deferredAt stamp'
present 'goal_ended' "$catalog" 'the catalog names the ended-goal mark'
present 'no transcript path' "$catalog" 'the catalog names the missing-transcript notice'
present 'record with no .handoff. reads as absent' "$catalog" 'the catalog names the record with no handoff'
present "note's own folder or its parent" "$catalog" 'the catalog names the goal fallback bound'

total=$((total + 1))
counts=$(rg -n '1469' "$child004" --glob '*.md' || true)
lines=$(printf '%s\n' "$counts" | sed '/^$/d' | wc -l | tr -d ' ')
marked=$(printf '%s\n' "$counts" | rg -c '89e246760e' || true)
if [ "$lines" = '2' ] && [ "$marked" = '2' ]; then
  pass 'two 1469 citations name commit 89e246760e'
else
  fail "1469 citations: lines=$lines marked=$marked"
fi

total=$((total + 1))
counts=$(rg -n ':183|line 183' "$child013" --glob '*.md' || true)
lines=$(printf '%s\n' "$counts" | sed '/^$/d' | wc -l | tr -d ' ')
marked=$(printf '%s\n' "$counts" | rg -c 'c69f278cfc' || true)
if [ "$lines" = '10' ] && [ "$marked" = '10' ]; then
  pass 'ten 183 citations name commit c69f278cfc'
else
  fail "183 citations: lines=$lines marked=$marked"
fi

printf 'checks: %s, failed: %s\n' "$total" "$failed"
[ "$failed" -eq 0 ]
