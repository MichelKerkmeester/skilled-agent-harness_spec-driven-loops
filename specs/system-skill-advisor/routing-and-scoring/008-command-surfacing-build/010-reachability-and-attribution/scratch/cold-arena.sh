#!/bin/bash
# True cold first prompt: no advisor daemon for the checkout before the hook runs.
A=$(cd "$TMPDIR/skilled-behaviour-arenas/pre-claude" && pwd -P)
HOOK=.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js
cd "$A" || exit 2
alive() { pgrep -f "pre-claude/.skilled/(bin|skills)" | tr '\n' ' '; }
now() { python3 -c 'import time;print(int(time.time()*1000))'; }
run() {
  s=$(now)
  out=$(printf '{"prompt":"create a readme for the utils folder","cwd":"%s","hook_event_name":"UserPromptSubmit","session_id":"%s"}' "$A" "$1" | node $HOOK 2>/dev/null)
  e=$(now)
  echo "$1: $((e-s)) ms | $(printf '%s' "$out" | jq -r '.hookSpecificOutput.additionalContext // "<none>"' 2>/dev/null | head -1)"
}
for i in 1 2 3 4 5; do
  p=$(alive); [ -n "$p" ] && kill $p 2>/dev/null; /bin/sleep 2
  p=$(alive); [ -n "$p" ] && kill -9 $p 2>/dev/null; /bin/sleep 1
  echo "before cold-$i daemons: [$(alive)]"
  run "cold-$i"
  /bin/sleep 4; echo "after  cold-$i daemons: [$(alive)]"
done
run warm-1; run warm-2
p=$(alive); [ -n "$p" ] && kill $p 2>/dev/null
