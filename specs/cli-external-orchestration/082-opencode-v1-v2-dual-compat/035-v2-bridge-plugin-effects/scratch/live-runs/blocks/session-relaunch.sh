export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
AI_SESSION_CHILD=1 SKILLED_LOOP_ID=probe-loop SESSION_RELAUNCH_WINDOW_TOKENS=2000 \
  bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 session-relaunch "Run the shell command 'echo relaunch-probe' and then reply with the single word DONE."
jq -r '.system[]' "$EVIDENCE_DIR/session-relaunch.v1.capture.jsonl" | grep -E '\[session-relaunch\] Context is past the configured window'
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/session-relaunch.v1.events.jsonl"
cat "$EVIDENCE_DIR/session-relaunch.v1.exit"

AI_SESSION_CHILD=1 SKILLED_LOOP_ID=probe-loop SESSION_RELAUNCH_WINDOW_TOKENS=2000 \
  bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 session-relaunch "Run the shell command 'echo relaunch-probe' and then reply with the single word DONE."
jq -r '.system[]' "$EVIDENCE_DIR/session-relaunch.v2.capture.jsonl" | grep -E '\[session-relaunch\] Context is past the configured window'
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/session-relaunch.v2.events.jsonl"
cat "$EVIDENCE_DIR/session-relaunch.v2.exit"
