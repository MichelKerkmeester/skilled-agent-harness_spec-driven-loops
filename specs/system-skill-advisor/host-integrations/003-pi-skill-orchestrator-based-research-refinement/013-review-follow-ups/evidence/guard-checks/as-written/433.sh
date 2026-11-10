SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db"
export SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0
export SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2
GEN=.skilled/skills/.state/advisor/skill-graph-generation.json
GEN_BEFORE=$(shasum "$GEN")
HOOK=.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js
WORK='{"session_id":"playbook-433","hook_event_name":"UserPromptSubmit","prompt":"help me refactor the advisor hook timeout handling"}'
CASUAL='{"session_id":"playbook-433","hook_event_name":"UserPromptSubmit","prompt":"hello"}'

echo "$WORK" | SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node "$HOOK" > "$SANDBOX/short.json"; echo "short-budget exit=$?"
echo "$WORK" | node "$HOOK" > "$SANDBOX/default.json"; echo "default-budget exit=$?"
echo "$CASUAL" | node "$HOOK" > "$SANDBOX/casual.json"; echo "casual exit=$?"

for f in short default casual; do
  python3 -c "import json; d=json.load(open('$SANDBOX/$f.json')); print('$f:', d['hookSpecificOutput']['additionalContext'].splitlines()[0])"
done

if [ -z "${SANDBOX:-}" ] || [ -z "${GEN:-}" ] || [ -z "${GEN_BEFORE:-}" ]; then
  echo "the block's variables are missing; rerun the whole block in one shell"
else
  sandbox_advisor_running() {
    [ -e "$SANDBOX/db/.system-skill-advisor-launcher.json" ] || [ -n "$(ls -A "$SANDBOX/sock" 2>/dev/null)" ] ||
      [ -n "$(lsof -t +D "$SANDBOX" 2>/dev/null)" ]
  }
  for i in $(seq 1 60); do [ "$i" -gt 25 ] && ! sandbox_advisor_running && break; sleep 1; done
  [ "$(shasum "$GEN")" = "$GEN_BEFORE" ] && echo "live generation file unchanged" || echo "live generation file CHANGED"
  unset SPECKIT_IPC_SOCKET_DIR SYSTEM_SKILL_ADVISOR_DB_DIR SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN
  if [ -z "$(lsof -t -p $$ 2>/dev/null)" ]; then
    echo "lsof cannot list open files here; sandbox kept at $SANDBOX"
  elif sandbox_advisor_running; then
    echo "sandbox advisor still running after the wait; sandbox kept at $SANDBOX"
  else
    rm -r "$SANDBOX" && echo "sandbox advisor exited; sandbox removed"
  fi
fi
