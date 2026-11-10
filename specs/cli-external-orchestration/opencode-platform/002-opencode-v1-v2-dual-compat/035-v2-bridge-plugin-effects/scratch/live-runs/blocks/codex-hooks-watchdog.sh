export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
node .opencode/bin/install-codex-hooks.mjs --check; echo $?
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 baseline "Reply with the single word OK."
AI_SESSION_CHILD=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 baseline "Reply with the single word OK."
grep -E 'codex hook drift detected' "$EVIDENCE_DIR/baseline.v1.effects.txt"
grep -E 'codex hook drift detected' "$EVIDENCE_DIR/baseline.v2.effects.txt"
cat "$EVIDENCE_DIR/baseline.v1.exit" "$EVIDENCE_DIR/baseline.v2.exit"
