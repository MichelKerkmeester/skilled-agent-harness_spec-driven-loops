export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
OPENCODE_GOAL_STATE_DIR="$(mktemp -d)" || exit 1; [ -d "$OPENCODE_GOAL_STATE_DIR" ] || exit 1; export OPENCODE_GOAL_STATE_DIR
trap 'rm -rf "$OPENCODE_GOAL_STATE_DIR"' EXIT
AI_SESSION_CHILD=1 OPENCODE_GOAL_STATE_DIR="$OPENCODE_GOAL_STATE_DIR" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 opencode-goal "Call the opencode_goal tool with action 'set' and objective 'Probe goal canary 7Q4Z'. Then call the opencode_goal_status tool. Then reply with the single word DONE."
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/opencode-goal.v1.events.jsonl"
ls "$OPENCODE_GOAL_STATE_DIR"
grep -l 7Q4Z "$OPENCODE_GOAL_STATE_DIR"/*.json
jq -r '.system[]' "$EVIDENCE_DIR/opencode-goal.v1.capture.jsonl" | grep -E '\[active_goal:goal-'
rm -rf "$OPENCODE_GOAL_STATE_DIR"
trap - EXIT

OPENCODE_GOAL_STATE_DIR="$(mktemp -d)" || exit 1; [ -d "$OPENCODE_GOAL_STATE_DIR" ] || exit 1; export OPENCODE_GOAL_STATE_DIR
trap 'rm -rf "$OPENCODE_GOAL_STATE_DIR"' EXIT
AI_SESSION_CHILD=1 OPENCODE_GOAL_STATE_DIR="$OPENCODE_GOAL_STATE_DIR" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 opencode-goal "Call the opencode_goal tool with action 'set' and objective 'Probe goal canary 7Q4Z'. Then call the opencode_goal_status tool. Then reply with the single word DONE."
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/opencode-goal.v2.events.jsonl"
ls "$OPENCODE_GOAL_STATE_DIR"
grep -l 7Q4Z "$OPENCODE_GOAL_STATE_DIR"/*.json
jq -r '.system[]' "$EVIDENCE_DIR/opencode-goal.v2.capture.jsonl" | grep -E '\[active_goal:goal-'
rm -rf "$OPENCODE_GOAL_STATE_DIR"
trap - EXIT
