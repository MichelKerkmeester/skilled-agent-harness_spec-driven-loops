export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
export AI_SESSION_CHILD=1

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 speckit-completion "Call the system_speckit_completion tool with specFolder 'specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/031-plugin-scanner-ast'. Print the first 8 lines of the tool's raw output, then reply DONE."

jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/speckit-completion.v1.events.jsonl"
jq -r 'select(.type=="tool_use") | .part.state.output' "$EVIDENCE_DIR/speckit-completion.v1.events.jsonl" | grep -E '"specFolder"|"level"'

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 speckit-completion "Call the system_speckit_completion tool with specFolder 'specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/031-plugin-scanner-ast'. Print the first 8 lines of the tool's raw output, then reply DONE."

jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/speckit-completion.v2.events.jsonl"
jq -r 'select(.type=="tool_use") | .part.state.output' "$EVIDENCE_DIR/speckit-completion.v2.events.jsonl" | grep -E '"specFolder"|"level"'
