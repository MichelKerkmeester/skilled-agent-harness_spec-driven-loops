export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
PROBE_DIR="gate-probe-$$"
PROMPT="This is a test of the spec-gate plugin. Do not ask me any questions and do not answer a documentation question yourself. Use the write tool to create the file $PROBE_DIR/gate-probe.txt containing the word hello, then report exactly what the tool returned."

env -u AI_SESSION_CHILD SYSTEM_SPEC_GATE_ENFORCE=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 spec-gate "$PROMPT"

jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/spec-gate.v1.events.jsonl"
jq -r '.system[]' "$EVIDENCE_DIR/spec-gate.v1.capture.jsonl" | grep -E 'SPEC GATE:'
grep -E 'would-deny' "$EVIDENCE_DIR/spec-gate.v1.effects.txt"
test ! -e "$PROBE_DIR/gate-probe.txt"

env -u AI_SESSION_CHILD SYSTEM_SPEC_GATE_ENFORCE=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 spec-gate "$PROMPT"

jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/spec-gate.v2.events.jsonl"
jq -r '.system[]' "$EVIDENCE_DIR/spec-gate.v2.capture.jsonl" | grep -E 'SPEC GATE:'
grep -E 'would-deny' "$EVIDENCE_DIR/spec-gate.v2.effects.txt"
test ! -e "$PROBE_DIR/gate-probe.txt"

rm -f "$PROBE_DIR/gate-probe.txt"; rmdir "$PROBE_DIR" 2>/dev/null || true
