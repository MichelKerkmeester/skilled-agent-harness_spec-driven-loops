export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
ls -l .opencode/plugins/sk-vision.js
AI_SESSION_CHILD=1 SK_VISION_AUTOINSPECT=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v1 sk-vision "Call the sk_vision_status tool with no arguments. Print the first 8 lines of its raw output, then reply DONE."
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/sk-vision.v1.events.jsonl"

AI_SESSION_CHILD=1 SK_VISION_AUTOINSPECT=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh \
  v2 sk-vision "Call the sk_vision_status tool with no arguments. Print the first 8 lines of its raw output, then reply DONE."
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/sk-vision.v2.events.jsonl"
