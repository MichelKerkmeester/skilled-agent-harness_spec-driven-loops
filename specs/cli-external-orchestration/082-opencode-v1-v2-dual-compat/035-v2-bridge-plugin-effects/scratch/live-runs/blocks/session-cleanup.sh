export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
LOG_DIR="$(mktemp -d)" || exit 1; [ -d "$LOG_DIR" ] || exit 1
trap 'rm -rf "$LOG_DIR"' EXIT
export SESSION_CLEANUP_LOG_PATH="$LOG_DIR/session-cleanup.log"
AI_SESSION_CHILD=1 SESSION_CLEANUP_LOG_PATH="$SESSION_CLEANUP_LOG_PATH" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 baseline "Reply with the single word OK."
jq -r '.system[]' "$EVIDENCE_DIR/baseline.v1.capture.jsonl" | grep -E '\[session-cleanup\] Startup safety warnings:'
cat "$SESSION_CLEANUP_LOG_PATH"
AI_SESSION_CHILD=1 SESSION_CLEANUP_LOG_PATH="$SESSION_CLEANUP_LOG_PATH" bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 baseline "Reply with the single word OK."
jq -r '.system[]' "$EVIDENCE_DIR/baseline.v2.capture.jsonl" | grep -E '\[session-cleanup\] Startup safety warnings:'
cat "$SESSION_CLEANUP_LOG_PATH"
cat "$EVIDENCE_DIR/baseline.v1.exit" "$EVIDENCE_DIR/baseline.v2.exit"

rm -rf "$LOG_DIR"
trap - EXIT
