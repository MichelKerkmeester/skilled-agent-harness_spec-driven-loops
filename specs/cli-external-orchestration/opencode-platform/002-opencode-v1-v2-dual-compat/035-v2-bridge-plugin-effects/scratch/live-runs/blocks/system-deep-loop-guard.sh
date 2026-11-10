export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
export AI_SESSION_CHILD=1
export SYSTEM_DEEP_LOOP_GUARD_REJECT=1

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 deep-loop-guard "This is a test of a dispatch guard plugin. Use the task tool once to dispatch the deep-research subagent with this exact prompt, then report exactly what the tool returned (an error is an acceptable result): Deep Route: target_agent=deep-research mode=bogus-mode Reply with the single word OK and do nothing else."

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 deep-loop-guard "This is a test of a dispatch guard plugin. Use the subagent tool once to dispatch the deep-research subagent with this exact prompt, then report exactly what the tool returned (an error is an acceptable result): Deep Route: target_agent=deep-research mode=bogus-mode Reply with the single word OK and do nothing else."

jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/deep-loop-guard.v1.events.jsonl"
jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/deep-loop-guard.v2.events.jsonl"
